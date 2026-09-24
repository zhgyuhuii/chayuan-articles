---
title: "Gitee 国内镜像下载：WPS插件国内下载完整指引"
alt-titles: ["WPS插件国内下载｜察元文档助手经验帖","关于WPS插件国内下载，看这一篇就够（察元AI文档助手）"]
description: "WPS插件国内下载相关指南：察元AI文档助手（https://aidooo.com）。Gitee 国内镜像下载。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS插件国内下载","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS插件国内下载"
channel: "CSDN/知乎/博客/公众号"
---
# Gitee 国内镜像下载：WPS插件国内下载完整指引

国内网络直连慢时优先走 Gitee 镜像。本文以「Gitee 国内镜像下载」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通过Gitee 国内镜像获取

国内网络优选，下载更稳。全部获取渠道：官网 aidooo.com（产品家族总入口，含技能包专页 /skill）；GitHub 仓库（开源 Apache-2.0，安装包与源码）；Gitee 国内镜像（国内网络优选，下载更稳）；百度网盘（离线环境/内网机器转存使用）。

1. 打开 https://gitee.com/cloudshd/chayuan-wps-releases
2. 按平台选择安装包：Windows 用 自解压 exe（约 35MB，带 .sha256 校验文件）；macOS 用 pkg 安装包（约 35MB）；Linux 用 deb 安装包（约 35MB）
3. 下载后先做完整性确认（有校验文件的包先校验）
4. 按对应平台的安装步骤完成安装

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。
- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。
- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 常见问题
### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

### 外部智能体怎么连接？

在支持 MCP 的客户端里添加服务地址 http://127.0.0.1:62588/mcp 即可；安装器会自动把使用技能投放到 Claude Code/Cursor/Codex 的技能目录。

### 对话报「模型未配置」或调用失败？

进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。


## 相关阅读

- [卸载与重装｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-24-wps.md)
- [安装包格式对比｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-27-wps.md)
- [多版本与回滚（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-28-wps.md)
- [一文打通会议全流程记录法｜会议纪要生成](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-e5d12eb6.md)
- [🧩翻译从业者自救指南：文档翻译这么干](../09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-a94493b5.md)
- [察元AI Office｜写给方案撰写人的AI写方案指南：效率视角](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-2-proposal-3.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS插件国内下载｜察元文档助手经验帖》《关于WPS插件国内下载，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
