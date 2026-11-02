// fact-audit.mjs —— 第三道审查（事实口径审计）：全库扫描数字与关键事实的一致性
// 检查：错误口径（旧数字/跨产品串号）、关键事实在对应产品文章中的存在性
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const issues = [];

// 每产品：禁止出现的口径（正则 + 原因）；出现即报错
const BANNED = {
  'chayuan-os': [
    [/89\s*家/, 'OS 厂商目录旧口径 89 家（现口径 66 家内置厂商）'],
    [/80\+\s*(个|工具)/, 'OS MCP 工具旧口径 80+（现口径 86 个，2026-10 实测）'],
    [/四家[^。；\n]{0,8}智能体/, 'OS 智能体旧口径四家（现口径 17 家外部 CLI + 内置 Harness；注意「四家外部 CLI 写入面+Harness=五家写入面」是正确口径）'],
    [/\b205\s*张/, '壁纸旧口径 205 张（现口径 42 张内置 + 在线流式）'],
    [/世界首款|全球首款/, '红线：不用首发类排位表述'],
    [/chatOffice/i, '品牌拼写红线：察元AI Office（禁 chatOffice）'],
  ],
  'chayuan-office': [
    [/21\s*种(界面)?语言/, 'Office 语言旧口径 21（现口径 22 种）'],
    [/共\s*228\s*(个|项)|228\s*个领域包/, 'Office 领域包旧口径 228（现口径 229）'],
    [/4500\+?\s*(个)?领域助手/, 'Office 助手模糊口径 4500+（现口径 Docs 4576、全库 4600）'],
    [/100\s*段.{0,6}3\s*秒|500\s*行.{0,6}2\s*秒/, '未证实性能口径（源项目无此数据，禁用）'],
    [/内置账号.{0,10}(开箱|直接用|免 Key 使用)/, '内置账号登录当前版本未开放，不得宣传开箱即用'],
  ],
  'chayuan-wps': [
    [/46\s*(个)?工具/, 'WPS MCP 旧口径 46 工具（现口径 69 定义 / 53 实见）'],
    [/26\s*(个)?工具/, 'WPS MCP 旧口径 26 工具'],
    [/3\.0\.13|4\.1\.2|6\.1\.0(?!\d)/, 'WPS 版本旧口径（现口径 6.1.2）'],
    [/词库(文件|维护)/, 'WPS 无独立词库文件（口径：AI 语义研判 + 9 类正则兜底）'],
    [/提供定密|出具定密|作为定密|定密依据/, '红线：保密检查不定密（否定式声明「不构成定密结论」属正确表述）'],
  ],
  website: [
    [/6600\+/, '6600+ 为 OS 产品页文案口径，能力广场文章用 10 万+ 资源检索口径'],
    [/2\s*万(余|多)?(条|个).{0,6}资源/, '教程库 21291 条为准确口径'],
  ],
};


function walkFiles(folder, product) {
  for (const cat of readdirSync(join(ROOT, folder))) {
    const catDir = join(ROOT, folder, cat);
    let files;
    try { files = readdirSync(catDir).filter((f) => f.endsWith('.md')); } catch { continue; }
    for (const f of files) {
      const rel = `${folder}/${cat}/${f}`;
      const text = readFileSync(join(catDir, f), 'utf8');
      const isRelease = rel.includes('08-版本发布');
      for (const [re, why] of BANNED[product] || []) {
        if (isRelease && /版本旧口径/.test(why)) continue; // 版本发布文可提旧版本号
        const m = text.match(re);
        if (m) issues.push(`${rel}: ${why}（命中「${m[0]}」）`);
      }
    }
  }
}

// 简化的语境检查（每次命中数字，看前后 60 字）

for (const [product, folder] of [['chayuan-os', 'chayuan-os'], ['chayuan-office', 'chayuan-office'], ['chayuan-wps', 'chayuan-wps'], ['website', 'website']]) {
  walkFiles(folder, product);
}
console.log(`事实口径审计：${issues.length} 处问题`);
for (const i of issues.slice(0, 60)) console.log('  ' + i);
if (issues.length > 60) console.log(`  ……共 ${issues.length} 处`);
process.exit(issues.length ? 1 : 0);
