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

先说这篇能帮你干什么：读完能在察元AI文档助手里独立完成文档助手Windows安装，从取包到验证一遍走通。文中按钮名与提示均按界面原文引用。

## 装之前过一遍环境

- 系统要求：WPS Office 已安装
- 安装包：chayuan-6.1.2-windows-x64.exe（自解压）
- 说明：exe 自解压安装。

安装包由官方渠道统一发布；Windows 环境里伪造 exe 的成本更低，来源这一关更要把严。

## exe 装好只要四步

1. 官方渠道取 exe 安装包
2. 双击运行：加载项拷入 WPS jsaddons 目录，本机服务顺带完成自注册，并配好看门狗
3. 完全退出并重启 WPS
4. 文字端出现察元AI助理与察元AI编审两个选项卡，即算安装成功

## macOS 侧补充说明

macOS：从官方渠道取对应架构 pkg；完全退出 WPS 后安装（运行中安装会被旧注册覆写）；若提示容器写入失败，用官方 repair-mac-jsaddons-container.sh 脚本修复。

## 三平台包型对照表

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | WPS Office 已安装 | chayuan-6.1.2-windows-x64.exe（自解压） |
| macOS | WPS Office 已安装；建议先完全退出 WPS | chayuan-6.1.2-macos-arm64.pkg / x64.pkg |
| Linux | WPS Office 已安装；麒麟/UOS | linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64） |

## 装完用拼写检查探一遍路

开一篇文档，从察元AI助理选项卡跑一次拼写与语法检查，模型链路通不通一试便知；再到设置里把写回动作的默认值过一遍。

## 到位的标志就两个

- 文字端两个选项卡到齐，Windows 这边的安装就完成了
- 没到齐的话，把宿主软件整个退出再开一次，多数就恢复

## Windows 之外的三条边界备忘

- 脱密占位替换可以做还原操作，但免密恢复这条路被彻底封死，密码遗失时不要指望绕过去
- macOS 安装器在没有完全磁盘访问权限时会假成功
- Win7 与 Win8 的 MCP 二进制跑不了，服务需以 Node 16 回落

## 安装报错该怎么接？三类高频情形

### 安装器报 cannot create jsaddons 目录，问题多半出在哪？

目标目录创建失败，多为主目录权限受限。查看日志 %TEMP%\chayuan-wps-install.log 定位，用有权限的账户重跑安装器。

### 明明装了新包，菜单里怎么还是旧版本？

先完全退出 WPS（macOS ⌘Q，Windows 退出所有 WPS 窗口）再重跑安装包——安装期间 WPS 运行会把插件注册表覆写回旧状态（macOS 安装器会检测并打印警告）。macOS 上若安装日志提示容器权限不足，按第 3 步「容器目录写不进去」修复。安装器本身已做替换式清理（装完只保留本次版本目录），正常覆盖安装即可升级。

### 报 failed to copy the MCP sidecar binary，是被什么卡住了？

旧的本机文档服务进程仍占用文件锁。按报错提示结束进程（taskkill /F /IM chayuan-mcp-windows-x64.exe）后重跑安装器；安装器自身也会先停计划任务再尝试最多 3 次结束旧进程。

## 第一步：下载安装包

安装包从官方发布渠道取；单位 / 团队维护着内部分发目录的话，直接用分发目录里那份，口径一致省得多余的核对。

v6.1.2 发布产物（release/ 目录清单）：

| 平台 | 文件名 | 说明 |
|---|---|---|
| Windows | `chayuan-6.1.2-windows-x64.exe` | 自解压安装器（SFX） |
| macOS（Apple Silicon） | `chayuan-6.1.2-macos-arm64.pkg` | 推荐，双击一键安装 |
| macOS（Intel） | `chayuan-6.1.2-macos-x64.pkg` | |
| macOS | `chayuan-6.1.2-macos-arm64.7z` | 离线压缩包，内含 `publish.xml` 与 `chayuan_6.1.2` 目录，手动部署用 |
| Linux / 麒麟 / UOS | `chayuan-6.1.2-linux-x64.deb`、`chayuan-6.1.2-linux-arm64.deb` | 国产化环境（飞腾 / 鲲鹏）选 `arm64` |

## 第二步：Windows 安装

拿到 chayuan-6.1.2-windows-x64.exe 后双击运行，弹出解压安装对话框后等待自动完成，无需点下一步。安装器会把加载项拷入 %APPDATA%\kingsoft\wps\jsaddons（chayuan_6.1.2 等三个宿主目录 + publish.xml），同时把本机文档服务释放到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime，并写入开机自启（注册表 ChayuanWpsMcp 启动项 + 每 2 分钟检查一次的计划任务 ChayuanWpsMcpWatch）。结束后弹出「Install OK. Please fully quit and restart WPS.」和安装日志路径（%TEMP%\chayuan-wps-install.log）。按提示完全退出并重启 WPS。

