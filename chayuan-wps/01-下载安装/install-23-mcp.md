---
title: "MCP 端口稳定性说明｜察元文档助手安装指南"
alt-titles: ["MCP端口｜察元文档助手上手笔记","关于MCP端口，看这一篇就够（察元AI文档助手）"]
description: "MCP端口相关指南：察元AI文档助手（https://aidooo.com）。MCP 端口稳定性说明。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["MCP端口","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "MCP端口"
channel: "CSDN/知乎/博客/公众号"
---
# MCP 端口稳定性说明｜察元文档助手安装指南

端口固定 62588，外部客户端配置一次不用改；可用环境变量调整。本文以「MCP 端口稳定性说明」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Linux 为例）

端口固定 62588，外部客户端配置一次不用改；可用环境变量调整

1. 下载 chayuan-<版本>-linux 对应架构的 deb/安装包
2. 运行安装脚本或按手动路径安装：~/.local/share/Kingsoft/wps/jsaddons；麒麟/UOS 专业版在 /opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons
3. MCP 服务通过 systemd --user（chayuan-mcp.service）注册自启
4. 重启 WPS（必要时终端执行 quickstartoffice restart），功能区出现察元页签

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。
- Windows PowerShell 5.1 执行一行命令中文乱码？——v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 匿名指标上报默认关闭（opt-in），不采集文档内容

## 常见问题
### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

### 支持哪些 WPS 版本？

WPS 文字 12.x 与 WPS 365（WebView2）桌面端；不支持网页版 WPS。

### 校对结果可靠吗？

校对由大模型推理完成，输出「原文引用+建议+理由」的结构化清单并默认以批注写回，每条都由人工裁决；它擅长语境类错误（搭配、语法、逻辑），最终采用权在用户。


## 相关阅读

- [麒麟WPS插件怎么做？银河麒麟环境安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-5-wps.md)
- [加载项不显示排查｜察元文档助手故障处理](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-31-wps.md)
- [安装后对话报错｜察元文档助手故障处理](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-36-wps-ai.md)
- [✨教师自救指南：教师办公AI这么干](../09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-9-ai.md)
- [审计会计行业怎么用察元文档助手：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-434984f1.md)
- [察元AI Office｜写给政企办公人员的政企办公软件指南：清单式指南](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-10-gov-office-5.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《MCP端口｜察元文档助手上手笔记》《关于MCP端口，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
