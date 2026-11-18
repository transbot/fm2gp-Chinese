# 验收附件归档 / Verification archive

为减少当前源码下载体积，历史验收截图（PNG）和构建压缩包（ZIP）已停止跟踪。它们不参与 `npm ci`、测试或生产构建。本地已有附件保留在原路径；新运行产生的同类附件由 `.gitignore` 排除。

完整旧证据固定保存在清理前提交 `256e659104d1c078ffa9b029aeb648f0760ac8e8`：

- [全部验收证据与截图](https://github.com/transbot/fm2gp-Chinese/tree/256e659104d1c078ffa9b029aeb648f0760ac8e8/docs/verification)
- [集中收尾构建包 dist.zip](https://github.com/transbot/fm2gp-Chinese/blob/256e659104d1c078ffa9b029aeb648f0760ac8e8/docs/verification/edition-closeout/build/dist.zip)
- [当时的完整仓库](https://github.com/transbot/fm2gp-Chinese/tree/256e659104d1c078ffa9b029aeb648f0760ac8e8)

报告中的附件链接已改为固定提交地址。保留的 JSON/TXT 记录及 SHA-256 清单描述各次验收的历史状态，不应改写为清理后的文件清单；如需核对旧附件或源码，应使用对应报告记录的原始提交。旧截图不代表当前线上验收结果。

Markdown 报告、数学与来源核对、JSON 清单和原始日志、`edition-closeout/harness/` 及 `scripts/` 中的验证脚本继续保留。部分汇总脚本会读取清单或调用 harness，因此不整体忽略本目录。

本次仅移出附件、交互草稿及已跟踪的构建产物，不改写 Git 历史。完整克隆仍会下载历史大文件；部署建议使用 `git clone --depth 1` 或当前分支源码 ZIP，详见[部署指南](../deployment.md)。

Historical verification PNGs and ZIPs are archived at the immutable commit linked above. Reports, mathematical/source notes, manifests, text logs and reusable verification scripts remain tracked. Existing local attachments are kept; future generated PNGs/ZIPs are ignored. Use a shallow clone or current source ZIP for a smaller source download. Full clones still contain historical blobs.
