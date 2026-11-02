---
title: "图书校对操作详解：真实界面步骤与常见坑"
description: "图书校对完整教程：察元 AI 文档助手（Chayuan AI）是 WPS 加载项，「安装」的本质是把加载项文件放进 WPS 的 jsaddons 目录。步骤含真实按钮文案与验证方法。"
keywords: ["图书校对", "察元AI文档助手", "场景", "编校质量", "三审三校辅助"]
product: chayuan-wps
category: "03-场景用例"
primary_keyword: "图书校对"
channel: "CSDN/知乎/博客"
---

# 图书校对操作详解：真实界面步骤与常见坑

图书校对这件事，说简单也简单，说麻烦是真麻烦——麻烦不在功能本身，在于信息散落在各处，拼出一个完整流程要查好几篇资料。这篇文章把它一次讲全：是什么、入口在哪、具体步骤、边界在哪，全部基于察元AI文档助手的真实界面。

## 这个功能到底解决什么问题

察元 AI 文档助手（Chayuan AI）是 WPS 加载项，「安装」的本质是把加载项文件放进 WPS 的 jsaddons 目录。三平台都有现成的一键安装包：双击（或一条命令）即可完成拷贝与本机文档服务注册，装完重启 WPS 就能看到察元菜单。

不换办公软件、不改变习惯，给 WPS 装上一个 AI 引擎是迁移成本最低的路线。

入口、步骤、验证三段看清，这事就顺了。

## 操作前的准备工作

- 本机已安装 WPS Office（文字 / 表格 / 演示任意端均可；三端使用同一套前端构建产物，差异只在安装路径与部署方式）。
- 本篇以 v6.1.2 发布产物为准；升级安装直接用新版安装包覆盖即可。

## 完整操作步骤

第 1 步 · 下载安装包

在哪：官网 https://aidooo.com，或单位 / 团队内部分发的安装包目录。

v6.1.2 发布产物（release/ 目录清单）：

| 平台 | 文件名 | 说明 |
|---|---|---|
| Windows | chayuan-6.1.2-windows-x64.exe | 自解压安装器（SFX） |
| macOS（Apple Silicon） | chayuan-6.1.2-macos-arm64.pkg | 推荐，双击一键安装 |
| macOS（Intel） | chayuan-6.1.2-macos-x64.pkg | |
| macOS | chayuan-6.1.2-macos-arm64.7z | 离线压缩包，内含 publish.xml 与 chayuan_6.1.2 目录，手动部署用 |
| Linux / 麒麟 / UOS | chayuan-6.1.2-linux-x64.deb、chayuan-6.1.2-linux-arm64.deb | 国产化环境（飞腾 / 鲲鹏）选 arm64 |

第 2 步 · Windows 安装

1. 在哪：下载得到的 chayuan-6.1.2-windows-x64.exe。
2. 做什么：双击运行，弹出解压安装对话框后等待自动完成，无需点下一步。
3. 看到什么：安装器把加载项拷入 %APPDATA%\kingsoft\wps\jsaddons（chayuan_6.1.2 等三个宿主目录 + publish.xml），同时把本机文档服务释放到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime，并写入开机自启（注册表 ChayuanWpsMcp 启动项 + 每 2 分钟检查一次的计划任务 ChayuanWpsMcpWatch）。结束后弹出「Install OK. Please fully quit and restart WPS.」和安装日志路径（%TEMP%\chayuan-wps-install.log）。按提示完全退出并重启 WPS。

第 3 步 · macOS 安装

1. 在哪：下载得到的 .pkg。
2. 做什么：建议先完全退出 WPS，再双击 chayuan-6.1.2-macos-arm64.pkg（Intel 机型用 x64 包）。若系统提示无法验证开发者，右键安装包 ＞「打开」＞ 确认（绕过 Gatekeeper；此为 macOS 系统行为，取自用户手册口径，产品代码不涉及）。
3. 看到什么：安装器自动把加载项装入沙盒版 WPS 容器目录 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons（另会尽力写一份到 ~/Library/Application Support/Kingsoft/wps/jsaddons 覆盖非沙盒布局），同步插件注册表（jsplugins.xml、authaddin.json），并把本机文档服务注册为 LaunchAgent（com.chayuan.mcp），装完轮询健康检查并把结果写进安装日志。
4. 两个注意事项（安装器会主动检测并提示）：
    1. 安装时 WPS 正在运行：安装日志会打印响亮警告——本次写入的插件注册会在 WPS 退出时被旧状态覆写（加载项仍显示旧版本）。按提示操作：① 完全退出 WPS（保存文档后 ⌘Q，或 pkill -x wpsoffice）＞ ② 重新运行本安装包 ＞ ③ 再打开 WPS。
    2. 容器目录写不进去（macOS 收紧权限后 Installer 无「完全磁盘访问权限」）：安装日志会提示「容器 jsaddons 安装失败（Operation not permitted）」，此时 WPS 仍会加载旧版。修复任选其一：① 系统设置 ＞ 隐私与安全性 ＞ 完全磁盘访问权限 ＞ 勾选「安装器」后重跑安装包；② 在有完全磁盘访问权限的终端执行 bash scripts/repair-mac-jsaddons-container.sh（该脚本支持 status 只读检查 / 默认修复 / rollback 回滚三种模式）。

第 4 步 · Linux / 麒麟 / UOS 安装

bash

sudo dpkg -i chayuan-6.1.2-linux-x64.deb

