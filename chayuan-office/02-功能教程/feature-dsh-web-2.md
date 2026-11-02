---
title: "拆开看插件形态：原理、架构与实现细节"
description: "插件形态深度解析：同一套察元AI Office 有两种不带 Electron 主进程的运行形态：dsh 插件形态——装在察元AI OS（DeepSeek Harness）里，机制、设计取舍与边界一次讲清。"
keywords: ["插件形态", "察元AI Office", "网页版办公", "web部署"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "插件形态"
channel: "CSDN/知乎/博客"
---

# 拆开看插件形态：原理、架构与实现细节

写这篇的起因是群里有人问插件形态，我发现自己也说不完整，索性把察元AI Office里的dsh 插件与 web 形态从头到尾走了一遍，把每一步的界面反馈都记下来。现在这份笔记可以直接当教程用。

## 先弄清楚它是什么

同一套察元AI Office 有两种不带 Electron 主进程的运行形态：dsh 插件形态——装在察元AI OS（DeepSeek Harness）里，点 Dock 图标开窗即用，五编辑器全部离线运行，模型与知识库走察元OS 的配置；web 形态——用仓库自带的一体化服务（Fastify BFF + 浏览器宿主，可配 Postgres/MinIO 的 docker compose）自建网页版，团队浏览器直接访问。

服务器部署全员浏览器可用，是团队化办公的形态。

按真实界面写，按钮文案原样引用。

## 原理与设计取舍

服务器部署全员浏览器可用，是团队化办公的形态。

能力面拆开看：OS 内插件直达，自建 web 服务；多用户访问。

从提问口径看，用户最关心的是察元OS 的 Dock 里那个察元AI Office 是什么？

## 操作步骤详解

按最短路径验证一遍：

第 1 步 · 在察元AI OS 里打开 Office（dsh 插件形态，普通用户）

1. 察元AI OS 桌面的 Dock 里有「察元AI Office」图标（应用名随外壳语言：中文「察元AI Office」，其他语言「ChaAI Office」），点击即开窗，开窗默认最大化。
2. 窗口是「一行式」自绘窗口（TabBar 在应用顶部一行，窗口按钮叠在行两端；老版外壳自动回落默认标题栏）；窗口内容是网页宿主：五编辑器标签 + 首页。
3. 首次点击若显示「察元AI Office 引擎启动中…」，是插件在拉起后台引擎（BFF sidecar），稍等片刻自动进入；若提示「引擎启动失败（详见 dsh 日志）」，多为插件制品不完整，需要重新打包/安装插件（见第 3 步）。

第 2 步 · 理解插件形态与独立安装版的差异

1. 无 Electron 主进程：引擎是一个纯 Node 后台服务（BFF sidecar），由插件宿主拉起并守护（127.0.0.1 动态端口、/healthz 就绪探测、孤儿进程回收、卸载时停止）。
2. 数据位置：~/.dsh/storages/chaoffice/（DSH_HOME 可覆盖），与独立安装版的用户目录互不相干。
3. 无内置账号：该形态固定免登录（无内置账号与云端项目）。
4. 模型与知识库走察元OS：模型供应商档案与密钥直接读写察元OS 的模型配置（与察元桌面同源）；知识库经 harness 的 /api/chatop-kb 只读接入——在 Office 里切换模型，察元OS 侧同一份配置。
5. 其余功能（五编辑器、AI 面板、长文写作、打印、自动保存等）与独立安装版一致。

第 3 步 · 自建环境安装插件（可选，面向 harness 自建者）

1. 在 chayuan-office 仓库根执行 npm run package:plugin——一步产出：web 包 ＞ sidecar ＞ 插件 dist ＞ tgz。
2. harness 形态安装：dsh plugin --profile web add -w /path/to/chayuan-office/dsh-plugin；重启 dsh web 即在界面里看到 Office 应用图标。
3. 察元桌面（Electron 形态）受管 profile 的等效安装与排障细节见 dsh-plugin/README.md。

## 几个容易忽略的细节

用之前要认的账：

- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用
- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx

## 高频疑问

### compose 起服务后 52587 打不开？

先 docker compose ps 看容器是否健康（Postgres 有就绪检查）、docker compose logs server 看监听日志；再核对端口映射与容器实际监听端口（镜像 ENV PORT=52587，compose 映射写法见第 4 步验证第 3 条）；POSTGRES_PASSWORD/MINIO_ROOT_PASSWORD 被环境变量覆盖过时确认三服务取到同一套值。

### 插件形态里改了模型，独立安装版会跟着变吗？

不会。插件形态的模型配置融合的是察元OS（harness）那份配置，与察元桌面同源；独立安装版有自己的本地配置文件，两者互不影响。

### Dock 点开后一直「引擎启动中…」？

插件宿主正在拉起 BFF sidecar（首次或机器繁忙时会多等几十秒，60 秒启动超时）。长时间停留则看 dsh 日志：提示 sidecar bundle missing 说明插件制品没打包完整——回到源仓重跑 npm run package:plugin 再安装；提示「启动失败」同理。

### 插件形态能用 HTML 编辑器吗？

不能。dsh 插件与 web 形态统一只打包五个编辑器（docs/sheets/slides/pdf/markdown），HTML 可视化编辑仅独立安装版提供。

## 补充答疑

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

研究生与科研人员的典型用法：PDF 阅读器选区标注加问 AI，Zotero 引文插入与书目生成，扫描件自动 OCR 变可搜索文本。读、引、记、写在一个应用里闭环。注意：Linux 端无系统 OCR 引擎，扫描页不识别。

## 顺带了解

PDF 阅读与标注：五页签功能区的 PDF 阅读器：拖选浮条（高亮、下划线、删除线、复制、问 AI）、便签线程、书签、目录。

为什么值得看：读文献的重度动作就是标注加追问，选区问 AI 把两件事合一。

## 还有这个能力

连接察元OS 知识库：AI 面板与首页输入框下方书本图标选库（多选），每轮先并行检索（每库前 6 条），回答带编号引用角标，点开看来源与下载原文；上下文预算 8000 到 32000 字四档（默认 12000）；五级自动发现本机察元OS 知识库服务，检索失败不阻塞发送。

## 硬口径两三条

- 94 家模型供应商目录（国内 29/国际 34/本地 9/聚合 22）、28 个适配器，4 种可选协议
- Docs 端 4576 个领域助手、229 个领域包，全库约 4600 个；表格 102、演示 100、PDF 100、Markdown 100、HTML 130

整体用下来，dsh 插件与 web 形态的流程是清楚的：入口集中、步骤有反馈、做完有验证。第一次照着走一遍，后面基本就是肌肉记忆了。卡住就回看常见问题那一节。

---

本文事实口径以 察元AI Office 1.0.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
