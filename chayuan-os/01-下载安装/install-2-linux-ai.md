---
title: "Linux deb 安装：linux AI系统完整指引"
alt-titles: ["linux AI系统｜察元OS上手笔记","关于linux AI系统，看这一篇就够（察元AI OS）"]
description: "linux AI系统相关指南：察元AI OS（https://aidooo.com）。Linux deb 安装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["linux AI系统","察元AI OS","下载","安装"]
product: chayuan-os
category: "01-下载安装"
primary_keyword: "linux AI系统"
channel: "CSDN/知乎/博客/公众号"
---
# Linux deb 安装：linux AI系统完整指引

x64/arm64 deb 安装与数据目录。本文以「Linux deb 安装」为主题，给出察元AI OS的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/chayuan-harness。系统要求总览：Windows——Windows 10/11（x64）与 Windows on ARM（arm64）；macOS——Apple Silicon / Intel；Linux（deb 系）——x64/arm64；UOS 20 推荐 deb；银河麒麟 V10（飞腾/鲲鹏/兆芯/海光）有专门适配章节；Linux（通用）——x64/arm64，FUSE 2；服务器/Docker——任意可跑 Docker 的服务器。

## Linux（deb 系） 安装步骤（deb（ChaAIOS-<版本>-<arch>.deb））

系统要求：x64/arm64；UOS 20 推荐 deb；银河麒麟 V10（飞腾/鲲鹏/兆芯/海光）有专门适配章节。UOS 上 AppImage 缺 libfuse2 会双击失败，推荐 deb

1. 下载对应架构 deb：sudo dpkg -i ChaAIOS-*.deb（或 apt install ./）
2. 应用菜单启动察元AI OS
3. 首次启动自动初始化数据目录与模型服务
4. 建议一次加载一个对话模型（8GB 内存设备）

## 安装后怎么验证

1. 重启宿主程序，确认功能入口已出现（Linux（deb 系） 环境）
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- AppImage 双击没反应？——多为缺 FUSE 2：安装 libfuse2（Ubuntu 24.04 为 libfuse2t64），或使用 --appimage-extract-and-run 解压运行；UOS 环境推荐直接用 deb。
- 锁屏密码忘了？——多用户体系提供管理员密码找回流程：以管理员身份登录后在用户管理中重置目标账户密码。
- Docker 部署端口冲突？——默认网页桌面端口 52584，被占用时修改 compose 映射端口；系统各服务端口有统一注册表，改前先查占用。

## 离线运行与部署形态

完全断网可用是察元AI OS 的基础设计：本地模型对话（llama.cpp 引擎随软件分发，无需 Python/CUDA）、知识库导入/检索/问答、桌面与文件/终端/编辑器等系统应用、四家智能体终端与管理，全部离线工作；仅模型下载、云端模型调用、应用更新需要联网。装机自带五件套模型：Qwen3-4B（对话）、bge-m3（嵌入）、bge-reranker-v2-m3（重排）、whisper-small-int8（语音识别）、piper 中文语音合成。

## 数据安全与隐私边界

- 全部本地服务只监听 127.0.0.1，数据不出本机
- API Key safeStorage 加密存储，仅注入子进程
- 遥测可完全停用（DSH_TELEMETRY_DISABLED）
- 权限门三级管控（T0 直放/T1 每次询问可记忆/T2 每次必问），超时视为拒绝（fail closed）

## 费用与授权的边界（如实说明）

免费下载使用，购买只停提醒、永不锁功能。免费部分：首运行起 90 天完全静默；之后每日首次启动弹一次购买页（可手动关闭），主页每 30 分钟一条温和提醒，「买了只停提醒，不买照用」。付费部分：四档价格：¥149 / ¥359 / ¥599 / ¥1049（年度推荐）；弹窗内扫码支付或复制机器指纹到官网购买；离线激活：客服后台签发 HMAC 短码（Crockford base32 + 校验位），绑定 16 位机器指纹，本地验签、无需联网激活服务器

## 常见问题
### 知识库导入失败？

单文件上限 48MB、支持 PDF/docx/xlsx/HTML/Markdown/TXT/图片 OCR；超限文件请拆分，格式不识别时转为支持格式后重试。

### 内存小能跑吗？

8GB 内存可用：建议一次加载一个对话模型+一个嵌入模型；系统有总内存 45% 的预算硬底线防卡死。

### 语音输入没反应？

检查系统麦克风权限与默认输入设备；确认 whisper 语音识别模型已加载；嘈杂环境建议使用外接麦克风。


## 相关阅读

- [锁屏密码找回｜察元OS故障处理](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-16d2dd89.md)
- [安装包完整性：安装包校验完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-2591bbcf.md)
- [GGUF 模型本地导入：GGUF导入完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-17-gguf.md)
- [智能体记忆攻略：多智能体共享记忆的关键点拆解（细节版）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-24-memory-4.md)
- [一文读懂Spotlight 全局搜索｜进阶技巧](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-1-spotlight-3.md)
- [察元AI 能力广场｜API价格攻略：API 价格页的关键点拆解](../../website/02-%E6%9D%BF%E5%9D%97%E6%95%99%E7%A8%8B/feature-14-pricing-4.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI OS迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《linux AI系统｜察元OS上手笔记》《关于linux AI系统，看这一篇就够（察元AI OS）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
