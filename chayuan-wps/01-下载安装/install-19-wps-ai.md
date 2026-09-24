---
title: "系统要求与兼容性｜察元文档助手安装指南"
alt-titles: ["WPS AI系统要求｜察元文档助手上手笔记","关于WPS AI系统要求，看这一篇就够（察元AI文档助手）"]
description: "WPS AI系统要求相关指南：察元AI文档助手（https://aidooo.com）。系统要求与兼容性。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS AI系统要求","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS AI系统要求"
channel: "CSDN/知乎/博客/公众号"
---
# 系统要求与兼容性｜察元文档助手安装指南

WPS 文字 12.x / WPS 365（WebView2）与三平台系统要求汇总。本文以「系统要求与兼容性」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 macOS 为例）

WPS 文字 12.x / WPS 365（WebView2）与三平台系统要求汇总

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

- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。
- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 匿名指标上报默认关闭（opt-in），不采集文档内容

## 常见问题
### 我的文档会上传到云端吗？

不会强制上传。使用本地/内网模型时文档不出本机；MCP 服务只监听 127.0.0.1:62588 回环地址；只有你主动配置云端模型时，对话内容才会发往对应服务商。

### 什么是 MCP 文档智能体服务？

加载项内置的本机服务（46 工具/15 域），外部 AI 编程工具（Claude Code、Codex、Cursor 等）连上后可直接打开、读取、修改、批注本机 WPS 文档，写操作默认只预览、传 confirmed:true 才落盘。

### 任务栏出现黑色窗口或关闭窗口后 MCP 断连？

这是 4.1.2 之前版本的已知问题：sidecar 可见启动导致黑窗常驻、关窗即断连；升级到 4.1.2 及以上版本后 sidecar 改为隐藏启动，问题不复现。


## 相关阅读

- [Windows 一行命令安装详解（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-1-wps.md)
- [MCP黑窗怎么做？黑窗与断连问题一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-34-mcp.md)
- [jsplugins.xml怎么做？Linux jsplugins 问题一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-32-jsplugins-xml.md)
- [老文档复活工作流（察元文档助手速查手册）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-631caa84.md)
- [🔥保密检查隐藏用法｜保密检查一次讲清](../09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-106.md)
- [察元AI Office｜重度 PDF 用户提效实录路线：PDF处理这样落地](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-8-pdf-worker-3.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元文档助手，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS AI系统要求｜察元文档助手上手笔记》《关于WPS AI系统要求，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
