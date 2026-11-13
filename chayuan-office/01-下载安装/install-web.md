---
title: "网页版部署：企业内网部署网页版"
description: "网页版部署指南：察元AI Office按平台架构的安装步骤、验证方法与排错。"
keywords: ["网页版部署", "察元AI Office", "下载安装", "web", "SaaS"]
product: chayuan-office
category: "01-下载安装"
primary_keyword: "网页版部署"
channel: "CSDN/知乎/博客"
---

# 网页版部署：企业内网部署网页版

网页版部署是企业内网用上这套办公套件的另一条路：服务跑在一台主机上，团队成员浏览器直接访问，省去逐台装客户端。这篇从部署前置讲到验证结果，docker compose 与 dsh 插件两条线都覆盖。

## 安装前确认

- 系统要求：Windows 10 及以上，x64/arm64
- 安装包：NSIS 安装器 exe
- 说明：自建网页版形态。

## 实操全过程

1. 安装包经由官方发布页或仓库发布区下发到部署机
2. 双击安装
3. 启动后在设置里配置模型供应商（BYOK）或指向本机 Ollama
4. 开始页新建或打开文档

## 其他平台装法速览

macOS：dmg 包从官方发布处下载；拖入应用程序文件夹启动；设置＞模型设置里接入模型。

## 装完后的第一件事

让部署活起来的验证两步走：设置里完成模型接入（BYOK 或本机端点），接着新建 docx 请 AI 写一段并做全文校对；两项都响应，部署即算可用。

## 如何确认操作生效

- 开始页能新建六种格式文档，设置里模型可配置
- 若没有生效，先完全退出宿主软件再重启一次

## 部署前要认清的能力差集

部署前先划出能力差集：

- web/dsh 两种形态只含五个编辑器、没有 HTML，购买与激活界面也不存在

## 常见问题

### Dock 图标点开后窗口卡在「引擎启动中…」，正常吗？

背后是插件宿主在拉起 BFF sidecar，首启或机器繁忙时等上几十秒属正常，启动超时上限 60 秒。若长时间停在该画面，查 dsh 日志：看到 sidecar bundle missing 即插件制品不完整，回源仓重跑 npm run package:plugin 再装一遍；报「启动失败」的处理方式相同。

### 在插件里换了模型，独立安装版的那份配置会跟着动吗？

不会跟着变。插件形态读写的模型配置来自宿主系统（harness）那份档案，与桌面侧同源；独立安装版另有一份本地配置文件，两边互不干扰。

### 部署好的 web 服务，访问时要求登录吗？

CHATOFFICE_AUTH 默认 off，打开就能用、没有账号体系；若要接产品账号，需自行部署 Logto 并把变量切到 jwt（compose 里 Logto 服务以注释形式预留，解开即用）。

## 普通用户：从 Dock 进入

第 1 步 · 在宿主系统里打开 Office（dsh 插件形态，普通用户）

1. 宿主系统桌面 Dock 栏中的「察元AI Office」图标（名称随外壳语言变化：中文显示「察元AI Office」，其他语言显示「ChaAI Office」）点击即开窗，窗口默认最大化。
2. 窗口采用「一行式」自绘样式（TabBar 位于应用顶部一行，窗口按钮叠放在行两端；老版外壳会自动回落到默认标题栏）；窗体内是网页宿主：五编辑器标签加首页。
3. 第一次点击若出现「察元AI Office 引擎启动中…」字样，说明插件正在拉起后台引擎（BFF sidecar），稍候即可进入；若提示「引擎启动失败（详见 dsh 日志）」，大概率是插件制品不完整，按第 3 步重新打包安装。

## 形态差异：插件版对比独立版

第 2 步 · 理解插件形态与独立安装版的差异

1. 没有 Electron 主进程：引擎退化为纯 Node 后台服务（BFF sidecar），由插件宿主负责拉起与守护（127.0.0.1 动态端口、/healthz 就绪探测、孤儿进程回收、卸载即停止）。
2. 数据落在 ~/.dsh/storages/chaoffice/（可用 DSH_HOME 覆盖），与独立安装版的用户目录完全隔离。
3. 不带内置账号：该形态固定免登录（无内置账号、无云端项目）。
4. 模型与知识库依托宿主系统：供应商档案与密钥直接读写系统的模型配置（与桌面侧同源）；知识库经 harness 的 /api/chatop-kb 只读接入——Office 里切了模型，宿主侧同一份档案同步生效。
5. 其余功能（五编辑器、AI 面板、长文写作、打印、自动保存等）与独立安装版无差别。

## 自建者：安装插件到 harness

第 3 步 · 自建环境安装插件（可选，面向 harness 自建者）

