# 本版集中收尾：评审验收报告

检查日期：2026-11-07（北京时间）。本报告的固定版本是**包含本报告的 `codex/edition-closeout` Git 提交**；交付消息提供完整 HEAD 和该提交的 GitHub 链接，避免在文件内自引用尚未生成的提交号。文件内容另由 [source-manifest.json](source-manifest.json) 的 staged Git blob SHA-256 固定。

基线 main：`f19725917d9fa24c8f33b2e9c288e48da3338392`。Issue #1 独立修复：[`99c4b0f23b22feb2806e3a1cae464e74120ebbea`](https://github.com/transbot/fm2gp-Chinese/commit/99c4b0f23b22feb2806e3a1cae464e74120ebbea)。其后的提交集中保存 README、覆盖清单、验收脚本与本报告证据。**本轮交付是已推送评审分支，不是 main 合并或正式域名发布。**

## 结果与范围

| 项目 | 本次实际结果 | 证据 |
|---|---|---|
| 本地历史引用清理 | 本地证据分支与远端归档标签解引用都为 `97c5f21ec350bd032fa7d0619008ca3bf60c30cb`，无 worktree 占用后用 `git branch -D` 删除 | [清理记录](archive-cleanup.txt)、[worktree 记录](worktrees-before.txt) |
| Issue #1 | **已修复待合并**，GitHub Issue 保持 open；原生空槽被拒绝 | [RED](issue1/red.txt)、[GREEN](issue1/green.txt)、[逐帧与八次传送](issue1/math-check.json) |
| README 与覆盖清单 | 双语 README 同步40个去重演示；按章列出正文、演示、资源与待补项 | [覆盖清单](../../book-coverage.md)、[实际入口与资源清单](entry-inventory.json) |
| 工程门禁 | ESLint、app/node 两套 TS、60 个测试文件/570 项 Vitest、生产构建全部通过 | [门禁日志](gates/) |
| 整站生产预览 | 59 个入口 × 中英文 × 1440/390 = **236 组通过** | [逐入口原始结果](site/audit.json)、[运行日志](site-run.txt) |
| 既有专项 | **21 套专项通过**，合计82个语言/视口运行上下文；与236组入口扫描重叠，不能相加当作独立测试数 | [首跑记录](specials-results.json)、[最终汇总与复测](final-results.json) |
| 封面、购书、二维码与语言 | 8组空值/隔离配置检查 + 2组语言回退通过；QR解码地址正确 | [封面记录](cover/audit.json)、[二维码解码](qr-decode.json) |
| 资源一致性 | 59个入口HTML、69个浏览器实际加载资源SHA-256与本次dist一致；73个构建文件已哈希 | [资源比对](resource-parity.json)、[构建清单](build/dist-sha256.json)、[构建包](build/dist.zip) |

环境：Windows、Node v22.17.1、npm 11.7.0、Microsoft Edge 156.0.4314.58（Playwright，headless）。主预览 `http://127.0.0.1:4193`，隔离购书预览 `http://127.0.0.1:4194`；视口为1440×1000与390×1000。全部浏览器结果是**本次本地生产构建预览**结果，不冒充正式域名验收。完整环境与执行命令见 [environment.json](environment.json)。

## Issue #1：数学状态与边界核对

`cycleVisualization.validateInput` 在原整数检查处按索引检查 own slot 和安全整数，错误仍为 `cycleInvalidInteger`；`traceCycles` 仍通过原有 `RangeError` 出口拒绝输入。没有修改循环调度、算术计数或播放语义。

