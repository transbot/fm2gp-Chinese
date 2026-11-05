# 第四轮辅助函数返回状态修复验收

日期：2026-11-06（Asia/Shanghai）。基线 `cdc965fac9b669ff6c45b0f44a8224a8fab6cf81`；分支 `codex/phase4-reverse-adaptive`。本报告随单笔修复提交发布，固定提交链接及完整HEAD见交付消息。

## 问题复现与最小修复

在基线生产构建预览 `http://127.0.0.1:4181`，使用独立浏览器上下文复现了中英文 ×1440/390：

- 两元素／容量2，第19/21步错误显示 `reverse_n_with_buffer: f=0,l=0,result=2`。
- 九元素／容量4，第31/80步错误显示 `f=0,l=0,result=4`；第59/80步父帧为 `f=5,n=4`，却显示 `f=0,l=0,result=9`。
- 九元素／容量9，第40/42步同样继承了reverse_copy的局部变量。

[复现记录](reproduction.json)、[运行结果](reproduction.txt)和四张before视口截图保留旧实现证据。

修改 `src/lib/algorithms/reverseTrace.ts`：切回 `reverse_n_with_buffer` 后、生成返回快照前，将 `helper` 恢复为 `{buffer_end:n}`。沿用既有结构，不额外展示参数。`reverse_copy` 的最终局部状态仍保存在它自己的返回快照中。未改变UI组件、步骤数量、算法执行顺序、结果或计数。

## 独立作用域断言

新增4组测试使用源码作用域和以下固定数值，未从被测helper字段生成预期值：

| 输入／容量 | 中间返回步骤 | 起点／长度 | reverse_copy局部变量 | reverse_n_with_buffer局部变量 | 原序列返回位置 |
| --- | --- | --- | --- | --- | --- |
| 0,1／2 | 19/21 | 0／2 | f=0,l=0,result=2 | buffer_end=2 | 2 |
| 九元素／4，左半 | 31/80 | 0／4 | f=0,l=0,result=4 | buffer_end=4 | 4 |
| 九元素／4，右半 | 59/80 | 5／4 | f=0,l=0,result=9 | buffer_end=4 | 9 |
| 九元素／9，整段 | 40/42 | 0／9 | f=0,l=0,result=9 | buffer_end=9 | 9 |

每例检查三个连续阶段：`reverse_copy / return / writeReturn` → `reverse_n_with_buffer / write / writeReturn` → `adaptive / fits / return`。第三阶段helper为null，反转调用帧保留自己的f和n。三个阶段的返回空间均为sequence，返回位置如表所列；所有计数与前一步相等，即返回事件计数增量为0。

RED：旧代码下新增4组全部失败（其余31项通过），见[red.txt](red.txt)。实现恢复上下文后，全量 **42文件、415项通过**，见[vitest.txt](vitest.txt)。

## 工程与浏览器验收

环境：Windows，Node22.17.1、npm11.7.0、Vite8.0.16、Vitest4.1.8；Edge156.0.4314.58无头Playwright。生产构建预览4181；四个环境为zh-CN/en-US ×1440×1000/390×1000。手机为模拟视口。

| 门禁 | 结果 | 证据 |
| --- | --- | --- |
| ESLint | PASS | [eslint.txt](eslint.txt) |
| TypeScript应用、测试及Vite配置 | PASS | [typescript.txt](typescript.txt) |
| 全量测试 | 415项PASS | [vitest.txt](vitest.txt) |
| 生产构建 | PASS | [build.txt](build.txt) |
| 返回作用域专项 | 四环境PASS | [browser-run.txt](browser-run.txt)、[原始记录](browser-audit.json) |
| 完整第四轮反转专项 | 四环境PASS | [运行日志](full-reverse-run.txt)、[完整记录](../phase4-reverse/browser-audit.json) |

`verify-reverse-return.cjs` 使用固定步号、计数、作用域和返回值独立验证真实界面。覆盖三个返回阶段的前进、回看、进度拖动、末尾重播后定位、语言切换后回看与继续播放；比较函数名、局部变量、帧、代码高亮、计数与原序列返回位置。四环境共记录176个返回状态；零页面错误。截图前断言实际语言、无全页横向溢出。

完整反转专项重新核对逐步状态、缓冲区、原始标签、输入重置、容量选择、独立播放、双语、键盘及章节来源返回，并刷新[关键轨迹](../phase4-reverse/key-traces.json)。九元素固定计数与原报告一致。

## 右半区第59/80步普通视口截图

| 语言 | 1440桌面 | 390手机 |
| --- | --- | --- |
| 中文 | [修复前](before-right-return-zh-1440.png) / [修复后](after-right-return-zh-1440.png) | [修复前](before-right-return-zh-390.png) / [修复后](after-right-return-zh-390.png) |
| 英文 | [修复前](before-right-return-en-1440.png) / [修复后](after-right-return-en-1440.png) | [修复前](before-right-return-en-390.png) / [修复后](after-right-return-en-390.png) |

修复后视口可同时看到父帧f=5,n=4、辅助函数名reverse_n_with_buffer、buffer_end=4、原序列返回9(end)及对应return代码高亮。

文件清单见[统一source-manifest.json](../phase4-reverse/source-manifest.json)，已纳入本目录及新增脚本。文本按LF规范化计算SHA-256，二进制按原始字节，清单排除自身。

本次修复验收无未通过项。Browserslist/npm升级提示不影响检查，未修改依赖。main合并与正式域名验收在本提交固定后接续执行，发布证据另行记录，以免为了补写提交号而改变已验收发布版本。
