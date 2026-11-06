# 第十轮评审：理论、模型与同构

基线 `0b4c011811f2ecd283829610f50c12b9f94c6444`，分支 `codex/phase10-isomorphism`。本报告对应包含本文件的固定提交。以下数据来自合并前的生产构建预览。

## 页面与范围

- /book/6#section-6-6 解释定义 6.11–6.13 和整数加法、模 7 乘法模型。短例明确为两个加法幺半群之间的同构；两端的单位元素均为 0。
- /book/6#section-6-7 提供两个书中同构与一个伴读反例。选择预设、x、y，联动查看映射表、两张运算表及两条计算路径；分别显示当前有序对和全部 16 对的验证结果。
- 两群性质对照展示实际运算、元素阶、生成元和对角线。不同构证明有 6 行，四阶循环群的一般证明有 5 行。展开整张卡可读完整公式序列；每行的依据独立开合。
- 泛型阅读卡用 ℤ₄ 和 U(8) 的具体运算与单位元素说明不同构模型可共用非负整数幂算法，并回到 10.3、C.2 和 /power。可用“同构／isomorphism”“克莱因群／Klein group”“范畴性／categorical”按节检索。

[逐行数学核对](math-check.md) · [独立表值与枚举](independent-values.json) · [实现与阅读状态测试](../../../src/pages/IsomorphismReading.test.tsx)。

## 工程结果及复测

Windows，Node 22.17.1，npm 11.7.0，Vite 8.0.16、Vitest 4.1.8。[ESLint](eslint.txt)、[TypeScript app](typescript-app.txt)、[TypeScript node](typescript-node.txt)、[完整 Vitest](tests.txt)和[生产构建](build.txt)通过。完整 Vitest 共 55 个文件、521 项。既有 Browserslist 数据提示与 npm 更新提示见日志。

纯计算用例先于实现运行，首次因缺少模块而失败；实现后 5 项通过。[RED](math-red.txt) · [GREEN](math-green.txt)。提取 GroupProof 后立即重跑第九轮数学、选择器与步骤的 15 项专项及带步骤的真实浏览器往返，均通过。[提取后组件专项](proof-extraction.txt) · [提取后往返](extraction-history.txt)。

页面接入后，首次全量运行中第九轮的 7 项用例失败，原选择器测试选中了第 6 章的全部下拉框（包括新增 3 个）。保留原期望，按两个原有控件的名称定位，完整重跑后通过。[首次日志](tests-first.txt) · [最终日志](tests.txt)。

## 生产预览

Edge 156.0.4314.58、独立无头上下文；中文／英文 × 1440／390 像素，视口高 1000。390 模拟手机宽度。构建后比对预览入口 HTML 与 dist/index.html。所有最终运行的浏览器专项均无 pageerror。

| 专项 | 实际结果 | 原始证据 |
|---|---|---|
| 第十轮同构阅读 | 4 条完整阅读路径，48 对直达/刷新，12 次显式搜索，8 个 /power 结果 | [本轮导航](browser/navigation.json) |
| 第九轮普通模式 | 8 次费马／欧拉往返、48 对直达/刷新 | [groups](groups/navigation.json) |
| 第九轮逐步依据 | 8 次混合状态往返、12 对嵌套依据直达/刷新 | [reasons](reasons/navigation.json) |
| 第八轮两条路径 | 8 次迭代器移动、16 个纯幂结果、64 对直达/刷新 | [types](types/navigation.json) |
| 目录搜索 | 4 次完整阅读流程、24 个链接目标 | [directory](directory/navigation.json) |
| 搜索滚动、章节历史 | 410 条滚动与 96 条历史观测 | [scroll](scroll/browser-audit.json) · [history](history/browser-audit.json) |

从 /book?source=model-reader&tag=two+words 逐字搜索对应语言的词，经 6.6 到 6.7，主动载入反例 (b,1,1)，核对左路 3 与右路 4。使用键盘选择 (f₃,0,3)，核对选中控件、完整像序列、两个表格单元格的行列坐标、标题、局部滚动容器和可见焦点。普通展开和直接访问伴读反例保留先前的选择。展开 3 行依据，另外 8 行保持收起。切换语言后仍使用同一组语义状态。

从阅读卡点入 /power 前，核对 from 与 readerSource：包含 /book/6、source、tag、q 和 #generic-model-range。浏览器后退、前进核对各历史键和离开位置。幂页分别选乘法、加法，输入 3 和 5，推进到最终步骤并核对 243、15。返回证明后同时核对预设、两个操作数、路径中间值、公式、依据状态和位置。硬刷新前只清除阅读卡的展开提示，保留已选模型参数和证明状态；返回时阅读卡展开并按其锚点定位。

| 视口 | 离开 → 显式返回后等待 400 ms | 硬刷新返回 → 来源目标 |
|---|---:|---:|
| zh 1440 | 6636 → 6636 | 6383 → 6383 |
| en 1440 | 7068 → 7068 | 6715 → 6715 |
| zh 390 | 8992 → 8992 | 8427 → 8427 |
| en 390 | 11364 → 11364 | 10547 → 10547 |

嵌套依据的直达与刷新每次都从清空展开提示开始，检查祖先与目标均打开，容差 2 CSS 像素。回到目录清空搜索后仅删除 q。各新增条目在四个环境检查视口宽度、可见文案及无障碍属性的无页码要求。复现使用 scripts/verify-isomorphism.cjs，以 READER_BASE_URL 和 ISO_AUDIT_DIR 指定服务及输出目录。

## 截图

成功和失败映射使用普通视口截图。性质对照截取该视口下整个内容区域，以保留两表及生成元。截图前核对当前语言，搜索另核对搜索框和 URL。

| 视口 | 合法映射 f₃,0,3 | 失败映射 b,1,1 | 两群性质 | 章节搜索 |
|---|---|---|---|---|
| zh-1440 | [截图](browser/valid-map-zh-1440.png) | [截图](browser/failing-map-zh-1440.png) | [截图](browser/group-properties-zh-1440.png) | [截图](browser/search-zh-1440.png) |
| en-1440 | [截图](browser/valid-map-en-1440.png) | [截图](browser/failing-map-en-1440.png) | [截图](browser/group-properties-en-1440.png) | [截图](browser/search-en-1440.png) |
| zh-390 | [截图](browser/valid-map-zh-390.png) | [截图](browser/failing-map-zh-390.png) | [截图](browser/group-properties-zh-390.png) | [截图](browser/search-zh-390.png) |
| en-390 | [截图](browser/valid-map-en-390.png) | [截图](browser/failing-map-en-390.png) | [截图](browser/group-properties-en-390.png) | [截图](browser/search-en-390.png) |

[文件哈希清单](source-manifest.json)按相对基线变更的 Git blob 字节计算 SHA-256，排除清单自身。
