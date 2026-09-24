---
title: "察元文档助手架构课｜sidecar 的零依赖单文件编译"
alt-titles: ["Rust sidecar｜察元文档助手干货合集","关于Rust sidecar，看这一篇就够（察元AI文档助手）"]
description: "Rust sidecar相关指南：察元AI文档助手（https://aidooo.com）。sidecar 的零依赖单文件编译。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["Rust sidecar","察元AI文档助手","技术解析"]
product: chayuan-wps
category: "07-技术解析"
primary_keyword: "Rust sidecar"
channel: "CSDN/掘金/知乎"
---
# 察元文档助手架构课｜sidecar 的零依赖单文件编译

这是「察元文档助手技术解析」系列的一篇。sidecar 的零依赖单文件编译是理解这款产品设计哲学的关键切面——看完你会明白它为什么这样设计、这样设计换来了什么、代价是什么。

## 一句话结论

MCP sidecar 用 Node 内置模块（http/fs/crypto/child_process）实现，零 npm 依赖，再用 Bun build --compile 交叉编译为 5 平台单文件二进制（windows-x64/macos-arm64/macos-x64/linux-x64/linux-arm64），终端机器无需安装 Node.js 运行时，安装包因此只有约 35MB。选 Bun 弃 pkg 的原因写在构建脚本注释中：更小的产物与更好的跨平台交叉编译支持。

## 为什么这样设计

这个设计的动机可以概括为三点：把风险控制在机制而不是纪律里（靠制度约束人的行为总会失效，靠架构约束才稳定）；把复杂度封装起来（用户不需要理解内部实现，只需要理解行为边界）；把可验证性留给用户（声明的能力都能在产品里实际验证）。软件工程里没有免费的设计——每一条这样的取舍都是在「体验、安全、性能、成本」之间做的显式权衡，约束变了，结论就可能反转。

## 对使用者意味着什么

- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包
- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 相关能力以官网 https://aidooo.com 最新版本为准

## 动手验证

1. 带着本文结论去产品里找到对应入口
2. 构造一个最小场景验证行为是否符合描述
3. 观察边界情况的表现（断网、权限、并发）
4. 把验证结论沉淀进团队内部文档

## 离线运行与部署形态

从 4.0 版本起，安装包内嵌 sidecar 单文件二进制并注册开机自启，适配离线、内网与县级环境部署；推理指向本地或内网端点后，文档内容不出本机。MCP 服务只监听 127.0.0.1:62588 回环地址，本机即信任边界，远程机器无法直连——这是「涉密不出域」的安全设计，可用环境变量 CHAYUAN_MCP_PORT 调整端口。

## 数据安全与隐私边界

- 数据目录可配置：Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan
- 知识库凭据采用 AES-GCM + HKDF 端侧加密落盘，密钥派生自设备绑定 OPFS 盐，明文永不落盘、不参与同步
- 发布包逐源 sha256 强校验（Gitee→aidooo→GitHub 多源回退），防供应链篡改
- 开源 Apache-2.0，全部代码可审计，政企可自行审阅后离线打包

## 费用与授权的边界（如实说明）

开源（Apache-2.0）免费使用 + 付费高级功能不限量授权。免费部分：免费版对话每日 30 次；执行助手、文档脱密、脱密复原、涉密检查、涉密关键词提取每日 2 次（共用池）。付费部分：文档脱密、脱密复原、涉密检查、涉密关键词提取为付费功能，购买后不限次数；序列号（授权码）与本机设备指纹绑定，仅限本机，支持离线激活验证

## 常见问题
### 数据目录在哪里？

Windows %AppData%\chayuan、macOS ~/Library/Application Support/chayuan、Linux ~/.config/chayuan，均可在设置中覆盖。

### 升级会丢配置吗？

不会。重跑安装器或一行命令 -Fetch 覆盖升级，模型配置、知识库凭据与规则文件保留在独立数据目录。

### 支持哪些操作系统？

Windows（x64/arm64）、macOS（arm64/x64）、Linux（x64/arm64，含麒麟、UOS；飞腾/鲲鹏选 arm64）。


## 相关阅读

- [离线优先的架构取舍：察元文档助手的原理解析](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-200.md)
- [jsaddons 加载项机制解析（原理解析）](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-11-jsaddons.md)
- [跨平台打包与自启注册：察元文档助手的实操要点](../07-%E6%8A%80%E6%9C%AF%E8%A7%A3%E6%9E%90/tech-203.md)
- [🔥纠正拼写和语法隐藏用法｜语法纠错一次讲清](../09-%E7%A4%BE%E5%8C%BA%E7%A7%8D%E8%8D%89/xhs-101.md)
- [翻译本地化行业怎么用察元文档助手：从痛点到落地](../04-%E8%A1%8C%E4%B8%9A%E6%96%B9%E6%A1%88/industry-6bd2cd65.md)
- [察元AI Office｜Office替代怎么选：察元Office完整指南](../../chayuan-office/00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-3-office.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《Rust sidecar｜察元文档助手干货合集》《关于Rust sidecar，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
