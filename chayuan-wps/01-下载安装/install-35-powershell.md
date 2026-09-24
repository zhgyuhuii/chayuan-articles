---
title: "PowerShell乱码怎么做？PowerShell 5.1 乱码一次讲清"
alt-titles: ["PowerShell乱码｜察元文档助手干货合集","关于PowerShell乱码，看这一篇就够（察元AI文档助手）"]
description: "PowerShell乱码相关指南：察元AI文档助手（https://aidooo.com）。PowerShell 5.1 乱码。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["PowerShell乱码","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "PowerShell乱码"
channel: "CSDN/知乎/博客/公众号"
---
# PowerShell乱码怎么做？PowerShell 5.1 乱码一次讲清

一行命令在 PS 5.1 下中文乱码的处理（v4.1.1 已修复）。本文以「PowerShell 5.1 乱码」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 问题定位与处理

安装类问题九成出在三个环节：安装包与系统架构不匹配、安装目录权限不足、安全软件拦截。先按这三条排查，再进入具体问题处理。

1. 症状确认：Windows PowerShell 5.1 执行一行命令中文乱码？
2. 按官方口径处理：v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。
3. 处理后在干净环境复现验证一次
4. 仍失败时收集系统版本与报错截图，通过官网支持渠道反馈

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。
- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 常见问题
### 杀毒软件拦截安装器或 sidecar 怎么办？

安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。

### 对话报「模型未配置」或调用失败？

进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。

### 能在完全断网的环境用吗？

能。配置 Ollama 或任意 OpenAI 兼容内网网关后全部功能可离线使用；安装包内嵌 sidecar 二进制并注册自启，适配离线与内网部署。


## 相关阅读

- [MCP 不在线排查：MCP不在线完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-33-mcp.md)
- [手动 jsaddons 安装（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-13-jsaddons.md)
- [MCP服务自启怎么做？MCP 自启验证一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-16-mcp.md)
- [察元文档助手架构课｜四级安装体检的设计](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-be121f0e.md)
- [国企办公AI新手路线：国企办公室场景全拆解](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-10-soe-2.md)
- [察元AI Office｜开源 AI Office 与商业 Office 套件（深度对比）](../../chayuan-office/05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-0-office.md)

## 写在最后

这篇文章覆盖了从了解到用熟的完整路径。如果只记一件事：先配置好模型（内网用户走本地端点），再按步骤跑通第一个任务，后面的路就顺了。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《PowerShell乱码｜察元文档助手干货合集》《关于PowerShell乱码，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
