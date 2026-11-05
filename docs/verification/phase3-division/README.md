# 第三轮：倍增求余、斐波那契求余与商余共享验收

验收日期：2026-11-05。发布基线 `863cb9527cd0d6a5b093f61d4fa54bc88ae3e23c`，工作分支 `codex/phase3-division-doubling-fibonacci`。本报告及同目录证据随实现提交；审查时以包含本报告的提交为固定版本。提交前再次 fetch，远端 main 与工作分支均仍位于该基线。此次只推送工作分支，不发布 main。

## 实现与书中依据

- 保留 `/division` 地址，提供逐次减法、倍增求余、斐波那契求余三个独立播放器，以及可展开的 `quotient_remainder` 播放器。共用已应用输入，每个快照包含原始 A/B、运行变量、辅助函数局部变量、实际执行语句、计数、语义事件和检查点。
- 已读取用户提供的中文版 PDF，结合文字提取和渲染图核对第4.5—4.6节、习题4.6的 45÷6 示例，并核对 `solutions/4_6.md`。原 PDF 仅本地读取，未复制到仓库；文件哈希见 [environment.json](environment.json)。
- 第4.5节对应 `largest_doubling` / `remainder`；第4.6节对应有用的返回值法则、`quotient_remainder` / `remainder_fibonacci`。`ch04.h` 的粗粒度节标题没有覆盖这一细分，以实际正文核对归属。四个函数的展示语句与仓库原源码进行忽略空白/注释的自动对照，全部通过。
- 严格检查十进制整数原文后才转换 Number。A 为0—1,000,000、B 为1—1,000,000；A < 257B。内部算术先用 BigInt 检查精确结果，内部候选量不受输入上限限制。接受输入完整回放，不压缩步骤；废弃的旧压缩轨迹模块已移除。
- 编辑保持草稿与运行输入分离；应用输入或选择示例暂停并重置所有播放器。空白、非法整数、范围、零除数、容量错误显示在相应字段旁。原文如 `045` 应用后保留拼写且清除待应用状态。
- 前进、回看、进度拖动、重置、重播恢复完整快照。语言只参与渲染，切换后保留计算状态并即时翻译说明。沿用浅色公共组件、`usePlayback`、`TraceCode`、语言上下文。
- 目录、学习导航、README 更新为4.5—4.6节；习题4.6有演示与解答入口。中英文名称、别名、函数名均参与搜索，按路径去重。显式节号与习题号仍分开匹配。
- 浏览器验收发现首页搜索在返回时丢失查询，改为与章节目录一致的 URL 查询参数；增加导航回归测试。

## 固定计数与关键状态

45÷6 的最终商为7、余数为3。下列计数来自实际轨迹；比较、赋值、进入/返回不计为算术操作，图示及等式校验不计入算法计数。

| 方法 | 加法 | 减法 | 减半 | 余数扣减 | 快照数 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 逐次减法 | 0 | 7 | 0 | 7 | 17 |
| 倍增求余 | 2 | 6 | 2 | 3 | 22 |
| 斐波那契求余 | 4 | 6 | 0 | 2 | 42 |
| 同时求商与余数 | 6 | 6 | 2 | 3 | 27 |

倍增求余的6次减法含3次 `a−b` 条件计算（包括最后一次失败判断），另3次扣减余数。斐波那契的6次减法含4次 `c−b` 回退和2次扣减余数。商余共享另计 `n+n`、`n+1`。

- 逐次减法余数轨迹：45→39→33→27→21→15→9→3。
- 倍增求余轨迹：45→21→9→3。
- 斐波那契余数轨迹：45→15→3；增长 `(b,c)` 为 `(6,6),(6,12),(12,18),(18,30),(30,48)`；回退恢复量依次为18、12、6、6。
- 商余共享稳定 `(n,c,a)`：`(1,24,21),(2,12,21),(3,12,9),(6,6,9),(7,6,3)`。在完整成对更新后验证 `A=n×c+a`；拆分赋值中间明确提示正在更新。`0≤r<B` 仅作为最终条件。结束验证 `45=7×6+3`。
- 所有要求的9个有效例子均通过，包括770÷3→(256,2)、1,000,000÷1,000,000→(1,0)。后者 Fibonacci 的 c 可达2,000,000。257÷1拒绝为容量超限，B=0拒绝为输入错误。

各例计数、快照数及45÷6全部快照见 [key-counts.json](key-counts.json)。独立结果校验采用整数除法和取余；额外覆盖 A=0…300、B∈{2,3,6,7,19,1,000,000}、四种方法，共7,224条完整轨迹。

## 工程检查与生产预览

环境：Windows、Node22.17.1、npm11.7.0、Vite8.0.16、Vitest4.1.8、无头 Edge156.0.4314.58。浏览器连接生产构建预览 `http://127.0.0.1:4177`，不是开发服务器，也不代表正式域名已发布本轮。手机检查为390像素桌面浏览器视口模拟，不是物理手机验收。

| 检查 | 最终结果 | 证据 |
| --- | --- | --- |
| ESLint | PASS，退出0 | [lint-final.txt](lint-final.txt) |
| TypeScript `tsc -b` | PASS，退出0 | [typescript-final.txt](typescript-final.txt) |
| 全部 Vitest | PASS，38个文件、349项测试 | [all-tests-final.txt](all-tests-final.txt) |
| 生产构建 | PASS，退出0 | [build-final.txt](build-final.txt) |
| 生产预览浏览器 | PASS，中文/英文 × 1440/390 | [browser-retest.txt](browser-retest.txt)、[browser-audit.json](browser-audit.json) |

