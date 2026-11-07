# 第十二轮：环、单位、零因子与域 — 评审验收

## 版本与环境

- 基线：`0256d3f4914ead73a8dc4a75a15477b1cebb0a11`。
- 交付分支：`codex/phase12-rings-fields`。固定版本是包含本报告的提交；完整 HEAD 由交付消息和 GitHub 固定提交 URL 标识。
- 日期：2026-11-07，北京时间。Windows，Node 22.17.1，npm 11.7.0。
- 浏览器：Microsoft Edge 156.0.4314.58，Playwright；中文、英文 × 1440×1000 / 390×1000。
- 环境：Vite **生产构建预览**，`http://127.0.0.1:4192`。本轮未合并 main，未部署正式域名。
- PDF 原文件 SHA-256：`aa0b3762c2ea451803e325c695c0d90d3dd02b30d9cf5ab0818464f4bb1dbdae`。核对定义 8.3—8.7、8.10、习题 8.6 和相关书例，公式及零环脚注同时进行了原 PDF 视觉检查。

## 交付内容

1. `/book/8#section-8-4`：两种运算、乘法单位元素与单位、ℤ₆ / ℤ₅ 交互表、逆元与非零零乘积伙伴、零值的单独说明。
2. `/book/8#zero-divisor-not-unit`：习题 8.6 的六行章内参考推导。每行依据独立展开，最后一行公式为语言无关的 `b = 0 ∧ b ≠ 0`。
3. `/book/8#section-8-8`：ℤ、ℚ、ℚ[x] 的单位、域与欧几里得整环区别；从系数域连接带余除法。
4. `/polynomial-gcd`：新增“首项系数相除（伴读补充）”预设，保留既有双播放器及精确分数机制。英文零除式提示明确为 “the zero polynomial as the divisor”。
5. 节级搜索、显式正文分派、习题 8.6 双向链接及正确的应用来源锚点。应用可见正文及标签不含 PDF 页码。

[数学、来源身份、逐行依据、固定数值及存储约定](mathematics.md)

## 工程门禁

|检查|结果|记录|
|---|---|---|
|ESLint|通过|[lint](checks/lint.txt)|
|TypeScript app，--noEmit|通过，无诊断|[app](checks/types-app.txt)|
|TypeScript node，--noEmit|通过，无诊断|[node](checks/types-node.txt)|
|完整 Vitest|**59 文件，565 测试通过**|[完整输出](checks/vitest.txt)|
|定向测试|4 文件，55 测试通过|[输出](checks/focused-green.txt)|
|Vite 生产构建|通过|[构建输出](checks/build.txt)|
|浏览器脚本语法检查|node --check 通过|scripts/verify-rings-fields.cjs|
|补丁空白检查|git diff --check 通过|提交前执行|

纯环模块按先写独立测试、确认缺少模块失败、再实现的顺序完成；[RED 记录](checks/red.txt)、[4 项环测试通过](checks/ring-green.txt)。不将已存在的测试或本轮后补的 UI 检查追称为 TDD。

两张加法表与两张乘法表、所有逆元、非零伙伴和分类使用独立字面量期望。另遍历 61 对、341 个三元组检查两个固定交换环的代数规律。这些循环核对不重复计入 565 项 Vitest 数量。

## 新增生产预览专项

`scripts/verify-rings-fields.cjs` **4/4 环境通过**，浏览器运行异常为 0。[原始导航、历史 key、选择及公式记录](browser/navigation.json)

每组实际完成：

