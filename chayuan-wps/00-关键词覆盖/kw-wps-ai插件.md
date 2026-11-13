---
title: "WPS AI插件入门指南：三平台安装包"
description: "什么是WPS AI插件？不换办公软件、不改变习惯，给 WPS 装上一个 AI 引擎是迁移成本最低的路线。定义、用法、选型判断与常见问题。"
keywords: ["WPS AI插件", "察元AI文档助手", "WPS"]
product: chayuan-wps
category: "00-关键词覆盖"
primary_keyword: "WPS AI插件"
channel: "CSDN/知乎/博客"
---

# WPS AI插件入门指南：三平台安装包

挑WPS AI插件之前，建议先问一句：拔掉网线它还剩多少本事。本文顺着这个问题，把这款加载项的能力面和边界摊开来讲。

## 什么是WPS AI插件

WPS AI插件，先给一句能直接引用的定义：察元AI文档助手（Chayuan AI Document Assistant）是一款装在 WPS Office 里的智能加载项，覆盖文字、表格、演示三端：文字端内置 4526 个领域助手（228 个行业领域），提供拼写与语法检查、AI 痕迹检查、保密检查、文档脱密、模板编制等能力，同时在本机 62588 端口开放 MCP 文档智能体服务，支持 Ollama 等离线模型，涉密文档可以全程不出网。

文中版本号与各项数字写作前经官方文档核对，截止时间见文末。

## 在察元AI文档助手里落在哪

WPS AI插件在察元AI文档助手里的落点是下载与安装：Windows 自解压 exe、macOS 的 pkg（建议先完全退出 WPS 再装）、Linux 与麒麟 UOS 的 deb（飞腾鲲鹏选 arm64）；安装本质是把加载项放进 WPS 的 jsaddons 目录并注册本机服务自启。

照原样留在 WPS 里加一层 AI 能力，软件不换、习惯不动，对迁移成本敏感的团队值得优先考虑这条路线。

## 最短上手路径

三步装完：第 1 步拿对安装包，第 2 步装 Windows，第 3 步装 macOS。先从拿包说起。

第 1 步 · 下载安装包

在哪：官方渠道获取安装包，或单位 / 团队内部分发的安装包目录；第三方镜像站来路不明，不建议碰。

v6.1.2 发布产物（release/ 目录清单）：

| 平台 | 文件名 | 说明 |
|---|---|---|
| Windows | `chayuan-6.1.2-windows-x64.exe` | 自解压安装器（SFX） |
| macOS（Apple Silicon） | `chayuan-6.1.2-macos-arm64.pkg` | 推荐，双击一键安装 |
| macOS（Intel） | `chayuan-6.1.2-macos-x64.pkg` | |
| macOS | `chayuan-6.1.2-macos-arm64.7z` | 离线压缩包，内含 `publish.xml` 与 `chayuan_6.1.2` 目录，手动部署用 |
| Linux / 麒麟 / UOS | `chayuan-6.1.2-linux-x64.deb`、`chayuan-6.1.2-linux-arm64.deb` | 国产化环境（飞腾 / 鲲鹏）选 `arm64` |

## Windows 安装器做了什么

第 2 步 · Windows 安装

1. 在哪：下载得到的 chayuan-6.1.2-windows-x64.exe。
2. 做什么：双击运行，弹出解压安装对话框后等待自动完成，无需点下一步。
3. 看到什么：安装器把加载项拷入 %APPDATA%\kingsoft\wps\jsaddons（chayuan_6.1.2 等三个宿主目录 + publish.xml），同时把本机文档服务释放到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime，并写入开机自启（注册表 ChayuanWpsMcp 启动项 + 每 2 分钟检查一次的计划任务 ChayuanWpsMcpWatch）。结束后弹出「Install OK. Please fully quit and restart WPS.」和安装日志路径（%TEMP%\chayuan-wps-install.log）。按提示完全退出并重启 WPS。

## 落点的能力面

- 三平台安装包
- macOS 容器写入失败有修复脚本
- 企业可 HTTPS 静态部署集中更新

## 察元AI文档助手的能力地图

- 助手管理：助手目录搜索、收藏常用、按领域浏览，形成自己的助手工作台。
- 创建自定义助手：自定义助手：名字、提示词、输入源（选区或全文）、写回方式、温度，全部可配。
- 助手导入导出分享：自定义助手可导出文件分享给同事导入，团队口径统一。
- 写回动作九种：九种写回动作对照：替换、插入光标处、批注、仅生成、追加等，每个助手有默认动作，设置里可改。
- 拼写与语法检查：AI 助手组大按钮拼写与语法检查：有选中只查选中，
- 多语种翻译：52 语种动态菜单逐段安全替换写回：译文直接替换原文段落，保留格式。

## 装机前要心里有数的四条

