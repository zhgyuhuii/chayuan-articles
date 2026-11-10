---
title: "文档助手Windows安装安装：察元 AI 文档助手"
description: "文档助手Windows安装指南：察元AI文档助手按平台架构的安装步骤、验证方法与排错。"
keywords: ["文档助手Windows安装", "察元AI文档助手", "下载安装", "exe", "WPS插件"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "文档助手Windows安装"
channel: "CSDN/知乎/博客"
---

# 文档助手Windows安装安装：察元 AI 文档助手

先说这篇能帮你干什么：读完能在察元AI文档助手里独立完成文档助手Windows安装，路径是政企统一给 WPS 加 AI 能力。步骤里的每个「」按钮都是界面原文。

## 安装前确认

- 系统要求：WPS Office 已安装
- 安装包：chayuan-6.1.2-windows-x64.exe（自解压）
- 说明：exe 自解压安装。

安装包从官网 aidooo.com 获取。

## 操作步骤详解

1. 官网 aidooo.com 下载 exe
2. 双击安装：加载项进入 WPS jsaddons 目录，本机服务自注册并带看门狗
3. 完全退出并重启 WPS
4. 文字端出现察元AI助理与察元AI编审两个选项卡即成功

## 其他平台装法速览

macOS：官网下载对应架构 pkg；完全退出 WPS 后安装（运行中安装会被旧注册覆写）；若提示容器写入失败，用官方 repair-mac-jsaddons-container.sh 脚本修复。

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | WPS Office 已安装 | chayuan-6.1.2-windows-x64.exe（自解压） |
| macOS | WPS Office 已安装；建议先完全退出 WPS | chayuan-6.1.2-macos-arm64.pkg / x64.pkg |
| Linux | WPS Office 已安装；麒麟/UOS | linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64） |

## 装完后的第一件事

打开一篇文档，点开察元AI助理选项卡跑一次拼写与语法检查，确认模型链路通畅；再到设置里过一遍写回动作默认值。

## 做完后的验证

- 重启 WPS 后文字端出现察元AI助理与察元AI编审两个选项卡
- 若没有生效，先完全退出宿主软件再重启一次

## 注意事项与真实边界

边界先摆在桌面上：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- macOS 安装器无完全磁盘访问权限会假成功
- Win7 与 Win8 的 MCP 二进制跑不了，需 Node 16 回落
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 高频疑问

### Windows 安装报「ERROR: cannot create %APPDATA%\kingsoft\wps\jsaddons」？

目标目录创建失败，多为主目录权限受限。查看日志 %TEMP%\chayuan-wps-install.log 定位，用有权限的账户重跑安装器。

### 装完了，WPS 里察元菜单还是旧版本？

先完全退出 WPS（macOS ⌘Q，Windows 退出所有 WPS 窗口）再重跑安装包——安装期间 WPS 运行会把插件注册表覆写回旧状态（macOS 安装器会检测并打印警告）。macOS 上若安装日志提示容器权限不足，按第 3 步「容器目录写不进去」修复。安装器本身已做替换式清理（装完只保留本次版本目录），正常覆盖安装即可升级。

### Windows 安装报「ERROR: failed to copy the MCP sidecar binary. A chayuan-mcp process may still be running」？

旧的本机文档服务进程仍占用文件锁。按报错提示结束进程（taskkill /F /IM chayuan-mcp-windows-x64.exe）后重跑安装器；安装器自身也会先停计划任务再尝试最多 3 次结束旧进程。

## 更多操作细节

第 1 步 · 下载安装包

在哪：官网 https://aidooo.com，或单位 / 团队内部分发的安装包目录。

v6.1.2 发布产物（release/ 目录清单）：

| 平台 | 文件名 | 说明 |
|---|---|---|
| Windows | `chayuan-6.1.2-windows-x64.exe` | 自解压安装器（SFX） |
| macOS（Apple Silicon） | `chayuan-6.1.2-macos-arm64.pkg` | 推荐，双击一键安装 |
| macOS（Intel） | `chayuan-6.1.2-macos-x64.pkg` | |
| macOS | `chayuan-6.1.2-macos-arm64.7z` | 离线压缩包，内含 `publish.xml` 与 `chayuan_6.1.2` 目录，手动部署用 |
| Linux / 麒麟 / UOS | `chayuan-6.1.2-linux-x64.deb`、`chayuan-6.1.2-linux-arm64.deb` | 国产化环境（飞腾 / 鲲鹏）选 `arm64` |

## 更多操作细节

第 2 步 · Windows 安装

1. 在哪：下载得到的 chayuan-6.1.2-windows-x64.exe。
2. 做什么：双击运行，弹出解压安装对话框后等待自动完成，无需点下一步。
3. 看到什么：安装器把加载项拷入 %APPDATA%\kingsoft\wps\jsaddons（chayuan_6.1.2 等三个宿主目录 + publish.xml），同时把本机文档服务释放到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime，并写入开机自启（注册表 ChayuanWpsMcp 启动项 + 每 2 分钟检查一次的计划任务 ChayuanWpsMcpWatch）。结束后弹出「Install OK. Please fully quit and restart WPS.」和安装日志路径（%TEMP%\chayuan-wps-install.log）。按提示完全退出并重启 WPS。

## 更多操作细节

第 3 步 · macOS 安装

1. 在哪：下载得到的 .pkg。
2. 做什么：建议先完全退出 WPS，再双击 chayuan-6.1.2-macos-arm64.pkg（Intel 机型用 x64 包）。若系统提示无法验证开发者，右键安装包 ＞「打开」＞ 确认（绕过 Gatekeeper；此为 macOS 系统行为，取自用户手册口径，产品代码不涉及）。
3. 看到什么：安装器自动把加载项装入沙盒版 WPS 容器目录 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons（另会尽力写一份到 ~/Library/Application Support/Kingsoft/wps/jsaddons 覆盖非沙盒布局），同步插件注册表（jsplugins.xml、authaddin.json），并把本机文档服务注册为 LaunchAgent（com.chayuan.mcp），装完轮询健康检查并把结果写进安装日志。
4. 两个注意事项（安装器会主动检测并提示）：
    1. 安装时 WPS 正在运行：安装日志会打印响亮警告——本次写入的插件注册会在 WPS 退出时被旧状态覆写（加载项仍显示旧版本）。按提示操作：① 完全退出 WPS（保存文档后 ⌘Q，或 pkill -x wpsoffice）＞ ② 重新运行本安装包 ＞ ③ 再打开 WPS。
    2. 容器目录写不进去（macOS 收紧权限后 Installer 无「完全磁盘访问权限」）：安装日志会提示「容器 jsaddons 安装失败（Operation not permitted）」，此时 WPS 仍会加载旧版。修复任选其一：① 系统设置 ＞ 隐私与安全性 ＞ 完全磁盘访问权限 ＞ 勾选「安装器」后重跑安装包；② 在有完全磁盘访问权限的终端执行 bash scripts/repair-mac-jsaddons-container.sh（该脚本支持 status 只读检查 / 默认修复 / rollback 回滚三种模式）。

## 更多操作细节

第 4 步 · Linux / 麒麟 / UOS 安装

```bash
sudo dpkg -i chayuan-6.1.2-linux-x64.deb
```

图形界面双击安装（软件中心 / GDebi）也支持——安装脚本会自动推断当前登录用户，避免只装进 root 家目录。

1. 在哪：终端。
2. 做什么：执行
3. 看到什么：安装脚本把加载项装入 ~/.local/share/Kingsoft/wps/jsaddons（同时写一份小写 kingsoft 路径，防止个别大小写敏感环境漏读），并做替换式清理（装完只剩本次版本目录）；若本机存在 WPS 专业版 office6 布局（/opt/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office-pro/files/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office/files/kingsoft/wps-office/office6），会同步装入对应 jsaddons 并更新 jsplugins.xml。随后重启 WPS；若未出现加载项，执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart（该命令属 WPS 专业版自带，见该路径下 bin；安装脚本执行完也会在终端打印这条提示）。

## 更多操作细节

第 5 步 · 手动排查：常见 jsaddons 位置速查

安装包已自动覆盖以下路径；手动排查 / 手动部署时对照：

目录内容形如：chayuan_<版本>（文字端）、chayuan-et_<版本>（表格端）、chayuan-wpp_<版本>（演示端）三个目录 + publish.xml。

| 平台 | 路径 |
|---|---|
| Windows | `%AppData%\Kingsoft\wps\jsaddons` |
| Linux | `~/.local/share/Kingsoft/wps/jsaddons` |
| 麒麟 / UOS 专业版 | `/opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons`（具体见上文三种 office6 布局） |
| macOS（沙盒版，常见） | `~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons` |
| macOS（非沙盒 / 旧布局） | `~/Library/Application Support/Kingsoft/wps/jsaddons` |

## 更多操作细节

第 6 步 ·（IT 管理员，可选）在线部署

把 wps-addon-build/ 目录内文件部署到 HTTPS 静态服务器，再在 WPS「开发工具 ＞ 加载项」中填入对应加载项 URL，即可集中更新、统一管理。

文档助手Windows安装能不能用好，一半看操作，一半看你认不认边界：macOS 安装器无完全磁盘访问权限会假成功。

---

察元AI文档助手，WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。官网 aidooo.com，数据截至 2026 年 10 月（版本 6.1.2）。
