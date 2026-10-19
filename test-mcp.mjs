/**
 * SciGlyph MCP Server — 综合测试脚本
 *
 * 通过 stdio 与 MCP Server 通信，测试所有 7 个工具。
 * 运行方式: node test-mcp.mjs
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = join(__dirname, "dist", "index.js");

let passed = 0;
let failed = 0;
const failures = [];

// ---------------------------------------------------------------------------
// JSON-RPC over stdio 客户端
// ---------------------------------------------------------------------------

const server = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "pipe"],
});

let buffer = "";
let idCounter = 0;
const pending = new Map();

server.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  // MCP 使用换行分隔的 JSON-RPC 消息
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id && pending.has(msg.id)) {
        const { resolve } = pending.get(msg.id);
        pending.delete(msg.id);
        resolve(msg);
      }
    } catch {
      // 忽略非 JSON 行
    }
  }
});

server.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  if (text.trim()) {
    console.error("[server stderr]", text.trim());
  }
});

function sendRequest(method, params) {
  const id = ++idCounter;
  const msg = JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n";
  return new Promise((resolve) => {
    pending.set(id, { resolve });
    server.stdin.write(msg);
  });
}

function sendNotification(method, params) {
  const msg = JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n";
  server.stdin.write(msg);
}

// ---------------------------------------------------------------------------
// 断言工具
// ---------------------------------------------------------------------------

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    failures.push(message);
    console.log(`  ❌ ${message}`);
  }
}

function assertTextContains(text, substring, label) {
  assert(
    typeof text === "string" && text.includes(substring),
    `${label || `文本包含 "${substring}"`}`,
  );
}

// ---------------------------------------------------------------------------
// 测试用例
// ---------------------------------------------------------------------------

async function testInitialize() {
  console.log("\n📋 测试: MCP 初始化");
  const res = await sendRequest("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test-client", version: "1.0.0" },
  });

  assert(res.result != null, "初始化返回 result");
  assert(res.result.serverInfo?.name === "sciglyph-mcp", "服务器名称正确");
  assert(res.result.serverInfo?.version === "0.1.0", "服务器版本正确");
  assert(res.result.capabilities?.tools != null, "声明 tools 能力");

  // 发送 initialized 通知
  sendNotification("notifications/initialized", {});
}

async function testListTools() {
  console.log("\n📋 测试: tools/list — 列出全部工具");
  const res = await sendRequest("tools/list", {});

  assert(res.result != null, "返回 result");
  const tools = res.result.tools;
  assert(Array.isArray(tools), "tools 是数组");
  assert(tools.length === 7, `工具数量为 7 (实际: ${tools?.length})`);

  const expectedTools = [
    "sciglyph_browse_categories",
    "sciglyph_search_assets",
    "sciglyph_get_asset",
    "sciglyph_list_by_category",
    "sciglyph_get_url",
    "sciglyph_library_info",
    "sciglyph_get_usage_examples",
  ];

  for (const name of expectedTools) {
    assert(
      tools.some((t) => t.name === name),
      `工具 "${name}" 存在`,
    );
  }
}

async function testBrowseCategories() {
  console.log("\n📋 测试: sciglyph_browse_categories — 浏览分类体系");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_browse_categories",
    arguments: {},
  });

  assert(!res.result?.isError, "不返回错误");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "SciGlyph", "包含 SciGlyph");
  assertTextContains(text, "cells-microbes", "包含分类 cells-microbes");
  assertTextContains(text, "morphology-arrangement", "包含子分类");
  assertTextContains(text, "classic", "包含系列 classic");
  assertTextContains(text, "illustration", "包含形态 illustration");
  assertTextContains(text, "CC BY 4.0", "包含许可信息");
}

async function testSearchAssetsByChineseKeyword() {
  console.log("\n📋 测试: sciglyph_search_assets — 中文关键词搜索");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_search_assets",
    arguments: { query: "球菌" },
  });

  assert(!res.result?.isError, "不返回错误");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "球菌", "搜索结果包含'球菌'");
  assertTextContains(text, "coccus", "包含英文结果");
}

async function testSearchAssetsByEnglishKeyword() {
  console.log("\n📋 测试: sciglyph_search_assets — 英文关键词搜索");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_search_assets",
    arguments: { query: "coccus" },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "Coccus", "搜索结果包含 'Coccus'");
}

async function testSearchAssetsWithFilter() {
  console.log("\n📋 测试: sciglyph_search_assets — 带筛选条件的搜索");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_search_assets",
    arguments: { query: "", category: "01", series: "classic", limit: 5 },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "找到", "返回搜索结果");
  assertTextContains(text, "001-coccus", "包含预期素材");
}

async function testSearchAssetsWithInvalidFilter() {
  console.log("\n📋 测试: sciglyph_search_assets — 无效筛选参数验证");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_search_assets",
    arguments: { series: "invalid-series" },
  });

  assert(res.result?.isError === true, "返回 isError: true");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "无效", "包含无效提示");
  assertTextContains(text, "classic", "提示有效值");
}

async function testSearchAssetsWithWhitespace() {
  console.log("\n📋 测试: sciglyph_search_assets — 带空格的关键词");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_search_assets",
    arguments: { query: "  球菌  " },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "球菌", "trim 后正确搜索");
}

async function testSearchAssetsNoResults() {
  console.log("\n📋 测试: sciglyph_search_assets — 无结果搜索");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_search_assets",
    arguments: { query: "不存在的素材xyz123" },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "未找到", "返回未找到提示");
}

async function testGetAsset() {
  console.log("\n📋 测试: sciglyph_get_asset — 获取已知素材");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_asset",
    arguments: { assetId: "001-coccus" },
  });

  assert(!res.result?.isError, "不返回错误");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "球菌", "包含中文名");
  assertTextContains(text, "Coccus", "包含英文名");
  assertTextContains(text, "001-coccus.svg", "包含 SVG URL");
  assertTextContains(text, "CC BY 4.0", "包含许可信息");
}

async function testGetAssetNotFound() {
  console.log("\n📋 测试: sciglyph_get_asset — 获取不存在的素材（模糊匹配）");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_asset",
    arguments: { assetId: "nonexistent-id-xyz" },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "未找到", "返回未找到提示");
}

async function testGetAssetFuzzyMatch() {
  console.log("\n📋 测试: sciglyph_get_asset — 模糊匹配建议");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_asset",
    arguments: { assetId: "coccus" },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "您是否在找", "返回模糊匹配建议");
}

async function testListByCategoryId() {
  console.log("\n📋 测试: sciglyph_list_by_category — 按编号列出");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_list_by_category",
    arguments: { category: "01", limit: 10 },
  });

  assert(!res.result?.isError, "不返回错误");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "细胞与微生物", "包含大类中文名");
  assertTextContains(text, "001-coccus", "包含素材");
}

async function testListByCategoryName() {
  console.log("\n📋 测试: sciglyph_list_by_category — 按英文名称列出");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_list_by_category",
    arguments: { category: "cells-microbes", limit: 5 },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "细胞与微生物", "按名称成功解析");
}

async function testListByCategoryNameIgnoreCase() {
  console.log("\n📋 测试: sciglyph_list_by_category — 不区分大小写匹配");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_list_by_category",
    arguments: { category: "Cells-Microbes", limit: 3 },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "细胞与微生物", "不区分大小写成功匹配");
}

async function testListByCategoryChineseName() {
  console.log("\n📋 测试: sciglyph_list_by_category — 按中文名称匹配");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_list_by_category",
    arguments: { category: "细胞与微生物", limit: 3 },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "001-coccus", "按中文名称成功匹配");
}

async function testListByCategoryWithSubcategory() {
  console.log("\n📋 测试: sciglyph_list_by_category — 按大类+子分类列出");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_list_by_category",
    arguments: { category: "01", subcategory: "morphology-arrangement", limit: 5 },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "形态与排列", "包含子分类名");
  assertTextContains(text, "001-coccus", "包含素材");
}

async function testListByCategoryInvalid() {
  console.log("\n📋 测试: sciglyph_list_by_category — 无效大类");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_list_by_category",
    arguments: { category: "99" },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "无效", "返回无效提示");
  assertTextContains(text, "有效的大类", "列出有效大类");
}

async function testGetUrl() {
  console.log("\n📋 测试: sciglyph_get_url — 构建已知素材 URL");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_url",
    arguments: {
      categoryId: "01",
      subcategoryId: "morphology-arrangement",
      filename: "001-coccus",
    },
  });

  assert(!res.result?.isError, "不返回错误");
  const text = res.result?.content?.[0]?.text || "";
  const expectedUrl =
    "https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg";
  assertTextContains(text, expectedUrl, "URL 正确构建");
  assertTextContains(text, "✅", "标记为已索引素材");
}

async function testGetUrlUnindexed() {
  console.log("\n📋 测试: sciglyph_get_url — 构建未索引素材 URL");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_url",
    arguments: {
      categoryId: "02",
      subcategoryId: "dna-rna",
      filename: "999-unknown",
    },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "genetics-omics", "包含正确大类路径");
  assertTextContains(text, "⚠", "标记为未索引");
}

async function testGetUrlInvalidCategory() {
  console.log("\n📋 测试: sciglyph_get_url — 无效大类 ID");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_url",
    arguments: {
      categoryId: "99",
      subcategoryId: "test",
      filename: "test",
    },
  });

  assert(res.result?.isError === true, "返回 isError: true");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "构建 URL 失败", "返回错误信息");
}

async function testLibraryInfo() {
  console.log("\n📋 测试: sciglyph_library_info — 素材库信息");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_library_info",
    arguments: {},
  });

  assert(!res.result?.isError, "不返回错误");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "SciGlyph", "包含名称");
  assertTextContains(text, "1.0.0", "包含版本");
  assertTextContains(text, "CC BY 4.0", "包含许可");
  assertTextContains(text, "2830", "包含素材总数");
  assertTextContains(text, "sciglyph_get_usage_examples", "工具列表包含 usage_examples");
}

async function testUsageExamples() {
  console.log("\n📋 测试: sciglyph_get_usage_examples — 默认示例");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_usage_examples",
    arguments: {},
  });

  assert(!res.result?.isError, "不返回错误");
  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "Markdown", "包含 Markdown 示例");
  assertTextContains(text, "HTML", "包含 HTML 示例");
  assertTextContains(text, "CSS", "包含 CSS 示例");
  assertTextContains(text, "引用规范", "包含引用规范");
}

async function testUsageExamplesWithAssetId() {
  console.log("\n📋 测试: sciglyph_get_usage_examples — 指定素材 ID");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_usage_examples",
    arguments: { assetId: "001-coccus" },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "球菌", "使用指定素材");
  assertTextContains(text, "001-coccus.svg", "包含 URL");
}

async function testUsageExamplesInvalidId() {
  console.log("\n📋 测试: sciglyph_get_usage_examples — 无效素材 ID");
  const res = await sendRequest("tools/call", {
    name: "sciglyph_get_usage_examples",
    arguments: { assetId: "nonexistent-xyz" },
  });

  const text = res.result?.content?.[0]?.text || "";
  assertTextContains(text, "未找到", "返回未找到提示");
}

// ---------------------------------------------------------------------------
// 运行测试
// ---------------------------------------------------------------------------

async function run() {
  console.log("🚀 SciGlyph MCP Server 综合测试\n");
  console.log(`  服务器路径: ${serverPath}\n`);

  try {
    await testInitialize();
    await testListTools();
    await testBrowseCategories();
    await testSearchAssetsByChineseKeyword();
    await testSearchAssetsByEnglishKeyword();
    await testSearchAssetsWithFilter();
    await testSearchAssetsWithInvalidFilter();
    await testSearchAssetsWithWhitespace();
    await testSearchAssetsNoResults();
    await testGetAsset();
    await testGetAssetNotFound();
    await testGetAssetFuzzyMatch();
    await testListByCategoryId();
    await testListByCategoryName();
    await testListByCategoryNameIgnoreCase();
    await testListByCategoryChineseName();
    await testListByCategoryWithSubcategory();
    await testListByCategoryInvalid();
    await testGetUrl();
    await testGetUrlUnindexed();
    await testGetUrlInvalidCategory();
    await testLibraryInfo();
    await testUsageExamples();
    await testUsageExamplesWithAssetId();
    await testUsageExamplesInvalidId();
  } catch (err) {
    console.error("\n💥 测试执行出错:", err);
    failed++;
    failures.push(`执行异常: ${err.message}`);
  }

  // 输出总结
  console.log("\n" + "=".repeat(60));
  console.log(`📊 测试结果: ${passed} 通过, ${failed} 失败`);
  if (failures.length > 0) {
    console.log("\n❌ 失败项:");
    for (const f of failures) {
      console.log(`  - ${f}`);
    }
  }
  console.log("=".repeat(60));

  server.kill();
  process.exit(failed > 0 ? 1 : 0);
}

// 等待一会确保 server 启动
setTimeout(run, 500);