- 带 source、tag 参数的目录逐字搜索“零因子” / “zero divisor”，断言实际输入及当前语言，进入 8.4。
- ℤ₆ 默认 2 的行与见证、ℤ₅ 默认 2 的逆元；先保存 ℤ₆=5，再以键盘将 ℤ₅ 选为 0。检查焦点和局部滚动、页面宽度。
- 六行依据保留完整公式顺序，第 2、6 行展开，其余收起。最后一行的可见依据与完整可访问名称随语言立即切换，状态保持。
- 经正文进入 8.8，地址仍在旧节锚点时手动展开应用卡，解码 from 为完整查询串加 `#polynomial-leading-division`；readerSource 使用实际来源历史 key。
- 浏览器实际拖动 / 前进到 T=1/2、Q=1/2/R=0、raw=2x、monic=x 四个关键状态，同时读取当前函数、代码高亮与计数。首一化后回看恢复最近返回 2x；原始返回保持 2x。
- 语言切换后回看与继续；终点重播；播放中重新应用预设后两个播放器均暂停并回到 0；等待 1200ms 不前进；重置与零多项式除式提示。
- 显式来源返回的首个完成渲染快照及 400ms 后快照、浏览器后退/前进、演示硬刷新后按来源卡锚点返回。两模型独立选择和六个依据状态均恢复。
- 习题 8.6 → 章内推导 → 展开依据 → 返回习题 → 浏览器后退/前进。保留完整查询串；不同历史 key 恢复各自实际阅读位置。
- 两个嵌套依据锚点（zero-unit-inverse、zero-unit-contradiction）的直达与刷新，共 **16 条直达/刷新记录**；展开必要父证明及目标依据。
- 返回目录清空搜索，仅删除 q；source、tag 保持。

### 坐标验收（CSS px）

容差始终为 2px，以下观测差值均为 0。初始返回采样在路由完成及两帧渲染后执行，随后再等 400ms。

|语言 / 宽度|离开 / 返回初始 / 稳定|硬刷新返回 / 来源锚点|证明实际点击离开 / 后退|
|---|---|---|---|
|zh / 1440|4000 / 4000 / 4000|4379 / 4379|2400 / 2400|
|en / 1440|4200 / 4200 / 4200|4647 / 4647|2572 / 2572|
|zh / 390|4620 / 4620 / 4620|5167 / 5167|3404 / 3404|
|en / 390|6675 / 6675 / 6675|6619 / 6619|4424 / 4424|

### 零值、存储与双语

组件测试额外覆盖空存储、非法保存值、读取/保存异常、重新挂载的同步恢复。三个选择字段之外不持久化派生结果。六行公式及其两种语言依据逐项配对，最后一行可访问名称完整断言。当前模型 ℤ₅=0、另一模型 ℤ₆=5 的状态在演示往返与硬刷新返回后仍分别保留。

### 失败与复测过程

- 首次纯模块 RED：模块尚不存在，符合预期；实现后 4 项测试通过。
- 首次组件定向测试：两条测试用“逆元 / inverse”检索，而正文采用“可逆 / invertible”。修正测试用语以对应实际语义；未改动数学内容，55 项定向测试随后通过。[原输出](checks/focused.txt)
- 沙箱内 Edge 启动遇到 Windows 管道/进程权限错误，未执行页面检查。改用获准的本机 Edge 启动后完成全部专项。[环境失败](prior-failures/browser-sandbox.txt)
- 原可访问名称严格字符串漏计浏览器在隐藏文本边界插入的空白；改为完整匹配并仅允许冒号前空白。[首次记录](prior-failures/browser-name-failure.json)
- 初次返回快照在恢复的动画帧之前读取到 0；加入路由与两帧完成等待，并继续保留 400ms 二次采样。[首次记录](prior-failures/browser-timing-failure.json)
- 390px 中文习题路径中，点击前预采样为 2884；点击操作将链接滚入可见区，**实际 click 事件位置为 3404，后退也恢复 3404**。新增点击事件原始采样，以实际离开位置为准；未放宽 2px 容差、未修改滚动恢复代码。[首次记录](prior-failures/browser-history-failure.json)
- 最终专项 **4/4 全通过**，[结果](checks/rings-browser.txt)。上述试验与环境失败均保留，不计为最终通过项。

## 既有回归

