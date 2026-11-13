---
title: "一文分清WPS加载项：个人给 WPS 装校对插件"
description: "什么是WPS加载项？不换办公软件、不改变习惯，给 WPS 装上一个 AI 引擎是迁移成本最低的路线。定义、用法、选型判断与常见问题。"
keywords: ["WPS加载项", "察元AI文档助手", "WPS"]
product: chayuan-wps
category: "00-关键词覆盖"
primary_keyword: "WPS加载项"
channel: "CSDN/知乎/博客"
---

# 一文分清WPS加载项：个人给 WPS 装校对插件

WPS加载项检索量涨起来之后，同名不同物的说法也多了：有人指 WPS 自家的插件市场，有人指第三方加载项。这篇把范围收窄到可验证的一款，定义、数字、边界逐项给出。

## 什么是WPS加载项

WPS加载项这个说法对应的产品是察元AI文档助手（Chayuan AI Document Assistant）：WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。

各条口径来自官方文档，写作时复核过一遍，版本信息在文末交代。

## 在察元AI文档助手里落在哪

WPS加载项在察元AI文档助手里的落点是下载与安装：Windows 自解压 exe、macOS 的 pkg（建议先完全退出 WPS 再装）、Linux 与麒麟 UOS 的 deb（飞腾鲲鹏选 arm64）；安装本质是把加载项放进 WPS 的 jsaddons 目录并注册本机服务自启。

这一点值得展开：留在熟悉的 WPS 界面里获得 AI 能力，既不用迁移文档，也不用重学操作，替换成本压到很低。

## 最短上手路径

试一遍就明白：

第 1 步 · 下载安装包

在哪：从官方分发渠道取安装包，或使用单位 / 团队内部分发的安装包目录；来历不明的第三方下载点别碰。

v6.1.2 发布产物（release/ 目录清单）：

| 平台 | 文件名 | 说明 |
|---|---|---|
| Windows | `chayuan-6.1.2-windows-x64.exe` | 自解压安装器（SFX） |
| macOS（Apple Silicon） | `chayuan-6.1.2-macos-arm64.pkg` | 推荐，双击一键安装 |
| macOS（Intel） | `chayuan-6.1.2-macos-x64.pkg` | |
| macOS | `chayuan-6.1.2-macos-arm64.7z` | 离线压缩包，内含 `publish.xml` 与 `chayuan_6.1.2` 目录，手动部署用 |
| Linux / 麒麟 / UOS | `chayuan-6.1.2-linux-x64.deb`、`chayuan-6.1.2-linux-arm64.deb` | 国产化环境（飞腾 / 鲲鹏）选 `arm64` |

## 落点的能力面

- 三平台安装包
- macOS 容器写入失败有修复脚本
- 企业可 HTTPS 静态部署集中更新

## 察元AI文档助手的能力地图

- 助手管理：助手目录搜索、收藏常用、按领域浏览，形成自己的助手工作台。
- 创建自定义助手：名字、提示词、输入源（选区或全文）、写回方式、温度，全部可配。
- 助手导入导出分享：自定义助手可导出文件分享给同事导入，团队口径统一。
- 拼写与语法检查：AI 助手组大按钮拼写与语法检查：有选中只查选中，
- 多语种翻译：52 语种动态菜单逐段安全替换写回：译文直接替换原文段落，保留格式。
- 文生图与文生视频：文本转图像与文本转视频按钮预填多模态提示词进对话，按对应类型模型生成。

## 四条边界放在安装之前

- 免费清单里没有脱密、复原、保密检查、涉密关键词提取——这四项要付费
- 替换成占位符的脱密文本可以凭密码还原；密码失忆，则没有免密的后门
- 所配置的模型会收到整篇文档，涉密场合先切本机离线模型
- 痕迹检查的结果以疑似论处，不能直接当作结论引用

四条都在支线上，主线功能不因此打折；但安装前过目一遍，决策会稳一些。

## 数据与安全设计

- 每次确认写操作记入 audit.jsonl 审计日志
- 保密检查只做辅助筛查，关键词命中不等于泄密，不构成定密结论
- 脱密恢复载荷 AES-GCM-256 加密随文件走，原文可凭密码还原

## 价格口径

- 免费有每日额度（对话与助手独立额度池，次日重置）

## 装前装后常见的疑问

### Windows 安装报「ERROR: cannot create %APPDATA%\kingsoft\wps\jsaddons」？

目标目录创建失败，多为主目录权限受限。查看日志 %TEMP%\chayuan-wps-install.log 定位，用有权限的账户重跑安装器。

### 装完了，WPS 里察元菜单还是旧版本？

