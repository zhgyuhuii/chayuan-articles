---
title: "MCP服务自启怎么做？MCP 自启验证一次讲清"
alt-titles: ["MCP服务自启｜察元文档助手经验帖","关于MCP服务自启，看这一篇就够（察元AI文档助手）"]
description: "MCP服务自启相关指南：察元AI文档助手（https://aidooo.com）。MCP 自启验证。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["MCP服务自启","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "MCP服务自启"
channel: "CSDN/知乎/博客/公众号"
---
# MCP服务自启怎么做？MCP 自启验证一次讲清

浏览器访问 /healthz 看 online、检查注册表/LaunchAgent/systemd 三平台自启项。本文以「MCP 自启验证」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 macOS 为例）

浏览器访问 /healthz 看 online、检查注册表/LaunchAgent/systemd 三平台自启项

1. 下载 chayuan-<版本>-macos 安装包（按芯片选 arm64 或 x64）
2. 双击 pkg 按引导完成安装，加载项落位 ~/Library/Containers/com.kingsoft.wpsoffice.mac/Data/.kingsoft/wps/jsaddons
3. 安装器注册 LaunchAgent（com.chayuan.mcp）实现 MCP 服务开机自启
4. 重启 WPS，功能区出现两个察元页签即完成

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：升级采用覆盖安装方式，用户数据目录不受影响

## 相关报错速查

- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。
- Windows PowerShell 5.1 执行一行命令中文乱码？——v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。
- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 匿名指标上报默认关闭（opt-in），不采集文档内容
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- MCP 服务仅监听 127.0.0.1:62588，无需 Token 与命令行，sidecar 与 WPS 同机运行，文档与密钥不出域
- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步

## 常见问题
### 双击安装包没反应？

常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。

### 杀毒软件拦截安装器或 sidecar 怎么办？

安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。

### 安装后 WPS 功能区没有出现察元页签怎么办？

先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。


## 相关阅读

- [arm64 与 x64 选型｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-21-arm64-wps.md)
- [sha256 完整性校验：安装包校验完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-9562e436.md)
- [WPS插件安装失败怎么做？安装失败排查总览一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-15-wps.md)
- [条形码生成攻略：条形码批量生成的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-25-barcode-2.md)
- [错字检查避坑与选型：以察元文档助手为例](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-b4253f30.md)
- [察元AI Office｜教师的教师办公方案（深度复盘）](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-6-teacher-4.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元文档助手，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《MCP服务自启｜察元文档助手经验帖》《关于MCP服务自启，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