图形界面双击安装（软件中心 / GDebi）也支持——安装脚本会自动推断当前登录用户，避免只装进 root 家目录。

1. 在哪：终端。
2. 做什么：执行
3. 看到什么：安装脚本把加载项装入 ~/.local/share/Kingsoft/wps/jsaddons（同时写一份小写 kingsoft 路径，防止个别大小写敏感环境漏读），并做替换式清理（装完只剩本次版本目录）；若本机存在 WPS 专业版 office6 布局（/opt/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office-pro/files/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office/files/kingsoft/wps-office/office6），会同步装入对应 jsaddons 并更新 jsplugins.xml。随后重启 WPS；若未出现加载项，执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart（该命令属 WPS 专业版自带，见该路径下 bin；安装脚本执行完也会在终端打印这条提示）。

第 5 步 · 手动排查：常见 jsaddons 位置速查

安装包已自动覆盖以下路径；手动排查 / 手动部署时对照：

目录内容形如：chayuan_<版本>（文字端）、chayuan-et_<版本>（表格端）、chayuan-wpp_<版本>（演示端）三个目录 + publish.xml。

| 平台 | 路径 |
|---|---|
| Windows | %AppData%\Kingsoft\wps\jsaddons |
| Linux | ~/.local/share/Kingsoft/wps/jsaddons |
| 麒麟 / UOS 专业版 | /opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons（具体见上文三种 office6 布局） |
| macOS（沙盒版，常见） | ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons |
| macOS（非沙盒 / 旧布局） | ~/Library/Application Support/Kingsoft/wps/jsaddons |

第 6 步 ·（IT 管理员，可选）在线部署

把 wps-addon-build/ 目录内文件部署到 HTTPS 静态服务器，再在 WPS「开发工具 ＞ 加载项」中填入对应加载项 URL，即可集中更新、统一管理。

第 7 步 ·（可选）一体化安装：加载项 + MCP 服务 + 智能体技能

wps-skill-chayuan 便携包（release/ 下 wps-skill-chayuan-6.1.2-portable.zip / .7z）解压后按系统跑一条命令：

一次完成：加载项装入 jsaddons + MCP 服务开机自启 + 技能文件投放到已装的 Claude Code / Cursor / Codex，并跑四级自检。只要加载项不要智能体投放时加 --no-agent（-NoAgent）。

1. macOS / Linux：bash scripts/install-wps-skill-chayuan.sh
2. Windows：powershell -ExecutionPolicy Bypass -File scripts\install-wps-skill-chayuan.ps1

## 怎么确认做成了

验证

1. 完全退出并重启 WPS，打开 WPS 文字：功能区出现「察元AI助理」「察元AI编审」两个选项卡。
2. 文件层面：Windows 资源管理器打开 %AppData%\Kingsoft\wps\jsaddons，应看到 chayuan_6.1.2、chayuan-et_6.1.2、chayuan-wpp_6.1.2 目录与 publish.xml；macOS / Linux 打开上表对应路径同理。
3. Windows 可查看安装日志 %TEMP%\chayuan-wps-install.log，末尾应为 install ok。

## 适用场景

升级到新版本（安装器为替换式安装，自动清理旧版本目录）；个人给 WPS 装校对插件，政企统一给 WPS 加 AI 能力，新机器第一次安装察元 AI 文档助手。

用户常搜的问法：Windows / macOS / 麒麟上怎么安装察元 AI 文档助手；jsaddons 目录在哪？想手动放文件怎么放。

## 注意事项与真实边界

用之前要认的账：

- Win7 与 Win8 的 MCP 二进制跑不了，需 Node 16 回落
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- macOS 安装器无完全磁盘访问权限会假成功

## 你可能会问

### Windows 安装报「ERROR: failed to copy the MCP sidecar binary. A chayuan-mcp process may still be running」？

旧的本机文档服务进程仍占用文件锁。按报错提示结束进程（taskkill /F /IM chayuan-mcp-windows-x64.exe）后重跑安装器；安装器自身也会先停计划任务再尝试最多 3 次结束旧进程。

### Windows 安装报「ERROR: cannot create %APPDATA%\kingsoft\wps\jsaddons」？

目标目录创建失败，多为主目录权限受限。查看日志 %TEMP%\chayuan-wps-install.log 定位，用有权限的账户重跑安装器。

### 装完了，WPS 里察元菜单还是旧版本？

先完全退出 WPS（macOS ⌘Q，Windows 退出所有 WPS 窗口）再重跑安装包——安装期间 WPS 运行会把插件注册表覆写回旧状态（macOS 安装器会检测并打印警告）。macOS 上若安装日志提示容器权限不足，按第 3 步「容器目录写不进去」修复。安装器本身已做替换式清理（装完只保留本次版本目录），正常覆盖安装即可升级。

### Windows 7 / 8 怎么装？

加载项本体可正常装；本机文档服务用的预编译二进制在 Win7/8 无法运行，需先装 Node.js 16.x x64（14.18+ 亦可；Win7 需 SP1），安装器释放的 start-mcp.cmd 会先试二进制、探活失败自动回落 node server.mjs 运行。排查日志在 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\sidecar-start.log。

整体用下来，下载与安装的流程是清楚的：入口集中、步骤有反馈、做完有验证。第一次照着走一遍，后面基本就是肌肉记忆了。卡住就回看常见问题那一节。

---

察元AI文档助手（Chayuan AI Document Assistant）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 6.1.2），后续版本功能可能调整。