1. 在 chayuan-office 仓库根执行 npm run package:plugin——一步产出：web 包 ＞ sidecar ＞ 插件 dist ＞ tgz。
2. harness 形态安装：dsh plugin --profile web add -w /path/to/chayuan-office/dsh-plugin；重启 dsh web 即在界面里看到 Office 应用图标。
3. 桌面版（Electron 形态）受管 profile 的等效安装与排障说明在 dsh-plugin/README.md。

## 部署主机：compose 拉起三服务

第 4 步 · 部署 web 形态（docker compose 一键）

```sh
docker compose -f docker/docker-compose.yml up -d
```

1. 仓库自带 docker/docker-compose.yml，一次拉起 server、Postgres 17、MinIO 三个服务：
2. 关键约定：
    1. BFF 端口：server 服务对外映射 52587（镜像内监听端口由 PORT 决定，默认 52587）；
    2. 数据目录：容器内 /data（volume server-data）；
    3. 账号开关：CHATOFFICE_AUTH——off（默认，免登录）/ jwt（接 Logto 后启用）；
    4. Postgres 与 MinIO 的连接参数在 compose 里以注释形式给出（POSTGRES_URL、S3_ENDPOINT），需要持久化到数据库/对象存储时再启用；MinIO 控制台映射在 9001；
    5. 环境口令 POSTGRES_PASSWORD、MINIO_ROOT_PASSWORD 有默认值，生产部署务必覆盖。
    6. 不想用 compose 也行，按镜像头注释直接 docker build -f apps/server/Dockerfile -t chaoffice-server . && docker run -p 52587:<容器端口> chaoffice-server（单镜像同端口提供 API、web 宿主与五个编辑器静态资源）。
    7. 源码开发运行：npm run dev:web 起 web 宿主（5180），五个编辑器各自 dev 服务跑在 5173–5177。
    8. 团队成员浏览器打开 http://<主机>:52587（或开发形态 http://<主机>:5180）即用；远端知识库在 web 形态经同源 /kb/* 只读代理。

## 部署后的核对动作

验证

1. dsh 插件形态：宿主桌面（或 dsh web）重启后，Dock 里应出现「察元AI Office」图标；开窗后窗体内是五编辑器标签宿主。
2. 插件管理面：curl http://127.0.0.1:52584/api/chaoffice/status（经 dsh web 端口）应返回形如 {"ok":true,"status":"ready","appOrigin":"/chaoffice-app/"}；status 为 starting/failed 分别对应启动中与失败。
3. web 形态：docker compose -f docker/docker-compose.yml up -d 后，docker compose logs server | grep listening 看到监听地址；curl http://127.0.0.1:52587/healthz 应返回 {"ok":true,"ts":…}。端口不通时，用 docker port <容器名> 核对映射目标端口与容器实际 PORT 是否一致。
4. 浏览器打开服务地址：应看到 Office 网页宿主，能新建 Docs/Sheets/Slides/PDF/Markdown 五类文档（无 HTML 编辑器即为正确形态）。

## 补充答疑

### 这两种轻量形态里还有 HTML 编辑器可用吗？

没有。dsh 插件与 web 形态统一只打包五个编辑器（docs/sheets/slides/pdf/markdown），HTML 可视化编辑仅独立安装版提供。

### 服务起了但 52587 端口访问不通，从哪查起？

先 docker compose ps 看容器是否健康（Postgres 有就绪检查）、docker compose logs server 看监听日志；再核对端口映射与容器实际监听端口（镜像 ENV PORT=52587，compose 映射写法见第 4 步验证第 3 条）；POSTGRES_PASSWORD/MINIO_ROOT_PASSWORD 被环境变量覆盖过时确认三服务取到同一套值。

## 部署前的条件清单

- dsh 插件形态：宿主 OS 桌面版出厂内置该插件（开箱即用，Dock 直接出现「察元AI Office」图标）；自建 harness dsh web 环境则要手动安装插件（见第 3 步）。
- web 形态：一台能跑 docker 的主机（或 Node 22+ 环境与仓库源码）；浏览器访问。
- 两种形态都只有五个编辑器：Docs / Sheets / Slides / PDF / Markdown（无 HTML 编辑器）。

## 这套部署方式的价值点

- OS 内插件直达
- 自建 web 服务
- 多用户访问

## 形态定位与取舍

自建部署可做到零遥测，数据边界完全由自己掌控；仅桌面形态提供 HTML 编辑器这一条要记牢，网页版用户用不到它。服务器部署让全员浏览器可用，正是团队化办公要的形态；Linux 机器无系统引擎不识别扫描件这类限制，各端一致，不因部署方式改变。

一句话收拢：网页版部署的核心收益是「装一次、全员用」，插件直达是它的轻量版。其余细节按上文小节索引。

---

web 形态部署行为与端口约定对应 1.0.15 版，数据截至 2026 年 10 月；本文限定 docker compose 部署、dsh 插件安装与验证排障三条线，桌面安装版细节不展开，后续版本以官方文档为准。
