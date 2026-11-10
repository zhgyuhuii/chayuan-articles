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

文档助手Linux安装这件事，卡住人的通常是三步：入口在哪、要点哪些按钮、做完怎么确认。这篇按察元AI文档助手的真实界面顺序走一遍，先解决政企统一给 WPS 加 AI 能力。

## 安装前确认

- 系统要求：WPS Office 已安装；麒麟/UOS
- 安装包：linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64）
- 说明：deb 安装与 quickstartoffice。

安装包从官网 aidooo.com 获取。

## 完整操作步骤

1. sudo dpkg -i 安装 deb
2. 加载项进入 ~/.local/share/Kingsoft/wps/jsaddons
3. 选项卡没出现时执行 quickstartoffice restart
4. 重启 WPS 确认

## 其他平台装法速览

Windows：官网 aidooo.com 下载 exe；双击安装：加载项进入 WPS jsaddons 目录，本机服务自注册并带看门狗；完全退出并重启 WPS。

macOS：官网下载对应架构 pkg；完全退出 WPS 后安装（运行中安装会被旧注册覆写）；若提示容器写入失败，用官方 repair-mac-jsaddons-container.sh 脚本修复。

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | WPS Office 已安装 | chayuan-6.1.2-windows-x64.exe（自解压） |
| macOS | WPS Office 已安装；建议先完全退出 WPS | chayuan-6.1.2-macos-arm64.pkg / x64.pkg |
| Linux | WPS Office 已安装；麒麟/UOS | linux-x64.deb / linux-arm64.deb（飞腾/鲲鹏选 arm64） |

## 装完后的第一件事

第一件事是配模型：设置里选一家已购通道或本机 Ollama，点测试连接通过后，随便开一篇文档跑一次 AI 助手对话，通了再干正事。

## 如何确认操作生效

- 重启 WPS 后文字端出现察元AI助理与察元AI编审两个选项卡
- 若没有生效，先完全退出宿主软件再重启一次

## 几个容易忽略的细节

如实说明，它不是万能的：

- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- macOS 安装器无完全磁盘访问权限会假成功
- Win7 与 Win8 的 MCP 二进制跑不了，需 Node 16 回落
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道

## 常见问题

### Windows 7 / 8 怎么装？

加载项本体可正常装；本机文档服务用的预编译二进制在 Win7/8 无法运行，需先装 Node.js 16.x x64（14.18+ 亦可；Win7 需 SP1），安装器释放的 start-mcp.cmd 会先试二进制、探活失败自动回落 node server.mjs 运行。排查日志在 %LOCALAPPDATA%\chayuan-wps\mcp\runtime\sidecar-start.log。

### 麒麟 / UOS 用软件商店专业版，家目录装了还是不出现？

专业版 WPS 实际从 office6/jsaddons 加载。确认 deb 已装入（安装日志会打印 also copied to /opt/...），重启 WPS 后再执行 /opt/apps/cn.wps.wps-office-pro/files/bin/quickstartoffice restart；仍不行时手动检查第 5 步表格中专业版路径下有没有 chayuan_<版本> 目录。

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

## 更多操作细节

第 7 步 ·（可选）一体化安装：加载项 + MCP 服务 + 智能体技能

wps-skill-chayuan 便携包（release/ 下 wps-skill-chayuan-6.1.2-portable.zip / .7z）解压后按系统跑一条命令：

一次完成：加载项装入 jsaddons + MCP 服务开机自启 + 技能文件投放到已装的 Claude Code / Cursor / Codex，并跑四级自检。只要加载项不要智能体投放时加 --no-agent（-NoAgent）。

1. macOS / Linux：bash scripts/install-wps-skill-chayuan.sh
2. Windows：powershell -ExecutionPolicy Bypass -File scripts\install-wps-skill-chayuan.ps1

## 更多操作细节

验证

1. 完全退出并重启 WPS，打开 WPS 文字：功能区出现「察元AI助理」「察元AI编审」两个选项卡。
2. 文件层面：Windows 资源管理器打开 %AppData%\Kingsoft\wps\jsaddons，应看到 chayuan_6.1.2、chayuan-et_6.1.2、chayuan-wpp_6.1.2 目录与 publish.xml；macOS / Linux 打开上表对应路径同理。
3. Windows 可查看安装日志 %TEMP%\chayuan-wps-install.log，末尾应为 install ok。

## 动手前再核对一遍

- 本机已安装 WPS Office（文字 / 表格 / 演示任意端均可；三端使用同一套前端构建产物，差异只在安装路径与部署方式）。
- 本篇以 v6.1.2 发布产物为准；升级安装直接用新版安装包覆盖即可。

## 这几条能力放一起看更清楚

- 三平台安装包
- macOS 容器写入失败有修复脚本
- 企业可 HTTPS 静态部署集中更新

## 放回产品盘面看

把文档助手Linux安装放回察元AI文档助手的整体盘面：工具面按域聚合后好记好用，写确认纪律保证外部智能体不能悄悄改你的文档，免费有每日额度（对话与助手独立额度池、次日重置），本地数据落盘位置说明、帮助手册、在线客服与关于页；结果按助手定义的写回方式落进文档。

## 安全与数据边界

安全口径单独立一层：把重复劳动固化成自己的助手，一次配置长期复用，自定义助手可导出文件分享给同事导入，团队口径统一，好用的助手不该只有一个人受益；九种写回动作对照：替换、插入光标处、批注、仅生成、追加等，每个助手有默认动作，设置里可改。

## 平台与形态

平台与形态的账：WPS 三端智能加载项：校对、编审、核对、脱密，一个文档智能体，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域）；提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务。

## 价格与授权

价格口径一并交代：文档脱密、脱密复原、保密检查、涉密关键词提取四项为付费专属、零免费额度；结果按助手定义的写回方式落进文档，免费有每日额度（对话与助手独立额度池，次日重置），免费有每日额度（对话与助手独立额度池、次日重置）。

文档助手Linux安装能不能用好，一半看操作，一半看你认不认边界：macOS 安装器无完全磁盘访问权限会假成功。

---

察元AI文档助手（Chayuan AI Document Assistant）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 6.1.2），后续版本功能可能调整。
