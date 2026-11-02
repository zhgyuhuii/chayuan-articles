---
title: "本机MCP出问题怎么办：排查手册加进阶技巧"
description: "本机MCP排错指南：本机 MCP 服务（sidecar）是察元 AI 文档助手的「文档智能体」底座：故障定位路径与进阶用法。"
keywords: ["本机MCP", "察元AI文档助手", "MCP服务启动", "62588端口"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "本机MCP"
channel: "CSDN/知乎/博客"
---

# 本机MCP出问题怎么办：排查手册加进阶技巧

这篇文章没有虚的，全是本机MCP的实操细节：入口路径、按钮原文、做完后的界面变化，以及我踩过的坑。基于察元AI文档助手当前版本。

## 先定位问题在哪一层

按这个顺序排查通常最快：先确认前置条件（已按对应教程/W02 装好察元 AI 文档助手加载项（服务要操作文档，还需 WPS 打开且加载项已启用，agent 才会在线）。），再核对操作路径，最后看边界限制。三层各有一些典型症状，对号入座能省很多时间。

## 高频故障与对策

### 想停掉服务怎么办？

前台方式启动的在终端按 Ctrl+C；找不到终端就结束 chayuan-mcp（二进制）或 node server.mjs 进程。设置页在端口冲突时也会提示：「请在运行 sidecar 的终端按 Ctrl+C 停止，或结束 chayuan-mcp / node server.mjs 进程。」设了自启的先卸载自启（autostart 脚本 /uninstall 或删对应 LaunchAgent/服务），否则看门狗会再拉起来。

## 正确的操作路径

方式 A · 在 WPS 里一键启动（最省事）

1. 在哪：WPS 助手窗格输入区机器人图标（文档智能体下拉），或 设置 ＞ 「MCP 服务管理」。
2. 做什么：服务未运行时，消息区顶部出现软横幅「本机文档服务未就绪，发送将使用内置助手」，点横幅右侧「一键启动」；或在设置页点「启动本机服务」按钮（两条路走同一条启动链路：沿候选链自动选启动方式——Windows 上隐藏启动的 start-mcp.cmd 排在二进制之前，再到 npm run mcp:sidecar、node mcp-sidecar/server.mjs）。
3. 看到什么：按钮变「正在启动…」，成功后横幅消失、健康灯变绿、状态为「本机文档服务已启动」。详见对应教程。

方式 B · 命令行启动（开发/排障常用）

1. 在哪：仓库根目录的终端。
2. 做什么：执行 npm run mcp:sidecar（等价于 node mcp-sidecar/server.mjs）。
3. 看到什么：终端依次输出 listening http://127.0.0.1:62588、MCP http://127.0.0.1:62588/mcp、healthz http://127.0.0.1:62588/healthz、dataDir <数据目录>，以及一行鉴权说明 auth token-gated: /agent/, /upstream/allowlist POST, declassify_ tools。关掉这个终端（Ctrl+C）服务即停止。

方式 C · 免 Node 直接跑二进制 / 双击脚本

1. 在哪：mcp-sidecar/bin/ 目录（按平台取用：chayuan-mcp-windows-x64.exe、chayuan-mcp-macos-arm64、chayuan-mcp-macos-x64、chayuan-mcp-linux-arm64、chayuan-mcp-linux-x64 共 5 个；源码仓库可用 npm run mcp:build-binary 重新构建）。
2. 做什么：直接运行对应平台二进制；Windows 也可双击 mcp-sidecar/start-mcp.cmd（macOS/Linux 对应 mcp-sidecar/start-mcp.sh）——脚本会先探测 62588 是否已健康（已健康就静默退出），再优先启动二进制、失败回落 node，日志写在脚本旁的 sidecar-start.log。

## 如何确认操作生效

验证

1. 浏览器或终端访问 curl http://127.0.0.1:62588/healthz：应返回 JSON，含 "ok": true 和 "name": "chayuan-wps-mcp"。
2. 同一返回里的 agent.agentOnline 为 true 表示 WPS 加载项已连上（没开 WPS 时为 false，属正常——开了 WPS 并启用加载项后即变 true）。
3. curl http://127.0.0.1:62588/token：返回服务 url 与 port（/mcp 本身免 token，外部客户端无需它）。

## 进阶用法与边界

- 三种启动方式
- 三平台自启
- healthz 健康检查

## 接着回答几个常见问题

### 外部智能体连接报 401 / unauthorized？

普通文档工具走 /mcp，不需要 token；401 出现在 /agent/* 等内部通道（加载项专属）。外部智能体只需配置 http://127.0.0.1:62588/mcp；若你确实在调内部通道，token 在 dataDir 的 token 文件里，请求头带 X-Chayuan-Token。

### 启动时报端口被占 / already running pid=…？

服务是单实例的，说明已经有一个 sidecar 在跑（可能来自自启或加载项自动拉起）。先用 /healthz 确认——健康就直接用，不必再起一个；确实是僵死进程就结束它再启动。改端口用环境变量 CHAYUAN_MCP_PORT，改了端口客户端连接地址也要跟着改。

### 另一台电脑能直接连我这台的 62588 吗？

不能。服务固定只监听 127.0.0.1（涉密不出域的设计）。跨机使用需在本机做代理/SSH 转发，见对应教程 的「远程机器」节。

## 补充答疑

### /healthz 返回正常，但助手面板仍显示未就绪？

服务活着、是 WPS 加载项没连上：确认 WPS 已打开且加载项已启用；若横幅显示「本机服务在运行，但应用安全层拦截了加载项的连接——请在设置中信任察元AI加载项（或确认安全弹窗）后重启应用」，按提示信任后重启应用（这条横幅没有一键启动按钮，拉起服务解决不了拦截）。

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

### Win7 或 Win8 能用吗？

加载项可装，但 MCP 预编译二进制跑不了，需要装 Node.js 16.x，由启动脚本自动回落到 node 运行。

### 装完选项卡不出现？

按三步排查：确认 jsaddons 目录里有察元文件；完全退出 WPS（含后台进程）再重启；开发工具的加载项列表里确认察元已启用。

## 一个真实场景

涉密单位文书的典型用法：模型切到本机 Ollama 离线运行，文档脱密把涉密词换占位符，脱密版对外流转、原件留底。保密合规与 AI 效率兼得。注意：脱密四项为付费专属且忘记密码无法恢复。

## 顺带了解

脱密复原：脱密复原按钮（仅已脱密文档亮起）：输密码确定复原，按占位符就地还原，脱密后被编辑过也能还原。

为什么值得看：可逆设计让脱密不是单向门，改完还能回来。

## 还有这个能力

数据路径与帮助反馈：本地数据落盘位置说明、帮助手册、在线客服与关于页。

## 硬口径两三条

- 文字端两个选项卡：察元AI助理、察元AI编审；表格/演示端各一个察元AI助理选项卡
- 文字端 4526 个领域助手、228 个行业领域；表格端 66 个配方；演示端 81 个；翻译 52 语种动态菜单

## 如实说不足

- Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落
- macOS 安装器没有完全磁盘访问权限时会出现假成功，需要跑修复脚本
- AI 痕迹检查给的是疑似线索，疑似不等于定论

## 定位与家族

察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI Office（开源 AI 办公套件）、察元AI 能力广场（aidooo.com）。

如果只记一件事：三种启动方式。剩下的细节照步骤节走就行。

---

察元AI文档助手（Chayuan AI Document Assistant）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 6.1.2），后续版本功能可能调整。
