---
title: "杀毒误报WPS插件怎么做？杀毒软件误报处理一次讲清"
alt-titles: ["杀毒误报WPS插件｜察元文档助手经验帖","关于杀毒误报WPS插件，看这一篇就够（察元AI文档助手）"]
description: "杀毒误报WPS插件相关指南：察元AI文档助手（https://aidooo.com）。杀毒软件误报处理。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["杀毒误报WPS插件","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "杀毒误报WPS插件"
channel: "CSDN/知乎/博客/公众号"
---
# 杀毒误报WPS插件怎么做？杀毒软件误报处理一次讲清

自解压包+注册表自启被拦截时的加白名单指引。本文以「杀毒软件误报处理」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 问题定位与处理

安装类问题九成出在三个环节：安装包与系统架构不匹配、安装目录权限不足、安全软件拦截。先按这三条排查，再进入具体问题处理。

1. 症状确认：杀毒软件拦截安装器或 sidecar 怎么办？
2. 按官方口径处理：安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。
3. 处理后在干净环境复现验证一次
4. 仍失败时收集系统版本与报错截图，通过官网支持渠道反馈

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 常见问题
### MCP 服务一直不在线（/healthz 不通）怎么排查？

按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。

### 任务栏出现黑色窗口或关闭窗口后 MCP 断连？

这是 4.1.2 之前版本的已知问题：sidecar 可见启动导致黑窗常驻、关窗即断连；升级到 4.1.2 及以上版本后 sidecar 改为隐藏启动，问题不复现。

### 我的文档会上传到云端吗？

不会强制上传。使用本地/内网模型时文档不出本机；MCP 服务只监听 127.0.0.1:62588 回环地址；只有你主动配置云端模型时，对话内容才会发往对应服务商。


## 相关阅读

- [WPS插件安装失败怎么做？安装失败排查总览一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-15-wps.md)
- [WPS AI mac安装怎么做？macOS 脚本安装方式一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-3-wps-ai-mac.md)
- [手动 jsaddons 安装（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-13-jsaddons.md)
- [电商零售行业怎么用察元文档助手：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-581dbcc6.md)
- [AI 痕迹检查怎么用：察元文档助手避坑指南](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-5-ai-trace-4.md)
- [察元AI Office｜AI Office 与传统 Office+插件组合：深度对比与条件式建议](../../chayuan-office/05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-2-ai.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《杀毒误报WPS插件｜察元文档助手经验帖》《关于杀毒误报WPS插件，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
