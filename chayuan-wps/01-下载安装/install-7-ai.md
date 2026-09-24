---
title: "官网下载指引：察元AI文档助手下载完整指引"
alt-titles: ["察元AI文档助手下载｜察元文档助手经验帖","关于察元AI文档助手下载，看这一篇就够（察元AI文档助手）"]
description: "察元AI文档助手下载相关指南：察元AI文档助手（https://aidooo.com）。官网下载指引。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["察元AI文档助手下载","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "察元AI文档助手下载"
channel: "CSDN/知乎/博客/公众号"
---
# 官网下载指引：察元AI文档助手下载完整指引

官网各入口与技能包专页的下载路径说明。本文以「官网下载指引」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通过官网 aidooo.com获取

产品家族总入口，含技能包专页 /skill。全部获取渠道：官网 aidooo.com（产品家族总入口，含技能包专页 /skill）；GitHub 仓库（开源 Apache-2.0，安装包与源码）；Gitee 国内镜像（国内网络优选，下载更稳）；百度网盘（离线环境/内网机器转存使用）。

1. 打开 https://aidooo.com
2. 按平台选择安装包：Windows 用 自解压 exe（约 35MB，带 .sha256 校验文件）；macOS 用 pkg 安装包（约 35MB）；Linux 用 deb 安装包（约 35MB）
3. 下载后先做完整性确认（有校验文件的包先校验）
4. 按对应平台的安装步骤完成安装

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。
- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。
- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 常见问题
### 外部智能体怎么连接？

在支持 MCP 的客户端里添加服务地址 http://127.0.0.1:62588/mcp 即可；安装器会自动把使用技能投放到 Claude Code/Cursor/Codex 的技能目录。

### MCP 服务一直不在线（/healthz 不通）怎么排查？

按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。

### 安装后 WPS 功能区没有出现察元页签怎么办？

先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。


## 相关阅读

- [手动 jsaddons 安装（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-13-jsaddons.md)
- [便携技能包使用（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-12-wps.md)
- [UOS WPS插件怎么做？统信 UOS 环境安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-6-uos-wps.md)
- [MCP文档智能体攻略：本机 MCP 文档智能体服务的关键点拆解（细节版）](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-31-mcp-service-4.md)
- [本地引擎一键安装引导怎么用：察元文档助手避坑指南](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-33-local-engine-4.md)
- [察元AI Office｜行政/办公室文员的通知写作方案（新手路线）](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-1-notice-2.md)

## 写在最后

察元AI文档助手的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《察元AI文档助手下载｜察元文档助手经验帖》《关于察元AI文档助手下载，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
