---
title: "WPS插件安装怎么做？Windows 安装全流程一次讲清"
alt-titles: ["WPS插件安装｜察元文档助手干货合集","关于WPS插件安装，看这一篇就够（察元AI文档助手）"]
description: "WPS插件安装相关指南：察元AI文档助手（https://aidooo.com）。Windows 安装全流程。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS插件安装","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS插件安装"
channel: "CSDN/知乎/博客/公众号"
---
# WPS插件安装怎么做？Windows 安装全流程一次讲清

从下载到功能区出现两个页签的完整 Windows 安装路径，含一行命令懒人方案。本文以「Windows 安装全流程」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## Windows 安装步骤（自解压 exe（约 35MB，带 .sha256 校验文件））

系统要求：WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64。一行命令：在 PowerShell 中执行 README「一行命令安装」小节的命令即可免克隆安装

1. 从官网或 Gitee 镜像下载 chayuan-<版本>-windows-x64.exe 自解压包
2. 双击运行，安装器自动完成四步：复制加载项到 jsaddons 并写 publish.xml、注册 MCP 开机自启（注册表 HKCU\Run）、四级体检（jsaddons→/healthz→initialize→桥接工具）、向 Claude/Cursor/Codex 投放技能
3. 重启 WPS 文字，功能区出现「察元 AI 助理」「察元 AI 编审」两个页签即安装成功
4. 懒人方案：PowerShell 一行命令安装（WebClient 下载 + UTF8 执行），支持 -SkillOnly、-Version 参数

## 安装后怎么验证

1. 重启宿主程序，确认功能入口已出现（Windows 环境）
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。
- 任务栏出现黑色窗口或关闭窗口后 MCP 断连？——这是 4.1.2 之前版本的已知问题：sidecar 可见启动导致黑窗常驻、关窗即断连；升级到 4.1.2 及以上版本后 sidecar 改为隐藏启动，问题不复现。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- 匿名指标上报默认关闭（opt-in），不采集文档内容
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域

## 常见问题
### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

### 外部智能体怎么连接？

在支持 MCP 的客户端里添加服务地址 http://127.0.0.1:62588/mcp 即可；安装器会自动把使用技能投放到 Claude Code/Cursor/Codex 的技能目录。

### 支持哪些 WPS 版本？

WPS 文字 12.x 与 WPS 365（WebView2）桌面端；不支持网页版 WPS。


## 相关阅读

- [手动 jsaddons 安装（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-13-jsaddons.md)
- [MCP 不在线排查：MCP不在线完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-33-mcp.md)
- [jsplugins.xml怎么做？Linux jsplugins 问题一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-32-jsplugins-xml.md)
- [一文读懂表格批量处理（14 项）｜实操教程](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-26-table-batch.md)
- [涉密检查一文讲透：是什么、怎么用、边界在哪](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-c909f77f.md)
- [察元AI Office｜办公模板攻略：模板与字体的关键点拆解](../../chayuan-office/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-25-templates-2.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元文档助手，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS插件安装｜察元文档助手干货合集》《关于WPS插件安装，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
