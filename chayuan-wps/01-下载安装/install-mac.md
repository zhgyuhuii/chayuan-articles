---
title: "文档助手macOS安装安装：三平台安装包"
description: "文档助手macOS安装指南：察元AI文档助手按平台架构的安装步骤、验证方法与排错。"
keywords: ["文档助手macOS安装", "察元AI文档助手", "下载安装", "pkg"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "文档助手macOS安装"
channel: "CSDN/知乎/博客"
---

# 文档助手macOS安装安装：三平台安装包

这篇讲文档助手macOS安装。动手之前有一条边界得先摆出来：macOS 安装器在没有拿到完全磁盘访问权限时会假成功，看起来装完了，实际文件没落位。知道这条边界再用，后面的篇幅讲怎么把它装对、装完怎么确认。

## 先看清你的 Mac 是哪种芯片

- 系统要求：WPS Office 已安装；建议先完全退出 WPS
- 安装包：chayuan-6.1.2-macos-arm64.pkg / x64.pkg，两个包对应不同架构的 Mac，别装错

安装包从官方渠道获取；第三方镜像站来路不明，别图省事从那里拿。退出 WPS 这一条常被当成可选项，其实运行中安装会被旧注册覆写，等于白装一次；文件名里的 arm64 与 x64 分别对应 Apple Silicon 和 Intel 机器，打开「关于本机」看一眼芯片型号再决定下哪个。

## 下载与安装：四步把 pkg 装进 WPS

1. 从官方渠道下载对应架构的 pkg 安装包
2. 完全退出 WPS 后再点安装
3. 若提示容器写入失败，用官方 repair-mac-jsaddons-container.sh 脚本修复
4. 重启 WPS 确认选项卡出现

## 三个平台的安装包对照

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | WPS Office 已安装 | chayuan-6.1.2-windows-x64.exe（自解压） |
| macOS | WPS Office 已安装；建议先完全退出 WPS | chayuan-6.1.2-macos-arm64.pkg / x64.pkg |
| Linux | WPS Office 已安装；麒麟/UOS | linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64） |

## 装完先跑一次拼写检查

打开一篇文档，点开察元AI助理选项卡跑一次拼写与语法检查，确认模型链路通畅；再到设置里过一遍写回动作默认值。这两步都过了，安装才算真正闭环。

## 两个容易翻车的边界

- macOS 安装器无完全磁盘访问权限会假成功，这是 mac 这条线上最常见的坎
- Win7 与 Win8 的 MCP 二进制跑不了，需 Node 16 回落

第一条的表现很隐蔽：安装器报成功、进度条走完，重启 WPS 后选项卡却迟迟不出现，这时候该先查的是磁盘访问权限，而不是急着重装一遍。第二条则落在 MCP 服务的启动环节，具体的回落做法在上面的问答里展开过。

## 装不上时被问最多的两个问题

### 为什么 Win7/8 上加载项装得上、MCP 服务却起不来？

加载项本体可正常装；本机文档服务用的预编译二进制在 Win7/8 无法运行，需先装 Node.js 16.x x64（14.18+ 亦可；Win7 需 SP1），安装器释放的 start-mcp.cmd 会先试二进制、探活失败自动回落 node server.mjs 运行。排查日志在 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\sidecar-start.log。

### 麒麟 / UOS 装了 deb，专业版 WPS 里为什么还是找不到选项卡？

专业版 WPS 实际从 office6/jsaddons 加载。确认 deb 已装入（安装日志会打印 also copied to /opt/...），重启 WPS 后再执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart；仍不行时手动检查第 5 步表格中专业版路径下有没有 chayuan_<版本> 目录。

## Linux / 麒麟 / UOS：deb 包的装法

```bash
sudo dpkg -i chayuan-6.1.2-linux-x64.deb
```

图形界面双击安装（软件中心 / GDebi）也支持——安装脚本会自动推断当前登录用户，避免只装进 root 家目录。

命令跑完后，安装脚本会把加载项装入 ~/.local/share/Kingsoft/wps/jsaddons（同时写一份小写 kingsoft 路径，防止个别大小写敏感环境漏读），并做替换式清理（装完只剩本次版本目录）；若本机存在 WPS 专业版 office6 布局（/opt/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office-pro/files/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office/files/kingsoft/wps-office/office6），会同步装入对应 jsaddons 并更新 jsplugins.xml。随后重启 WPS；若未出现加载项，执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart（该命令属 WPS 专业版自带，见该路径下 bin；安装脚本执行完也会在终端打印这条提示）。

## 手动排查：常见 jsaddons 位置速查

安装包已自动覆盖以下路径；手动排查 / 手动部署时对照：

目录内容形如：chayuan_<版本>（文字端）、chayuan-et_<版本>（表格端）、chayuan-wpp_<版本>（演示端）三个目录 + publish.xml。

| 平台 | 路径 |
|---|---|
| Windows | `%AppData%\Kingsoft\wps\jsaddons` |
| Linux | `~/.local/share/Kingsoft/wps/jsaddons` |
| 麒麟 / UOS 专业版 | `/opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons`（具体见上文三种 office6 布局） |
| macOS（沙盒版，常见） | `~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons` |
| macOS（非沙盒 / 旧布局） | `~/Library/Application Support/Kingsoft/wps/jsaddons` |

## IT 管理员可选：HTTPS 静态部署

把 wps-addon-build/ 目录内文件部署到 HTTPS 静态服务器，再在 WPS「开发工具 ＞ 加载项」中填入对应加载项 URL，即可集中更新、统一管理。

## 可选：一体化安装加载项与服务

wps-skill-chayuan 便携包（release/ 下 wps-skill-chayuan-6.1.2-portable.zip / .7z）解压后按系统跑一条命令：

一次完成：加载项装入 jsaddons + MCP 服务开机自启 + 技能文件投放到已装的 Claude Code / Cursor / Codex，并跑四级自检。只要加载项不要智能体投放时加 --no-agent（-NoAgent）。

1. macOS / Linux：bash scripts/install-wps-skill-chayuan.sh
2. Windows：powershell -ExecutionPolicy Bypass -File scripts\install-wps-skill-chayuan.ps1

## 安装验证：三步确认

1. 完全退出并重启 WPS，打开 WPS 文字：功能区出现「察元AI助理」「察元AI编审」两个选项卡。
2. 文件层面：Windows 资源管理器打开 %AppData%\Kingsoft\wps\jsaddons，应看到 chayuan_6.1.2、chayuan-et_6.1.2、chayuan-wpp_6.1.2 目录与 publish.xml；macOS / Linux 打开上表对应路径同理。
3. Windows 可查看安装日志 %TEMP%\chayuan-wps-install.log，末尾应为 install ok。

## 点安装按钮前的最后两道检查

- 本机已安装 WPS Office（文字 / 表格 / 演示任意端均可；三端使用同一套前端构建产物，差异只在安装路径与部署方式）。
- 本篇以 v6.1.2 发布产物为准；升级安装直接用新版安装包覆盖即可。

## 这套 mac 安装方案里值得记住的三件事

- 三平台安装包
- macOS 容器写入失败有修复脚本
- 企业可 HTTPS 静态部署集中更新

## 装完之后，数据往哪走

这套加载项把「优先支持离线内网模型」当成立场：涉密文档不出网也能用 AI；模型这块支持 Ollama 一键装。同时要留意一点：交给 AI 处理时，整篇文档的内容都会传给你配置的那个模型，mac 上处理敏感稿件之前，先在设置里换到本机离线模型更稳妥。

## 助手分享与写回动作

自定义助手可导出文件分享给同事导入，团队口径统一；好用的助手不该只有一个人受益。写回动作共九种：替换、插入光标处、批注、仅生成、追加等，每个助手有默认动作，设置里可改。AI 结果怎么落到文档里决定了信任度：批注式让你过目，替换式提效率。

装 mac 版时抓住主线就行：选对架构的 pkg、退出 WPS 再装、装完看选项卡。路径类的问题不用背，装完如果哪里对不上，直接翻「手动排查」那张表按系统找对应位置。

---

文中安装包名与路径对应 6.1.2 发布产物，整理时以官方文档逐条核对过，数据截至 2026 年 10 月；后续版本若调整安装逻辑，以官方发布说明为准。