复现命令：`npm run lint`、`npx tsc -b --pretty false`、`npm run test:run`、`npm run build`。Windows测试设置 TEMP/TMP 为仓库 `.local`。预览命令为 `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4177 --strictPort`。浏览器命令为 `node scripts/verify-division.cjs`，使用环境中的 Playwright 与本机 Edge；可通过 `READER_BASE_URL` / `DIVISION_AUDIT_DIR` 指定目标与输出。

每种语言/宽度逐项检查45÷6的108个快照，共432次变量、算术计数和刚执行语句高亮对照；这些 UI 对照引用已独立验证的轨迹，固定计数与关键状态另有直接常量断言。还覆盖以下真实浏览器交互：

- `/division`直达、刷新，首页搜索进入、后退、前进，4.5/4.6及习题4.6来源返回；来源查询参数随刷新保留。
- 首页与章节目录名称/函数名搜索、路径去重，显式“第4.6节”/“Section 4.6”和“习题4.6”/“Exercise 4.6”区分。
- 播放中编辑并应用47÷7，四个播放器均暂停复位；继续、回看、重播全部对应新输入；独立播放不移动其他播放器。
- 中途切换语言，输入、步骤、变量、计数、高亮不变，当前说明以及回看/继续播放说明同步翻译；输入错误也同步翻译。
- 键盘左右键移动进度、拖动进度、重置与重播；完整成对更新和中间状态的等式说明。
- 所有固定例子、原文舍入陷阱、容量提示、字段关联、候选量2,000,000、无全页横向溢出、长轨迹局部滚动。
- 受影响页面的可见文字、展开的开发者笔记、title/aria-label无页码；英文界面未残留中文操作文案（语言自称“中文”除外）。没有新增页码数据。

截图前断言实际 `html.lang` 与搜索框原文。中文查询“斐波那契求余”，英文查询“Fibonacci remainder”。本次没有重跑全站所有页面的浏览器扫描；全量单元/组件测试包含前两轮算法、输入、语言及导航回归。未通过项：无。既有 Browserslist 数据库过期及 React Router future flag 提示保留，未改变依赖版本。

## 发现、修复与复测记录

历史日志保留，不用最终通过结果覆盖失败记录。保留测试工具的原始诊断格式，包括 DOM dump 的行尾空白；代码差异检查不把原始日志当作源代码。

1. 算法先写测试与空实现，42项 RED：[red.txt](red.txt)；实现后42项 GREEN：[algorithm-green.txt](algorithm-green.txt)。旧 UI 的新交互测试 RED：[ui-red.txt](ui-red.txt)；新 UI 首次8项通过：[ui-first-run.txt](ui-first-run.txt)。后续新增前导零用例。
2. 专项整合检查失败：源码读取测试使用 node 环境，与全局 localStorage 清理不兼容；函数查找误命中 `segment_remainder`；测试使用 `.at`、`node:fs` 类型和不适用的 `exact` 选项。改为 Vite raw import、函数词边界、兼容的数组索引及查询选项。见 [targeted.txt](targeted.txt)、[typescript.txt](typescript.txt)。修复后67项通过：[targeted-retest.txt](targeted-retest.txt)。
3. 全量测试首次2项失败：旧除法测试仍查找 spinbutton 并以失焦触发校验。按严格原文输入及显式应用行为更新断言。见 [all-tests.txt](all-tests.txt)；复测348项通过：[all-tests-retest.txt](all-tests-retest.txt)。
4. 生产预览首次发现首页返回搜索词丢失，见 [browser-first-run.txt](browser-first-run.txt)。修复为 URL 查询状态；新增测试首轮因选择器仍用旧英文标题而失败，见 [navigation-retest.txt](navigation-retest.txt)，随后修正为唯一结果链接。最终349项测试、四组浏览器验收全部通过。
5. 首次通过 npm 转发预览参数时，Windows/npm将参数解析为位置参数导致启动失败；改为直接调用 Vite CLI，成功启动并完成上述生产预览。未更改发布配置。

## 截图与文件清单

| 内容 | 中文桌面 | 中文390 | 英文桌面 | 英文390 |
| --- | --- | --- | --- | --- |
| 完整页面 | [图](division-complete-zh-1440.png) | [图](division-complete-zh-390.png) | [图](division-complete-en-1440.png) | [图](division-complete-en-390.png) |
| 斐波那契卡片 | [图](fibonacci-zh-1440.png) | [图](fibonacci-zh-390.png) | [图](fibonacci-en-1440.png) | [图](fibonacci-en-390.png) |
| 商余稳定检查点 | [图](quotient-checkpoint-zh-1440.png) | [图](quotient-checkpoint-zh-390.png) | [图](quotient-checkpoint-en-1440.png) | [图](quotient-checkpoint-en-390.png) |
| 首页搜索 | [图](home-search-zh-1440.png) | [图](home-search-zh-390.png) | [图](home-search-en-1440.png) | [图](home-search-en-390.png) |
| 章节搜索 | [图](chapter-search-zh-1440.png) | [图](chapter-search-zh-390.png) | [图](chapter-search-en-1440.png) | [图](chapter-search-en-390.png) |

已目视检查中英文桌面和手机截图，包括完整页面、代码局部滚动与商余检查点。代码、测试、构建入口、当前报告/日志/截图的 SHA-256 见 [source-manifest.json](source-manifest.json)；UTF-8文本统一LF，二进制保持原样。清单不包含自身，原始 PDF 哈希单独记录。最终提交号以 Git 包含此报告的提交为准，避免自引用哈希。
