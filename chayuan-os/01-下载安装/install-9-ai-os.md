---
title: "官网下载指引（察元OS）"
alt-titles: ["察元AI OS下载｜察元OS干货合集","关于察元AI OS下载，看这一篇就够（察元AI OS）"]
description: "察元AI OS下载相关指南：察元AI OS（https://aidooo.com）。官网下载指引。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["察元AI OS下载","察元AI OS","下载","安装"]
product: chayuan-os
category: "01-下载安装"
primary_keyword: "察元AI OS下载"
channel: "CSDN/知乎/博客/公众号"
---
# 官网下载指引（察元OS）

官网入口与检查更新联动。本文以「官网下载指引」为主题，给出察元AI OS的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub Releases https://github.com/zhgyuhuii/chayuan-harness。系统要求总览：Windows——Windows 10/11（x64）与 Windows on ARM（arm64）；macOS——Apple Silicon / Intel；Linux（deb 系）——x64/arm64；UOS 20 推荐 deb；银河麒麟 V10（飞腾/鲲鹏/兆芯/海光）有专门适配章节；Linux（通用）——x64/arm64，FUSE 2；服务器/Docker——任意可跑 Docker 的服务器。

## 通过官网 aidooo.com获取

下载与产品页，应用内检查更新走同一站点。全部获取渠道：官网 aidooo.com（下载与产品页，应用内检查更新走同一站点）；GitHub Releases（dmg/exe/deb/AppImage 自动更新源）。

1. 打开 https://aidooo.com
2. 按平台选择安装包：Windows 用 NSIS 安装器 exe（ChaAIOS-<版本>-<arch>.exe）；macOS 用 dmg（ChaAIOS-<版本>-arm64.dmg）；Linux（deb 系） 用 deb（ChaAIOS-<版本>-<arch>.deb）；Linux（通用） 用 AppImage（ChaAIOS-<版本>-<arch>.AppImage）；服务器/Docker 用 docker compose
3. 下载后先做完整性确认（有校验文件的包先校验）
4. 按对应平台的安装步骤完成安装

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 安装提示架构不符？——终端执行 uname -m 确认架构：aarch64 选 arm64 包，x86_64 选 x64 包；飞腾/鲲鹏设备均为 arm64。
- 锁屏密码忘了？——多用户体系提供管理员密码找回流程：以管理员身份登录后在用户管理中重置目标账户密码。
- 智能体（CLI）无法启动？——在应用管理→智能体页检查安装状态并重装；四家 CLI 二进制随安装包分发（约 1.3GB），磁盘空间不足会导致启动失败。

## 离线运行与部署形态

完全断网可用是察元AI OS 的基础设计：本地模型对话（llama.cpp 引擎随软件分发，无需 Python/CUDA）、知识库导入/检索/问答、桌面与文件/终端/编辑器等系统应用、四家智能体终端与管理，全部离线工作；仅模型下载、云端模型调用、应用更新需要联网。装机自带五件套模型：Qwen3-4B（对话）、bge-m3（嵌入）、bge-reranker-v2-m3（重排）、whisper-small-int8（语音识别）、piper 中文语音合成。

## 数据安全与隐私边界

- 全部敏感操作写审计日志 audit.jsonl，可回放检查
- 全部本地服务只监听 127.0.0.1，数据不出本机
- API Key safeStorage 加密存储，仅注入子进程
- 权限门三级管控（T0 直放/T1 每次询问可记忆/T2 每次必问），超时视为拒绝（fail closed）

## 费用与授权的边界（如实说明）

免费下载使用，购买只停提醒、永不锁功能。免费部分：首运行起 90 天完全静默；之后每日首次启动弹一次购买页（可手动关闭），主页每 30 分钟一条温和提醒，「买了只停提醒，不买照用」。付费部分：四档价格：¥149 / ¥359 / ¥599 / ¥1049（年度推荐）；弹窗内扫码支付或复制机器指纹到官网购买；离线激活：客服后台签发 HMAC 短码（Crockford base32 + 校验位），绑定 16 位机器指纹，本地验签、无需联网激活服务器

## 常见问题
### 知识库导入失败？

单文件上限 48MB、支持 PDF/docx/xlsx/HTML/Markdown/TXT/图片 OCR；超限文件请拆分，格式不识别时转为支持格式后重试。

### AppImage 双击没反应？

多为缺 FUSE 2：安装 libfuse2（Ubuntu 24.04 为 libfuse2t64），或使用 --appimage-extract-and-run 解压运行；UOS 环境推荐直接用 deb。

### 内置了哪些模型？

装机五件套：Qwen3-4B-instruct（对话）、bge-m3（嵌入）、bge-reranker-v2-m3（重排）、whisper-small-int8（语音识别）、piper 中文（语音合成）；标准包含引擎不含权重时可通过 models 完整离线包或在线下载补齐。


## 相关阅读

- [AI操作系统下载怎么做？Windows 安装指南一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-0-ai.md)
- [Docker AI工作站怎么做？Docker 服务器部署一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-7-docker-ai.md)
- [手机访问（H5/远程协助）｜察元OS安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-8-ai.md)
- [技能页签与技能商店怎么用：察元OS进阶技巧](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-10-skills-3.md)
- [智能体怎么选：察元OS完整指南](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-633afc07.md)
- [察元AI 能力广场｜能力广场投稿与我的使用指南（资源投稿）](../../website/02-%E6%9D%BF%E5%9D%97%E6%95%99%E7%A8%8B/feature-20-submit.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元OS，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI OS迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《察元AI OS下载｜察元OS干货合集》《关于察元AI OS下载，看这一篇就够（察元AI OS）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
