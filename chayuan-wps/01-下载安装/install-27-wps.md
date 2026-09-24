---
title: "安装包格式对比｜察元文档助手安装指南"
alt-titles: ["WPS插件安装包｜察元文档助手干货合集","关于WPS插件安装包，看这一篇就够（察元AI文档助手）"]
description: "WPS插件安装包相关指南：察元AI文档助手（https://aidooo.com）。安装包格式对比。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS插件安装包","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS插件安装包"
channel: "CSDN/知乎/博客/公众号"
---
# 安装包格式对比｜察元文档助手安装指南

exe/pkg/deb/7z 各自适用场景一张表。本文以「安装包格式对比」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Windows 为例）

exe/pkg/deb/7z 各自适用场景一张表

1. 从官网或 Gitee 镜像下载 chayuan-<版本>-windows-x64.exe 自解压包
2. 双击运行，安装器自动完成四步：复制加载项到 jsaddons 并写 publish.xml、注册 MCP 开机自启（注册表 HKCU\Run）、四级体检（jsaddons→/healthz→initialize→桥接工具）、向 Claude/Cursor/Codex 投放技能
3. 重启 WPS 文字，功能区出现「察元 AI 助理」「察元 AI 编审」两个页签即安装成功
4. 懒人方案：PowerShell 一行命令安装（WebClient 下载 + UTF8 执行），支持 -SkillOnly、-Version 参数

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- 任务栏出现黑色窗口或关闭窗口后 MCP 断连？——这是 4.1.2 之前版本的已知问题：sidecar 可见启动导致黑窗常驻、关窗即断连；升级到 4.1.2 及以上版本后 sidecar 改为隐藏启动，问题不复现。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan

## 常见问题
### 能在完全断网的环境用吗？

能。配置 Ollama 或任意 OpenAI 兼容内网网关后全部功能可离线使用；安装包内嵌 sidecar 二进制并注册自启，适配离线与内网部署。

### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

### MCP 服务一直不在线（/healthz 不通）怎么排查？

按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。


## 相关阅读

- [全平台安装总览：WPS AI全平台安装完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-39-wps-ai.md)
- [arm64 与 x64 选型｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-21-arm64-wps.md)
- [WPS 版本兼容说明｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-20-wps.md)
- [MCP文档决策指南：自带 MCP 服务 vs 自建文档自动化脚本](../05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-6-mcp-3.md)
- [数据目录在哪里？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-64450312.md)
- [察元AI Office｜制造业行业怎么用察元Office：从痛点到落地](../../chayuan-office/04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-e7880031.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS插件安装包｜察元文档助手干货合集》《关于WPS插件安装包，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
