---
title: "覆盖升级安装指南：全平台步骤与验证"
description: "覆盖升级指南：察元AI OS按平台架构的安装步骤、验证方法与排错。"
keywords: ["覆盖升级", "察元AI OS", "下载安装", "升级", "数据保留"]
product: chayuan-os
category: "01-下载安装"
primary_keyword: "覆盖升级"
channel: "CSDN/知乎/博客"
---

# 覆盖升级安装指南：全平台步骤与验证

直接上干货。检查更新在察元AI OS里的定位一句话能说清：AI 桌面操作系统，本地大模型、知识库、智能体、宠物群聊装进一个桌面。具体怎么操作、有什么讲究，往下看。

## 安装前确认

- 系统要求：Windows 10/11，x64 或 arm64
- 安装包：NSIS 安装器（ChaAIOS-版本-架构.exe）
- 说明：升级不丢数据的机制。

Windows 10/11（x64/arm64）、macOS（Apple Silicon/Intel）、Linux（deb/AppImage，银河麒麟 V10 与统信 UOS 已实测）、Docker 服务器形态。安装包从官网 aidooo.com 获取。

## 完整操作步骤

1. 官网 aidooo.com 下载对应架构的 exe 安装器
2. 双击安装，零额外依赖
3. 首次启动创建本机账户，进入桌面
4. 对话应用里选本地模型即可开聊，全程无需联网

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | Windows 10/11，x64 或 arm64 | NSIS 安装器（ChaAIOS-版本-架构.exe） |
| macOS | Apple Silicon 或 Intel | dmg（ChaAIOS-版本-arm64.dmg / x64.dmg） |
| Linux（deb） | x64/arm64；银河麒麟 V10、统信 UOS 20 推荐 deb | deb（ChaAIOS-版本-架构.deb） |
| Linux（AppImage） | x64/arm64，需要 FUSE 2 | AppImage（ChaAIOS-版本-架构.AppImage） |
| Docker 服务器 | 任意可跑 Docker 的服务器 | docker compose（察元AI工舱形态） |

## 装完后的第一件事

首次登录桌面会自动弹出模型设置向导，四步配好默认模型并应用到智能体；随后到设置账号与找回里生成恢复密钥，这两件事做完，这台机器就算真正就绪。

## 架构对照速查

| 设备 | 架构 | 选包 |
|---|---|---|
| 飞腾、鲲鹏 | arm64 | arm64 的 deb 或 AppImage |
| 兆芯、海光 | x64 | x64 包 |
| 常见 Intel、AMD | x64 | x64 包 |
| Apple Silicon | arm64 | arm64 的 dmg |

拿不准就终端执行 uname -m：输出 aarch64 选 arm64，输出 x86_64 选 x64。

## 收尾检查

- 启动进入桌面，对话应用选本地模型能正常回复
- 首启初始化需要 5 到 30 秒，属正常现象，期间不用干预

## 注意事项与真实边界

如实说明，它不是万能的：

- 全量安装包含模型权重约 4.7GB，轻量包约 1GB，完整离线能力需要额外下载权重
- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限

## 接着回答几个常见问题

### 下载进度一直不动 / 下载中断了？

重新打开关于面板看状态行；若已报错会显示失败原因（网络断续常见），网络恢复后再点一次「检查更新…」重新下载即可。

### 点「检查更新…」却打开了一个网页？

那是网页（浏览器）形态：没有桌面更新桥，按钮降级为打开官方站点页。完整的检查-下载-安装流程需要桌面安装版（察元AI OS 桌面应用）。

### 为什么从来不弹更新提醒？

产品采用手动检查模式：不静默检查、不强更。想升级时到 设置 ＞ 关于 点一次「检查更新…」。

## 补充答疑

### 更新会丢数据吗？

不会。安装包只更新程序文件，你的数据根目录不动（帮助中心 ＞ 参考 ＞ 常见问题 FAQ 同口径）。

### 「检查更新失败」怎么回事？

多为网络访问 GitHub Releases 失败。按提示「可到 Releases 页手动下载」：Releases 页地址为 https://github.com/zhgyuhuii/chayuan-harness/releases，手动下载最新安装包覆盖安装即可。

## 能力点备忘

- 在线检查更新
- 重启安装
- 数据保留

## 安装与运行答疑

### Docker 部署端口冲突？

网页桌面默认端口 52584，被占用时修改 compose 端口映射；系统各服务端口有统一注册表，改前先查占用。

