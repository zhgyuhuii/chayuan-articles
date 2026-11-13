---
title: "一体化安装脚本安装：三平台安装包"
description: "一体化安装脚本指南：察元AI文档助手按平台架构的安装步骤、验证方法与排错。"
keywords: ["一体化安装脚本", "察元AI文档助手", "下载安装", "一键安装", "脚本"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "一体化安装脚本"
channel: "CSDN/知乎/博客"
---

# 一体化安装脚本安装：三平台安装包

「Windows / macOS / 麒麟上怎么安装察元 AI 文档助手」——这个问题最近被问了好几次。答案不复杂：一体化安装脚本在察元AI文档助手里是现成能力，这篇把入口、步骤、验证一次写全，按钮文案原样引用。

## 跑脚本前机器要满足的条件

- 系统要求：WPS Office 已安装
- 安装包：chayuan-6.1.2-windows-x64.exe（自解压）
- 说明：一条命令装齐加载项与服务。

安装包只在官方渠道发布，其他地方流出的包先别急着点开。

## Windows 上装加载项的四步

1. 从官方渠道下载 exe
2. 双击安装（加载项进 WPS jsaddons 目录，本机服务自注册并带看门狗）
3. 完全退出 WPS 再重启
4. 文字端看到察元AI助理与察元AI编审两个选项卡，即成功

## Linux 与 macOS 各自的装法

Linux：sudo dpkg -i 安装 deb；加载项进入 ~/.local/share/Kingsoft/wps/jsaddons；选项卡没出现时执行 quickstartoffice restart。

macOS：从官方渠道取对应架构的 pkg；完全退出 WPS 后安装（运行中安装会被旧注册覆写）；若提示容器写入失败，用官方 repair-mac-jsaddons-container.sh 脚本修复。

## 批注能出，加载项才算装活

装完先拿一篇旧文档试校对：能出批注说明模型通了；再进察元AI编审选项卡看规则管理加载是否正常，两端都在，加载项就算装实了。

## 选项卡就是最直接的信号

- 选项卡两个都在，脚本这一轮就算跑通了
- 没看到选项卡，先把宿主软件彻底关干净再启动一次

## 装机路上的几道坎

- 脱密功能走的是占位替换、可逆还原的路子，但别指望忘密找回：密码一旦丢了，系统里没有任何免密恢复通道
- macOS 安装器无完全磁盘访问权限会假成功
- Win7 与 Win8 装得了加载项，但 MCP 二进制跑不了，需 Node 16 回落

四道坎的暴露时机不一样：前一道藏在安全设计里，装的时候感觉不到；macOS 假成功要等选项卡迟迟不出现才浮出水面；Win7/8 的回落则发生在服务启动环节，得看 sidecar-start.log 才知道实际走了哪条路。排查时先定平台、再对号入座，比上来就重装一遍快得多。

## 两个装机高频疑问

### Win7/Win8 上本机服务起不来，能补救吗？

加载项本体可以正常装；起不来的是本机文档服务用的预编译二进制，Win7/8 跑不了它，需要先装 Node.js 16.x x64（14.18+ 亦可；Win7 需 SP1）。安装器释放的 start-mcp.cmd 会先试二进制，探活失败就自动回落 node server.mjs 运行；排查日志在 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\sidecar-start.log。

### 专业版 WPS 明明装了 deb，选项卡为什么迟迟不来？

专业版 WPS 实际从 office6/jsaddons 加载。先确认 deb 已装入（安装日志会打印 also copied to /opt/...），重启 WPS 后执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart；仍不行就手动查上面表格里专业版路径下有没有 chayuan_<版本> 目录。

## 便携包：一条命令装齐三样

wps-skill-chayuan 便携包（release/ 下 wps-skill-chayuan-6.1.2-portable.zip / .7z）解压后按系统跑一条命令：

1. macOS / Linux：bash scripts/install-wps-skill-chayuan.sh
2. Windows：powershell -ExecutionPolicy Bypass -File scripts\install-wps-skill-chayuan.ps1

脚本内部会把几件事按依赖铺开：加载项先进 jsaddons，MCP 服务的开机自启跟着注册，随后向已装的 Claude Code、Cursor、Codex 投放技能文件，收尾跑一遍四级自检，哪一环没过都会当场报出来。有些机器只想要加载项、不打算配智能体，加 --no-agent（Windows 写作 -NoAgent）即可跳过投放环节，其余动作照常执行。

## 三个位置把安装证据对一遍

1. 完全退出并重启 WPS，打开 WPS 文字，功能区应出现「察元AI助理」「察元AI编审」两个选项卡。
2. 文件层面：用 Windows 资源管理器打开 %AppData%\Kingsoft\wps\jsaddons，应能看到 chayuan_6.1.2、chayuan-et_6.1.2、chayuan-wpp_6.1.2 目录与 publish.xml；macOS / Linux 打开上表对应路径同理。
3. Windows 还可查看安装日志 %TEMP%\chayuan-wps-install.log，末尾应为 install ok。

三处证据相互独立，交叉对着看，比单看选项卡更稳妥。

## 跑脚本之前确认两条

- 本机已安装 WPS Office（文字 / 表格 / 演示任意一端都行）。
- 本篇按 v6.1.2 的发布产物来写；要升级时拿新版安装包覆盖安装就行。

确认完这两条，剩下要拿主意的只有一件事：智能体技能要不要一并投放。上机前想清楚，跑起来就不用中途改参数。

## 这套一体化方案实际交付的三样

- 一条命令同时装齐加载项与 MCP 文档服务
- macOS 容器写入失败可用修复脚本兜底
- 企业内网能用 HTTPS 静态部署做集中更新

## 脚本跑完，机器上多了什么

加载项进入 jsaddons 只是一半：MCP 文档智能体服务会在本机 62588 端口开放，自动发现本机察元AI OS 知识库（固定端口 52582），回答带编号引用与文件来源。知识库绑定走输入区书本按钮（topK 默认 5、RRF 融合、混合检索默认开、重排默认关），这些默认值装完即可用，不必再逐项设置。

## 涉密环境的两条口径

优先支持离线内网模型是这套加载项的立场：涉密文档不出网也能用 AI，支持 Ollama 等离线模型，配模型时有一键安装引导。另一条要同时记住：AI 拿到的是整篇文档而不是你选中的片段，涉密稿子先切到本机离线模型再让它动手；凭据走 AES-GCM 设备绑定加密。

## 助手配置与写回

自定义助手的名字、提示词、输入源（选区或全文）、写回方式、温度全部可配，把重复劳动固化成自己的助手，一次配置长期复用；配置好的助手可导出文件分享给同事导入，团队口径统一。生成结果按助手定义的写回方式落进文档，助手目录里还能搜索、收藏常用、按领域浏览。

一体化安装的核心价值就一句：三样东西按依赖顺序一次装齐，自检不过会当场暴露。装完先验证、再动文档，顺序别反。

---

便携包文件名、脚本参数与自检流程对应 6.1.2 版，整理时以官方文档核对，数据截至 2026 年 10 月；后续版本若调整脚本行为，以官方发布说明为准。
