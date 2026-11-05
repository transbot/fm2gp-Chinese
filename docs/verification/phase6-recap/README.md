# 第六轮：第14章全书总结验收

- 分支：`codex/phase6-book-recap`。
- 固定发布基线：`4fad5333b1989e68060beba31904f907ea67b8e2`。已fetch并核对远端main，从该基线新建分支。
- 审查对象：包含本报告的独立提交；完整HEAD见交付消息。`source-manifest.json`对应提交内源码、脚本、构建入口及本轮证据，清单自身除外。
- 本轮仅提交并推送评审分支，不合并main或上线。
- 日期：2026-11-06，Asia/Shanghai。

## 正文与内容核对

已读取用户提供的中文版PDF第14章正文，并渲染目视核对。PDF SHA-256：`aa0b3762c2ea451803e325c695c0d90d3dd02b30d9cf5ab0818464f4bb1dbdae`。本章强调从具体高效实现逐步泛化、效率、正确接口和有用的返回值、类型与概念的区别，以及避免过多或不足的要求。应用保留正式章名“全书总结”/“Conclusions”，不显示PDF页码，不虚构14.1等节号。

入口：`/book/14`。三个普通主题锚点：

| 主题 | 锚点 | 关联演示 |
| --- | --- | --- |
| 从乘法到通用幂算法 | `review-power` | /multiply、/concepts/algebra、/power、/concepts/matrices、/shortest-path |
| 从整数求余到多项式GCD | `review-gcd` | /division、/gcm、/polynomial-gcd、/horner |
| 迭代器能力与内存权衡 | `review-iterators` | /concepts/iterators、/reverse |

每组先给简短总结、再给两个问题；参考解释默认折叠，包含实际对应章节和演示入口。中英文使用同一结构化主题数据，资源名称从既有lessonSearchCatalog和bookCatalog取得，原有代码／阅读资源区继续使用bookResources。第14章目录摘要同步覆盖三个主题。

数学和算法说明逐项核对：

- 正整数指数：封闭且满足结合律的二元运算，即半群，足以支持幂算法；不要求交换律或单位元素。零指数需要单位元素并返回它，扩展为幺半群。类型满足概念包括语义规律及值操作，不只是运算符能编译。
- 同阶方阵乘法封闭且结合；算法改变分组、保留因子顺序，不依赖交换律。零指数使用同阶单位矩阵。布尔可达性及热带半环最短路径展示改变矩阵运算后的复用；不宣称矩阵操作与整数操作实际成本相同。
- A=BQ+R保证(A,B)与(B,R)的公因式保持。非负整数有0≤R<B；ℚ[x]中R=0或deg(R)<deg(B)，非零除数大小／次数严格下降。零多项式没有通常意义的次数，先判零；循环以b=0终止。多项式首一化独立发生在循环返回后。
- 商余共享复用倍增、减半和扣减，并额外维护n；明确记录商有额外更新，避免把“有用返回”误述成免费计算。45÷6得到(7,3)，完整检查点满足A=n×c+a；成对更新中的暂态不声称恒等式成立。
- 九元素递归反转：h=4、左半m=4、跳过中间项后m=5、右半l=9(end)。根交换前序列[3,2,1,0,4,8,7,6,5]，交换(0,5)、(1,6)、(2,7)、(3,8)。前向能力无需向后移动，但需要可写、可交换元素及可保存重用的位置副本。
- 容量1：12次交换，36次传送，最大层数4，缓冲未使用；容量2：8次交换、8次复制、8次回写，3×8+8+8=40次传送，最大层数3，缓冲峰值2。一次swap计3次传送，每次缓冲复制/回写计1次。现有真实轨迹在测试中重新生成并锁定这些计数和根调用步骤。

## 交互与来源返回

页内导航使用React Router Link，显式携带pathname、完整search和主题hash，每个主题跳转产生独立history key。

进入演示继续使用from URL，同时在Router state中携带来源历史条目的key和URL。ReaderNavigation只在来源URL匹配且存在相应历史记录时，用该条目离开前记录的scrollY处理显式“返回来源”；普通页面跳转、查询REPLACE、浏览器POP继续沿用既有行为。不会为了回到主题而重新计算或重置演示。

参考解释使用原生details/summary，支持Enter和Space。展开状态以问题ID保存在当前标签页sessionStorage中，语言切换、演示往返和主题页刷新时保持。无法读取存储或数据损坏时安全回到折叠状态。硬刷新演示会重新建立滚动记录；此时来源URL仍保留主题及查询参数，返回时定位主题锚点，不能声称刷新后仍有旧内存中的精确scrollY。

## 工程门禁与生产预览

环境：Windows、Node22.17.1、npm11.7.0、Vite8.0.16、Vitest4.1.8。Edge156.0.4314.58无头Playwright；zh-CN/en-US，每种语言1440×1000及390×1000。预览地址`http://127.0.0.1:4184`，由生产构建的Vite preview提供，不是开发服务器。

