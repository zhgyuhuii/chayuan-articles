---
title: "网页版办公上手指南：照着做十分钟跑通"
description: "网页版办公完整教程：同一套察元AI Office 有两种不带 Electron 主进程的运行形态：dsh 插件形态——装在察元AI OS（DeepSeek Harness）里，步骤含真实按钮文案与验证方法。"
keywords: ["网页版办公", "察元AI Office", "插件形态", "web部署"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "网页版办公"
channel: "CSDN/知乎/博客"
---

# 网页版办公上手指南：照着做十分钟跑通

被网页版办公折腾过的人应该都有体会：明明是个高频操作，每次做都要重新想一遍流程。干脆整理成一篇，从打开哪个应用到看到什么结果，一步不落。以下内容以察元AI Office为准。

## 先弄清楚它是什么

同一套察元AI Office 有两种不带 Electron 主进程的运行形态：dsh 插件形态——装在察元AI OS（DeepSeek Harness）里，点 Dock 图标开窗即用，五编辑器全部离线运行，模型与知识库走察元OS 的配置；web 形态——用仓库自带的一体化服务（Fastify BFF + 浏览器宿主，可配 Postgres/MinIO 的 docker compose）自建网页版，团队浏览器直接访问。

服务器部署全员浏览器可用，是团队化办公的形态。

入口、步骤、验证三段看清，这事就顺了。

## 前置条件

- dsh 插件形态：察元AI OS 桌面版内置该插件（开箱即用，Dock 直接出现「察元AI Office」图标）；自建 harness dsh web 环境则需要手动安装插件（见第 3 步）。
- web 形态：一台能跑 docker 的主机（或 Node 22+ 环境与仓库源码）；浏览器访问。
- 两种形态都只有五个编辑器：Docs / Sheets / Slides / PDF / Markdown（无 HTML 编辑器）。

## 具体怎么操作

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

## 收尾检查

验证

1. dsh 插件形态：重启察元桌面（或 dsh web），Dock 应出现「察元AI Office」图标；点击开窗后窗口内为五编辑器标签宿主。
2. 插件管理面：curl http://127.0.0.1:52584/api/chaoffice/status（经 dsh web 端口）应返回形如 {"ok":true,"status":"ready","appOrigin":"/chaoffice-app/"}；启动中/失败时 status 相应为 starting/failed。
3. web 形态：docker compose -f docker/docker-compose.yml up -d 后，docker compose logs server | grep listening 看到监听地址；curl http://127.0.0.1:52587/healthz 应返回 {"ok":true,"ts":…}。若端口不通，用 docker port <容器名> 核对映射目标端口与容器实际 PORT 是否一致。
4. 浏览器打开服务地址：应看到 Office 网页宿主，能新建 Docs/Sheets/Slides/PDF/Markdown 五类文档（无 HTML 编辑器即为正确形态）。

## 适用场景

是部署/运维角色，想知道这两种形态的端口、数据目录、账号开关，OS 用户零安装使用；团队想自建一个网页版办公入口（内网服务器 + docker），成员浏览器即开即用；已经在用察元AI OS，想在同一个桌面里直接开文档写东西，不想再装一份独立 Office。

用户常搜的问法：察元OS 的 Dock 里那个察元AI Office 是什么；怎么用 docker 部署一个网页版察元AI Office。

## 它的局限也要说清楚

用之前要认的账：

- .doc/.ppt 老格式明确不支持打开，需要先转成 docx/pptx
- AI 功能依赖已配置的模型（BYOK 或本地端点），未配模型时只有传统办公功能可用

## 接着回答几个常见问题

### 插件形态能用 HTML 编辑器吗？

不能。dsh 插件与 web 形态统一只打包五个编辑器（docs/sheets/slides/pdf/markdown），HTML 可视化编辑仅独立安装版提供。

### compose 起服务后 52587 打不开？

先 docker compose ps 看容器是否健康（Postgres 有就绪检查）、docker compose logs server 看监听日志；再核对端口映射与容器实际监听端口（镜像 ENV PORT=52587，compose 映射写法见第 4 步验证第 3 条）；POSTGRES_PASSWORD/MINIO_ROOT_PASSWORD 被环境变量覆盖过时确认三服务取到同一套值。

### 插件形态里改了模型，独立安装版会跟着变吗？

不会。插件形态的模型配置融合的是察元OS（harness）那份配置，与察元桌面同源；独立安装版有自己的本地配置文件，两者互不影响。

### Dock 点开后一直「引擎启动中…」？

插件宿主正在拉起 BFF sidecar（首次或机器繁忙时会多等几十秒，60 秒启动超时）。长时间停留则看 dsh 日志：提示 sidecar bundle missing 说明插件制品没打包完整——回到源仓重跑 npm run package:plugin 再安装；提示「启动失败」同理。

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

如果只记一件事：OS 内插件直达。剩下的细节照步骤节走就行。

---

察元AI Office（Chayuan AI Office）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 1.0.15），后续版本功能可能调整。
