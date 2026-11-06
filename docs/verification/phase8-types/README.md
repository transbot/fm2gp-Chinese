# 第八轮评审记录：值、概念与 C++ 源码速查

基线为 `bdc1749f2e083393f1af013f83c000cda401d1df`；验收对象为包含本报告的 `codex/phase8-types-concepts-reference` 提交。环境为本地生产构建预览。正式站点的发布和验收留到评审通过之后。

## 读者入口与固定用例

| 落点 | 核实内容 |
|---|---|
| /book/10#section-10-2 | 一串 01000001，解释选择使用原生单选按钮。8 位无符号整数为 65；最高位补零的 ASCII 字符为大写 A。展开定义 10.1–10.5，对照数据、值、值类型、对象、对象类型。语言切换保持当前选择。 |
| /book/10#section-10-3 | 栈中 k 个已有元素每次都搬移，入栈代价随 k 线性增长。前向与随机访问模型都从 0 到 end 位置 3，实际代价分别为三次后继与一次跳转。两种模型在 end 读取均显示错误。 |
| /book/C#section-C-1 | A 由实参 r 和 a 共同推导，返回类型使用该 A；N 来自 n，Op 来自运算对象。源码链接选中四参数重载。 |
| /book/C#section-C-2 | 概念名宏与 requires 并列对照。代数页原例 (5,3,1) 得到 1、3；章内与附录共用的伴读例 (5,3,3) 得到 −1、5。源码表达式检查可通过，但 regrouping 需要结合律。 |
| /book/C#section-C-4 | op(r,a) 累积，op(a,a) 自合并。真实字符串调用按整行比较，输出为 `Result: bbb`。 |
| /book/C#section-C-5 | r=2、a=3、n=5，乘法累积／纯幂 486／243，加法 17／15；n=0 累积都返回 2，纯幂返回 1 或 0。书例 my_ratio 说明断言及其启用条件。 |

[四张源码卡的文件与行号、编译断言及固定结果](source-lines.md) · [MSVC C++20 原程序实际输出](cpp.txt)。Book 现在单独按节号选择正文组件；章节搜索仍按节索引术语。迭代器、纯幂、代数实验室继续使用各自的现有演示。

## 工程检查

Windows，Node 22.17.1，npm 11.7.0，Vite 8.0.16，Vitest 4.1.8。ESLint、两套 TypeScript 检查、全量 50 个文件的 495 项 Vitest、生产构建全部通过。[ESLint](lint.txt) · [TS app](typescript-app.txt) · [TS node](typescript-node.txt) · [全部测试](tests.txt) · [生产构建](build.txt)。

实现前两个针对性测试因位串与反例链接尚不存在而失败；接入后通过。[RED](red.txt) · [GREEN](green.txt)。首次 app 类型检查报告分派表类型仅允许返回非空元素，改用带节号参数的 React ComponentType 后复测通过。[首次诊断](typescript-first.txt)。早期第七轮浏览器检查与一次重新构建重叠，导航请求失败；保存了[当时日志](proofs-first.txt)和[部分记录](proofs-first.json)。最终重跑使用构建完成后保持稳定的预览。

## 生产预览与导航

Edge 156.0.4314.58，无头独立浏览器上下文，zh-CN / en-US、1440 / 390 像素、视口高度 1000。390 为窄屏模拟。实际预览入口 http://127.0.0.1:4187 ，核对 HTML 与最终 dist/index.html 相同。新增脚本用 READER_BASE_URL、TYPES_AUDIT_DIR 指定服务和输出位置；同一构建运行既有脚本。

1. 从 /concepts/iterators 点击“建议先学”，到 /book/10#section-10-3 看到概念正文，再从移动代价卡回到迭代器演示。两个模型分别执行 advance(3)，读取位置 3 都触发尾后提示。
2. 带 source=proof-reader 和 tag=two+words 进入目录，用当前语言逐字搜索“复杂度”或“complexity”。从 10.3 跟随正文到 C.2，用键盘展开两层卡片，切换语言再切回。手动展开后地址仍为 #section-C-2，卡内链接解码后的 from 明确使用同一组查询参数及 #cpp-subtraction。离开前刻意滚离条目锚点，在代数页验证两组减法数据；检查显式返回、浏览器后退和前进，再在演示硬刷新并清空展开存储后返回。最后回到目录，清空只移除 q。

| 环境 | 离开 → 返回后再等待 400 ms | 硬刷新返回 → 嵌套条目锚点 |
|---|---:|---:|
| 中文 1440 | 1130 → 1130 | 962 → 962 |
| 英文 1440 | 1335 → 1335 | 1082 → 1082 |
| 中文 390 | 1790 → 1790 | 1368 → 1368 |
| 英文 390 | 2389 → 2389 | 1828 → 1828 |

[第八轮导航原始记录](browser/navigation.json)含完整来源、历史键、展开的父卡和子卡、滚动采样、迭代器操作、纯幂结果与深链列表。4 个环境、8 次迭代器移动、16 次纯幂核对、64 对直达与刷新（含 C.7）；检查视口宽度与条目文案、无障碍属性的无页码要求。[专项日志](browser.txt)。

| 既有回归 | 记录 |
|---|---|
| 第六轮第 14 章的 11 个演示 × 4 个环境，共 44 次往返 | [recap](recap/browser-audit.json) |
| 第七轮目录流程 4 次，24 个结果或返回链接 | [directory](directory/navigation.json) |
| 搜索滚动 410 条状态观测 | [scroll](scroll/browser-audit.json) |
| 章节历史 96 条状态观测 | [history](history/browser-audit.json) |
| 第 9 章及附录 A/B 内容回归，240 对直达与刷新、8 次演示往返 | [proofs](proofs/navigation.json) |

## 视口截图

位串两种解释分别截图，代码长行局部滚动。各截图核对界面语言，搜索截图还检查输入框和查询参数。

| 环境 | 位串整数 / ASCII | C.2 与减法反例 | 累积与纯幂 | 目录搜索 |
|---|---|---|---|---|
| 中文桌面 | [整数](browser/integer-zh-1440.png) / [字符](browser/ascii-zh-1440.png) | [反例](browser/counterexample-zh-1440.png) | [对照](browser/powers-zh-1440.png) | [复杂度](browser/search-zh-1440.png) |
| 英文桌面 | [integer](browser/integer-en-1440.png) / [ASCII](browser/ascii-en-1440.png) | [example](browser/counterexample-en-1440.png) | [powers](browser/powers-en-1440.png) | [complexity](browser/search-en-1440.png) |
| 中文手机宽度 | [整数](browser/integer-zh-390.png) / [字符](browser/ascii-zh-390.png) | [反例](browser/counterexample-zh-390.png) | [对照](browser/powers-zh-390.png) | [复杂度](browser/search-zh-390.png) |
| 英文手机宽度 | [integer](browser/integer-en-390.png) / [ASCII](browser/ascii-en-390.png) | [example](browser/counterexample-en-390.png) | [powers](browser/powers-en-390.png) | [complexity](browser/search-en-390.png) |

[变更文件 SHA-256 清单](source-manifest.json)覆盖相对基线新增及修改的 Git blob 字节，排除清单自身。
