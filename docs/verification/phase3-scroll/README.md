# 首页与章节目录搜索滚动回归

2026-11-05；基线 `74e2c7282f7c879966350bf5933b2cccf928377d`；分支 `codex/phase3-division-doubling-fibonacci`。开始时工作区干净，fetch 后远端与本地均为该基线。本轮整理为一笔修复提交，仅推送评审分支。

## 生产预览复现

先构建未修改的基线，然后在独立生产预览 `http://127.0.0.1:4178` 中复现。原4177端口已被占用，未停止已有进程。使用无头 Edge156.0.4314.58，Windows、Node22.17.1、npm11.7.0；视口为1440×1000、390×1000，语言由 zh-CN/en-US 浏览器环境选择。

逐字输入“斐波那契求余”/“Fibonacci remainder”，每个字符后等待 URL 查询更新和两个 animation frames，再记录 scrollY、输入框 top/bottom、焦点、URL 和实际界面语言。四组均在第一个字符后跳到页首，焦点仍在输入框：

| 语言/宽度 | 输入前 scrollY | 首字后 scrollY | 输入前 top | 首字后 top |
| --- | ---: | ---: | ---: | ---: |
| 中文1440 | 1053 | 0 | 219.75 | 1272.75 |
| 英文1440 | 1146 | 0 | 220.25 | 1366.25 |
| 中文390 | 1722 | 0 | 220 | 1942 |
| 英文390 | 2103 | 0 | 219.5 | 2322.5 |

原始逐字记录：[reproduction.json](reproduction.json)；运行日志：[reproduction.txt](reproduction.txt)；复现普通视口截图以 `before-home-` 命名。

根因：Home 的 `setSearchParams(..., {replace:true})` 每次改变 search，ReaderNavigation 原 effect 把 pathname+search 当作新目的地；新的查询没有保存位置，于是执行 `scrollTo(0,0)`。旧首页测试没有挂载 ReaderNavigation，因此未覆盖此行为。

## 修复行为

- 公共 ReaderNavigation 使用导航类型区分同路径、同 hash 的 REPLACE 查询编辑与实际导航。输入、删除、清空、重置沿用当前阅读位置，不按新查询回到页首。
- 按 history entry key 保存阅读位置，POP 恢复对应条目；新页面默认从顶部开始，新显式 hash 跳转定位锚点。已有 hash 条目的浏览器返回仍优先恢复离开时的位置，不强行再次定位到锚点。
- 页面显示时通过 scroll 事件记录位置，避免新页面变短后在 effect cleanup 才取到被浏览器压缩的 scrollY。使用浏览器 manual scroll restoration 避免双重恢复，卸载时恢复原设置。
- `/book` 在结果区保留至少一个视口的高度，避免筛选后内容太短而让浏览器自动压缩滚动距离；空结果提示仍在搜索框下方正常显示。
- Home 的 URL 查询恢复机制保留。导航测试挂载真实 ReaderNavigation、Home、Book；jsdom 用滚动桩验证调用语义，实际视口与焦点由生产浏览器另行测量。

## 验收结果

| 检查 | 最终结果 | 记录 |
| --- | --- | --- |
| ESLint | PASS，退出0 | [lint-final.txt](lint-final.txt) |
| TypeScript | PASS，退出0 | [typescript-final.txt](typescript-final.txt) |
| 全部 Vitest | PASS，38文件、353项 | [tests-final.txt](tests-final.txt) |
| 生产构建 | PASS，退出0 | [build-final.txt](build-final.txt) |
| 滚动专项浏览器 | PASS，中英文×1440/390 | [browser-retest.txt](browser-retest.txt)、[browser-audit.json](browser-audit.json) |
| 第三轮除法浏览器回归 | PASS，中英文×1440/390 | [division-regression.txt](division-regression.txt)、[详细记录](division-regression/browser-audit.json) |

滚动专项使用 `pressSequentially` 逐字输入，共300次字符更新检查（四环境中重复覆盖首页和目录）；逐字删除另有50次检查。每次字符更新后的搜索框保持原视口 top，偏差0像素，焦点仍在输入框，框体完整处于视口内。还检查了整词清空、重置、目录清空、进入 `/division` 后的浏览器后退/前进、带 q 参数刷新后的查询和结果恢复、目录进入第4.6节、节与习题4.6的演示来源返回、同章显式锚点跳转。导航点击前记录实际离开位置，返回后与其比较。

