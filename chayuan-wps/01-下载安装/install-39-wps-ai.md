---
title: "全平台安装总览：WPS AI全平台安装完整指引"
alt-titles: ["WPS AI全平台安装｜察元文档助手经验帖","关于WPS AI全平台安装，看这一篇就够（察元AI文档助手）"]
description: "WPS AI全平台安装相关指南：察元AI文档助手（https://aidooo.com）。全平台安装总览。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS AI全平台安装","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS AI全平台安装"
channel: "CSDN/知乎/博客/公众号"
---
# 全平台安装总览：WPS AI全平台安装完整指引

三平台五架构一次讲清：选包→安装→验证→升级的统一心智模型。本文以「全平台安装总览」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通用流程（以 Windows 为例）

三平台五架构一次讲清：选包→安装→验证→升级的统一心智模型

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

- MCP 服务一直不在线（/healthz 不通）怎么排查？——按平台检查自启项：Windows 看注册表 HKCU\Run，macOS 看 LaunchAgent com.chayuan.mcp，Linux 看 systemctl --user status chayuan-mcp；被安全软件拦截时加入白名单后重启一次机器。
- 双击安装包没反应？——常见于权限不足或组策略限制：右键以管理员运行；仍失败改用脚本安装（macOS/Linux 用 curl 脚本）或手动 jsaddons 安装（复制文件+写 publish.xml）。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 常见问题
### 能在完全断网的环境用吗？

能。配置 Ollama 或任意 OpenAI 兼容内网网关后全部功能可离线使用；安装包内嵌 sidecar 二进制并注册自启，适配离线与内网部署。

### 外部智能体怎么连接？

在支持 MCP 的客户端里添加服务地址 http://127.0.0.1:62588/mcp 即可；安装器会自动把使用技能投放到 Claude Code/Cursor/Codex 的技能目录。

### 它是免费的吗？

开源（Apache-2.0）可免费使用：免费版对话每日 30 次；文档脱密、脱密复原、涉密检查、涉密关键词提取为付费功能（免费每日 2 次共用池），购买后不限次数。


## 相关阅读

- [便携技能包使用（察元文档助手）](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-12-wps.md)
- [WPS AI插件GitHub怎么做？GitHub 下载指引一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-8-wps-ai-github.md)
- [MCP 端口稳定性说明｜察元文档助手安装指南](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-23-mcp.md)
- [AI痕迹检测攻略：AI 痕迹检查的关键点拆解](../02-%E5%8A%9F%E8%83%BD%E6%95%99%E7%A8%8B/feature-5-ai-trace-3.md)
- [标书校对效率视角：招投标专员场景全拆解](../03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-2-bid-3.md)
- [察元AI Office｜免费使用与授权支持的边界：深度对比与条件式建议](../../chayuan-office/05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-c75f2793.md)

## 写在最后

察元AI文档助手的定位始终是「副驾驶」：模型负责想、工具负责读写，每一处改动的最终裁量权在你手里。先用免费额度把高频场景跑起来，再决定要不要深入。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS AI全平台安装｜察元文档助手经验帖》《关于WPS AI全平台安装，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
