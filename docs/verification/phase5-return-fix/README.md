# 第五轮：首一化最近返回值修复验收

- 修复基线：`4461e0b4677bda188ef41f28b669e7cd3ab401e1`。
- 分支：`codex/phase5-polynomial-gcd`。固定审查版本为包含本报告的单笔修复提交；完整HEAD在交付消息及后续发布报告中提供。
- 验收日期：2026-11-06，Asia/Shanghai。

## 修复及固定预期

在 `src/lib/algorithms/polynomialGcd.ts` 计算 monic 结果后、emit 最终快照前，执行 `s.returned=normalize(s.result)`。normalize复制数组及每个分数对象。rawGcd继续保存书中gcd的原始返回值；returned现在表示最近完成的函数返回值。没有改变数学结果、迭代次数、消元次数、步骤数量或UI布局。

| 案例 | gcdReturn 的 returned | monic 的 returned / result | 两步共同 rawGcd | 两步计数（GCD / 消元） |
| --- | --- | --- | --- | --- |
| 默认书例 | 6 | 1 | 6 | 2 / 5 |
| 习题8.3（1） | −4x²+24x−35 | x²−6x+35/4 | −4x²+24x−35 | 3 / 5 |
| 习题8.3（2） | (605/1521)(x+1)² | x²+2x+1 | (605/1521)(x+1)² | 3 / 5 |
| 非零常数4、6 | 6 | 1 | 6 | 1 / 1 |
| 两个零多项式 | 0 | 0 | 0 | 0 / 0 |

两个返回事件均不增加计数。gcdReturn当前函数为gcd，高亮return；monic当前函数为monic，高亮normalize（非零）或zero（两个零）。返回值与首一结果独立，后续修改不会污染前一步原始返回快照。

## RED → GREEN 与工程门禁

先增加5组纯轨迹固定断言和5组实际组件回看断言。旧实现有8项失败：默认、两个习题和常数在纯函数及界面各失败一次；零结果原本相同。[RED日志](red.txt)保留实际不匹配证据。增加一行修复后，42项相关测试通过：[GREEN](green.txt)。预期值直接采用表中固定值，不从被测最终快照推导。

| 门禁 | 结果 |
| --- | --- |
| ESLint | PASS，[日志](eslint.txt) |
| TypeScript app / node | PASS，[app](typescript-app.txt)、[node](typescript-node.txt) |
| 完整Vitest | 44文件、457项PASS，[日志](all-tests.txt) |
| 生产构建 | PASS，[日志](build.txt) |
| 相邻返回浏览器专项 | 中英文×1440/390共4组，200条固定状态PASS，页面异常0，[日志](browser-run.txt)、[原始记录](browser-audit.json) |
| 完整多项式浏览器专项 | 4组、932条状态PASS，[日志](polynomial-run.txt)、[原始记录](../phase5-polynomial/browser-audit.json) |

环境：Windows、Node22.17.1、npm11.7.0、Vitest4.1.8、Vite8.0.16、Edge156.0.4314.58无头浏览器。生产预览地址 `http://127.0.0.1:4183`。专项视口1440×1100及390×1100；完整专项1440×1000及390×1000。每个组合使用独立浏览器上下文。本记录不是正式域名验收，发布后的结果另存 `.local/phase5-release/README.md`，以保持发布提交固定。

专项脚本 `scripts/verify-polynomial-return.cjs` 不导入轨迹生成器，直接使用固定步数、表达式、计数、函数名及代码行。逐项读取界面“最近返回值”“原始GCD返回值”“首一GCD”，验证前进、回看、拖动、从终点重播及中英文切换后继续播放。回看恢复原始返回值，首一化结果不提前出现在gcdReturn中。完整专项另覆盖双播放器独立运行、播放中应用输入、零除式与GCD边界、两道习题、章节入口、来源返回、搜索、刷新、前进后退和无页码要求。

关键轨迹与受影响的完整页面截图已更新到 [phase5-polynomial](../phase5-polynomial/)。原始首次实现及8项失败记录保留，不将旧报告中的447项测试覆盖改写为457项。

## 最终状态截图

每个“播放器”截图包含当前函数、三个返回/结果字段和代码高亮；普通视口截图同时保留在同目录。

| 案例 | 中文桌面 | 中文手机 | English desktop | English mobile |
| --- | --- | --- | --- | --- |
| 默认书例首一化 | [图](final-book-zh-1440.png) | [图](final-book-zh-390.png) | [Image](final-book-en-1440.png) | [Image](final-book-en-390.png) |
| 习题8.3（1）首一化 | [图](final-exercise1-zh-1440.png) | [图](final-exercise1-zh-390.png) | [Image](final-exercise1-en-1440.png) | [Image](final-exercise1-en-390.png) |

文件清单：[source-manifest.json](../phase5-polynomial/source-manifest.json)，包括本修复源码、脚本、构建入口和两组验收证据；文本LF归一化、二进制原样SHA-256，清单排除自身。既有npm升级和Browserslist更新提醒不影响验收，未升级依赖。
## 发布资源校验脚本预检

新增可复用的 `scripts/verify-production-assets.cjs`，通过浏览器实际加载首页、第8章、多项式、霍纳、整数除法和反转资源，逐个比较本地构建SHA-256。首次运行在重复导航的HTTP缓存响应上无法取得响应体，保留[失败日志](preview-assets-first-failure.txt)及[原始记录](preview-assets/first-failure.json)。改为浏览器请求拦截直通以禁用HTTP缓存，重跑6个HTML入口和17个资源均一致：[日志](preview-assets-run.txt)、[记录](preview-assets/asset-parity.json)。没有跳过不在本地构建中的资源；线上验收将使用同一脚本。预检记录中的commit是修复前HEAD，测试对象为该基线上的待提交工作树，以本提交清单为准。
