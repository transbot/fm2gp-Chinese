# 第九轮评审验收：从元素阶到陪集划分

基线 `f2ad685bb658b01decbd92a01c5aa5cffe0f234b`。分支 `codex/phase9-finite-groups`。本报告随评审提交归档，验收在本地生产构建预览执行。

本报告记录首个第九轮评审版本；逐步展开依据的修复及对应验收请见[补充报告](../phase9-proof-steps/README.md)。

## 交付范围

- /book/6#section-6-3 从有限性、左乘双射与消去推到正指数的存在，区分群阶、元素阶与任意一次重复的指数差。
- /book/6#section-6-4 选择元素，逐次模乘到首次出现单位元素。依次显示幂序列、最小正指数、成员集合，并标出当前生成的是四个子群中的哪一个。
- /book/6#section-6-5 阅读 ℤ 与 4ℤ 原例，对固定 H=〈2〉选择代表元，分别查看按 h=1,2,4 得到的乘积和排序后的集合。按书中顺序展开等大、覆盖、双向包含与计数，再进入费马和欧拉演示。

[逐行数学与书例来源核对](math-check.md) · [六行固定结果](fixed-results.json)。计算由轨迹产生，测试独立列出六行期望；第 6.6 题参考解答的乘法表来源差异已记录。

## 工程检查

Windows、Node 22.17.1、npm 11.7.0、Vitest 4.1.8、Vite 8.0.16。工程门禁全部通过：[ESLint](eslint.txt)、[TypeScript app](typescript-app.txt)、[TypeScript node](typescript-node.txt)、[完整 Vitest（52 个文件、507 项）](tests.txt)、[生产构建](build.txt)。npm 更新、Browserslist 数据提示可见原始日志。

专项先针对尚无实现的页面和算法运行，组件用例失败且算法模块未找到。[首次运行](red.txt)。接入后 2 个文件的 11 项通过，[专项结果](green.txt)。状态用例涵盖未设置、空值、越界、带空白或非整数字符的值、合法值的独立恢复、存储读取和写入抛异常后的可操作性。选择键分别为 `fm2gp:book:6.4:element` 和 `fm2gp:book:6.5:representative`。读取发生在第一次渲染，用户更改时写入；语言切换共享同一个数值状态。

## 生产预览与证据

Edge 156.0.4314.58 独立无头上下文，中文／英文，1440×1000／390×1000；390 为窄视口模拟。入口 http://127.0.0.1:4187 的 HTML 与最终 dist/index.html 一致。所有最终浏览器记录均无 pageerror。使用 READER_BASE_URL 指定服务，用 GROUP_AUDIT_DIR 或既有专项的输出环境变量分目录保存证据。

| 专项 | 实际范围 | 原始记录 |
|---|---|---|
| 第九轮 | 8 次应用往返，每次填写两组输入，48 对直达与刷新，16 次精确节／习题检索 | [第九轮导航](browser/navigation.json) |
| 第八轮类型与源码 | 64 对直达与刷新，8 次迭代器移动，16 个纯幂结果 | [记录](types/navigation.json) |
| 第七轮目录查询 | 4 个完整流程，24 个链接目标 | [记录](directory/navigation.json) |
| 第七轮证明与附录 | 240 对直达与刷新，8 次嵌套演示往返 | [记录](proofs/navigation.json) |
| 第六轮主题 | 44 次演示往返 | [记录](recap/browser-audit.json) |
| 搜索滚动／章节历史 | 410／96 条观测 | [搜索](scroll/browser-audit.json) · [历史](history/browser-audit.json) |

## 非默认选择的来源返回

从 /book?source=group-reader&tag=two+words 搜索“元素阶”或“order of an element”，进入 6.3，经正文到 6.4。以键盘选择元素 3 和代表元 6，切换语言，核对选择和证明展开状态。手动展开应用卡时地址仍为 #section-6-4。解码后的 from 保留 /book/6、source、tag、q 与当前应用卡 ID；同时核对 readerSource.url 与离开时的历史 key。

费马页实填 (2,7) 得 2⁶≡1 (mod 7)，候选数 7 是素数；(2,9) 得 2⁸≡4 (mod 9)，合数时定理不适用。欧拉页实填 (3,8)、(2,8)，φ(8)=4，分别得到余数 1（互素）和 0（不互素）。每次均推进到最终步骤再读取实际输出。

