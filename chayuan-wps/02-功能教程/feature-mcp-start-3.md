---
title: "文档智能体实操场景实战：从需求到交付"
description: "文档智能体实操场景实战：本机 MCP 服务（sidecar）是察元 AI 文档助手的「文档智能体」底座：从需求到交付的完整工作流。"
keywords: ["文档智能体实操", "文档智能体", "察元AI文档助手", "MCP服务启动", "62588端口"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "文档智能体实操"
channel: "CSDN/知乎/博客"
---

# 文档智能体实操场景实战：从需求到交付

被文档智能体实操折腾过的人应该都有体会：明明是个高频操作，每次做都要重新想一遍流程。干脆整理成一篇，从打开哪个应用到看到什么结果，一步不落。以下内容以察元AI文档助手为准。

## 先看看痛点对不对得上

首次启用文档智能体；服务没起来自查，想让 Claude Code / Codex / Cursor 直接操作 WPS 文档，第一步是把本机 MCP 服务跑起来，重启电脑后不想每次手动启动，想设成开机自启。

用户常搜的问法：MCP 端口是多少？怎么启动本机 MCP 服务；怎么让服务开机自动启动，不用每次手动跑。

## 从打开到做完的每一步

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

设为开机自启

1. 安装包用户：安装器已自动注册 OS 级自启，无需操作——Windows 写注册表 HKCU\...\Run\ChayuanWpsMcp 并释放二进制到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\，另建每 2 分钟一次的看门狗计划任务 ChayuanWpsMcpWatch；macOS 注册 LaunchAgent com.chayuan.mcp（RunAtLoad + KeepAlive）；Linux 注册 systemd 用户单元 chayuan-mcp.service（Restart=on-failure）。
2. 手动注册/卸载：运行对应平台脚本 mcp-sidecar/autostart/install-windows-user.cmd（卸载加 /uninstall 参数）、install-macos-launchagent.sh、install-linux-user.sh。

启动后自动发生的几件事

1. 数据目录被创建（下称 dataDir）：Windows 为 %LOCALAPPDATA%\chayuan-wps\mcp\，macOS/Linux 为 ~/.config/chayuan-wps/mcp/（可用环境变量 CHAYUAN_MCP_DATA_DIR 改）。
2. 发现文件 mcp-server.json 写入 dataDir，含服务地址（url/port）与探测到的 WPS 可执行文件路径。
3. 写入审计与运行日志 audit.jsonl（dataDir 下），每 3 秒刷新心跳文件 runtime/sidecar-heartbeat.json。
4. 同一时刻只允许一个实例：重复启动会提示 already running 并退出；端口被占（EADDRINUSE）会退出并提示 port in use。

## 关键能力点

- 三种启动方式
- 三平台自启
- healthz 健康检查

## 几个容易忽略的细节

功能归功能，这几个边界先摆清楚：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 接着回答几个常见问题

### 另一台电脑能直接连我这台的 62588 吗？

不能。服务固定只监听 127.0.0.1（涉密不出域的设计）。跨机使用需在本机做代理/SSH 转发，见对应教程 的「远程机器」节。

### /healthz 返回正常，但助手面板仍显示未就绪？

服务活着、是 WPS 加载项没连上：确认 WPS 已打开且加载项已启用；若横幅显示「本机服务在运行，但应用安全层拦截了加载项的连接——请在设置中信任察元AI加载项（或确认安全弹窗）后重启应用」，按提示信任后重启应用（这条横幅没有一键启动按钮，拉起服务解决不了拦截）。

### 启动时报端口被占 / already running pid=…？

服务是单实例的，说明已经有一个 sidecar 在跑（可能来自自启或加载项自动拉起）。先用 /healthz 确认——健康就直接用，不必再起一个；确实是僵死进程就结束它再启动。改端口用环境变量 CHAYUAN_MCP_PORT，改了端口客户端连接地址也要跟着改。

## 补充答疑

### 想停掉服务怎么办？

前台方式启动的在终端按 Ctrl+C；找不到终端就结束 chayuan-mcp（二进制）或 node server.mjs 进程。设置页在端口冲突时也会提示：「请在运行 sidecar 的终端按 Ctrl+C 停止，或结束 chayuan-mcp / node server.mjs 进程。」设了自启的先卸载自启（autostart 脚本 /uninstall 或删对应 LaunchAgent/服务），否则看门狗会再拉起来。

### 外部智能体连接报 401 / unauthorized？

普通文档工具走 /mcp，不需要 token；401 出现在 /agent/* 等内部通道（加载项专属）。外部智能体只需配置 http://127.0.0.1:62588/mcp；若你确实在调内部通道，token 在 dataDir 的 token 文件里，请求头带 X-Chayuan-Token。

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

### 装完选项卡不出现？

按三步排查：确认 jsaddons 目录里有察元文件；完全退出 WPS（含后台进程）再重启；开发工具的加载项列表里确认察元已启用。

### Win7 或 Win8 能用吗？

加载项可装，但 MCP 预编译二进制跑不了，需要装 Node.js 16.x，由启动脚本自动回落到 node 运行。

## 一个真实场景

涉密单位文书的典型用法：模型切到本机 Ollama 离线运行，文档脱密把涉密词换占位符，脱密版对外流转、原件留底。保密合规与 AI 效率兼得。注意：脱密四项为付费专属且忘记密码无法恢复。

## 顺带了解

连接本机知识库：自动发现本机察元AI OS 知识库：固定端口 52582 三级发现链（手动指定、上次缓存、并行端口梯），指纹校验通过后提示已自动接入并发现 N 个库；库列表运行时实时拉取，察元OS 侧增删库无需 WPS 重配。

为什么值得看：装好就自动接上，资料问答在 WPS 里直接问，不用配地址。

## 还有这个能力

助手导入导出分享：自定义助手可导出文件分享给同事导入，团队口径统一。

文档智能体实操的能力边界也写清楚了：能做什么、不擅长什么。工具好不好用，很大程度上取决于你知不知道它的边界。

---

本文事实口径以 察元AI文档助手 6.1.2 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
