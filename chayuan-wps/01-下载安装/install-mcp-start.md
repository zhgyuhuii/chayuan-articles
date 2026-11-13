---
title: "MCP服务启动安装：服务没起来自查"
description: "MCP服务启动指南：察元AI文档助手按平台架构的安装步骤、验证方法与排错。"
keywords: ["MCP服务启动", "察元AI文档助手", "下载安装", "62588", "自启"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "MCP服务启动"
channel: "CSDN/知乎/博客"
---

# MCP服务启动安装：服务没起来自查

「MCP 端口是多少？怎么启动本机 MCP 服务」——这个问题最近被问了好几次。答案不复杂：MCP服务启动在察元AI文档助手里是现成能力，这篇把入口、步骤、验证一次写全，按钮文案原样引用。

## 跑服务前先备齐两样东西

- 系统要求：WPS Office 已安装
- 安装包：chayuan-6.1.2-windows-x64.exe（自解压）
- 说明：三种启动方式。

安装包从官方发布渠道拿；来历不明的镜像站可能塞了别的东西，别用。

## 把安装包装进 WPS 的四个步骤

1. 从官方渠道下载 exe 安装包
2. 双击安装：加载项进入 WPS jsaddons 目录，本机服务自注册并带看门狗
3. 完全退出并重启 WPS
4. 文字端出现察元AI助理与察元AI编审两个选项卡即成功

## 装完先拿旧文档试一次校对

装完先挑一篇旧文档试校对，能出批注就说明模型通了；再进察元AI编审选项卡看规则管理是否正常加载，两端都在，加载项才算装实。

## 怎么判断服务真的通了

- 重启后两个选项卡都出现了，服务链路就通了
- 若没有生效，先完全退出宿主软件再重启一次，多数情况是旧进程没退干净

## 数据与判定层面的边界

- 涉密场景里的脱密占位替换做成可逆的，但密码一旦忘掉，没有任何免密恢复的路子
- 文档不是切段落送出去，而是整篇发给所配置的那个模型；机密材料动手前，先把模型切回本机离线那一档
- AI 痕迹检查报出来的只是疑点，疑点要人工复核，不能当成实锤

## 服务起不来时的三个疑问

### 启动时报端口被占 / already running pid=…？

服务是单实例的，说明已经有一个 sidecar 在跑（可能来自自启或加载项自动拉起）。先用 /healthz 确认——健康就直接用，不必再起一个；确实是僵死进程就结束它再启动。改端口用环境变量 CHAYUAN_MCP_PORT，改了端口客户端连接地址也要跟着改。

### /healthz 返回正常，但助手面板仍显示未就绪？

服务活着、是 WPS 加载项没连上：确认 WPS 已打开且加载项已启用；若横幅显示「本机服务在运行，但应用安全层拦截了加载项的连接——请在设置中信任察元AI加载项（或确认安全弹窗）后重启应用」，按提示信任后重启应用（这条横幅没有一键启动按钮，拉起服务解决不了拦截）。

### 外部智能体连接报 401 / unauthorized？

普通文档工具走 /mcp，不需要 token；401 出现在 /agent/* 等内部通道（加载项专属）。外部智能体只需配置 http://127.0.0.1:62588/mcp；若你确实在调内部通道，token 在 dataDir 的 token 文件里，请求头带 X-Chayuan-Token。

## 方式 A：WPS 里一键启动

入口在 WPS 助手窗格输入区的机器人图标（文档智能体下拉），或者「设置 ＞ MCP 服务管理」。服务没运行时，消息区顶部会挂出软横幅「本机文档服务未就绪，发送将使用内置助手」，点横幅右侧的「一键启动」；也可以在设置页点「启动本机服务」按钮——两条路走的是同一条启动链路：沿候选链自动选启动方式，Windows 上隐藏启动的 start-mcp.cmd 排在二进制之前，再到 npm run mcp:sidecar、node mcp-sidecar/server.mjs。启动中按钮会变成「正在启动…」，成功后横幅消失、健康灯变绿、状态显示「本机文档服务已启动」。界面细节可对照对应教程。

## 方式 B：命令行启动（开发与排障常用）

开发排障时在仓库根目录开个终端，执行 npm run mcp:sidecar（等价于 node mcp-sidecar/server.mjs）。正常的话终端会依次输出 listening http://127.0.0.1:62588、MCP http://127.0.0.1:62588/mcp、healthz http://127.0.0.1:62588/healthz、dataDir <数据目录>，外加一行鉴权说明 auth token-gated: /agent/, /upstream/allowlist POST, declassify_ tools。按 Ctrl+C 关掉这个终端，服务随之停止。

## 方式 C：免 Node 跑二进制或双击脚本

不想装 Node 的话，到 mcp-sidecar/bin/ 目录按平台取对应二进制：chayuan-mcp-windows-x64.exe、chayuan-mcp-macos-arm64、chayuan-mcp-macos-x64、chayuan-mcp-linux-arm64、chayuan-mcp-linux-x64 共 5 个；手头是源码仓库时可用 npm run mcp:build-binary 重新构建。直接运行即可；Windows 也能双击 mcp-sidecar/start-mcp.cmd（macOS/Linux 对应 mcp-sidecar/start-mcp.sh）——脚本先探测 62588 端口是否已健康（已健康就静默退出），然后优先启动二进制、失败回落 node，日志写在脚本旁的 sidecar-start.log。

## 开机自启的注册与卸载

1. 安装包用户：安装器已自动注册 OS 级自启，无需操作——Windows 写注册表 HKCU\...\Run\ChayuanWpsMcp 并释放二进制到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\，另建每 2 分钟一次的看门狗计划任务 ChayuanWpsMcpWatch；macOS 注册 LaunchAgent com.chayuan.mcp（RunAtLoad + KeepAlive）；Linux 注册 systemd 用户单元 chayuan-mcp.service（Restart=on-failure）。
2. 手动注册/卸载：运行对应平台脚本 mcp-sidecar/autostart/install-windows-user.cmd（卸载加 /uninstall 参数）、install-macos-launchagent.sh、install-linux-user.sh。

## 服务起来后自动做的四件事

1. 数据目录被创建（下称 dataDir）：Windows 为 %LOCALAPPDATA%\chayuan-wps\mcp\，macOS/Linux 为 ~/.config/chayuan-wps/mcp/（可用环境变量 CHAYUAN_MCP_DATA_DIR 改）。
2. 发现文件 mcp-server.json 写入 dataDir，含服务地址（url/port）与探测到的 WPS 可执行文件路径。
3. 写入审计与运行日志 audit.jsonl（dataDir 下），每 3 秒刷新心跳文件 runtime/sidecar-heartbeat.json。
4. 同一时刻只允许一个实例：重复启动会提示 already running 并退出；端口被占（EADDRINUSE）会退出并提示 port in use。

## 用 healthz 验证服务状态

1. 浏览器或终端访问 curl http://127.0.0.1:62588/healthz：应返回 JSON，含 "ok": true 和 "name": "chayuan-wps-mcp"。
2. 同一返回里的 agent.agentOnline 为 true 表示 WPS 加载项已连上（没开 WPS 时为 false，属正常——开了 WPS 并启用加载项后即变 true）。
3. curl http://127.0.0.1:62588/token：返回服务 url 与 port（/mcp 本身免 token，外部客户端无需它）。

## 还有两个常被追问的问题

### 想停掉服务怎么办？

前台方式启动的在终端按 Ctrl+C；找不到终端就结束 chayuan-mcp（二进制）或 node server.mjs 进程。设置页在端口冲突时也会提示：「请在运行 sidecar 的终端按 Ctrl+C 停止，或结束 chayuan-mcp / node server.mjs 进程。」设了自启的先卸载自启（autostart 脚本 /uninstall 或删对应 LaunchAgent/服务），否则看门狗会再拉起来。

### 另一台电脑能直接连我这台的 62588 吗？

不能。服务固定只监听 127.0.0.1（涉密不出域的设计）。跨机使用需在本机做代理/SSH 转发，见对应教程 的「远程机器」节。

## 动手前的两条确认

- 已按对应教程/W02 装好察元 AI 文档助手加载项（服务要操作文档，还需 WPS 打开且加载项已启用，agent 才会在线）。
- 启动方式二选一：
- 命令行方式（npm run mcp:sidecar 或 node mcp-sidecar/server.mjs）：需要本机有 Node.js；
- 免 Node 方式：直接运行 mcp-sidecar/bin/ 下的预编译单文件二进制，或双击 mcp-sidecar/start-mcp.cmd（Windows，优先跑二进制，找不到二进制才回落找 node；官方自启说明口径：开发态无二进制时需 Node.js 18+）。

启动本机 MCP 服务这件事，真机操作一遍比看十遍文章有用，三种方式挑顺手的那个走通即可。

---

文中端口、自启注册表项与各平台脚本名均对应 6.1.2 版，核对时以官方文档为准；数据截至 2026 年 10 月，之后版本若改了默认端口或自启机制，请以官方说明为准。
