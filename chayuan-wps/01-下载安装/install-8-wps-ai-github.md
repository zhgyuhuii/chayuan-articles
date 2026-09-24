---
title: "WPS AI插件GitHub怎么做？GitHub 下载指引一次讲清"
alt-titles: ["WPS AI插件GitHub｜察元文档助手经验帖","关于WPS AI插件GitHub，看这一篇就够（察元AI文档助手）"]
description: "WPS AI插件GitHub相关指南：察元AI文档助手（https://aidooo.com）。GitHub 下载指引。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS AI插件GitHub","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS AI插件GitHub"
channel: "CSDN/知乎/博客/公众号"
---
# WPS AI插件GitHub怎么做？GitHub 下载指引一次讲清

开源仓库的 Releases 下载、sha256 校验文件用途。本文以「GitHub 下载指引」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通过GitHub 仓库获取

开源 Apache-2.0，安装包与源码。全部获取渠道：官网 aidooo.com（产品家族总入口，含技能包专页 /skill）；GitHub 仓库（开源 Apache-2.0，安装包与源码）；Gitee 国内镜像（国内网络优选，下载更稳）；百度网盘（离线环境/内网机器转存使用）。

1. 打开 https://github.com/zhgyuhuii/chayuan-wps-releases
2. 按平台选择安装包：Windows 用 自解压 exe（约 35MB，带 .sha256 校验文件）；macOS 用 pkg 安装包（约 35MB）；Linux 用 deb 安装包（约 35MB）
3. 下载后先做完整性确认（有校验文件的包先校验）
4. 按对应平台的安装步骤完成安装

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- 安装后 WPS 功能区没有出现察元页签怎么办？——先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。
- Windows PowerShell 5.1 执行一行命令中文乱码？——v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 匿名指标上报默认关闭（opt-in），不采集文档内容
- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步

## 常见问题
### 双击安装包没反应？

常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。

### 我的文档会上传到云端吗？

不会强制上传。使用本地/内网模型时文档不出本机；MCP 服务只监听 127.0.0.1:62588 回环地址；只有你主动配置云端模型时，对话内容才会发往对应服务商。

### 支持哪些 WPS 版本？

WPS 文字 12.x 与 WPS 365（WebView2）桌面端；不支持网页版 WPS。


## 相关阅读

- [麒麟WPS插件怎么做？银河麒麟环境安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-5-wps.md)
- [arm64 与 x64 选型｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-21-arm64-wps.md)
- [杀毒误报WPS插件怎么做？杀毒软件误报处理一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-37-wps.md)
- [支持国产化环境吗？](../06-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/faq-3e49a66b.md)
- [匿名遥测的 opt-in 设计：察元文档助手的实操要点](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-201-opt-in.md)
- [察元AI Office｜行政/办公室文员提效实录路线：通知写作这样落地](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-1-notice-5.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS AI插件GitHub｜察元文档助手经验帖》《关于WPS AI插件GitHub，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
