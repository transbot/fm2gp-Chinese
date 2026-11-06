# 第七轮评审记录：从定义到归纳证明，附录 A/B 速查

基线：`9e6260664c842843dda593955fafe7b3677045d3`。评审分支：`codex/phase7-proofs-reference`。本报告针对包含本文件的提交；验收使用本地生产构建预览，不代表正式域名已发布。未合并 main。

## 内容与数学核对

- 第 9.1、9.6、9.7 节：从一次满足结合律的计算和一个否定结合律的反例，过渡到包含零的自然数、五条皮亚诺公理和加法的递推定义。固定的 2＋3 展开、左零证明与结合律证明可分别展开，每次改写都有可单独查看的依据。后两次反向改写分别作用于外层加法和括号内的加法。链接可带读者到运算与代数结构或幂算法，再回到原来的推导。
- 附录 A.1–A.3：18 个符号条目、4 个公式阅读示例，以及蕴含、逆否与逆命题的比较。一般真值表保留全部四行；给 p、q 指定整数含义之后，“p 真、q 假”没有整数实例。n＝4 时，p⇒q 为真而 q⇒p 为假。
- 附录 B.1–B.3：分步给出反证、归纳和鸽巢原理的使用条件。求和例从 n＝1 开始；子集例包含空集，1024 个子集至多落入 946 个和，最大和为 945。
- [逐行数学核对表与来源](math-check.md)区分书中定义、证明和用于说明它们的固定数值例；网页引用章、节、公式，不使用 PDF 页码。覆盖仅标到本轮有实际内容的九节。

## 工程检查

Windows，Node.js 22.17.1、npm 11.7.0；Vitest 4.1.8、Vite 8.0.16。检查针对同一份最终产品代码，不新增依赖。

| 检查 | 结果 |
|---|---|
| npm run lint | [通过](eslint.txt) |
| tsc --noEmit -p tsconfig.app.json | [通过](typescript-app.txt) |
| tsc --noEmit -p tsconfig.node.json | [通过](typescript-node.txt) |
| npm run test:run | [48 个文件、488 项全部通过](tests.txt) |
| npm run build | [生产构建通过](build.txt) |

## 真实浏览器验收

Microsoft Edge 156.0.4314.58 无头模式，使用生产构建的 Vite preview（127.0.0.1:4187）。中文和英文各用 1440×1000、390×1000 视口；手机证据为窄视口模拟。记录数按专项列出，不与 Vitest 个数相加。

| 专项 | 实测结果 | 原始记录 |
|---|---|---|
| 本轮章节、节与内容条目 | 每组 60 个目标各直达和刷新，合计 240 对；嵌套条目需先展开父级。四组均无 pageerror | [记录](reference/navigation.json) |
| 证明—演示 | 8 次偏离锚点的演示往返；浏览器后退、前进、显式来源返回、演示硬刷新后返回均核对。显式返回后额外等待，再读一次坐标 | [离开、返回、稳定坐标及历史键](reference/navigation.json) |
| 第 9 章与附录互引、精确搜索 | 20 次跨章互引，24 次显式检索；区分第 9.2 节和习题 9.2，附录节号兼容大小写。搜索截图前核对实际语言、输入值及 URL 查询词 | [记录](reference/navigation.json) |
| 第六轮全书总结 | 11 个演示 × 4 个环境，44 次往返；复测已有 disclosure ID、存储行为、三个主题和来源位置 | [记录](recap/browser-audit.json) |
| 搜索滚动 | 四组，共 410 条逐字输入及导航观测记录 | [记录](scroll/browser-audit.json) |
| 章节历史 | 四组，共 96 条观测记录，含历史键及离开位置 | [记录](history/browser-audit.json) |

采用同一个带多个查询参数及条目锚点的来源，比较两种返回。表中坐标单位为 CSS 像素；“稳定”指显式返回并再次等待后的实测值。硬刷新后没有原会话的位置，目标是展开后的条目，其坐标不应等于先前的离开位置。

| 环境 | /power 离开 → 稳定 | /concepts/algebra 离开 → 稳定 | 硬刷新后返回：实际值＝锚点值 |
|---|---:|---:|---:|
| 中文 1440 | 4001 → 4001 | 4001 → 4001 | 2622 |
| 英文 1440 | 4237 → 4237 | 4237 → 4237 | 2746 |
| 中文 390 | 4917 → 4917 | 4917 → 4917 | 3174 |
| 英文 390 | 6013 → 6013 | 5969 → 5969 | 3974 |

[专项脚本](../../../scripts/verify-proofs-reference.cjs)还检查 Enter/Space 展开、语言切换后内容和原展开状态、窄屏局部滚动及视口宽度。复跑时先执行工程检查、启动 Vite preview，再令 `READER_BASE_URL` 指向该预览；从可解析 `playwright/test` 的环境运行下列脚本。三个既有专项通过各自的输出环境变量重定向，避免覆盖旧报告。

| 脚本（scripts/） | 本轮输出变量及子目录 |
|---|---|
| verify-proofs-reference.cjs | PROOF_AUDIT_DIR → reference |
| verify-book-recap.cjs | RECAP_AUDIT_DIR → recap |
| verify-search-scroll.cjs | SCROLL_AUDIT_DIR → scroll |
| verify-chapter-history.cjs | HISTORY_AUDIT_DIR → history |

## 截图

证明与搜索是普通视口截图；真值表是相应视口下 A.3 内容区域的截图，以同时保留整数反例。

| 语言与宽度 | 结合律证明：已展开的依据 | A.3：真值表与整数例 | 章节搜索 |
|---|---|---|---|
| 中文 1440 | [证明](reference/proof-zh-1440.png) | [真值表](reference/truth-zh-1440.png) | [归纳](reference/search-zh-1440.png) |
| 英文 1440 | [Proof](reference/proof-en-1440.png) | [Truth table](reference/truth-en-1440.png) | [induction](reference/search-en-1440.png) |
| 中文 390 | [证明](reference/proof-zh-390.png) | [真值表](reference/truth-zh-390.png) | [归纳](reference/search-zh-390.png) |
| 英文 390 | [Proof](reference/proof-en-390.png) | [Truth table](reference/truth-en-390.png) | [induction](reference/search-en-390.png) |

## 首次失败与复测

1. [内容回归首次运行](content-red.txt)在实现前无法找到新增的证明和真值表；[专项复测](focused.txt)及全量测试通过。
2. 首次英文预览中快速输入 induction，只留下 idcon（[日志](search-first.txt)、[当时的记录](search-first-navigation.json)）。目录搜索现在即时更新草稿，保持 URL 同步及历史返回；四组最终预览均验证实际输入和 URL 中的 q。
3. 补查正文互引时，原生片段历史条目共用 default，后退错误地恢复到 403 而不是 2045（[日志](native-hash-first.txt)、[当时的记录](native-hash-first-navigation.json)）。对此类 POP 的位置记录按完整地址区分；已有会话位置优先，没有位置才展开并定位锚点。修复后章节历史、正文互引及第六轮往返均重跑通过。
4. [首次 ESLint](lint-first.txt)标出了文案中的全角空格；修正后重跑通过。以上原始失败不计为通过记录。

[SHA-256 文件清单](source-manifest.json)对仓库根文件、src、scripts、public、本轮验收目录和受版本控制的 dist/index.html 按 Git blob 字节计算，排除清单自身。独立复核：在检出的固定提交运行 `node scripts/create-proofs-manifest.cjs HEAD`。
