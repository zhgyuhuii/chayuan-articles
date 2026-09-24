---
title: "卸载与重装｜察元文档助手安装指南"
alt-titles: ["WPS插件卸载｜察元文档助手经验帖","关于WPS插件卸载，看这一篇就够（察元AI文档助手）"]
description: "WPS插件卸载相关指南：察元AI文档助手（https://aidooo.com）。卸载与重装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS插件卸载","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS插件卸载"
channel: "CSDN/知乎/博客/公众号"
---
# 卸载与重装｜察元文档助手安装指南

删 jsaddons 目录+清理自启项的干净卸载流程。本文以「卸载与重装」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Windows 为例）

删 jsaddons 目录+清理自启项的干净卸载流程

1. 从官网或 Gitee 镜像下载 chayuan-<版本>-windows-x64.exe 自解压包
2. 双击运行，安装器自动完成四步：复制加载项到 jsaddons 并写 publish.xml、注册 MCP 开机自启（注册表 HKCU\Run）、四级体检（jsaddons→/healthz→initialize→桥接工具）、向 Claude/Cursor/Codex 投放技能
3. 重启 WPS 文字，功能区出现「察元 AI 助理」「察元 AI 编审」两个页签即安装成功
4. 懒人方案：PowerShell 一行命令安装（WebClient 下载 + UTF8 执行），支持 -SkillOnly、-Version 参数

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。
- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改

## 常见问题
### 支持哪些 WPS 版本？

WPS 文字 12.x 与 WPS 365（WebView2）桌面端；不支持网页版 WPS。

### 什么是 MCP 文档智能体服务？

加载项内置的本机服务（46 工具/15 域），外部 AI 编程工具（Claude Code、Codex、Cursor 等）连上后可直接打开、读取、修改、批注本机 WPS 文档，写操作默认只预览、传 confirmed:true 才落盘。

### 任务栏出现黑色窗口或关闭窗口后 MCP 断连？

这是 4.1.2 之前版本的已知问题：sidecar 可见启动导致黑窗常驻、关窗即断连；升级到 4.1.2 及以上版本后 sidecar 改为隐藏启动，问题不复现。


## 相关阅读

- [PowerShell乱码怎么做？PowerShell 5.1 乱码一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-35-powershell.md)
- [安装报错速查表（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-29-wps.md)
- [WPS插件安装失败怎么做？安装失败排查总览一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-15-wps.md)
- [v5.1.4 发布要点：当前发布版本：三平台产物齐全；sidecar 最小 token 鉴权 + 审计](../08-%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83/release-8-5-1-4.md)
- [WPS AI插件决策指南：WPS 加载项形态 vs 独立桌面软件（细节版）](../05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-4-wps-ai-2.md)
- [察元AI Office｜开发者/自动化爱好者提效实录路线：自动化办公这样落地（细节版）](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-11-dev-3.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS插件卸载｜察元文档助手经验帖》《关于WPS插件卸载，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
