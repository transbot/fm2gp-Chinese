# 章内节号导航：独立历史条目修复

日期：2026-11-05。基线 `5f346c4c5bb49c513022d2c7d5a4c52a98881c92`，分支 `codex/phase3-division-doubling-fibonacci`。开始时工作区干净；fetch 后本地、远端评审分支均为指定基线，远端 main 为 `863cb9527cd0d6a5b093f61d4fa54bc88ae3e23c`。此次代码修复与本地验收证据整理为一笔提交，随后按用户要求合并 main 并另行记录正式域名发布验收。

## 真实浏览器复现

先构建未修改的基线，在生产预览 `http://127.0.0.1:4179` 中使用全新浏览器上下文直接打开 `/book/4`。中文/英文 × 1440/390，依次点击4.5、4.6，再后退/前进；随后手动滚动并反复离开与返回。

每次记录完整 `history.state`、URL、key、scrollY，以及4.5、4.6、习题4.6目标的视口 top/bottom。原生锚点创建的条目没有 Router key，初始页与两个节号都使用 `default`。四组均复现错用滚动位置。

| 环境 | 基线 key 序列 | 返回4.5期望 scrollY | 实际 scrollY |
| --- | --- | ---: | ---: |
| 中文1440 | default/default/default | 0 | 1044 |
| 英文1440 | default/default/default | 0 | 1144 |
| 中文390 | default/default/default | 0 | 1144 |
| 英文390 | default/default/default | 93 | 1672 |

期望值来自每次导航前实际记录的离开位置。点击顶部章内导航前，浏览器/测试工具可能把导航滚入视口，因此不能把更早的节正文位置误当作离开位置。原始证据：[reproduction.json](reproduction.json)、[reproduction.txt](reproduction.txt)；`before-*.png` 是失败基线截图。

## 最小产品修复

只修改 Book 的章内节号链接：用 React Router `Link` 替换原生 `<a href="#…">`，`to` 明确包含当前 `pathname`、完整 `search` 和新 `hash`。公共 ReaderNavigation 不作改动，继续按 history key 恢复 POP 阅读位置，并将显式跳转定位到目标节。

## 验收

环境：Windows、Node22.17.1、npm11.7.0、Vite8.0.16、Vitest4.1.8、无头 Edge156.0.4314.58。预览由 `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4179 --strictPort` 提供。390像素测试为桌面浏览器视口模拟。

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| ESLint | PASS | [lint.txt](lint.txt) |
| TypeScript | PASS | [typescript.txt](typescript.txt) |
| 全部 Vitest | 39文件、358项 PASS | [tests.txt](tests.txt) |
| 生产构建 | PASS | [build.txt](build.txt) |
| 章内历史专项 | 中英文×1440/390 PASS | [browser-retest.txt](browser-retest.txt)、[原始记录](browser-audit.json) |
| 搜索滚动专项 | 中英文×1440/390 PASS | [scroll-regression.txt](scroll-regression.txt)、[逐字记录](scroll-regression/browser-audit.json) |
| 第三轮除法专项 | 中英文×1440/390 PASS | [division-regression.txt](division-regression.txt)、[记录](division-regression/browser-audit.json) |

新增5项测试挂载真实 `BrowserRouter`、Book、ReaderNavigation 和 Division；不使用 MemoryRouter 代替这组历史检查。浏览器专项执行真实生产构建中的 BrowserRouter：

- 全新上下文直接进入章节，连续点击两个节号，验证初始条目及两次跳转的 key 各不相同。
- 连续跳转后后退/前进恢复对应离开位置；手动滚动后再次前进/后退也按最新离开位置恢复。每次检查包含目标 URL 与 key 的一致性。
- 带 q 的章节页连续导航保留完整查询参数。
- 在新文档直接打开带 hash 的地址，再刷新，均定位目标节。
- 第4.6节、习题4.6进入 `/division` 后，返回来源保留查询并定位正确锚点。

修复后的实际 key 与每次位置见原始记录；例如中文1440为 `default → bzvftt12 → b4pedaw7`。手动滚动后的4.6返回位置在四环境分别是1167、1267、1267、1795，全部与离开前记录一致。

搜索专项继续逐字检查300次输入、50次删除及清空/重置、焦点、历史、刷新与来源返回。除法专项继续验证45÷6四组计数（加/减/减半分别0/7/0、2/6/2、4/6/0、6/6/2）、余数轨迹、商余稳定检查点、9组固定输入、独立播放、应用新输入复位、语言切换后回看/继续，以及432次快照联动。

所有本轮工程及本地浏览器检查通过。既有 Browserslist 数据过期提示保留。正式域名验收在修复提交推送并合并 main 后执行，不以本地预览冒充线上结果。

## 失败与修复记录

1. 测试先于产品修改运行：新增5项中2项失败、3项通过，分别覆盖显式目标与独立条目/位置，见 [red.txt](red.txt)。最小修复后5项通过，见 [green.txt](green.txt)。
2. 第一版浏览器脚本用 `goto` 再次打开当前已经相同的带 hash URL，被浏览器视为同文档导航，并非“直接打开新文档”。见 [browser.txt](browser.txt)及保留的 failure.json。改用同一语言上下文中的新标签页直接访问，然后刷新，复测四组通过。没有扩大产品修复范围。
3. 旧滚动脚本只匹配 `href="#…"`，已改为匹配新的完整 Router 链接；生产资源验收脚本也同时识别同路由完整 URL 的锚点，避免漏计。

## 截图与复现

| 状态 | 中文1440 | 中文390 | 英文1440 | 英文390 |
| --- | --- | --- | --- | --- |
| 连续跳转至4.6 | [图](after-consecutive-zh-1440.png) | [图](after-consecutive-zh-390.png) | [图](after-consecutive-en-1440.png) | [图](after-consecutive-en-390.png) |
| 手动滚动后恢复4.6条目 | [图](after-restored-46-zh-1440.png) | [图](after-restored-46-zh-390.png) | [图](after-restored-46-en-1440.png) | [图](after-restored-46-en-390.png) |
| 返回4.5条目 | [图](after-restored-45-zh-1440.png) | [图](after-restored-45-zh-390.png) | [图](after-restored-45-en-1440.png) | [图](after-restored-45-en-390.png) |

手动滚动截图反映实际阅读位置，不强制把目标节重新顶到视口顶部。截图前断言实际语言；搜索专项同时断言中文查询“斐波那契求余”、英文查询“Fibonacci remainder”。

`node scripts/verify-chapter-history.cjs` 运行历史专项，基线复现加 `--reproduce`；可设置 `READER_BASE_URL`、`HISTORY_AUDIT_DIR`。搜索与除法脚本分别使用 `SCROLL_AUDIT_DIR`、`DIVISION_AUDIT_DIR` 保存新的证据而不覆盖旧记录。

共享 [source-manifest.json](../phase3-division/source-manifest.json) 已更新，包含本轮实现、脚本、报告及原始记录/截图。UTF-8文本按LF规范计算SHA-256，二进制原样计算，清单不包含自身。
