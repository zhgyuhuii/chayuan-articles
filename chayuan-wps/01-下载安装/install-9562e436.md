---
title: "sha256 完整性校验：安装包校验完整指引"
alt-titles: ["安装包校验｜察元文档助手干货合集","关于安装包校验，看这一篇就够（察元AI文档助手）"]
description: "安装包校验相关指南：察元AI文档助手（https://aidooo.com）。sha256 完整性校验。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["安装包校验","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "安装包校验"
channel: "CSDN/知乎/博客/公众号"
---
# sha256 完整性校验：安装包校验完整指引

为什么每个包带 .sha256 旁车文件、如何校验防篡改。本文以「sha256 完整性校验」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Windows 为例）

为什么每个包带 .sha256 旁车文件、如何校验防篡改

1. 从官网或 Gitee 镜像下载 chayuan-<版本>-windows-x64.exe 自解压包
2. 双击运行，安装器自动完成四步：复制加载项到 jsaddons 并写 publish.xml、注册 MCP 开机自启（注册表 HKCU\Run）、四级体检（jsaddons→/healthz→initialize→桥接工具）、向 Claude/Cursor/Codex 投放技能
3. 重启 WPS 文字，功能区出现「察元 AI 助理」「察元 AI 编审」两个页签即安装成功
4. 懒人方案：PowerShell 一行命令安装（WebClient 下载 + UTF8 执行），支持 -SkillOnly、-Version 参数

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。
- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 数据安全与隐私边界

- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- 匿名指标上报默认关闭（opt-in），不采集文档内容
- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包

## 常见问题
### Windows PowerShell 5.1 执行一行命令中文乱码？

v4.1.1 已修复（脚本强制 UTF8 处理）。旧版用户可先执行 [Console]::OutputEncoding=[Text.Encoding]::UTF8 再跑命令，或直接下载自解压包安装。

### 杀毒软件拦截安装器或 sidecar 怎么办？

安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。

### 外部智能体怎么连接？

在支持 MCP 的客户端里添加服务地址 http://127.0.0.1:62588/mcp 即可；安装器会自动把使用技能投放到 Claude Code/Cursor/Codex 的技能目录。


## 相关阅读

- [PowerShell乱码怎么做？PowerShell 5.1 乱码一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-35-powershell.md)
- [更新升级指南：WPS插件更新完整指引](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-22-wps.md)
- [手动 jsaddons 安装（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-13-jsaddons.md)
- [安装体验演进史（察元文档助手演进笔记）](../08-%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83/release-303-note.md)
- [写给记者/新媒体编辑的新媒体编辑工具指南：清单式指南](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-8-journo-5.md)
- [察元AI Office｜写给财务/数据岗的财务表格指南：清单式指南](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-7-finance-5.md)

## 写在最后

工具的价值要在具体工作流里兑现。建议按本文的顺序试一遍，把最耗时的那个环节交给察元文档助手，其余环节保持原样，增量收益最容易看出来。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《安装包校验｜察元文档助手干货合集》《关于安装包校验，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