| 固定对象 | 独立期望与本次核对 |
|---|---|
| `Array(2)`、`[10,,30]` | 每次调用前用 `index in array` 确认相应槽位缺失，直接调用验证器和轨迹入口。构造没有 JSON、展开或 Array.from 稠密化。两种校验与两种轨迹拒绝共4项先失败再通过。 |
| 稠密安全整数 | 0、负数、重复值、±9007199254740991继续接受；每帧值等于原输入中 origin 指向的值。 |
| 873个排列 | 枚举长度1—6全部排列，独立按目标位置恢复期望；检查33,964帧、197,727个数组格及临时值。结束结果及传送计数同时由既有独立递推/轨道检查验证。 |
| 主例八次传送 | 原始位置标签依次为012345、412345、412325、411325、401325、401325、401525、401523；复制/写入计数依次为(1,0)、(1,1)、(1,2)、(1,3)、(1,4)、(2,4)、(2,5)、(2,6)。 |
| `4 ← 2` | 标签为[4,1,2,3,2,5]；临时复制1、数组写入2、总传送3。复制期间来源2重复是物理数组状态，不能当作排列错误清除。 |
| 重复值例 | 相同数值仍各有原始位置身份；最终来源为[4,0,1,5,2,3]。浏览器复测局部变量作用域、回放及保存位置。 |

首次针对性测试：4 fail/1 pass；修复后 cycle 专项2文件32项通过；最终完整Vitest为60文件570项通过。RED、GREEN和最终门禁均保留，未将既有测试追记为新写的TDD。

## 覆盖口径

实际路由共59个：主页、目录、17个章节/附录页、40个去重演示。目录有14章、3附录、107个节锚点和69个习题锚点；24节登记了专门正文，第14章另有3个回顾主题。资源目录受版本控制的92个文件中，86个进入章节或习题索引，另外6个通过仓库文件夹访问。文件存在、非空、PDF头及文件哈希已核对；不声称对所有历史资源重新完成数学/排版审稿。

`build-edition-inventory.cjs` 比较实际 App 路由与目录集合，拒绝遗漏或重复统计；从显式 `sectionReaders` 识别正文，不将搜索关键词或通用节提示计为专门内容。逐行依据、附录方法卡、独立演示和仓库外链在覆盖清单中分别说明。习题8.3演示仅前两题，8.6为章内参考推导，7.1已移除错误PDF、保留CPP。

