---
title: "网页版部署安装指南：全平台步骤与验证"
description: "网页版部署指南：察元AI Office按平台架构的安装步骤、验证方法与排错。"
keywords: ["网页版部署", "察元AI Office", "下载安装", "web", "SaaS"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "网页版部署"
channel: "CSDN/知乎/博客"
---

# 网页版部署安装指南：全平台步骤与验证

网页版部署是什么、怎么用，一篇讲清楚。开源 AI 办公套件，六编辑器一体，AI 嵌进每个编辑器。下面进入正题：先概念，再步骤，最后是边界与常见问题，基于察元AI Office整理。

## 安装前确认

- 系统要求：Windows 10 及以上，x64/arm64
- 安装包：NSIS 安装器 exe
- 说明：自建网页版形态。

Windows 10+（x64/arm64）、macOS 11+（Apple Silicon/Intel）、Linux（deb/rpm/AppImage，x64/arm64，AppImage 需 glibc 2.34+）；另有浏览器 SaaS 与 dsh 插件形态（五编辑器，无 HTML）。安装包从官网 aidooo.com 获取或 GitHub Releases，其他站点均非官方渠道。

## 完整操作步骤

1. 官网 aidooo.com 或 GitHub Releases 下载 exe
2. 双击安装
3. 启动后在设置里配置模型供应商（BYOK）或指向本机 Ollama
4. 开始页新建或打开文档

## 全平台安装速览

| 平台 | 环境要求 | 安装包 |
|---|---|---|
| Windows | Windows 10 及以上，x64/arm64 | NSIS 安装器 exe |
| macOS | macOS 11 及以上，Apple Silicon/Intel | dmg 与 zip |
| Linux | deb/rpm/AppImage；AppImage 需 glibc 2.34+ | deb/rpm/AppImage（x64/arm64） |

## 装完后的第一件事

开始页新建一个 docx，在设置模型里接上厂商 API 或本机 Ollama，然后让首页 AI 生成一段测试文本——三步都通，环境就绪。

## 怎么确认做成了

- 开始页能新建六种格式文档，设置里模型可配置
- 若没有生效，先完全退出宿主软件再重启一次

## 这些坑和边界要知道

如实说明，它不是万能的：

- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx
- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用

## 你可能会问

### Dock 点开后一直「引擎启动中…」？

插件宿主正在拉起 BFF sidecar（首次或机器繁忙时会多等几十秒，60 秒启动超时）。长时间停留则看 dsh 日志：提示 sidecar bundle missing 说明插件制品没打包完整——回到源仓重跑 npm run package:plugin 再安装；提示「启动失败」同理。

### 插件形态里改了模型，独立安装版会跟着变吗？

不会。插件形态的模型配置融合的是察元OS（harness）那份配置，与察元桌面同源；独立安装版有自己的本地配置文件，两者互不影响。

### compose 起服务后 52587 打不开？

先 docker compose ps 看容器是否健康（Postgres 有就绪检查）、docker compose logs server 看监听日志；再核对端口映射与容器实际监听端口（镜像 ENV PORT=52587，compose 映射写法见第 4 步验证第 3 条）；POSTGRES_PASSWORD/MINIO_ROOT_PASSWORD 被环境变量覆盖过时确认三服务取到同一套值。

## 补充答疑

### 插件形态能用 HTML 编辑器吗？

不能。dsh 插件与 web 形态统一只打包五个编辑器（docs/sheets/slides/pdf/markdown），HTML 可视化编辑仅独立安装版提供。

### web 形态要登录吗？

默认 CHATOFFICE_AUTH=off，打开即用、无账号体系；要接入产品账号需部署 Logto 并把该变量切为 jwt（compose 中 Logto 服务以注释形式预留）。

## 更多操作细节

第 4 步 · 部署 web 形态（docker compose 一键）

sh

docker compose -f docker/docker-compose.yml up -d

1. 仓库自带 docker/docker-compose.yml（server + Postgres 17 + MinIO 三服务）：
2. 关键约定：
    1. BFF 端口：server 服务对外映射 52587（镜像内监听端口由 PORT 决定，默认 52587）；
    2. 数据目录：容器内 /data（volume server-data）；
    3. 账号开关：CHATOFFICE_AUTH——off（默认，免登录）/ jwt（接 Logto 后启用）；
    4. Postgres 与 MinIO 的连接参数在 compose 里以注释形式给出（POSTGRES_URL、S3_ENDPOINT），需要持久化到数据库/对象存储时再启用；MinIO 控制台映射在 9001；
    5. 环境口令 POSTGRES_PASSWORD、MINIO_ROOT_PASSWORD 有默认值，生产部署务必覆盖。
    6. 也可不用 compose，按镜像头注释直接 docker build -f apps/server/Dockerfile -t chaoffice-server . && docker run -p 52587:<容器端口> chaoffice-server（单镜像同端口提供 API、web 宿主与五个编辑器静态资源）。
    7. 源码开发运行：npm run dev:web 起 web 宿主（5180），五个编辑器各自 dev 服务跑在 5173–5177。
    8. 团队成员浏览器打开 http://<主机>:52587（或开发形态 http://<主机>:5180）即用；远端知识库在 web 形态经同源 /kb/* 只读代理。

## 能力点备忘

- OS 内插件直达
- 自建 web 服务
- 多用户访问

## 安装与运行答疑

### 必须配置 API Key 才能用 AI 吗？

现阶段是。内置账号登录当前版本未开放，AI 功能需要 BYOK 接入厂商或本机 Ollama 等端点；不配模型时传统办公功能完全可用。

### Linux 上扫描件 OCR 没生效？

Linux 无系统 OCR 引擎，扫描页保留位图不识别；macOS 与 Windows 走系统引擎自动识别。

## 一个真实场景

机关单位文字岗的典型用法：Docs 写正文，察元AI 页签全文校对出批注，保密检查八大类风险扫描，修订追踪让 AI 改动落成通用修订，逐条接受。校对、保密、留痕一条链在离线环境完成。注意：涉密文档建议接本地模型，全文不出机器。

## 顺带了解

打印与自动保存：六编辑器统一打印链路；30 秒自动保存，关闭时询问未保存项。

为什么值得看：打印别掉链子、断电别丢稿，这是办公软件的两条底线。

## 还有这个能力

本地模型接入：支持 Ollama（11434 端口，带启动服务按钮、20 秒超时）、LM Studio、Xinference、OneAPI、NewAPI、GPUStack、FastChat 与 openai-compatible 免 Key 家族，内网与离线全可用。

## 硬口径两三条

- Docs 端 4576 个领域助手、229 个领域包，全库约 4600 个；表格 102、演示 100、PDF 100、Markdown 100、HTML 130
- 94 家模型供应商目录（国内 29/国际 34/本地 9/聚合 22）、28 个适配器，4 种可选协议

## 如实说不足

- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用
- Linux 无系统 OCR 引擎，扫描页保留位图不识别；OCR 每轮上限 40 页
- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx

## 定位与家族

察元AI Office（Chayuan AI Office）是一款 Apache-2.0 开源的 AI 办公套件，把 docx、xlsx、pptx、真文本 PDF、Markdown、HTML 六种编辑器装进一个应用，AI 校对以批注锚定原文、修订追踪生成通用修订，Docs 端内置 4576 个领域助手，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点，覆盖 Windows/macOS/Linux（含麒麟/UOS），本地优先、离线可用。同家族产品：察元AI OS（AI 桌面操作系统）、察元AI文档助手（WPS 加载项）、察元AI 能力广场（aidooo.com）。

## 边界速览

- ODF 导入采取保守策略：脚注、批注、文本框不完整保留，无法证明正确的公式只保留结果值
- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面

## 数字口径

- 六编辑器：docx/xlsx/pptx/真文本 PDF/Markdown/HTML（web/dsh 形态为五编辑器）
- 22 种界面语言
- chaoffice 命令行 17 个子命令；壳内 MCP 服务端口 52588
- 知识库五级自动发现，注册表端口 52584，检索上下文预算默认 12000 字

## 性能与兼容口径

1GB 大 docx 打开不卡（图片按哈希留原文件按需读）；全文搜索上屏后约 0.15 秒出结果；ODF 导入采取保守策略，无法证明正确的公式只保留结果值，不完整保留项进 dropped 清单，宁可少保也不猜错。

安装这步别跳验证：装完先确认核心功能可用，再往下配。

---

察元AI Office，开源 AI 办公套件，六编辑器一体，AI 嵌进每个编辑器。官网 aidooo.com，数据截至 2026 年 10 月（版本 1.0.15）。
