# 第二轮评审收尾验收 — 2026-11-05

本次收尾基线：`731a6aab738f4642b022f866165768477f176981`。本报告、重新生成的截图与 source-manifest.json 对应本次收尾提交。[上一轮报告及证据](https://github.com/transbot/fm2gp-Chinese/blob/731a6aab738f4642b022f866165768477f176981/docs/verification/phase2-review-fixes/README.md)保留在原固定提交中；之前的 RED/GREEN 记录仍保留在本目录。

## 累计修复范围

1. 把 conceptLessons 提取为共用数据源。首页搜索和章节搜索使用包含算法与概念演示的共用索引，覆盖中英文名称、关联节号和别名；按路径合并 `/power`，保留两份目录的可搜索信息。首页显示对应语言标题，数量按去重后的演示目录统计；章节搜索定位真实小节，仍区分小节与习题。
2. 霍纳系数在转换为 Number 之前逐个检查原始十进制整数文本。拒绝小数与科学记数法，保留空序列、长度和范围校验。`[1.00000000000000001,2]`、`[1e-400,2]` 不再被接受为舍入后的其他数值。
3. 逐项求值的 power 仅在乘法成功后与 term 一起更新。对于 `[1,0,0,0]`、x=1000000，失败时保留 term=1000000000000、power=2、乘法计数=2；失败乘法仍由原有提示及精确失败算式说明。

4. 截图脚本保存首页与章节搜索截图前，中文填写“霍纳”，英文填写 `Horner`，并分别断言搜索框的实际值。浏览器记录新增 `screenshotQueries`，记录实际读回的关键词。
5. 章节目录显式节号支持 A、B、C 附录；统一字母大小写后完整匹配，不再回退到概念关联的宽泛匹配。`第C.7节`、`Section C.7`、`section c.7` 都只返回 C.7；数字节号与习题号仍互相区分。

埃及乘法的既有“综合应用与图”分类没有改变。本次未新增算法范围或调整数学约定。

## 本次实际执行的验证

| 检查 | 结果与记录 |
| --- | --- |
| 先补回归测试 | RED：5 失败 / 26 通过，复现附录精确查询与畸形节号问题；见 closeout-red.txt |
| 修复后针对性测试 | GREEN：3 文件 / 39 测试通过，见 closeout-green.txt |
| ESLint | PASS，见 lint.txt |
| TypeScript | PASS，见 typescript.txt（成功输出为空） |
| 完整 Vitest | PASS，33 文件 / 281 测试；见 tests.txt。包含既有埃及乘法、二分查找与最短路径回归。 |
| 生产构建 | PASS，见 build.txt |
| 生产预览 | PASS，两个搜索入口各 14 组查询，另有 7 个显式节号与 3 个习题号查询，均在中英文 × 1440/390 下通过；截图关键词读回断言，以及原文拒绝、溢出回看、自动重播、语言切换、来源返回及刷新通过。见 browser-audit.json |
| 视觉检查 | 新生成的章节搜索中文手机、英文桌面截图已目视核对，输入分别为“霍纳”和 Horner；受影响页面整页无横向溢出。 |

本次新增 15 项测试，覆盖三种 C.7 写法、A/B/C 附录大小写、数字节号精确匹配、习题号区分、畸形与不存在的节号。上一轮新增的 28 项测试继续通过；上一轮 red.txt（23失败/13通过）和 green.txt（5文件/58测试）保留为历史记录。

生产预览环境：http://127.0.0.1:4176，Windows、Node 22.17.1、npm 11.7.0、Vitest 4.1.8、Vite 8.0.16、独立无头 Edge 156.0.4314.58。本轮没有重跑早期的168项全站页面检查；本轮浏览器结果限于上述受影响页面和交互。上一轮修复中的未使用导入问题已在基线提交解决；本轮工程检查均通过。现有 Browserslist 数据库过期提示保留，依赖未变更。

## 截图

本轮重新生成首页、章节搜索和溢出状态的中英文桌面／手机截图。首页与章节搜索的中文输入统一为“霍纳”，英文为 Horner。

| 位置 | 中文桌面 | 中文手机 | English desktop | English mobile |
| --- | --- | --- | --- | --- |
| 首页搜索 | [桌面](home-search-zh-1440.png) | [手机](home-search-zh-390.png) | [Desktop](home-search-en-1440.png) | [Mobile](home-search-en-390.png) |
| 章节搜索 | [桌面](chapter-search-zh-1440.png) | [手机](chapter-search-zh-390.png) | [Desktop](chapter-search-en-1440.png) | [Mobile](chapter-search-en-390.png) |
| 溢出保留状态 | [桌面](overflow-state-zh-1440.png) | [手机](overflow-state-zh-390.png) | [Desktop](overflow-state-en-1440.png) | [Mobile](overflow-state-en-390.png) |

## 用户提供的独立复核

用户报告在原固定提交上额外执行了1,694组霍纳求值与计数检查、4,617条埃及乘法轨迹检查和154个文本文件哈希核对，结果符合约定。用户另说明此次独立运行覆盖搜索与算法函数；浏览器回放核对的是组件源码、脚本和已提交记录，并非声称独立执行了浏览器回放。这些是用户提供的独立结果，不计入本次工具实际执行的测试数量。原238项Vitest及168项页面检查仍由原提交的验收记录支持。

## 复现与证据

设置 TEMP/TMP 为仓库 `.local` 后运行工程检查。构建后运行 `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4176 --strictPort`，设置 NODE_PATH 到桌面运行时的 Playwright，执行 `node scripts/verify-phase2-review.cjs`。

source-manifest.json 使用 SHA-256，UTF-8 文本统一 LF 后计算，二进制按原始字节计算；不包含自身以避免循环哈希。提交后会逐项与提交内的文件复核。GitHub评审分支的推送不是线上部署验收；本次未验证生产网站。所有上述本次检查均已通过。
