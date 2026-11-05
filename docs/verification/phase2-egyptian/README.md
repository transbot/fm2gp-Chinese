# 埃及乘法改进与第二轮最终验收 — 2026-11-05

第一项霍纳法则已独立提交：`f0289ddc5a75206c15d0da3cc12ebf870e82b05a`。第二项入口保持 `/multiply`，章节目录同时关联第 2.1、2.2 节。此报告与 source-manifest.json 随同最终实现提交；以所在提交和文件 SHA-256 确认验收对象，未推送远程。

## 实现与数学口径

- 三个版本使用同一 n、a，共用应用输入与示例；各自具有独立的播放、暂停、速度、回看和重播。原倍增表保留为可展开汇总。
- n 始终是重复次数，a 是被累加对象，不互换。入口包装处理 n=0 与负 n，不计入算法帧。
- 计数仅包含数据加法及 a+a，不包含比较、half、n−1。计数从实际事件产生。
- 源码级算法调用栈只统计 multiply0、multiply1、multiply4、mult_acc4；odd/half 是语句内辅助操作，输入包装独立展示。
- 递归下降的参数倍增与返回后的奇数分支分开记录；恢复调用者自己的 n、a。辅助函数进入/退出时帧数同步改变。
- 代码高亮标明刚执行的语句，变量、返回值、加法次数、活动帧与峰值来自同一独立快照。代码片段逐句与 ch02.h 核对。
- 辅助空间为 O(n)、O(log n)、O(1)；不将演示器保存的回放记录计为算法空间，不假设编译器尾调用优化。
- 整数 |n|≤256、|a|≤1,000,000，保留全部步骤；每次数据运算先用精确整数检查，再进入安全整数状态。

| 输入 | multiply0 加法 / 峰值帧 | multiply1 加法 / 峰值帧 | multiply4 加法 / 峰值帧 |
| --- | --- | --- | --- |
| 15×7 | 14 / 15 | 6 / 4 | 6 / 2 |
| 16×7 | 15 / 16 | 4 / 5 | 4 / 1 |
| 41×59 | 40 / 41 | 7 / 6 | 7 / 2 |
| 1×a | 0 / 1 | 0 / 1 | 0 / 1 |

## 验收结果

- ESLint、TypeScript：通过，见 lint.txt、typescript.txt（成功时为空）。
- Vitest：31 文件 / 238 测试通过，见 tests.txt。
- 生产构建：通过，见 build.txt。最终构建后仅补充测试与验收脚本、清理两行尾随空格，没有改变应用行为。
- 算法测试先记录 RED（模块尚未实现），再得到 GREEN；组件回归和源码映射核验在集成阶段增加，不称作预先 TDD。
- 真实输入回归：播放中应用另一组输入后，三个播放器全部暂停归零；前进、回看和重播只显示新输入的轨迹。
- 语言回归：中途切换语言保留输入、变量、计数、活动帧及代码位置；回看与恢复自动播放的解释使用新语言。霍纳法则同样补测恢复自动播放。
- 输入边界：零、负 n、a=0、空输入、小数、超容量、n=256 完整回放。固定数学结果、独立精确运算与加法计数公式核验通过。
- 生产预览 http://127.0.0.1:4174：两个演示各自中文/英文 × 1440/390 验收；章节入口、直达刷新、浏览器返回/前进、键盘展开、源码计数、1/2 帧差异、错误提示与语言行为通过。
- 全站最终构建回归：42 条路由 × 2 语言 × 2 宽度 = 168 项通过，没有页面异常、整页横向溢出或受检英文状态中的中文残留。检查包含折叠文字和无障碍属性的页码扫描，见 sweep/browser-audit.json。
- 既有来源返回、章节滚动恢复、学习路线、设备语言、手动语言持久化、首页封面与空商店链接回归通过，见 sweep/flow-audit.json。二分查找和最短路径回归包含在完整 Vitest 中。

环境：Windows、Node 22.17.1、npm 11.7.0、Vitest 4.1.8、Vite 8.0.16、独立无头 Edge 156.0.4314.58。所有浏览器检查针对生产构建预览，不是开发服务器。

## 最终截图

中文桌面与英文手机截图已目视核对。宽代码与大调用栈局部滚动；原倍增表折叠可展开。

| 演示 | 中文桌面 | 中文手机 | English desktop | English mobile |
| --- | --- | --- | --- | --- |
| 埃及乘法 | [桌面](egyptian-zh-1440.png) | [手机](egyptian-zh-390.png) | [Desktop](egyptian-en-1440.png) | [Mobile](egyptian-en-390.png) |
| 霍纳法则最终回归 | [桌面](horner-regression/horner-zh-1440.png) | [手机](horner-regression/horner-zh-390.png) | [Desktop](horner-regression/horner-en-1440.png) | [Mobile](horner-regression/horner-en-390.png) |

## 复现与边界

设置 TEMP/TMP 为仓库 .local，执行 npm run lint、npx tsc -b --pretty false、npm run test:run、npm run build。启动 Vite preview 到 4174。浏览器脚本使用桌面运行时提供的 Playwright（NODE_PATH），不新增项目依赖。

- `node scripts/verify-egyptian.cjs`
- `READER_OUTPUT_DIR=docs/verification/phase2-egyptian/horner-regression` 时执行 `node scripts/verify-horner.cjs`。
- `READER_BASE_URL=http://127.0.0.1:4174`、`READER_OUTPUT_DIR=docs/verification/phase2-egyptian/sweep` 时执行 verify-reader-ui.cjs 与 verify-reader-flows.cjs。

第一项原始证据保留在 phase2-horner，不覆盖其提交时的结果。现有 Browserslist 数据库过期提示保留，依赖未变更。无未通过的验收项；检查覆盖所记录的状态，未穷举全部输入或其他浏览器，未验证线上部署。

提交后清单复核发现第一项 TraceCode 条目曾按 CRLF 原始字节计算，已按清单声明的 LF 规则修正并折入尚未推送的本地提交；两笔最终提交均重新核对所有清单条目。应用源码与验收结果未因此改变。
