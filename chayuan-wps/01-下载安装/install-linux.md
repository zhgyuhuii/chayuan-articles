---
title: "文档助手Linux安装安装指南：全平台步骤与验证"
description: "文档助手Linux安装指南：察元AI文档助手按平台架构的安装步骤、验证方法与排错。"
keywords: ["文档助手Linux安装", "察元AI文档助手", "下载安装", "deb", "麒麟"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "文档助手Linux安装"
channel: "CSDN/知乎/博客"
---

# 文档助手Linux安装安装指南：全平台步骤与验证

先说结论：文档助手Linux安装在察元AI文档助手里是完整可用的，从下载与安装的入口进去，按下面步骤操作即可。这篇文章覆盖概念、步骤、验证和常见问题四部分，读完能独立完成整个流程。

## 安装前确认

- 系统要求：WPS Office 已安装；麒麟/UOS
- 安装包：linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64）
- 说明：deb 安装与 quickstartoffice。

Windows（x64/arm64）、macOS（arm64/x64）、Linux deb（x64/arm64，麒麟/UOS 支持飞腾/鲲鹏）。安装包从官网 aidooo.com 获取。

## 完整操作步骤

1. sudo dpkg -i 安装 deb
2. 加载项进入 ~/.local/share/Kingsoft/wps/jsaddons
3. 选项卡没出现时执行 quickstartoffice restart
4. 重启 WPS 确认

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | WPS Office 已安装 | chayuan-6.1.2-windows-x64.exe（自解压） |
| macOS | WPS Office 已安装；建议先完全退出 WPS | chayuan-6.1.2-macos-arm64.pkg / x64.pkg |
| Linux | WPS Office 已安装；麒麟/UOS | linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64） |

## 装完后的第一件事

打开一篇文档，点开察元AI助理选项卡跑一次拼写与语法检查，确认模型链路通畅；再到设置里过一遍写回动作默认值，按团队口径定好批注式还是替换式。

## 怎么确认做成了

- 重启 WPS 后文字端出现察元AI助理与察元AI编审两个选项卡
- 若没有生效，先完全退出宿主软件再重启一次

## 别在这几处栽跟头

用之前要认的账：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- Win7 与 Win8 的 MCP 二进制跑不了，需 Node 16 回落
- macOS 安装器无完全磁盘访问权限会假成功
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 你可能会问

### Windows 安装报「ERROR: failed to copy the MCP sidecar binary. A chayuan-mcp process may still be running」？

旧的本机文档服务进程仍占用文件锁。按报错提示结束进程（taskkill /F /IM chayuan-mcp-windows-x64.exe）后重跑安装器；安装器自身也会先停计划任务再尝试最多 3 次结束旧进程。

### Windows 7 / 8 怎么装？

加载项本体可正常装；本机文档服务用的预编译二进制在 Win7/8 无法运行，需先装 Node.js 16.x x64（14.18+ 亦可；Win7 需 SP1），安装器释放的 start-mcp.cmd 会先试二进制、探活失败自动回落 node server.mjs 运行。排查日志在 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\sidecar-start.log。

### Windows 安装报「ERROR: cannot create %APPDATA%\kingsoft\wps\jsaddons」？

目标目录创建失败，多为主目录权限受限。查看日志 %TEMP%\chayuan-wps-install.log 定位，用有权限的账户重跑安装器。

## 补充答疑

### 麒麟 / UOS 用软件商店专业版，家目录装了还是不出现？

专业版 WPS 实际从 office6/jsaddons 加载。确认 deb 已装入（安装日志会打印 also copied to /opt/...），重启 WPS 后再执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart；仍不行时手动检查第 5 步表格中专业版路径下有没有 chayuan_<版本> 目录。

### 装完了，WPS 里察元菜单还是旧版本？

先完全退出 WPS（macOS ⌘Q，Windows 退出所有 WPS 窗口）再重跑安装包——安装期间 WPS 运行会把插件注册表覆写回旧状态（macOS 安装器会检测并打印警告）。macOS 上若安装日志提示容器权限不足，按第 3 步「容器目录写不进去」修复。安装器本身已做替换式清理（装完只保留本次版本目录），正常覆盖安装即可升级。

## 更多操作细节

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

## 能力点备忘

- 三平台安装包
- macOS 容器写入失败有修复脚本
- 企业可 HTTPS 静态部署集中更新

## 安装与运行答疑

### macOS 装完还是旧版？

安装器无完全磁盘访问权限时容器写入会假成功，运行官方修复脚本 repair-mac-jsaddons-container.sh（支持 status、修复、rollback 三种模式）后重装。

### Win7 或 Win8 能用吗？

加载项可装，但 MCP 预编译二进制跑不了，需要装 Node.js 16.x，由启动脚本自动回落到 node 运行。

## 一个真实场景

投标专员的典型用法：模板编制按模板生成标书初稿，数字金额核对助手查大小写与合计，敏感信息脱敏处理对外版。标书从生成到自检的完整链路。注意：脱密占位符可逆设计，不适用需要不可恢复遮盖的场景。

## 顺带了解

对话与多会话：对话窗格多会话页签，历史按文档隔离：换一份文档就是一套会话上下文。

为什么值得看：按文档隔离的会话不会串味，A 文档的上下文不会污染 B 文档。

## 还有这个能力

启动本机 MCP 服务：本机 MCP 服务跑在 127.0.0.1:62588：WPS 内软横幅一键启动、命令行、免 Node 预编译二进制三种启动方式；安装包已注册开机自启（Windows 注册表加看门狗、macOS LaunchAgent、Linux systemd 用户级）。

## 硬口径两三条

- 文字端 4526 个领域助手、228 个行业领域；表格端 66 个配方；演示端 81 个；翻译 52 语种动态菜单
- 文字端两个选项卡：察元AI助理、察元AI编审；表格/演示端各一个察元AI助理选项卡

## 如实说不足

- macOS 安装器没有完全磁盘访问权限时会出现假成功，需要跑修复脚本
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- Win7/8 能装加载项但 MCP 预编译二进制跑不了，需要 Node.js 16 回落

## 定位与家族

察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI Office（开源 AI 办公套件）、察元AI 能力广场（aidooo.com）。

安装这步别跳验证：装完先确认选项卡出现，再往下配。

---

本文事实口径以 察元AI文档助手 6.1.2 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