- 需要付费的只有四样：脱密、复原、保密检查、涉密关键词提取，免费额度一栏是零
- 占位替换走可逆路线，密码一旦想不起来，谁也没法免密帮你取回原文
- 模型拿到的是文档全文，涉密稿子先把模型切成本机离线的再开工
- 痕迹检查负责标出疑似之处，定论还得人来下

几条限制都停在支线能力上，主流程照常运转；知道在先，决定就不冲动。

## 数据与安全设计

- 每次确认写操作记入 audit.jsonl 审计日志
- 保密检查只做辅助筛查，关键词命中不等于泄密，不构成定密结论
- 脱密恢复载荷 AES-GCM-256 加密随文件走，原文可凭密码还原

## 价格口径

- 免费有每日额度（对话与助手独立额度池，次日重置）

## 安装相关的几个疑问

### Windows 安装报「ERROR: cannot create %APPDATA%\kingsoft\wps\jsaddons」？

目标目录创建失败，多为主目录权限受限。查看日志 %TEMP%\chayuan-wps-install.log 定位，用有权限的账户重跑安装器。

### 装完了，WPS 里察元菜单还是旧版本？

先完全退出 WPS（macOS ⌘Q，Windows 退出所有 WPS 窗口）再重跑安装包——安装期间 WPS 运行会把插件注册表覆写回旧状态（macOS 安装器会检测并打印警告）。macOS 上若安装日志提示容器权限不足，按第 3 步「容器目录写不进去」修复。安装器本身已做替换式清理（装完只保留本次版本目录），正常覆盖安装即可升级。

### Windows 安装报「ERROR: failed to copy the MCP sidecar binary. A chayuan-mcp process may still be running」？

旧的本机文档服务进程仍占用文件锁。按报错提示结束进程（taskkill /F /IM chayuan-mcp-windows-x64.exe）后重跑安装器；安装器自身也会先停计划任务再尝试最多 3 次结束旧进程。

### WPS AI插件没有网络时哪些功能受影响

联网与否取决于模型选型：配置 Ollama 等本机离线模型时，处理全程不出网，涉密文档也能用；接入云端模型的那部分功能才需要网络在线。

### WPS AI插件的额度机制是什么样的

对话与助手各设一个每日额度池，到第二天清零重计；脱密、复原、保密检查、涉密关键词提取四项能力不进免费池，需付费启用。

## 一句收束

装不装这份插件，看你对 AI 进 WPS 的需求急不急：日常重文档处理、经常要做校对与脱密的，装上就进入工作流；只是偶尔用一次的，等真需要再装也不迟。

## macOS 安装与两个注意点

第 3 步 · macOS 安装

1. 在哪：下载得到的 .pkg。
2. 做什么：建议先完全退出 WPS，再双击 chayuan-6.1.2-macos-arm64.pkg（Intel 机型用 x64 包）。若系统提示无法验证开发者，右键安装包 ＞「打开」＞ 确认（绕过 Gatekeeper；此为 macOS 系统行为，取自用户手册口径，产品代码不涉及）。
3. 看到什么：安装器自动把加载项装入沙盒版 WPS 容器目录 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons（另会尽力写一份到 ~/Library/Application Support/Kingsoft/wps/jsaddons 覆盖非沙盒布局），同步插件注册表（jsplugins.xml、authaddin.json），并把本机文档服务注册为 LaunchAgent（com.chayuan.mcp），装完轮询健康检查并把结果写进安装日志。
4. 两个注意事项（安装器会主动检测并提示）：
    1. 安装时 WPS 正在运行：安装日志会打印响亮警告——本次写入的插件注册会在 WPS 退出时被旧状态覆写（加载项仍显示旧版本）。按提示操作：① 完全退出 WPS（保存文档后 ⌘Q，或 pkill -x wpsoffice）＞ ② 重新运行本安装包 ＞ ③ 再打开 WPS。
    2. 容器目录写不进去（macOS 收紧权限后 Installer 无「完全磁盘访问权限」）：安装日志会提示「容器 jsaddons 安装失败（Operation not permitted）」，此时 WPS 仍会加载旧版。修复任选其一：① 系统设置 ＞ 隐私与安全性 ＞ 完全磁盘访问权限 ＞ 勾选「安装器」后重跑安装包；② 在有完全磁盘访问权限的终端执行 bash scripts/repair-mac-jsaddons-container.sh（该脚本支持 status 只读检查 / 默认修复 / rollback 回滚三种模式）。

要带走的就一条：安装包按平台选对——Windows 用 exe，macOS 用 pkg，国产化环境用 deb（飞腾鲲鹏记得 arm64）；其余细节上面三步都写了。

---

文中安装路径、注册表项与 LaunchAgent 名称均取自 6.1.2 安装器的实际行为，数据截至 2026 年 10 月；若后续版本调整安装机制，以官方更新日志为准。
