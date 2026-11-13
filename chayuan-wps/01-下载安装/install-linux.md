---
title: "文档助手Linux安装：三平台安装包"
description: "文档助手Linux安装指南：察元AI文档助手按平台架构的安装步骤、验证方法与排错。"
keywords: ["文档助手Linux安装", "察元AI文档助手", "下载安装", "deb", "麒麟"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "文档助手Linux安装"
channel: "CSDN/知乎/博客"
---

# 文档助手Linux安装：三平台安装包

文档助手Linux安装这件事，卡住人的通常是三步：入口在哪、要点哪些按钮、做完怎么确认。这篇按察元AI文档助手的真实界面顺序走一遍，先解决政企统一给 WPS 加 AI 能力。三平台的包各管各的架构，下错架构是第一大坑。

## 安装前确认

- 系统要求：WPS Office 已安装；麒麟/UOS
- 安装包：linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64）
- 说明：deb 安装与 quickstartoffice。

安装包一律从官方渠道拿，第三方镜像的包不装、不测。

## 完整操作步骤

1. sudo dpkg -i 安装 deb
2. 加载项进入 ~/.local/share/Kingsoft/wps/jsaddons
3. 选项卡没出现时执行 quickstartoffice restart
4. 重启 WPS 确认

## 其他平台装法速览

Windows：从官方渠道下载 exe；双击安装：加载项进入 WPS jsaddons 目录，本机服务自注册并带看门狗；完全退出并重启 WPS。

macOS：官方渠道下载对应架构 pkg；完全退出 WPS 后安装（运行中安装会被旧注册覆写）；若提示容器写入失败，用官方 repair-mac-jsaddons-container.sh 脚本修复。

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | WPS Office 已安装 | chayuan-6.1.2-windows-x64.exe（自解压） |
| macOS | WPS Office 已安装；建议先完全退出 WPS | chayuan-6.1.2-macos-arm64.pkg / x64.pkg |
| Linux | WPS Office 已安装；麒麟/UOS | linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64） |

## 装完后的第一件事

第一件事是配模型：设置里选一家已购通道或本机 Ollama，点测试连接通过后，随便开一篇文档跑一次 AI 助手对话，通了再干正事。模型配错是新手最常见的卡点：测试连接不过，先核对 API Key 与服务地址；本机 Ollama 则确认服务本身已启动。

## 如何确认操作生效

- 重启 WPS 后文字端出现察元AI助理与察元AI编审两个选项卡
- 若没有生效，先完全退出宿主软件再重启一次

## 装好也不等于万事大吉

装好只是起点，下面两条是真实会绊人的地方：

- macOS 安装时若没给完全磁盘访问权限，可能显示装好实际没装上（假成功），用修复脚本兜底
- 占位替换设计上可逆，可逆的前提是密码还在；密码忘了就是忘了，没有免密通道

## 常见问题

### Windows 7 / 8 怎么装？

加载项本体可正常装；本机文档服务用的预编译二进制在 Win7/8 无法运行，需先装 Node.js 16.x x64（14.18+ 亦可；Win7 需 SP1），安装器释放的 start-mcp.cmd 会先试二进制、探活失败自动回落 node server.mjs 运行。排查日志在 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\sidecar-start.log。

### 麒麟 / UOS 用软件商店专业版，家目录装了还是不出现？

专业版 WPS 实际从 office6/jsaddons 加载。确认 deb 已装入（安装日志会打印 also copied to /opt/...），重启 WPS 后再执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart；仍不行时手动检查第 5 步表格中专业版路径下有没有 chayuan_<版本> 目录。

## 第 4 步 · Linux / 麒麟 / UOS 安装

```bash
sudo dpkg -i chayuan-6.1.2-linux-x64.deb
```

图形界面双击安装（软件中心 / GDebi）也支持——安装脚本会自动推断当前登录用户，避免只装进 root 家目录。

1. 在哪：终端。
2. 做什么：执行
3. 看到什么：安装脚本把加载项装入 ~/.local/share/Kingsoft/wps/jsaddons（同时写一份小写 kingsoft 路径，防止个别大小写敏感环境漏读），并做替换式清理（装完只剩本次版本目录）；若本机存在 WPS 专业版 office6 布局（/opt/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office-pro/files/kingsoft/wps-office/office6、/opt/apps/cn.wps.wps-office/files/kingsoft/wps-office/office6），会同步装入对应 jsaddons 并更新 jsplugins.xml。随后重启 WPS；若未出现加载项，执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart（该命令属 WPS 专业版自带，见该路径下 bin；安装脚本执行完也会在终端打印这条提示）。

## 第 5 步 · 手动排查：常见 jsaddons 位置速查

安装包已自动覆盖以下路径；手动排查 / 手动部署时对照：

目录内容形如：chayuan_<版本>（文字端）、chayuan-et_<版本>（表格端）、chayuan-wpp_<版本>（演示端）三个目录 + publish.xml。手动部署时别只拷文字端的目录，三个端的目录缺一不可，publish.xml 也要在位——少了哪样，对应端的选项卡就出不来。

| 平台 | 路径 |
|---|---|
| Windows | `%AppData%\Kingsoft\wps\jsaddons` |
| Linux | `~/.local/share/Kingsoft/wps/jsaddons` |
| 麒麟 / UOS 专业版 | `/opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons`（具体见上文三种 office6 布局） |
| macOS（沙盒版，常见） | `~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons` |
| macOS（非沙盒 / 旧布局） | `~/Library/Application Support/Kingsoft/wps/jsaddons` |

## 第 6 步 ·（IT 管理员，可选）在线部署

把 wps-addon-build/ 目录内文件部署到 HTTPS 静态服务器，再在 WPS「开发工具 ＞ 加载项」中填入对应加载项 URL，即可集中更新、统一管理。这种方式适合统一管控版本的场景：服务器上换一次包，全单位的 WPS 下次启动就拿到新版。

## 第 7 步 ·（可选）一体化安装：加载项 + MCP 服务 + 智能体技能

wps-skill-chayuan 便携包（release/ 下 wps-skill-chayuan-6.1.2-portable.zip / .7z）解压后按系统跑一条命令：

一次完成：加载项装入 jsaddons + MCP 服务开机自启 + 技能文件投放到已装的 Claude Code / Cursor / Codex，并跑四级自检。四级自检逐项过一遍，全绿才算装利索；只要加载项、不要智能体投放的机器记得加 --no-agent（-NoAgent）。

1. macOS / Linux：bash scripts/install-wps-skill-chayuan.sh
2. Windows：powershell -ExecutionPolicy Bypass -File scripts\install-wps-skill-chayuan.ps1

## 第 8 步 · 三端与文件层面验证

1. 完全退出并重启 WPS，打开 WPS 文字：功能区出现「察元AI助理」「察元AI编审」两个选项卡。
2. 文件层面：Windows 资源管理器打开 %AppData%\Kingsoft\wps\jsaddons，应看到 chayuan_6.1.2、chayuan-et_6.1.2、chayuan-wpp_6.1.2 目录与 publish.xml；macOS / Linux 打开上表对应路径同理。
3. Windows 可查看安装日志 %TEMP%\chayuan-wps-install.log，末尾应为 install ok。

三条验证各自独立：选项卡看前端，目录看落盘，日志看安装器——哪条不过就查哪条。

## 开工前的两条核对

- 本机已安装 WPS Office（文字 / 表格 / 演示任意端均可；三端使用同一套前端构建产物，差异只在安装路径与部署方式）。
- 本篇以 v6.1.2 发布产物为准；升级安装直接用新版安装包覆盖即可。
- 麒麟/UOS 专业版与社区版的加载路径不同，先确认自己装的是哪一版，再对号入座看第 5 步的表格。

## 装完之后有什么可用

装好的不只是几个按钮：工具面按域聚合后好记好用；外部智能体想改你的文档，写确认纪律这一关绕不过去；本地数据落盘位置、帮助手册与关于页都在，遇到疑问先翻手册。结果按助手定义的写回方式落进文档。

## 写回动作与自定义助手

九种写回动作对照：替换、插入光标处、批注、仅生成、追加等，每个助手有默认动作，设置里可改。想把团队习惯固化下来，就走自定义助手那套：配置一次，导出文件发给同事导入，全组的口径就统一了。批量部署前先在一台机器上把默认动作调顺，再打镜像，能省掉后面逐台调整的麻烦。

## 装完别急着用

deb 装完如果选项卡迟迟不来，先彻底退出 WPS 再重启，再考虑 quickstartoffice restart——顺序别反。装完别急着开工，先把第 8 步的验证清单过一遍，三端都亮了选项卡再进入日常使用。

---

以上安装口径对应 2026 年 10 月发布的 6.1.2 版产物，数据截至当月；路径与脚本若随版本调整，以官方文档为准。
