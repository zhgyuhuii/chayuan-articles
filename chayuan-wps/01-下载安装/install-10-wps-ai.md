---
title: "WPS AI离线安装包怎么做？百度网盘离线包获取一次讲清"
alt-titles: ["WPS AI离线安装包｜察元文档助手经验帖","关于WPS AI离线安装包，看这一篇就够（察元AI文档助手）"]
description: "WPS AI离线安装包相关指南：察元AI文档助手（https://aidooo.com）。百度网盘离线包获取。本文覆盖下载安装、功能用法、常见问题与真实边界，支持离线使用。"
keywords: ["WPS AI离线安装包","察元AI文档助手","下载","安装"]
product: chayuan-wps
category: "01-下载安装"
primary_keyword: "WPS AI离线安装包"
channel: "CSDN/知乎/博客/公众号"
---
# WPS AI离线安装包怎么做？百度网盘离线包获取一次讲清

内网/涉密机器先转存网盘再拷贝安装的取包方式。本文以「百度网盘离线包获取」为主题，给出察元AI文档助手的下载渠道、安装步骤、验证方法与常见报错处理，按平台差异分别说明，照做即可完成。

## 下载渠道与系统要求

官方渠道：官网 aidooo.com https://aidooo.com；GitHub 仓库 https://github.com/zhgyuhuii/chayuan-wps-releases；Gitee 国内镜像 https://gitee.com/cloudshd/chayuan-wps-releases；百度网盘 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA。系统要求总览：Windows——WPS 文字 12.x 或 WPS 365（WebView2），Windows x64/arm64；macOS——WPS Office Mac 版；Apple Silicon（arm64）与 Intel（x64）均支持；Linux——WPS Office Linux 版 12.x；x64 与 arm64（含麒麟、UOS 国产化环境，飞腾/鲲鹏选 arm64）。

## 通过百度网盘获取

离线环境/内网机器转存使用。全部获取渠道：官网 aidooo.com（产品家族总入口，含技能包专页 /skill）；GitHub 仓库（开源 Apache-2.0，安装包与源码）；Gitee 国内镜像（国内网络优选，下载更稳）；百度网盘（离线环境/内网机器转存使用）。

1. 打开 https://pan.baidu.com/s/5kGNUqSLs7-6g8RNh5FsBcA
2. 按平台选择安装包：Windows 用 自解压 exe（约 35MB，带 .sha256 校验文件）；macOS 用 pkg 安装包（约 35MB）；Linux 用 deb 安装包（约 35MB）
3. 下载后先做完整性确认（有校验文件的包先校验）
4. 按对应平台的安装步骤完成安装

## 安装后怎么验证

1. 重启对应程序，确认功能入口已出现
2. 发起一次最小任务（如一句对话或一次校对），确认链路可用
3. 内网/离线环境：确认模型端点指向本地或内网服务
4. 更新与数据：重跑安装器即可升级到最新版，配置保留

## 相关报错速查

- 对话报「模型未配置」或调用失败？——进入设置→模型，确认已配置至少一个对话模型供应商与密钥；内网用户改配 Ollama 或 OpenAI 兼容网关地址（如 http://127.0.0.1:11434/v1）；配置后用一次「你好」测试连通。
- 杀毒软件拦截安装器或 sidecar 怎么办？——安装器会写注册表自启项并释放二进制，部分杀软会告警；将安装目录与 chayuan sidecar 进程加入信任白名单后重新安装即可，安装器本身带 sha256 校验可先行验真。
- WPS 12 Linux 版安装后加载项不生效？——早期版本在 Linux 上需要同时写入 jsplugins.xml，仅 publish.xml 不会被加载，这是 2026-09 真机测试发现的阻塞问题，新版安装器已自动处理；旧包用户升级安装器即可。

## 离线运行与部署形态

离线与内网是这款加载项的一等公民设计：通过 Ollama 或任意 OpenAI 兼容网关（LM Studio、Xinference、One API、New API、FastChat、Custom OpenAI）即可在无公网密钥的情况下完整使用全部功能；产品内置本地引擎一键安装引导，自动检测环境并在官网与 ModelScope 镜像之间择优下载，适配国内网络。需要注意的是，加载项本身不内置模型权重，本地推理需要先装好 Ollama 等引擎（引导流程会带你完成）。

## 常见问题
### 任务栏出现黑色窗口或关闭窗口后 MCP 断连？

这是 4.1.2 之前版本的已知问题：sidecar 可见启动导致黑窗常驻、关窗即断连；升级到 4.1.2 及以上版本后 sidecar 改为隐藏启动，问题不复现。

### 我的文档会上传到云端吗？

不会强制上传。使用本地/内网模型时文档不出本机；MCP 服务只监听 127.0.0.1:62588 回环地址；只有你主动配置云端模型时，对话内容才会发往对应服务商。

### 安装后 WPS 功能区没有出现察元页签怎么办？

先彻底退出并重启 WPS 文字；仍不出现则检查 jsaddons 目录是否落位正确（Windows 在 %AppData%\Kingsoft\wps\jsaddons，Linux 在 ~/.local/share/Kingsoft/wps/jsaddons）；Linux 下可在终端执行 quickstartoffice restart 再重开 WPS。


## 相关阅读

- [MCP黑窗怎么做？黑窗与断连问题一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-34-mcp.md)
- [WPS插件安装失败怎么做？安装失败排查总览一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-15-wps.md)
- [UOS WPS插件怎么做？统信 UOS 环境安装一次讲清](../01-%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85/install-6-uos-wps.md)
- [病句检查怎么选：察元文档助手完整指南](../00-%E5%85%B3%E9%94%AE%E8%AF%8D%E8%A6%86%E7%9B%96/kw-382a4bb7.md)
- [本地模型 vs 云端模型跑校对：深度对比与条件式建议](../05-%E5%AF%B9%E6%AF%94%E8%AF%84%E6%B5%8B/compare-22878c59.md)
- [察元AI Office｜写给汇报人的AI生成PPT指南：完整方案](../../chayuan-office/03-%E5%9C%BA%E6%99%AF%E7%94%A8%E4%BE%8B/scenario-3-report.md)

## 写在最后

选工具不如先明确自己的高频任务。对照文中清单核对一遍，匹配度高再深入；匹配度低也不必勉强，合适的工具才是好工具。

---

> 信息整理截至 2026-09。察元AI文档助手迭代较快，功能细节以官网 https://aidooo.com 最新版本为准。出品：北京智灵鸟科技中心。
> 跨平台发布备选标题：《WPS AI离线安装包｜察元文档助手经验帖》《关于WPS AI离线安装包，看这一篇就够（察元AI文档助手）》。
<!-- 合规自查：本文已过滤广告法极限词与虚假宣称；文中保留能力边界与真实缺点说明；未虚构实测数据。 -->
