---
title: "62588端口为什么这样工作：MCP 端口是多少"
description: "62588端口的机制拆解：MCP 服务是外部智能体操作 WPS 文档的桥，开机自启保证随时可用。设计取舍与边界一次讲清，基于察元AI文档助手。"
keywords: ["62588端口", "察元AI文档助手", "MCP服务启动", "文档智能体"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "62588端口"
channel: "CSDN/知乎/博客"
---

# 62588端口为什么这样工作：MCP 端口是多少

很多人搜「MCP 端口是多少？怎么启动本机 MCP 服务」，搜到的多是概念解释，落不到操作。这篇以察元AI文档助手为准，把62588端口从打开哪个应用讲到看到什么结果。

## 启动本机 MCP 服务是个什么东西

为什么要有62588端口：MCP 服务是外部智能体操作 WPS 文档的桥，开机自启保证随时可用。启动本机 MCP 服务的定位是本机 MCP 服务跑在 127.0.0.1:62588：

概念一分钟，操作十分钟，这篇都覆盖。

## 一步步来

按最短路径验证一遍：

设为开机自启

1. 安装包用户：安装器已自动注册 OS 级自启，无需操作——Windows 写注册表 HKCU\...\Run\ChayuanWpsMcp 并释放二进制到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\，另建每 2 分钟一次的看门狗计划任务 ChayuanWpsMcpWatch；macOS 注册 LaunchAgent com.chayuan.mcp（RunAtLoad + KeepAlive）；Linux 注册 systemd 用户单元 chayuan-mcp.service（Restart=on-failure）。
2. 手动注册/卸载：运行对应平台脚本 mcp-sidecar/autostart/install-windows-user.cmd（卸载加 /uninstall 参数）、install-macos-launchagent.sh、install-linux-user.sh。

启动后自动发生的几件事

1. 数据目录被创建（下称 dataDir）：Windows 为 %LOCALAPPDATA%\chayuan-wps\mcp\，macOS/Linux 为 ~/.config/chayuan-wps/mcp/（可用环境变量 CHAYUAN_MCP_DATA_DIR 改）。
2. 发现文件 mcp-server.json 写入 dataDir，含服务地址（url/port）与探测到的 WPS 可执行文件路径。
3. 写入审计与运行日志 audit.jsonl（dataDir 下），每 3 秒刷新心跳文件 runtime/sidecar-heartbeat.json。
4. 同一时刻只允许一个实例：重复启动会提示 already running 并退出；端口被占（EADDRINUSE）会退出并提示 port in use。

## 几个容易忽略的细节

如实说明，它不是万能的：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- AI 痕迹检查给的是疑似线索，疑似不等于定论

## 接着回答几个常见问题

### 启动时报端口被占 / already running pid=…？

服务是单实例的，说明已经有一个 sidecar 在跑（可能来自自启或加载项自动拉起）。先用 /healthz 确认——健康就直接用，不必再起一个；确实是僵死进程就结束它再启动。改端口用环境变量 CHAYUAN_MCP_PORT，改了端口客户端连接地址也要跟着改。

### /healthz 返回正常，但助手面板仍显示未就绪？

服务活着、是 WPS 加载项没连上：确认 WPS 已打开且加载项已启用；若横幅显示「本机服务在运行，但应用安全层拦截了加载项的连接——请在设置中信任察元AI加载项（或确认安全弹窗）后重启应用」，按提示信任后重启应用（这条横幅没有一键启动按钮，拉起服务解决不了拦截）。

### 外部智能体连接报 401 / unauthorized？

普通文档工具走 /mcp，不需要 token；401 出现在 /agent/* 等内部通道（加载项专属）。外部智能体只需配置 http://127.0.0.1:62588/mcp；若你确实在调内部通道，token 在 dataDir 的 token 文件里，请求头带 X-Chayuan-Token。

### 想停掉服务怎么办？

前台方式启动的在终端按 Ctrl+C；找不到终端就结束 chayuan-mcp（二进制）或 node server.mjs 进程。设置页在端口冲突时也会提示：「请在运行 sidecar 的终端按 Ctrl+C 停止，或结束 chayuan-mcp / node server.mjs 进程。」设了自启的先卸载自启（autostart 脚本 /uninstall 或删对应 LaunchAgent/服务），否则看门狗会再拉起来。

## 更多操作细节

方式 A · 在 WPS 里一键启动（最省事）

1. 在哪：WPS 助手窗格输入区机器人图标（文档智能体下拉），或 设置 ＞ 「MCP 服务管理」。
2. 做什么：服务未运行时，消息区顶部出现软横幅「本机文档服务未就绪，发送将使用内置助手」，点横幅右侧「一键启动」；或在设置页点「启动本机服务」按钮（两条路走同一条启动链路：沿候选链自动选启动方式——Windows 上隐藏启动的 start-mcp.cmd 排在二进制之前，再到 npm run mcp:sidecar、node mcp-sidecar/server.mjs）。
3. 看到什么：按钮变「正在启动…」，成功后横幅消失、健康灯变绿、状态为「本机文档服务已启动」。详见对应教程。

## 更多操作细节

方式 B · 命令行启动（开发/排障常用）

1. 在哪：仓库根目录的终端。
2. 做什么：执行 npm run mcp:sidecar（等价于 node mcp-sidecar/server.mjs）。
3. 看到什么：终端依次输出 listening http://127.0.0.1:62588、MCP http://127.0.0.1:62588/mcp、healthz http://127.0.0.1:62588/healthz、dataDir <数据目录>，以及一行鉴权说明 auth token-gated: /agent/, /upstream/allowlist POST, declassify_ tools。关掉这个终端（Ctrl+C）服务即停止。

## 更多操作细节

方式 C · 免 Node 直接跑二进制 / 双击脚本

1. 在哪：mcp-sidecar/bin/ 目录（按平台取用：chayuan-mcp-windows-x64.exe、chayuan-mcp-macos-arm64、chayuan-mcp-macos-x64、chayuan-mcp-linux-arm64、chayuan-mcp-linux-x64 共 5 个；源码仓库可用 npm run mcp:build-binary 重新构建）。
2. 做什么：直接运行对应平台二进制；Windows 也可双击 mcp-sidecar/start-mcp.cmd（macOS/Linux 对应 mcp-sidecar/start-mcp.sh）——脚本会先探测 62588 是否已健康（已健康就静默退出），再优先启动二进制、失败回落 node，日志写在脚本旁的 sidecar-start.log。

## 更多操作细节

验证

1. 浏览器或终端访问 curl http://127.0.0.1:62588/healthz：应返回 JSON，含 "ok": true 和 "name": "chayuan-wps-mcp"。
2. 同一返回里的 agent.agentOnline 为 true 表示 WPS 加载项已连上（没开 WPS 时为 false，属正常——开了 WPS 并启用加载项后即变 true）。
3. curl http://127.0.0.1:62588/token：返回服务 url 与 port（/mcp 本身免 token，外部客户端无需它）。

## 补充答疑

### 另一台电脑能直接连我这台的 62588 吗？

不能。服务固定只监听 127.0.0.1（涉密不出域的设计）。跨机使用需在本机做代理/SSH 转发，见对应教程 的「远程机器」节。

## 动手前再核对一遍

- 已按对应教程/W02 装好察元 AI 文档助手加载项（服务要操作文档，还需 WPS 打开且加载项已启用，agent 才会在线）。
- 启动方式二选一：
- 命令行方式（npm run mcp:sidecar 或 node mcp-sidecar/server.mjs）：需要本机有 Node.js；
- 免 Node 方式：直接运行 mcp-sidecar/bin/ 下的预编译单文件二进制，或双击 mcp-sidecar/start-mcp.cmd（Windows，优先跑二进制，找不到二进制才回落找 node；官方自启说明口径：开发态无二进制时需 Node.js 18+）。

## 顺手把能力清单放这

- 三种启动方式
- 三平台自启
- healthz 健康检查

## 安全与数据边界

安全口径单独立一层：脱密恢复载荷 AES-GCM-256 加密随文件走，原文可凭密码还原，四类本地端点默认端口，跨端口访问已放行；知道自己数据在哪，才有安全感。

## 平台与形态

平台与形态的账：macOS 容器写入失败有修复脚本；macOS 安装器无完全磁盘访问权限会假成功；同时在本机 62588 端口开放 MCP 文档智能体服务；本机 MCP 服务 http://127.0.0.1:62588/mcp。

这篇把启动本机 MCP 服务的链路拆完了。卡住就回看常见问题那一节，多数坎都在那里。

---

本文事实口径以 察元AI文档助手 6.1.2 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