锚点验收尊重 CSS 的16像素顶部留白；靠近文档底部的习题按浏览器最大滚动距离验证，确保锚点进入视口，而不要求页面底部以下凭空出现空间。所有四组无页面 JS 异常。

复用 `scripts/verify-division.cjs` 验证四个播放器的独立播放、播放中应用新输入复位、语言切换后回看与继续播放、9组固定输入、45÷6的全部108个快照（四环境合计432次变量/计数/高亮核对）、关键余数轨迹及5个商余稳定检查点。算法实现没有修改。

| 45÷6 | 加法 | 减法 | 减半 | 余数扣减 |
| --- | ---: | ---: | ---: | ---: |
| 逐次减法 | 0 | 7 | 0 | 7 |
| 倍增求余 | 2 | 6 | 2 | 3 |
| 斐波那契求余 | 4 | 6 | 0 | 2 |
| 商余共享 | 6 | 6 | 2 | 3 |

完整计数与轨迹：[key-counts.json](division-regression/key-counts.json)。本轮未重新运行全站逐页浏览器扫描；全量测试包含已有算法、翻译与导航用例。浏览器为本地生产构建预览，390宽度为桌面浏览器模拟，不是物理手机或正式域名发布验收。

## 失败与复测

1. 新导航测试先在基线运行：4项失败、1项通过，真实复现查询编辑导致 scrollY 归零，见 [red.txt](red.txt)。修复公共机制后5项通过，见 [green.txt](green.txt)。
2. 首次浏览器复测发现 `/book` 结果缩短导致 scrollY 从4被浏览器压缩到0，输入框从220移至224，见 [browser-first-fix.txt](browser-first-fix.txt)。增加结果区最小高度后复测通过。
3. 第二次脚本对文档末端习题错误要求 top=16，实际受最大滚动距离限制为692，见 [browser-second-fix.txt](browser-second-fix.txt)。修正验收断言以使用真实文档边界；未为迎合测试修改章节布局。最终四组通过。
4. 首轮工程检查的测试桩采用了 TypeScript 无法推断的 scrollTo 重载，见 [typescript.txt](typescript.txt)、[gates.json](gates.json)。修正测试桩后重新运行所有工程门禁，全部退出0，见 [gates-final.json](gates-final.json)。

历史日志按原始格式保留。既有 Browserslist 数据过期提示不影响构建，未更改依赖。本轮无剩余未通过项。

## 普通视口截图与复现命令

以下均为普通视口截图，不是全页长图。截图前核对 html.lang 和输入框实际值：中文“斐波那契求余”，英文“Fibonacci remainder”。

| 页面 | 中文桌面 | 中文390 | 英文桌面 | 英文390 |
| --- | --- | --- | --- | --- |
| 首页搜索 | [图](after-home-zh-1440.png) | [图](after-home-zh-390.png) | [图](after-home-en-1440.png) | [图](after-home-en-390.png) |
| 章节搜索 | [图](after-book-zh-1440.png) | [图](after-book-zh-390.png) | [图](after-book-en-1440.png) | [图](after-book-en-390.png) |

工程命令：`npm run lint`、`npx tsc -b --pretty false`、`npm run test:run`、`npm run build`。Windows测试 TEMP/TMP 指向仓库 `.local`。

预览：`node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4178 --strictPort`。设置 `READER_BASE_URL=http://127.0.0.1:4178` 和环境 Playwright 的 NODE_PATH，运行 `node scripts/verify-search-scroll.cjs`。基线复现加 `--reproduce`（需先检出/构建基线）。除法回归运行 `node scripts/verify-division.cjs`，设置 `DIVISION_AUDIT_DIR=docs/verification/phase3-scroll/division-regression` 保留旧证据。

更新的 [文件清单](../phase3-division/source-manifest.json) 包含本轮源码、脚本、报告、日志和截图；UTF-8文本按LF标准化后计算SHA-256，二进制原样计算，清单不包含自身。可用 `node scripts/create-division-manifest.cjs` 重新生成。固定审查版本以包含本报告的最终提交为准。