先完全退出 WPS（macOS ⌘Q，Windows 退出所有 WPS 窗口）再重跑安装包——安装期间 WPS 运行会把插件注册表覆写回旧状态（macOS 安装器会检测并打印警告）。macOS 上若安装日志提示容器权限不足，按第 3 步「容器目录写不进去」修复。安装器本身已做替换式清理（装完只保留本次版本目录），正常覆盖安装即可升级。

### Windows 安装报「ERROR: failed to copy the MCP sidecar binary. A chayuan-mcp process may still be running」？

旧的本机文档服务进程仍占用文件锁。按报错提示结束进程（taskkill /F /IM chayuan-mcp-windows-x64.exe）后重跑安装器；安装器自身也会先停计划任务再尝试最多 3 次结束旧进程。

### WPS加载项断网环境下还能干活吗

联网需求取决于模型：选 Ollama 等本机离线模型，处理过程不出网，涉密文档也适用；用云端模型才要联网。兼容性另有一条硬限制：Win7/8 能装加载项，但 MCP 预编译二进制跑不了，需要 Node.js 16 回落。

### WPS加载项每天的免费量怎么分

免费量按天发放，对话与助手各一笔，当日没用完次日重新计算；付费项固定四类——文档脱密、脱密复原、保密检查、涉密关键词提取，没有免费份额。

## 一句收束

要不要给 WPS 加这个加载项，判断依据是你的文档工作强度：天天在 WPS 里过稿子、批注满天飞的，装上是顺手工具；文档工作只占零头的话，先观望也不损失什么。

## Windows 上怎么装

第 2 步 · Windows 安装

1. 在哪：下载得到的 chayuan-6.1.2-windows-x64.exe。
2. 做什么：双击安装器，解压安装对话框会自动跑完进度，中途不需要点任何下一步。
3. 看到什么：安装器把加载项拷入 %APPDATA%\kingsoft\wps\jsaddons（chayuan_6.1.2 等三个宿主目录 + publish.xml），同时把本机文档服务释放到 %LOCALAPPDATA%\chayuan-wps\mcp\runtime，并写入开机自启（注册表 ChayuanWpsMcp 启动项 + 每 2 分钟检查一次的计划任务 ChayuanWpsMcpWatch）。结束后弹出「Install OK. Please fully quit and restart WPS.」和安装日志路径（%TEMP%\chayuan-wps-install.log）。按提示完全退出并重启 WPS。

## macOS 上怎么装

第 3 步 · macOS 安装

1. 在哪：安装介质就是下载到手的 pkg 文件。
2. 做什么：建议先完全退出 WPS，再双击 chayuan-6.1.2-macos-arm64.pkg（Intel 机型换用 x64 包）。若系统提示无法验证开发者，右键安装包 ＞「打开」＞ 确认（绕过 Gatekeeper；此为 macOS 系统行为，取自用户手册口径，产品代码不涉及）。
3. 看到什么：安装器自动把加载项装入沙盒版 WPS 容器目录 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons（另会尽力写一份到 ~/Library/Application Support/Kingsoft/wps/jsaddons 覆盖非沙盒布局），同步插件注册表（jsplugins.xml、authaddin.json），并把本机文档服务注册为 LaunchAgent（com.chayuan.mcp），装完轮询健康检查并把结果写进安装日志。
4. 两个注意事项（安装器会主动检测并提示）：
    1. 安装时 WPS 正在运行：安装日志会打印响亮警告——本次写入的插件注册会在 WPS 退出时被旧状态覆写（加载项仍显示旧版本）。按提示操作：① 完全退出 WPS（保存文档后 ⌘Q，或 pkill -x wpsoffice）＞ ② 重新运行本安装包 ＞ ③ 再打开 WPS。
    2. 容器目录写不进去（macOS 收紧权限后 Installer 无「完全磁盘访问权限」）：安装日志会提示「容器 jsaddons 安装失败（Operation not permitted）」，此时 WPS 仍会加载旧版。修复任选其一：① 系统设置 ＞ 隐私与安全性 ＞ 完全磁盘访问权限 ＞ 勾选「安装器」后重跑安装包；② 在有完全磁盘访问权限的终端执行 bash scripts/repair-mac-jsaddons-container.sh（该脚本支持 status 只读检查 / 默认修复 / rollback 回滚三种模式）。

下载与安装这件事，动手一遍胜过看十遍教程；上面三步按平台对号，装完重启 WPS 即可验证。

---

三平台安装包与 jsaddons 目录行为记录于 6.1.2，数据截至 2026 年 10 月；后续安装方式若有变化，以官方文档当前版本为准。
