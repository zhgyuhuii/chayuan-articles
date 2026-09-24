---
title: "macOS 安装指南（察元文档助手）"
alt-titles: ["mac WPS插件｜察元文档助手干货合集","关于mac WPS插件，看这一篇就够（察元AI文档助手）"]
description: "mac WPS插件相关指南：察元AI文档助手（https://aidooo.com）。macOS 安装指南。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["mac WPS插件","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "mac WPS插件"
channel: "CSDN/知乎/博客/公众号"
---
# macOS 安装指南（察元文档助手）

Apple Silicon 与 Intel 双架构的 pkg 安装与 LaunchAgent 自启说明。本文以「macOS 安装指南」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## macOS 安装步骤（pkg 安装包（约 35MB））

系统要求：WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持。也可用 curl -fsSL 安装脚本：install-wps-skill-chayuan.sh | bash -s -- --fetch

1. 下载 chayuan-<版本>-macos 安装包（按芯片选 arm64 或 x64）
2. 双击 pkg 按引导完成安装，加载项落位 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons
3. 安装器注册 LaunchAgent（com.chayuan.mcp）实现 MCP 服务开机自启
4. 重启 WPS，功能区出现两个察元页签即完成

## 安装后怎么验证

1. 重启宿主程序，确认功能入口已出现（macOS 环境）
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。
- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域
- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包

## 常见问题
### 我的文档会上传到云端吗？

不会强制上传。使用本地/内网模型时文档不出本机；MCP 服务只监听 127.0.0.1:62588 回环地址；只有你主动配置云端模型时，对话内容才会发往对应服务商。

### WPS 12 Linux 版安装后加载项不生效？

早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。

### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。


## 相关阅读

- [系统要求与兼容性｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-19-wps-ai.md)
- [便携技能包使用（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-12-wps.md)
- [麒麟WPS插件怎么做？银河麒麟环境安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-5-wps.md)
- [察元文档助手知识库核对/总结/问答使用指南（知识库问答）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-15-kb.md)
- [察元文档助手架构课｜sidecar 的零依赖单文件编译](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-1-rust-sidecar-2.md)
- [察元AI Office｜浏览器 SaaS 形态避坑指南：从入口到完成的完整流程](../../chayuan-office/02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-26-web-form-4.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《mac WPS插件｜察元文档助手干货合集》《关于mac WPS插件，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