| 检查 | 结果及证据 |
| --- | --- |
| ESLint | PASS，[日志](eslint.txt) |
| TypeScript app / node | PASS，[app](typescript-app.txt)、[node](typescript-node.txt) |
| 全量Vitest | 46个文件、466项PASS，[日志](all-tests.txt) |
| 生产构建 | PASS，[日志](build.txt)，dist/index.html随提交更新 |
| 本轮浏览器专项 | 四环境，12组主题直达/刷新、44组关联演示往返、12组主题历史导航PASS，[日志](browser-run.txt)、[完整记录](browser-audit.json) |
| 搜索滚动回归 | 四环境逐字输入、删除、清空、重置、查询和视口恢复PASS，[日志](scroll-run.txt)、[记录](scroll-regression/browser-audit.json) |
| 章节历史回归 | 四环境独立key、实际离开位置恢复、hash/query及来源返回PASS，[日志](history-run.txt)、[记录](history-regression/browser-audit.json) |

本轮9项新增测试包括结构化双语/地址/章节契约、正文条件、实际算法计数与检查点，以及挂载真实BrowserRouter和ReaderNavigation的主题历史、语言展开与来源返回。原有所有算法测试仍完整运行。

浏览器专项访问全部11个关联演示，读取真实URL、history key、scrollY、展开项和来源Router state。每次进入演示前记录实际点击离开位置，再分别验证浏览器后退/前进、显式返回来源、再次后退/前进。三个主题均保留q和额外source查询参数，返回后保持原展开项。另验证演示硬刷新后的来源锚点回退行为。

截图前切回目标语言；英文页面移除语言切换按钮的自称“中文”后检查无中文残留。检查所有已展示文案无页码、页面宽度不超出视口。目录截图使用中文“全书总结”或英文“Conclusions”并断言搜索框实际值和html语言。

## 发现与修复记录

1. 先添加内容契约测试，因bookRecap模块尚不存在而失败：[RED](red.txt)。实现数据后发现一个英文词句测试的大小写匹配错误（Closure/closure），修正为不区分大小写；[原记录](content-first-check.txt)保留。
2. 在修改滚动逻辑前，三组真实BrowserRouter来源返回测试都失败：预期离开位置777，实际返回主题标题位置100/200/300：[导航RED](navigation-red.txt)。补充来源条目key及URL校验后，相关18项内容/导航测试通过：[GREEN](green.txt)。最终追加根交换及商余检查点测试，全量466项通过。
3. 真实生产预览的首次专项与既有导航回归均通过。收尾精简页面提示文字并增加固定步骤断言后，重新执行全部工程门禁，并在最终构建上重跑本轮专项、刷新截图。搜索和章节历史回归针对相同滚动实现完成；最后文字调整未改变这两个旧页面。
4. 无新增依赖、后端或账号。既有Browserslist数据与npm版本更新提示为非阻断提醒，未升级依赖。

没有未通过的本轮验收项。390像素为桌面Edge模拟手机视口，未声称覆盖实体手机全部浏览器。精确阅读位置恢复范围是当前应用会话中的历史条目；刷新后的行为按上文记录。

## 截图

| 内容 | 中文桌面 | 中文手机 | English desktop | English mobile |
| --- | --- | --- | --- | --- |
| 章节页视口 | [图](overview-zh-1440.png) | [图](overview-zh-390.png) | [Image](overview-en-1440.png) | [Image](overview-en-390.png) |
| 幂算法主题及解释 | [图](review-power-zh-1440.png) | [图](review-power-zh-390.png) | [Image](review-power-en-1440.png) | [Image](review-power-en-390.png) |
| 求余与GCD主题及解释 | [图](review-gcd-zh-1440.png) | [图](review-gcd-zh-390.png) | [Image](review-gcd-en-1440.png) | [Image](review-gcd-en-390.png) |
| 迭代器与内存主题及解释 | [图](review-iterators-zh-1440.png) | [图](review-iterators-zh-390.png) | [Image](review-iterators-en-1440.png) | [Image](review-iterators-en-390.png) |
| 目录摘要 | [图](directory-zh-1440.png) | [图](directory-zh-390.png) | [Image](directory-en-1440.png) | [Image](directory-en-390.png) |

复现：`npm run build`，再执行`node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4184 --strictPort`。`scripts/verify-book-recap.cjs`接受READER_BASE_URL及RECAP_AUDIT_DIR；Playwright使用宿主已有模块，经NODE_PATH提供。`scripts/create-recap-manifest.cjs`生成[source-manifest.json](source-manifest.json)，文本LF归一化、二进制原样计算SHA-256，排除清单自身。

归档日志仅规范化行尾空白和文件末尾空行，失败内容及测试结果均保留；未规范化的工具输出另存本地`.local/phase6-original-logs/`。