历史报告保留原日期及身份：[首轮发布证据归档标签](https://github.com/transbot/fm2gp-Chinese/tree/archive/release-phase1-phase2-evidence/docs/verification/release-phase1-phase2)，目标 `97c5f21ec350bd032fa7d0619008ca3bf60c30cb`；[第十二轮固定评审记录](https://github.com/transbot/fm2gp-Chinese/tree/f19725917d9fa24c8f33b2e9c288e48da3338392/docs/verification/phase12-rings-fields)。旧记录的测试数没有合并进本次数量。

## 浏览器验收与原始导航记录

整站脚本 `verify-edition-site.cjs` 按生成的59入口工作；所有页面检查初态、语言、页面宽度及含隐藏说明/无障碍属性的无页码要求。40个演示执行各自有效操作；有自由输入或非法读取的页面验证错误提示并切换语言。有进度条的演示拖动到中间、终点再回到起点；切换语言核对输入及步号保持。固定模型/受限选择器无自由非法输入的页面明确记为N/A，不计作错误输入通过。素数计数是只读图表，记录绘制与悬停，不声称具有播放器。

以下21套专项全部重跑，原始数据保存在对应子目录：

| 专项 | 原始记录 | 重点 |
|---|---|---|
| 第十二轮环与域 | [rings/navigation.json](rings/navigation.json) | ℤ₅的0、ℤ₆的5独立恢复；六行依据及最后一行双语可访问名称；习题8.6往返；首项相除、消元、raw=2x、monic=x及回看；播放中重选预设复位 |
| 第十一轮循环搬移 | [cycles/navigation.json](cycles/navigation.json) | 八次传送、作用域、非法草稿原地暂停、语言切换、旧轨迹继续、新输入复位、中间刷新与暂停、复合次序 |
| 第十轮同构 | [isomorphism/navigation.json](isomorphism/navigation.json) | b/1/1得到3与4；f₃/0/3得到2与2；11行依据、/power结果243与15 |
| 第九轮群与逐行依据 | [groups](groups/navigation.json)、[reasons](reasons/navigation.json) | 两选择器、15行依据、费马/欧拉实际输入和输出，普通与proof-steps两种模式 |
| 第八轮类型与源码 | [types/navigation.json](types/navigation.json) | 两条阅读路径；同串01000001、ASCII完整结果65与大写A；迭代器代价与尾后位置 |
| 第七轮证明及目录查询 | [proofs](proofs/navigation.json)、[query](query/navigation.json) | 证明展开、附录、source/tag/q贯穿阅读与清空仅移除q |
| 第六轮回顾 | [recap/browser-audit.json](recap/browser-audit.json) | 三主题、全部11演示共44次往返 |
| 搜索滚动与章节历史 | [scroll](scroll/browser-audit.json)、[history](history/browser-audit.json) | 逐字输入、焦点、位置与独立history key；节/习题精确区分 |
| 除法、霍纳、埃及乘法、第二轮收尾 | [division](division/browser-audit.json)、[horner](horner/browser-audit.json)、[egyptian](egyptian/browser-audit.json)、[phase2-review](phase2-review/browser-audit.json) | 计数、固定轨迹、输入与回放、附录C.7精确定位 |
| 反转及返回作用域 | [reverse](reverse/browser-audit.json)、[reverse-return](reverse-return/browser-audit.json) | 容量、传送、标签与三个连续返回上下文 |
| 多项式及返回值 | [polynomial](polynomial/browser-audit.json)、[polynomial-return](polynomial-return/browser-audit.json) | 所有7个预设的每个事件；固定分数结果、相邻raw/monic返回与计数 |
| 生产路由与公共流程 | [production](production/production-audit.json)、[flows](flows/flow-audit.json) | 章节直达/刷新/前进后退、资源链接、设备语言、矩阵与迭代器 |

会话返回按**实际点击离开时位置**核对首次布局及400ms后稳定坐标；演示硬刷新返回按展开后的来源条目锚点核对，容差2 CSS像素。两种目标不混用。query、rings、cycles、isomorphism 等记录包含完整source/tag/q、来源条目及history key。原始记录保留具体URL、展开状态、离开与返回坐标，报告不以一句“导航通过”替代证据。

### 首次发现与复测

1. 新整站脚本首次236组中有16组失败：中文二分查找/旋转控件名不匹配，以及把旧斯坦因/斐波那契空输入误当成必报错。前者按实际控件名修正；后三页按现有负值范围规则验证错误提示。应用未改动。完整初跑记录与失败截图保留在 [attempts](attempts/) 和 site 的 `*-failure.png`；后续236组全部通过，并再次补强英文文案与语言切换保留状态检查。
2. 旧多项式专项用 `fixtures[1]` 作为分数例；新增首项系数预设后下标改变，脚本停在分数轨迹中间。改按稳定ID `fraction`/`book` 查找，未降低固定结果断言；全预设、全事件及四组导航复测通过。见 [初跑](attempts/polynomial-initial-failure.txt)、[复测](polynomial/retest.txt)。
3. 资源比对首跑读取HTTP缓存304响应体失败。改为禁用缓存后获取完整响应，59个HTML入口与69资源通过；[原失败](attempts/assets-cache-failure.txt)保留。
4. 第八轮ASCII断言从单字符A收紧为中英文完整结果，复测4条阅读路径、8次迭代器移动、16个幂用例及64组直达/刷新通过，见 [复测日志](types/full-ascii-retest.txt)。

既有行为与限制：旧斯坦因和两种斐波那契页面仍使用 `parseInt(...) || 0`，空输入按0处理，本轮不把它描述为严格原文整数解析；新轨迹页的严格输入规则保持原验收范围。Browserslist报告caniuse-lite数据过期，构建成功，无本次新增运行错误。浏览器是桌面Edge的390 CSS像素视口，不等同于已完成iOS/Android真机验收。未重新审定全部历史习题答案。

## 购书配置与关键截图

交付的 `src/config/book.ts` 中 `CHINESE_BOOK_STORE_URL` 仍为 `''`。中文版封面是普通图片，没有链接、手形或购买提示。隔离构建只在Vite测试插件内替换为 `https://example.com/edition-store-fixture`，通过本地拦截验证整封面链接、可见键盘焦点和Enter打开；这个地址**不在交付配置或主dist中**。

中文版封面原始尺寸1298×1691；桌面与390宽度保持比例、完整展示。中文优先中文版，英文优先英文版。README与首页共用 `public/images/mobile-web-qr.png`；OpenCV 4.6.0实测解码为 `https://fm2gp-chinese.bookzhou.com/`，370×370黑白图、最小白边40像素，与购书配置独立。语言初始化按浏览器偏好，手动选择重载后保持；不支持语言回退也已验证。

| 证据 | 中文桌面 | 中文手机 | English desktop | English mobile |
|---|---|---|---|---|
| 普通封面与二维码（完整页底区域） | [查看](cover/empty-zh-1440.png) | [查看](cover/empty-zh-390.png) | [View](cover/empty-en-1440.png) | [View](cover/empty-en-390.png) |
| 隔离购书配置 | [查看](cover/configured-zh-1440.png) | [查看](cover/configured-zh-390.png) | [View](cover/configured-en-1440.png) | [View](cover/configured-en-390.png) |
| 循环搬移中间状态4←2（普通视口） | [查看](cycles/intermediate-zh-1440.png) | [查看](cycles/intermediate-zh-390.png) | [View](cycles/intermediate-en-1440.png) | [View](cycles/intermediate-en-390.png) |
| 重复值来源标签 | [查看](cycles/duplicates-zh-1440.png) | [查看](cycles/duplicates-zh-390.png) | [View](cycles/duplicates-en-1440.png) | [View](cycles/duplicates-en-390.png) |
| 成功终态 | [查看](cycles/success-zh-1440.png) | [查看](cycles/success-zh-390.png) | [View](cycles/success-en-1440.png) | [View](cycles/success-en-390.png) |
| 排列复合次序 | [查看](cycles/composition-zh-1440.png) | [查看](cycles/composition-zh-390.png) | [View](cycles/composition-en-1440.png) | [View](cycles/composition-en-390.png) |

另外保存各章证明、来源返回、环模型、多项式四阶段、同构及搜索截图。实际截图位置见对应专项目录；英文搜索截图使用英文查询，中文使用中文查询。人工抽看了中文页底桌面/手机与英文手机4←2截图，封面标题完整、来源重复及局部代码滚动可辨认。

## 本版集中收尾清单与维护入口

| 项目 | 当前状态 | 结束条件 |
|---|---|---|
| Issue #1 | 修复及回归已提交，**已修复待合并**；Issue仍open | 评审通过，修复进入main，再完成正式域名验收后关闭 |
| README与全书覆盖说明 | 本次已同步并核对 | 与最终评审提交一并合并，发布报告固定同一版本 |
| 最终整站回归 | 本次生产预览、工程门禁与资源核对通过 | 合并后保留发布dist，确认Netlify Published commit_ref及正式域名专项、资源一致性 |
| 正式购书地址 | 空值状态交付；空值和隔离配置两分支均通过 | 取得真实地址后核对版次/ISBN，单独配置并复验；空值不阻碍本版评审 |
| 最终发布验收报告 | **尚未执行发布** | 评审后按授权合并发布，交付main完整HEAD、部署、北京时间、线上原始记录与资源哈希 |
| 新章节专题 | 只登记后续候选 | 不纳入本版完成数量；收到后续授权再安排 |

集中收尾的实现与评审证据已具备，后续剩余的是评审、main合并和正式域名发布门禁。正式域名验收后才交付本版最终发布报告并转入维护；本报告不提前宣布线上结案。

## Reproduction summary

The review contains the sparse-array fix as an independent commit, a generated bilingual coverage inventory, and production-preview evidence. Run the five commands in README (ESLint, both TypeScript projects, Vitest and build), then `build-edition-inventory.cjs`, `verify-edition-cycle.cjs`, `verify-edition-site.cjs`, `verify-edition-specials.cjs`, and `verify-edition-assets.cjs`. Set `NODE_PATH` to an installed Playwright package and `READER_BASE_URL` to the immutable preview. The optional bookstore fixture is built with `build-edition-store-preview.mjs`, served on4194, then tested with `verify-edition-cover.cjs`; delivered configuration stays empty. Exact commands and outputs are archived. No production publication or issue closure is claimed in this review.