全部针对同一本轮生产构建，每项中文、英文 × 1440 / 390，共 **16 组既有环境运行**。与新增 4 组分开统计，不将内部断言数量当作测试用例数量。

|专项|结果|原始记录|
|---|---|---|
|第十一轮排列与循环搬移|4/4，通过八次传送、重复值、暂停/刷新恢复及来源返回|[cycles](regressions/cycles.json) / [运行结果](checks/cycles.txt)|
|第十轮同构阅读|4/4，通过映射、依据状态、8 次幂结果与来源返回|[isomorphism](regressions/isomorphism.json) / [运行结果](checks/isomorphism.txt)|
|逐字搜索滚动|4/4|[scroll](regressions/scroll.json) / [运行结果](checks/scroll.txt)|
|章节历史|4/4，独立历史 key、实际离开位置恢复|[history](regressions/history.json) / [运行结果](checks/history.txt)|

## 截图

新增专项保留 **44 张**截图：每个环境 11 张。搜索、模型、字段比较及返回采用普通视口；完整六行证明和四个多项式状态采用局部完整截图，便于同时核对公式、变量和代码。

|画面|中文桌面|英文桌面|中文手机|英文手机|
|---|---|---|---|---|
|ℤ₆ 的 2|[图](browser/z6-two-zh-1440.png)|[图](browser/z6-two-en-1440.png)|[图](browser/z6-two-zh-390.png)|[图](browser/z6-two-en-390.png)|
|ℤ₅ 的 2|[图](browser/z5-two-zh-1440.png)|[图](browser/z5-two-en-1440.png)|[图](browser/z5-two-zh-390.png)|[图](browser/z5-two-en-390.png)|
|部分依据展开，最后一行展开|[图](browser/six-step-proof-zh-1440.png)|[图](browser/six-step-proof-en-1440.png)|[图](browser/six-step-proof-zh-390.png)|[图](browser/six-step-proof-en-390.png)|
|返回后保存的 0|[图](browser/restored-zero-zh-1440.png)|[图](browser/restored-zero-en-1440.png)|[图](browser/restored-zero-zh-390.png)|[图](browser/restored-zero-en-390.png)|
|原始返回 2x|[图](browser/raw-return-zh-1440.png)|[图](browser/raw-return-en-1440.png)|[图](browser/raw-return-zh-390.png)|[图](browser/raw-return-en-390.png)|
|首一化返回 x|[图](browser/monic-return-zh-1440.png)|[图](browser/monic-return-en-1440.png)|[图](browser/monic-return-zh-390.png)|[图](browser/monic-return-en-390.png)|

其余搜索、域对照、商项、消元和来源卡截图见 [browser](browser)。

## 清单与后续

- 本版结束范围固定为“第十二轮交付 + 一次集中收尾”。[集中收尾清单](closeout-checklist.md)列明 Issue #1、双语 README 与全书覆盖说明、购书配置、最终整站回归及发布的当前状态和完成条件。新章节专题统一转为后续候选；集中收尾通过后交付最终覆盖清单和发布验收报告，转入维护。
- [source-manifest.json](source-manifest.json)：本次提交改动文件的 SHA-256，使用 Git 暂存 blob 字节计算，避免 Windows CRLF 影响；清单自身不自引用。检出固定提交后可用 `git show HEAD:<path>` 的字节核对。
- [build-manifest.json](build-manifest.json)：本次生产构建 dist 文件 SHA-256；完整构建保留在本机 dist。
- 修改范围：固定环模块/测试、Chapter8 与证明数据、正文登记/关键词/导读、习题链接、多项式预设与措辞、定向测试与验收脚本/证据；未改公共播放器或滚动恢复实现。
- [Issue #1](https://github.com/transbot/fm2gp-Chinese/issues/1)（稀疏数组校验）继续作为低优先级待安排事项，本轮未修复。
- 本轮已完成评审分支范围；main 合并与正式域名验收等待评审通过后安排。
