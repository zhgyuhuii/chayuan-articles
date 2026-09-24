---
title: "Windows 一行命令安装详解（察元文档助手）"
alt-titles: ["WPS加载项一键安装｜察元文档助手上手笔记","关于WPS加载项一键安装，看这一篇就够（察元AI文档助手）"]
description: "WPS加载项一键安装相关指南：察元AI文档助手（https://aidooo.com）。Windows 一行命令安装详解。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS加载项一键安装","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS加载项一键安装"
channel: "CSDN/知乎/博客/公众号"
---
# Windows 一行命令安装详解（察元文档助手）

PowerShell 一条命令完成下载、安装、自启注册、体检、技能投放五件事。本文以「Windows 一行命令安装详解」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 macOS 为例）

PowerShell 一条命令完成下载、安装、自启注册、体检、技能投放五件事

1. 下载 chayuan-<版本>-macos 安装包（按芯片选 arm64 或 x64）
2. 双击 pkg 按引导完成安装，加载项落位 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons
3. 安装器注册 LaunchAgent（com.chayuan.mcp）实现 MCP 服务开机自启
4. 重启 WPS，功能区出现两个察元页签即完成

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。
- Windows PowerShell 5.1 执行一行命令中文乱码？——v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。
- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan

## 常见问题
### 外部智能体怎么连接？

在支持 MCP 的客户端里添加服务地址 http://127.0.0.1:62588/mcp 即可；安装器会自动把使用技能投放到 Claude Code/Cursor/Codex 的技能目录。

### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

### MCP 服务一直不在线（/healthz 不通）怎么排查？

按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。


## 相关阅读

- [卸载与重装｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-24-wps.md)
- [MCP 端口稳定性说明｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-23-mcp.md)
- [麒麟WPS插件怎么做？银河麒麟环境安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-5-wps.md)
- [一文读懂批注写回｜进阶技巧](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-3-apply-comments-3.md)
- [智能填报攻略：表单辅助填报的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-12-form-fill-4.md)
- [察元AI Office｜察元Office浏览器 SaaS 形态使用指南（在线办公）](../../chayuan-office/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-26-web-form.md)

## 写在最后

察元AI文档助手的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS加载项一键安装｜察元文档助手上手笔记》《关于WPS加载项一键安装，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