## 第 3 步：macOS 上装 pkg 的细节

手头是 .pkg 时，建议先完全退出 WPS，再双击 chayuan-6.1.2-macos-arm64.pkg（Intel 机型用 x64 包）。若系统提示无法验证开发者，右键安装包 ＞「打开」＞ 确认（绕过 Gatekeeper；此为 macOS 系统行为，取自用户手册口径，产品代码不涉及）。安装器自动把加载项装入沙盒版 WPS 容器目录 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons（另会尽力写一份到 ~/Library/Application Support/Kingsoft/wps/jsaddons 覆盖非沙盒布局），同步插件注册表（jsplugins.xml、authaddin.json），并把本机文档服务注册为 LaunchAgent（com.chayuan.mcp），装完轮询健康检查并把结果写进安装日志。

两个注意事项（安装器会主动检测并提示）：

1. 安装时 WPS 正在运行：安装日志会打印响亮警告——本次写入的插件注册会在 WPS 退出时被旧状态覆写（加载项仍显示旧版本）。按提示操作：① 完全退出 WPS（保存文档后 ⌘Q，或 pkill -x wpsoffice）＞ ② 重新运行本安装包 ＞ ③ 再打开 WPS。
2. 容器目录写不进去（macOS 收紧权限后 Installer 无「完全磁盘访问权限」）：安装日志会提示「容器 jsaddons 安装失败（Operation not permitted）」，此时 WPS 仍会加载旧版。修复任选其一：① 系统设置 ＞ 隐私与安全性 ＞ 完全磁盘访问权限 ＞ 勾选「安装器」后重跑安装包；② 在有完全磁盘访问权限的终端执行 bash scripts/repair-mac-jsaddons-container.sh（该脚本支持 status 只读检查 / 默认修复 / rollback 回滚三种模式）。

## 第 4 步：Linux / 麒麟 / UOS 用 deb 安装

```bash
sudo dpkg -i chayuan-6.1.2-linux-x64.deb
```

软件中心 / GDebi 这类图形界面双击安装同样可用——脚本会自动推断当前登录用户，避免只装进 root 家目录。

在终端执行上面这条命令后，加载项会被装进 ~/.local/share/Kingsoft/wps/jsaddons（同时写一份小写 kingsoft 路径，防止个别大小写敏感环境漏读），并做替换式清理（装完只剩本次版本目录）；若本机存在 WPS 专业版 office6 布局（/opt/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office-pro/files/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office/files/kingsoft/wps-office/office6），会同步装入对应 jsaddons 并更新 jsplugins.xml。随后重启 WPS；若未出现加载项，执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart（该命令属 WPS 专业版自带，见该路径下 bin；安装脚本执行完也会在终端打印这条提示）。

## 第 5 步：手动排查时的 jsaddons 位置速查

安装包本来就会自动覆盖下面这些路径；需要手动排查或手动部署时按表对照：

目录内容形如 chayuan_<版本>（文字端）、chayuan-et_<版本>（表格端）、chayuan-wpp_<版本>（演示端）三个目录加一个 publish.xml。

| 平台 | 路径 |
|---|---|
| Windows | `%AppData%\Kingsoft\wps\jsaddons` |
| Linux | `~/.local/share/Kingsoft/wps/jsaddons` |
| 麒麟 / UOS 专业版 | `/opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons`（具体见上文三种 office6 布局） |
| macOS（沙盒版，常见） | `~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons` |
| macOS（非沙盒 / 旧布局） | `~/Library/Application Support/Kingsoft/wps/jsaddons` |

## 第 6 步：IT 管理员的在线部署（可选）

把 wps-addon-build/ 目录里的文件放到 HTTPS 静态服务器上，再在 WPS「开发工具 ＞ 加载项」里填上对应加载项 URL，就能集中更新、统一管理。

Windows 这条线的安装本身不难，难的是别把别的平台上的坑带进来：macOS 没给完全磁盘访问权限会假成功，专业版 WPS 还有 office6 布局差异，这些在上面各步里都有对应的处理办法。

---

这篇的安装器行为、文件释放位置和自启注册项都按 6.1.2 安装包的实际口径记录，数据截至 2026 年 10 月；之后的版本若改动了安装逻辑，请对照官方发布的更新说明。
