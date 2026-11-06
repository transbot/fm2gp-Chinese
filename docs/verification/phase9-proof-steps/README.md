# 第九轮修复评审：逐步展开证明依据

基线为 `838578e0cf8e0827fa6103e1baefbd4c48dcbcc3`，评审分支为 `codex/phase9-finite-groups`。本报告对应包含本文件的修复提交，固定版本链接中的 SHA 即其完整 HEAD。验收使用生产构建的本地预览。

## 正文与状态

三张卡依次有 4、5、6 个步骤。展开证明即可顺序阅读全部公式；每行公式下的原生控件独立显示本步依据。15 个语言无关的语义 ID 同时作为 React key、DOM 锚点及 ReadingDetail 会话存储键的后缀。每个控件的无障碍名称包含对应公式。沿用现有阅读器的同步恢复和嵌套锚点定位。

- 有限阶存在性：order-left-translation、order-repeated-powers、order-cancel-on-right、order-positive-exponent。
- 生成子群大小：cyclic-first-return、cyclic-distinct-powers、cyclic-period、cyclic-product-closure、cyclic-inverses。
- 陪集划分：coset-equal-size、coset-cover、coset-intersection、coset-forward-inclusion、coset-reverse-inclusion、coset-count。

[数学依据与固定结果](../phase9-groups/math-check.md) · [步骤数据](../../../src/data/groupProofs.ts) · [逐行中英文断言](../../../src/pages/GroupProofSteps.test.tsx)。

## 工程检查

Windows，Node 22.17.1，Vitest 4.1.8，Vite 8.0.16。[ESLint](eslint.txt)、[TypeScript app](typescript-app.txt)、[TypeScript node](typescript-node.txt)、[完整测试](tests.txt)与[生产构建](build.txt)均通过。完整 Vitest 为 53 个文件、511 项。修复前 4 项新用例失败；修复后，证明步骤、原选择器及固定数学结果的专项共 3 个文件、15 项通过。[初次结果](red.txt) · [复测](focused.txt)。

四项新用例分别验证中文与英文的 15 组 ID／公式／依据对应关系、独立开合与语言切换及重新挂载、存储异常时仍可切换。测试对照固定公式与语义短语，检查整个页面的 ID 唯一性。

## 生产预览

参照固定构建的 dist/index.html 核对了预览入口。以 READER_BASE_URL=http://127.0.0.1:4187、GROUP_AUDIT_DIR 指定各自输出目录，运行 `node scripts/verify-finite-groups.cjs` 和带 `--proof-steps` 的修复专项。两者各在 Edge 156.0.4314.58、中文／英文、1440×1000／390×1000 的独立上下文运行；390 为窄视口模拟。

| 检查 | 通过范围 | 证据 |
|---|---|---|
| 三个证明的深层链接 | 每个环境各有三个目标，共 12 对直达与刷新。两种访问都预先清除展开提示，核对父证明、唯一展开的目标依据和实际定位 | [修复专项记录](reasons/navigation.json) |
| 部分依据展开后往返 | 8 次进入费马或欧拉演示再返回，分别保存离开、稳定返回及硬刷返回时全部 15 个步骤的布尔状态 | [修复日志](reasons.txt) |
| 原第九轮回归 | 普通模式完整重跑四组环境，8 次应用往返、16 个定理用例、48 对直达与刷新 | [原始记录](regression/navigation.json) · [日志](regression.txt) |

直接访问目标为 `order-cancel-on-right`（右消去）、`cyclic-period`（周期）、`coset-intersection`（陪集相交）。混合状态为这三行和 `coset-equal-size` 展开，其余 11 行收起。检查点击、键盘展开、语言切换、POP、显式返回与再次采样。各返回同时核对元素 3 的完整正幂、整个 G、选中代表元 6 的乘积 6→5→3 及集合 {3,5,6}。

会话内显式返回对比实际离开位置，返回后等待 400 ms。硬刷新另清除应用卡展开提示、保留证明依据和选择值，按应用卡目标位置验收，并检查祖先与应用卡展开。各位置容差为 2 CSS 像素。以下数据来自修复专项。

| 语言与宽度 | 应用 | 离开 → 稳定 | 硬刷返回 → 应用锚点 |
|---|---|---:|---:|
| zh 1440 | fermat | 4473 → 4473 | 4365 → 4365 |
| zh 1440 | euler | 4643 → 4643 | 4439 → 4439 |
| en 1440 | fermat | 4797 → 4797 | 4661 → 4661 |
| en 1440 | euler | 4995 → 4995 | 4735 → 4735 |
| zh 390 | fermat | 5505 → 5505 | 5285 → 5285 |
| zh 390 | euler | 5787 → 5787 | 5359 → 5359 |
| en 390 | fermat | 6851 → 6851 | 6519 → 6519 |
| en 390 | euler | 7217 → 7217 | 6649 → 6649 |

## 截图与复测记录

| 视口 | 陪集证明中部分展开、部分收起 |
|---|---|
| zh 1440 | [截图](reasons/mixed-reasons-zh-1440.png) |
| en 1440 | [截图](reasons/mixed-reasons-en-1440.png) |
| zh 390 | [截图](reasons/mixed-reasons-zh-390.png) |
| en 390 | [截图](reasons/mixed-reasons-en-390.png) |

第一次运行新增浏览器记录器时，有一个尚未定义的局部变量，脚本在保存结果前退出。[首次日志](audit-first.txt)。修正采样变量后，普通模式和修复模式都在最终构建上重新完整运行，全部通过。

[SHA-256 文件清单](source-manifest.json)按 Git blob 字节计算，覆盖相对第九轮基线 main 的全部新增或修改文件，排除本清单自身。