### 首次启动感觉卡住了？

首启要初始化数据目录并加载模型服务，5 到 30 秒属正常范围，期间无需干预，完成后自动进入桌面。

## 一个真实场景

小团队负责人的典型用法：服务器 Docker 部署察元AI工舱云桌面，员工浏览器打开即用，账户隔离，共享模型代理与知识库，配置统一。一台服务器全组使用，配置与数据集中管理。注意：需要一台性能尚可的服务器与基本的 Docker 能力。

## 顺带了解

支持的智能体总览：内置 DeepSeek Harness（系统级）加 17 家外部 CLI 智能体统一管理：Claude Code、Codex、OpenCode、OpenClaw、ZCode、Gemini CLI、Qwen Code、Kimi Code、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy、Crush、Aider、Goose，各家能力矩阵标明能否一键安装、写入模型、收系统技能、收 MCP、记忆采集。

为什么值得看：命令行 AI 编程智能体一茬茬冒，一台机器管十几家、配置互不打架，是这套系统的核心场景之一。

## 还有这个能力

忘记密码三路找回：三条路：恢复密钥直接重置；智能体面试找回（AI 面试官出题验证身份）；找管理员重置。各有前提与入口，防爆破有冷却限制。

## 硬口径两三条

- 86 个 MCP 工具（2026 年 10 月实测）
- 模型配置可一键写入五家（Harness/Claude Code/Codex/OpenCode/OpenClaw），MCP 配置自动传播 13 家

## 如实说不足

- Docker 云桌面、跨终端互联这类进阶形态需要一点动手能力
- 全量安装包含模型权重约 4.7GB，轻量包约 1GB，完整离线能力需要额外下载权重
- 暂不支持龙芯平台；本地不提供视频生成（视频生成走云端路由）

## 定位与家族

察元AI OS（Chayuan AI OS，简称察元OS）是一款 AI 桌面操作系统，以完整桌面环境为壳，内置本地大模型五件套、引用式知识库、17 家外部 CLI 智能体管理、宠物群聊多模型讨论与系统级 MCP 控制面，支持 Windows/macOS/Linux（银河麒麟、统信 UOS）及 Docker 云桌面形态，断网可用、数据不出本机。同家族产品：察元AI Office（开源 AI 办公套件）、察元AI文档助手（WPS 加载项）、察元AI 能力广场（aidooo.com）。

## 边界速览

- 云端厂商模型调用需自备 API Key

## 数字口径

- 17 家外部 CLI 智能体（Claude Code、Codex、OpenCode、OpenClaw、ZCode、Gemini CLI、Qwen Code、Kimi Code、Cursor CLI、Copilot CLI、Droid、Amp、Grok Build、CodeBuddy、Crush、Aider、Goose）加内置 DeepSeek Harness
- 66 家内置云端厂商目录加自定义 OpenAI 兼容厂商
- 装机五件套：Qwen3-4B 对话、BGE-M3 嵌入、BGE 重排、whisper-small 语音识别、piper 中文语音合成
- 127.0.0.1:52581（OpenAI 兼容统一模型代理）

## 跨终端互联的安全设计

同一网段的多台终端经 RTPS 多播互相发现，配对后按类别授权（模型加知识库、智能体执行）。远端调用以远端访客身份通过对端权限门并留审计；出厂默认零共享，开哪类授权完全由用户决定。

## 应用商店与离线分发

商店对接能力广场（aidooo.com），插件、技能、MCP 插件、智能体、技能包五类内容在线下载并云端推送更新，配排行榜辅助选型。内网环境走 .cop.tgz 离线包导入：导出即依赖闭包，导入逐文件校验，断网也能完成分发。

## 模型服务的实际构成

装机自带的五件套覆盖完整离线链路：Qwen3-4B 负责对话、BGE-M3 做嵌入、BGE 重排提升检索精度、whisper-small 跑语音识别、piper 做中文语音合成。模型中心里还能在线补更强档位（Qwen3-8B/14B、小内存档 LFM2.5、图像理解的 MiniCPM-V 等），下载源多路自动换。内存仪表实时显示每个模型的占用，空闲 15 分钟自动卸载，常用模型可钉住常驻。

安装这步别跳验证：装完先确认核心功能可用，再往下配。

---

察元AI OS（Chayuan AI OS）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 3.1.15），后续版本功能可能调整。