每个出口分别验证历史后退／前进、显式返回并等待 400 ms，以及在演示中清掉展开提示、保留选择再硬刷新后返回。逐字段核对元素 3、代表元 6、3→2→6→4→5→1、整个 G、6→5→3、集合 {3,5,6}。硬刷新后 lagrange-applications 和对应子卡均展开。坐标单位为 CSS 像素，各目标容差 2。

| 环境 | 应用 | 离开 → 稳定返回 | 硬刷新后 → 锚点 |
|---|---|---:|---:|
| zh 1440 | fermat | 3450 → 3450 | 2540 → 2540 |
| zh 1440 | euler | 2818 → 2818 | 2614 → 2614 |
| en 1440 | fermat | 3830 → 3830 | 2752 → 2752 |
| en 1440 | euler | 3086 → 3086 | 2826 → 2826 |
| zh 390 | fermat | 4734 → 4734 | 3208 → 3208 |
| zh 390 | euler | 3710 → 3710 | 3282 → 3282 |
| en 390 | fermat | 6388 → 6388 | 4302 → 4302 |
| en 390 | euler | 5000 → 5000 | 4432 → 4432 |

## 首次浏览器检查与复测

首次检查把演示最终步骤的页面高度用于验证返回初始步骤的演示页，观察到 1073 与 1171 的差异。[初次日志](browser-first.txt)。回放到演示时，演示会重新挂载，文档可能变短。最终脚本先在两种布局皆可到达的阅读位置验证浏览器往返，另记录最终步骤离开后的新文档滚动上限；来源章节的展开、选择值及每次稳定坐标均按原离开位置直接核对。另一次 POP 在页面定位完成前采样，取得前一页的 230；已改为等待目标内容挂载并检查实际恢复到位。[早期观测](browser-timing.txt) · [最终记录](browser/navigation.json)。未调整公共滚动逻辑。

## 视口截图

截图为普通视口；返回后的两张图分别定位到两个选择器，原离开坐标记录在截图取景之前。各图均先断言界面语言，目录截图另断言实际输入和 URL 查询。

| 环境 | 元素 2／3 | 代表元 3／6 | 陪集证明 | 费马返回：元素／代表元 | 欧拉返回：元素／代表元 | 搜索 |
|---|---|---|---|---|---|---|
| zh-1440 | [2](browser/element-2-zh-1440.png) / [3](browser/element-3-zh-1440.png) | [3](browser/representative-3-zh-1440.png) / [6](browser/representative-6-zh-1440.png) | [证明](browser/proof-zh-1440.png) | [元素](browser/return-fermat-element-zh-1440.png) / [代表元](browser/return-fermat-representative-zh-1440.png) | [元素](browser/return-euler-element-zh-1440.png) / [代表元](browser/return-euler-representative-zh-1440.png) | [目录](browser/search-zh-1440.png) |
| en-1440 | [2](browser/element-2-en-1440.png) / [3](browser/element-3-en-1440.png) | [3](browser/representative-3-en-1440.png) / [6](browser/representative-6-en-1440.png) | [证明](browser/proof-en-1440.png) | [元素](browser/return-fermat-element-en-1440.png) / [代表元](browser/return-fermat-representative-en-1440.png) | [元素](browser/return-euler-element-en-1440.png) / [代表元](browser/return-euler-representative-en-1440.png) | [目录](browser/search-en-1440.png) |
| zh-390 | [2](browser/element-2-zh-390.png) / [3](browser/element-3-zh-390.png) | [3](browser/representative-3-zh-390.png) / [6](browser/representative-6-zh-390.png) | [证明](browser/proof-zh-390.png) | [元素](browser/return-fermat-element-zh-390.png) / [代表元](browser/return-fermat-representative-zh-390.png) | [元素](browser/return-euler-element-zh-390.png) / [代表元](browser/return-euler-representative-zh-390.png) | [目录](browser/search-zh-390.png) |
| en-390 | [2](browser/element-2-en-390.png) / [3](browser/element-3-en-390.png) | [3](browser/representative-3-en-390.png) / [6](browser/representative-6-en-390.png) | [证明](browser/proof-en-390.png) | [元素](browser/return-fermat-element-en-390.png) / [代表元](browser/return-fermat-representative-en-390.png) | [元素](browser/return-euler-element-en-390.png) / [代表元](browser/return-euler-representative-en-390.png) | [目录](browser/search-en-390.png) |

[SHA-256 清单](source-manifest.json)覆盖相对基线新增或修改的 Git blob，排除清单自身。
