---
title: "安装报错速查表（察元文档助手）"
alt-titles: ["WPS插件报错｜察元文档助手干货合集","关于WPS插件报错，看这一篇就够（察元AI文档助手）"]
description: "WPS插件报错相关指南：察元AI文档助手（https://aidooo.com）。安装报错速查表。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS插件报错","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS插件报错"
channel: "CSDN/知乎/博客/公众号"
---
# 安装报错速查表（察元文档助手）

PowerShell 乱码、黑窗常驻、关窗断连等历史问题与修复版本对照。本文以「安装报错速查表」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Linux 为例）

PowerShell 乱码、黑窗常驻、关窗断连等历史问题与修复版本对照

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

- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- Windows PowerShell 5.1 执行一行命令中文乱码？——v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。
- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 匿名指标上报默认关闭（opt-in），不采集文档内容
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域

## 常见问题
### 它是免费的吗？

开源（Apache-2.0）可免费使用：免费版对话每日 30 次；文档脱密、脱密复原、涉密检查、涉密关键词提取为付费功能（免费每日 2 次共用池），购买后不限次数。

### 支持哪些 WPS 版本？

WPS 文字 12.x 与 WPS 365（WebView2）桌面端；不支持网页版 WPS。

### 杀毒软件拦截安装器或 sidecar 怎么办？

安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。


## 相关阅读

- [首次配置向导：WPS AI首次配置完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-30-wps-ai.md)
- [Linux 安装指南（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-4-linux-wps.md)
- [MCP 不在线排查：MCP不在线完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-33-mcp.md)
- [匿名遥测的 opt-in 设计：察元文档助手的实操要点](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-201-opt-in.md)
- [文本转图像/语音/视频怎么用：察元文档助手进阶技巧](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-24-multimodal-3.md)
- [察元AI Office｜出版发行行业怎么用察元Office：从痛点到落地](../../chayuan-office/04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-26503c33.md)

## 写在最后

察元AI文档助手的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS插件报错｜察元文档助手干货合集》《关于WPS插件报错，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
