# 第十一轮评审验收

基线为 `24c0da65036056a02cae2cc2848416a5cd9f4b2b`。评审分支为 `codex/phase11-permutation-cycles`。本报告、截图和哈希清单随被验收代码一起提交。交付范围为第 11.1、11.4 节和既有 /cycle；验收环境为本地生产构建预览。

## 阅读与运行

- 从 `/book/11#section-11-1` 阅读四元素书例、对换、六元素循环和定义 11.4 的平凡循环；`#permutation-composition` 对照两种复合次序及 p²、q²，链接习题 11.3。
- 在 `/book/11#cycle-source-map` 区分目的地和来源。`#cycle-transfer-count` 对照定理计数，`#cycle-rotation-example` 单独说明原书右旋两位的来源变换和外层调度。
- /cycle 默认运行六元素主例。已应用的数组、目的地表与零基步号保存在 `fm2gp:cycle:v1:run`；重新挂载同步校验并以暂停状态恢复。草稿和实时计时器只在当前页面使用。重新应用先暂停，失败保留当前快照，成功进入新轨迹起点。重置始终回到已应用轨迹的起点。
- 主例有 43 帧，8 帧发生数据传送。`4←2` 在界面第 26 步，原始标签为 [4,1,2,3,2,5]，累计临时复制 1、数组写入 2。当前高亮为 *i = *j，i=4、j=2、start=0、tmp 保存原位置 0 的值。[逐行数学核对与八次传送](mathematics.md)

## 工程验收

Windows，Node 22.17.1，npm 11.7.0，Vitest 4.1.8，Vite 8.0.16。Vitest 的 TEMP/TMP 指向仓库 .local。

|检查|结果|
|---|---|
|npm run lint|通过|
|npx tsc -p tsconfig.app.json --noEmit|通过|
|npx tsc -p tsconfig.node.json --noEmit|通过|
|npm run test:run|57 个测试文件，552 项通过|
|npm run build|通过|
|生产预览入口|/cycle HTML 和本次 dist/index.html 的 SHA-256 同为 f5920f0c11b737790f5d7977c60bcb78d9d32d4375646bde1a2004125a894a78|

独立枚举 1 至 6 个位置的 873 个排列，分别检查最终值、原始位置标签、非平凡循环数和数组写入数。固定用例另验每个传送事件、闭合时 j 的作用域、辅助函数返回后的局部变量和快照独立性。输入覆盖重复值、全相同值、20 项、非法目的地和原文整数格式。873 次枚举属于一项 Vitest 用例。

## 真实浏览器

Edge 156.0.4314.58，无头独立上下文，预览地址 http://127.0.0.1:4191，视口高 960。手机结果使用 390 CSS 像素模拟宽度。每组检查章节搜索、键盘展开、习题入口、部分草稿错误时换语言、播放器计时、实际拖动进度、重置、末尾重播、地址刷新及来源返回。输入错误后等待 1200 毫秒，仍停在零基步号 25，沿原轨迹继续到 26；成功应用重复值样本后等待 1100 毫秒，仍停在 0。刷新另一次运行后恢复步号 25、全部标签、变量、计数及高亮。四组无页面脚本错误。普通视口截图检查页面宽度并扫描可见文字、title 和 aria-label 中的页码。

|语言／宽度|离开|返回初次|返回 400 ms|刷新演示后返回|预期锚点|
|---|---:|---:|---:|---:|---:|
|中文 1440|1783|1783|1783|1598|1598|
|英文 1440|1975|1975|1975|1734|1734|
|中文 390|2199|2199|2199|1846|1846|
|英文 390|2883|2883|2883|2390|2390|

每次显式返回都核对了完整 source、tag、q 和条目 ID。浏览器后退、前进与首次直达分别检查；清空目录搜索只删除 q。记录包含实际 history key、八帧标签与计数、拖动、暂停和刷新后的状态。[导航原始记录](browser/navigation.json)

|视口|成功例|重复值|4←2|复合次序|
|---|---|---|---|---|
|中文桌面|[结果](browser/success-zh-1440.png)|[标签](browser/duplicates-zh-1440.png)|[搬移](browser/intermediate-zh-1440.png)|[复合](browser/composition-zh-1440.png)|
|英文桌面|[结果](browser/success-en-1440.png)|[标签](browser/duplicates-en-1440.png)|[搬移](browser/intermediate-en-1440.png)|[复合](browser/composition-en-1440.png)|
|中文手机|[结果](browser/success-zh-390.png)|[标签](browser/duplicates-zh-390.png)|[搬移](browser/intermediate-zh-390.png)|[复合](browser/composition-zh-390.png)|
|英文手机|[结果](browser/success-en-390.png)|[标签](browser/duplicates-en-390.png)|[搬移](browser/intermediate-en-390.png)|[复合](browser/composition-en-390.png)|

## 既有专项复跑

- 第十轮同构阅读：4 组上下文，显式与刷新返回、8 次幂运算结果、48 组直达／刷新通过。[记录](regressions/iso.json)
- 第九轮群与陪集普通模式：8 次应用往返、16 组定理用例、48 组直达／刷新通过。逐步依据模式另验 12 组嵌套依据直达／刷新、8 次混合展开状态的往返。[普通模式](regressions/groups.json) · [逐步依据](regressions/reasons.json)
- 搜索逐字滚动与章节独立历史条目在四组环境全部通过。[搜索滚动](regressions/scroll.json) · [章节历史](regressions/history.json)

## 实际发现与复测

1. 首次单测触发 Windows 临时目录 rename EPERM；指定仓库 .local 后得到预期的新增模块尚未实现错误。实现后专项通过。
2. 应用 TypeScript 检查发现新增断言使用了超出仓库 ES2020 类型库的 Array.at。改用现有目标支持的索引，重新执行两套检查与全量测试通过。
3. 初版预览脚本在同一条路径上先硬刷新演示，再断言会话内离开位置。得到锚点 1530，而离开位置为 1715。将会话内往返放在硬刷新之前，随后独立验恢复步号和刷新返回；最终四组两类返回的坐标误差均为 0。构建提示 Browserslist 数据可更新。

复现时构建后执行 `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4191 --strictPort`。设置 READER_BASE_URL 为该预览地址，NODE_PATH 指向宿主 Playwright，然后执行 `node scripts/verify-permutation-cycles.cjs`。默认输出本报告的 browser 目录。文件清单按 Git blob 的实际字节计算 SHA-256。[文件哈希](source-manifest.json)
