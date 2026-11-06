# 第七轮目录查询串修复：生产预览验收

修复基线：`37af23faa3c394fd6ed20ac2aa81d83d81bef6fa`。本报告对应包含本文件的固定修复提交。上一轮内容及数学核对保持不变：[逐行核对表](../phase7-proofs/math-check.md)。本目录是修复后的新证据，旧报告及首次失败记录保留。

## 修复与回归

Book.tsx 的目录章标题、节结果、习题结果、返回目录链接，现在用 React Router 的 pathname、search、hash 组成目标，完整传递 location.search；普通演示的 from 同样包含完整查询串。搜索框仍复制现有 URLSearchParams，只修改或删除 q。

新增 BrowserRouter 回归在修复前四项全部失败：结果链接只有 q，丢失 source 与 tag（[RED](red.txt)）。修复后四项通过（[GREEN](green.txt)）。包含中英文完整阅读顺序和三种结果的路径、查询、锚点断言；普通习题演示链接也核对完整 from。

## 工程门禁

Windows、Node 22.17.1、npm 11.7.0、Vitest 4.1.8、Vite 8.0.16。针对最终产品代码执行：

| 命令 | 结果 |
|---|---|
| npm run lint | [通过](eslint.txt) |
| npx tsc --noEmit -p tsconfig.app.json | [通过](typescript-app.txt) |
| npx tsc --noEmit -p tsconfig.node.json | [通过](typescript-node.txt) |
| npm run test:run | [49 文件，492 项通过](tests.txt) |
| npm run build | [通过](build.txt) |

npm 更新和 Browserslist 数据陈旧提示保留在日志中，没有更换依赖。

## 真实浏览器与阅读位置

Edge 156.0.4314.58，Playwright 独立无头上下文；生产构建预览 http://127.0.0.1:4187。四组环境：zh-CN / en-US × 1440 / 390，视口高度1000。390为窄视口模拟。

新增脚本 verify-book-query.cjs 从 `/book?source=proof-reader&tag=two+words` 开始，逐字输入归纳或 induction，每步等待 URL 与渲染并检查焦点及输入框坐标。点击9.7，展开结合律与一条依据，进入 power，返回来源，返回目录并清空。各阶段检查 source、tag、q；清空后只移除 q。另核对章、节、习题三类结果及普通习题演示来源。

四组完整流程通过，24个结果或目录返回链接目标通过。会话返回的两个采样点（立即稳定及再等待400ms）都等于离开坐标。另单独执行演示硬刷新、清除展开存储后的返回，展开父级后定位到主题。

| 环境 | 离开 → 稳定返回 | 硬刷新返回＝展开后的主题锚点 |
|---|---:|---:|
| 中文1440 | 2867 → 2867 | 2123 |
| 英文1440 | 3075 → 3075 | 2247 |
| 中文390 | 3587 → 3587 | 2619 |
| 英文390 | 4599 → 4599 | 3391 |

[目录全过程、URL、history key、展开状态和坐标原始记录](directory/navigation.json)。现有第七轮专项另记录同一个条目URL的8次偏离锚点往返，及硬刷新后条目定位：[条目级记录](reference/navigation.json)。

| 既有专项 | 最终结果 |
|---|---|
| 第七轮证明与附录 | 240对直达/刷新、8次演示往返、20次跨章互引、24次精确查询：[记录](reference/navigation.json) |
| 第六轮主题 | 44次演示往返，含历史和硬刷新返回：[记录](recap/browser-audit.json) |
| 搜索滚动 | 四组共410条观测：[记录](scroll/browser-audit.json) |
| 章节历史 | 四组共96条观测：[记录](history/browser-audit.json) |

所有最终浏览器记录均无pageerror。搜索截图前核对html语言、输入内容和URL；本轮图中中文为“归纳”，英文为“induction”。

| 视口 | 目录搜索 | 已展开的证明依据 |
|---|---|---|
| 中文1440 | [搜索](directory/directory-zh-1440.png) | [证明](directory/proof-zh-1440.png) |
| 英文1440 | [搜索](directory/directory-en-1440.png) | [证明](directory/proof-en-1440.png) |
| 中文390 | [搜索](directory/directory-zh-390.png) | [证明](directory/proof-zh-390.png) |
| 英文390 | [搜索](directory/directory-en-390.png) | [证明](directory/proof-en-390.png) |

本目录下 reference 子目录还有更新后的证明、A.3 真值表与搜索截图。复现时对脚本设 READER_BASE_URL，分别用 QUERY_AUDIT_DIR、PROOF_AUDIT_DIR、RECAP_AUDIT_DIR、SCROLL_AUDIT_DIR、HISTORY_AUDIT_DIR 指定输出目录。

[文件清单](source-manifest.json)按Git blob字节计算SHA-256，覆盖根配置、src、scripts、public、两份第七轮验收目录及受版本控制的dist/index.html，排除清单自身。运行 `node scripts/create-query-manifest.cjs HEAD` 可核对。旧phase7-proofs清单仍对应旧评审提交，应以本目录清单核对修复提交。

合并后的正式域名证据另归档 `.local/phase7-release`，以最终 main HEAD、Netlify published_deploy 和正式站点实测为准，不将此预览报告当作线上结果。
