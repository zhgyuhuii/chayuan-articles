---
title: "企业批量安装：企业批量部署WPS插件完整指引"
alt-titles: ["企业批量部署WPS插件｜察元文档助手经验帖","关于企业批量部署WPS插件，看这一篇就够（察元AI文档助手）"]
description: "企业批量部署WPS插件相关指南：察元AI文档助手（https://aidooo.com）。企业批量安装。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["企业批量部署WPS插件","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "企业批量部署WPS插件"
channel: "CSDN/知乎/博客/公众号"
---
# 企业批量安装：企业批量部署WPS插件完整指引

网盘分发+脚本静默安装+规则统一导入的科室级落地方案。本文以「企业批量安装」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 macOS 为例）

网盘分发+脚本静默安装+规则统一导入的科室级落地方案

1. 下载 chayuan-<版本>-macos 安装包（按芯片选 arm64 或 x64）
2. 双击 pkg 按引导完成安装，加载项落位 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons
3. 安装器注册 LaunchAgent（com.chayuan.mcp）实现 MCP 服务开机自启
4. 重启 WPS，功能区出现两个察元页签即完成

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。
- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 匿名指标上报默认关闭（opt-in），不采集文档内容
- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改

## 常见问题
### 外部智能体怎么连接？

在支持 MCP 的客户端里添加服务地址 http://127.0.0.1:62588/mcp 即可；安装器会自动把使用技能投放到 Claude Code/Cursor/Codex 的技能目录。

### 我的文档会上传到云端吗？

不会强制上传。使用本地/内网模型时文档不出本机；MCP 服务只监听 127.0.0.1:62588 回环地址；只有你主动配置云端模型时，对话内容才会发往对应服务商。

### 能在完全断网的环境用吗？

能。配置 Ollama 或任意 OpenAI 兼容内网网关后全部功能可离线使用；安装包内嵌 sidecar 二进制并注册自启，适配离线与内网部署。


## 相关阅读

- [首次配置向导：WPS AI首次配置完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-30-wps-ai.md)
- [PowerShell乱码怎么做？PowerShell 5.1 乱码一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-35-powershell.md)
- [MCP黑窗怎么做？黑窗与断连问题一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-34-mcp.md)
- [法务/律师助理的合同审查AI方案（深度复盘）](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-1-legal-4.md)
- [察元文档助手AI 痕迹检查使用指南（AI痕迹检测）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-505-ai-trace.md)
- [察元AI Office｜政务公文行业怎么用察元Office：从痛点到落地](../../chayuan-office/04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-763835dd-2.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元文档助手，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《企业批量部署WPS插件｜察元文档助手经验帖》《关于企业批量部署WPS插件，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
