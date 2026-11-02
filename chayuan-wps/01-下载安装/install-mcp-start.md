---
title: "MCP服务启动安装指南：全平台步骤与验证"
description: "MCP服务启动指南：察元AI文档助手按平台架构的安装步骤、验证方法与排错。"
keywords: ["MCP服务启动", "察元AI文档助手", "下载安装", "62588", "自启"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "MCP服务启动"
channel: "CSDN/知乎/博客"
---

# MCP服务启动安装指南：全平台步骤与验证

先说结论：MCP服务启动在察元AI文档助手里是完整可用的，从启动本机 MCP 服务的入口进去，按下面步骤操作即可。这篇文章覆盖概念、步骤、验证和常见问题四部分，读完能独立完成整个流程。

## 安装前确认

- 系统要求：WPS Office 已安装
- 安装包：chayuan-6.1.2-windows-x64.exe（自解压）
- 说明：三种启动方式。

Windows（x64/arm64）、macOS（arm64/x64）、Linux deb（x64/arm64，麒麟/UOS 支持飞腾/鲲鹏）。安装包从官网 aidooo.com 获取。

## 从打开到做完的每一步

1. 官网 aidooo.com 下载 exe
2. 双击安装：加载项进入 WPS jsaddons 目录，本机服务自注册并带看门狗
3. 完全退出并重启 WPS
4. 文字端出现察元AI助理与察元AI编审两个选项卡即成功

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | WPS Office 已安装 | chayuan-6.1.2-windows-x64.exe（自解压） |
| macOS | WPS Office 已安装；建议先完全退出 WPS | chayuan-6.1.2-macos-arm64.pkg / x64.pkg |
| Linux | WPS Office 已安装；麒麟/UOS | linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64） |

## 装完后的第一件事

打开一篇文档，点开察元AI助理选项卡跑一次拼写与语法检查，确认模型链路通畅；再到设置里过一遍写回动作默认值，按团队口径定好批注式还是替换式。

## 做完后的验证

- 重启 WPS 后文字端出现察元AI助理与察元AI编审两个选项卡
- 若没有生效，先完全退出宿主软件再重启一次

## 几个容易忽略的细节

用之前要认的账：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 接着回答几个常见问题

### 外部智能体连接报 401 / unauthorized？

普通文档工具走 /mcp，不需要 token；401 出现在 /agent/* 等内部通道（加载项专属）。外部智能体只需配置 http://127.0.0.1:62588/mcp；若你确实在调内部通道，token 在 dataDir 的 token 文件里，请求头带 X-Chayuan-Token。

### /healthz 返回正常，但助手面板仍显示未就绪？

服务活着、是 WPS 加载项没连上：确认 WPS 已打开且加载项已启用；若横幅显示「本机服务在运行，但应用安全层拦截了加载项的连接——请在设置中信任察元AI加载项（或确认安全弹窗）后重启应用」，按提示信任后重启应用（这条横幅没有一键启动按钮，拉起服务解决不了拦截）。

### 启动时报端口被占 / already running pid=…？

服务是单实例的，说明已经有一个 sidecar 在跑（可能来自自启或加载项自动拉起）。先用 /healthz 确认——健康就直接用，不必再起一个；确实是僵死进程就结束它再启动。改端口用环境变量 CHAYUAN_MCP_PORT，改了端口客户端连接地址也要跟着改。

## 补充答疑

### 想停掉服务怎么办？

前台方式启动的在终端按 Ctrl+C；找不到终端就结束 chayuan-mcp（二进制）或 node server.mjs 进程。设置页在端口冲突时也会提示：「请在运行 sidecar 的终端按 Ctrl+C 停止，或结束 chayuan-mcp / node server.mjs 进程。」设了自启的先卸载自启（autostart 脚本 /uninstall 或删对应 LaunchAgent/服务），否则看门狗会再拉起来。

### 另一台电脑能直接连我这台的 62588 吗？

不能。服务固定只监听 127.0.0.1（涉密不出域的设计）。跨机使用需在本机做代理/SSH 转发，见对应教程 的「远程机器」节。

## 更多操作细节

设为开机自启

1. 安装包用户：安装器已自动注册 OS 级自启，无需操作——Windows 写注册表 HKCU\...\Run\ChayuanWpsMcp 并释放二进制到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\，另建每 2 分钟一次的看门狗计划任务 ChayuanWpsMcpWatch；macOS 注册 LaunchAgent com.chayuan.mcp（RunAtLoad + KeepAlive）；Linux 注册 systemd 用户单元 chayuan-mcp.service（Restart=on-failure）。
2. 手动注册/卸载：运行对应平台脚本 mcp-sidecar/autostart/install-windows-user.cmd（卸载加 /uninstall 参数）、install-macos-launchagent.sh、install-linux-user.sh。

启动后自动发生的几件事

1. 数据目录被创建（下称 dataDir）：Windows 为 %LOCALAPPDATA%\chayuan-wps\mcp\，macOS/Linux 为 ~/.config/chayuan-wps/mcp/（可用环境变量 CHAYUAN_MCP_DATA_DIR 改）。
2. 发现文件 mcp-server.json 写入 dataDir，含服务地址（url/port）与探测到的 WPS 可执行文件路径。
3. 写入审计与运行日志 audit.jsonl（dataDir 下），每 3 秒刷新心跳文件 runtime/sidecar-heartbeat.json。
4. 同一时刻只允许一个实例：重复启动会提示 already running 并退出；端口被占（EADDRINUSE）会退出并提示 port in use。

## 能力点备忘

- 三种启动方式
- 三平台自启
- healthz 健康检查

## 安装与运行答疑

### macOS 装完还是旧版？

安装器无完全磁盘访问权限时容器写入会假成功，运行官方修复脚本 repair-mac-jsaddons-container.sh（支持 status、修复、rollback 三种模式）后重装。

### 装完选项卡不出现？

按三步排查：确认 jsaddons 目录里有察元文件；完全退出 WPS（含后台进程）再重启；开发工具的加载项列表里确认察元已启用。

## 一个真实场景

出版社编辑的典型用法：分块并发校对长书稿，术语一致性核对统一叫法，批注式结果逐条确认。编校效率与留痕规范兼得。注意：超长文档分轮处理，每轮按块长 6000 字并发。

## 顺带了解

三级生图与网络搜图：配图三级降级链：第一级模型生图（最多试 3 个模型）；第二级网络搜图（Serper、Tavily、Pexels、SearXNG 免 Key）；第三级 SVG 矢量兜底；降级铁律是上级失败才降级，绝不静默换花钱来源。

为什么值得看：配图这事儿要稳定：模型挂了搜图顶上，搜图不行矢量兜底，成本不会偷偷变。

## 还有这个能力

图像批量操作：6 项图像批量操作：文档内图片的统一处理。

## 硬口径两三条

- 文字端两个选项卡：察元AI助理、察元AI编审；表格/演示端各一个察元AI助理选项卡
- 文字端 4526 个领域助手、228 个行业领域；表格端 66 个配方；演示端 81 个；翻译 52 语种动态菜单

## 如实说不足

- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型
- AI 痕迹检查给的是疑似线索，疑似不等于定论

## 定位与家族

察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI Office（开源 AI 办公套件）、察元AI 能力广场（aidooo.com）。

安装这步别跳验证：装完先确认选项卡出现，再往下配。

---

察元AI文档助手，WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。官网 aidooo.com，数据截至 2026 年 10 月（版本 6.1.2）。
