---
title: "7z 离线包安装（察元文档助手）"
alt-titles: ["离线安装WPS插件｜察元文档助手干货合集","关于离线安装WPS插件，看这一篇就够（察元AI文档助手）"]
description: "离线安装WPS插件相关指南：察元AI文档助手（https://aidooo.com）。7z 离线包安装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["离线安装WPS插件","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "离线安装WPS插件"
channel: "CSDN/知乎/博客/公众号"
---
# 7z 离线包安装（察元文档助手）

完全断网机器用 7z 离线包手动就位的步骤。本文以「7z 离线包安装」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Linux 为例）

完全断网机器用 7z 离线包手动就位的步骤

1. 下载 chayuan-<版本>-linux 对应架构的 deb/安装包
2. 运行安装脚本或按手动路径安装：~/.local/share/Kingsoft/wps/jsaddons；麒麟/UOS 专业版在 /opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons
3. MCP 服务通过 systemd --user（chayuan-mcp.service）注册自启
4. 重启 WPS（必要时终端执行 quickstartoffice restart），功能区出现察元页签

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。
- Windows PowerShell 5.1 执行一行命令中文乱码？——v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域
- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- 匿名指标上报默认关闭（opt-in），不采集文档内容

## 常见问题
### 双击安装包没反应？

常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。

### 察元AI文档助手是什么？

一款 WPS 文字智能加载项（jsaddons），在 WPS 内提供 AI 对话、校对审查、表单填报与正文写回，同时内置本机 MCP 文档智能体服务，可被 Claude Code、Codex、Cursor 等外部智能体调用，支持离线/内网模型。

### 对话报「模型未配置」或调用失败？

进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。


## 相关阅读

- [MCP黑窗怎么做？黑窗与断连问题一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-34-mcp.md)
- [便携技能包使用（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-12-wps.md)
- [WPS AI mac安装怎么做？macOS 脚本安装方式一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-3-wps-ai-mac.md)
- [免费版与付费功能边界（选型指南）](../05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-63c664b5-2.md)
- [安装后 WPS 功能区没有出现察元页签怎么办？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-26-wps.md)
- [察元AI Office｜写给汇报人的AI生成PPT指南：深度复盘](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-3-report-4.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《离线安装WPS插件｜察元文档助手干货合集》《关于离线安装WPS插件，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
