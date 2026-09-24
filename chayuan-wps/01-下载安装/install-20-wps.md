---
title: "WPS 版本兼容说明｜察元文档助手安装指南"
alt-titles: ["WPS版本要求｜察元文档助手经验帖","关于WPS版本要求，看这一篇就够（察元AI文档助手）"]
description: "WPS版本要求相关指南：察元AI文档助手（https://aidooo.com）。WPS 版本兼容说明。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS版本要求","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS版本要求"
channel: "CSDN/知乎/博客/公众号"
---
# WPS 版本兼容说明｜察元文档助手安装指南

老版本 WPS 能不能用、Linux WPS 12 的 jsplugins.xml 坑。本文以「WPS 版本兼容说明」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Linux 为例）

老版本 WPS 能不能用、Linux WPS 12 的 jsplugins.xml 坑

1. 下载 chayuan-<版本>-linux 对应架构的 deb/安装包
2. 运行安装脚本或按手动路径安装：~/.local/share/Kingsoft/wps/jsaddons；麒麟/UOS 专业版在 /opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons
3. MCP 服务通过 systemd --user（chayuan-mcp.service）注册自启
4. 重启 WPS（必要时终端执行 quickstartoffice restart），功能区出现察元页签

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。
- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步

## 常见问题
### 支持哪些 WPS 版本？

WPS 文字 12.x 与 WPS 365（WebView2）桌面端；不支持网页版 WPS。

### 能在完全断网的环境用吗？

能。配置 Ollama 或任意 OpenAI 兼容内网网关后全部功能可离线使用；安装包内嵌 sidecar 二进制并注册自启，适配离线与内网部署。

### 对话报「模型未配置」或调用失败？

进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。


## 相关阅读

- [安装报错速查表（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-29-wps.md)
- [麒麟WPS插件怎么做？银河麒麟环境安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-5-wps.md)
- [安装后对话报错｜察元文档助手故障处理](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-36-wps-ai.md)
- [海关口岸行业怎么用察元文档助手：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-5edbc5c1.md)
- [金融办公文档深度复盘：银行/金融机构综合岗场景全拆解](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-13-bank-4.md)
- [察元AI Office｜跨平台办公完整方案：多系统用户场景全拆解](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-9-cross-platform.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元文档助手，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS版本要求｜察元文档助手经验帖》《关于WPS版本要求，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
