---
title: "MCP健康检查怎么做？健康检查四步体检一次讲清"
alt-titles: ["MCP健康检查｜察元文档助手经验帖","关于MCP健康检查，看这一篇就够（察元AI文档助手）"]
description: "MCP健康检查相关指南：察元AI文档助手（https://aidooo.com）。健康检查四步体检。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["MCP健康检查","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "MCP健康检查"
channel: "CSDN/知乎/博客/公众号"
---
# MCP健康检查怎么做？健康检查四步体检一次讲清

jsaddons→/healthz→initialize→桥接工具四级体检怎么做。本文以「健康检查四步体检」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Linux 为例）

jsaddons→/healthz→initialize→桥接工具四级体检怎么做

1. 下载 chayuan-<版本>-linux 对应架构的 deb/安装包
2. 运行安装脚本或按手动路径安装：~/.local/share/Kingsoft/wps/jsaddons；麒麟/UOS 专业版在 /opt/apps/cn.wps.wps-office-pro/.../office6/jsaddons
3. MCP 服务通过 systemd --user（chayuan-mcp.service）注册自启
4. 重启 WPS（必要时终端执行 quickstartoffice restart），功能区出现察元页签

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 匿名指标上报默认关闭（opt-in），不采集文档内容
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域

## 常见问题
### 对话报「模型未配置」或调用失败？

进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。

### 校对结果可靠吗？

校对由大模型推理完成，输出「原文引用+建议+理由」的结构化清单并默认以批注写回，每条都由人工裁决；它擅长语境类错误（搭配、语法、逻辑），最终采用权在用户。

### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。


## 相关阅读

- [安装包格式对比｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-27-wps.md)
- [双击安装无反应：安装无反应完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-11704542.md)
- [加载项不显示排查｜察元文档助手故障处理](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-31-wps.md)
- [公文校对避坑与选型：以察元文档助手为例](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-505f8a9c.md)
- [错字检查避坑与选型：以察元文档助手为例](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-b4253f30.md)
- [察元AI Office｜财务表格新手路线：财务/数据岗场景全拆解](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-7-finance-2.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元文档助手，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《MCP健康检查｜察元文档助手经验帖》《关于MCP健康检查，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
