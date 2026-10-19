#!/usr/bin/env node

/**
 * SciGlyph MCP Server — 主入口
 *
 * 适配 https://zengzichao.github.io/SciGlyph/ 科学绘图素材库的 MCP 服务。
 * 通过 Model Context Protocol 协议，让 AI 助手能够浏览、搜索、获取
 * SciGlyph 库中的科学插图素材（SVG 格式）。
 *
 * @version 0.1.0
 * @author ZengZichao
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  BASE_URL,
  ASSETS_PREFIX,
  LIBRARY_VERSION,
  LICENSE,
  TOTAL_ASSETS,
  AUTHOR,
  categories,
  seriesList,
  formList,
  type AssetMetadata,
  type Category,
  type Subcategory,
} from "./data/catalog.js";
import { sampleAssets } from "./data/sample-assets.js";

// ---------------------------------------------------------------------------
// 服务器版本信息
// ---------------------------------------------------------------------------

const SERVER_VERSION = "0.1.0";

// ---------------------------------------------------------------------------
// 辅助函数
// ---------------------------------------------------------------------------

/**
 * 根据大类 ID 和子分类 ID 构建素材的相对路径前缀。
 * 例如: ("01", "morphology-arrangement") => "assets/01-cells-microbes/morphology-arrangement/"
 */
function buildPathPrefix(categoryId: string, subcategoryId: string): string {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) {
    throw new Error(`Invalid category ID: ${categoryId}`);
  }
  const sub = cat.subcategories.find((s) => s.id === subcategoryId);
  if (!sub) {
    throw new Error(
      `Invalid subcategory ID: ${subcategoryId} for category ${categoryId}`,
    );
  }
  return `${ASSETS_PREFIX}${cat.id}-${cat.name}/${sub.id}/`;
}

/**
 * 根据素材元数据构建完整的 SVG URL。
 */
function buildAssetUrl(asset: AssetMetadata): string {
  const prefix = buildPathPrefix(asset.category, asset.subcategory);
  return `${BASE_URL}${prefix}${asset.id}.svg`;
}

/**
 * 根据素材元数据构建素材的相对路径（用于展示）。
 */
function buildAssetPath(asset: AssetMetadata): string {
  const prefix = buildPathPrefix(asset.category, asset.subcategory);
  return `${prefix}${asset.id}.svg`;
}

/**
 * 获取大类名称（双语）。
 */
function getCategoryName(categoryId: string): { zh: string; en: string; icon: string } {
  const cat = categories.find((c) => c.id === categoryId);
  return cat
    ? { zh: cat.nameZh, en: cat.nameEn, icon: cat.icon }
    : { zh: "未知", en: "Unknown", icon: "❓" };
}

/**
 * 获取子分类名称（双语）。
 */
function getSubcategoryName(
  categoryId: string,
  subcategoryId: string,
): { zh: string; en: string } {
  const cat = categories.find((c) => c.id === categoryId);
  const sub = cat?.subcategories.find((s) => s.id === subcategoryId);
  return sub ? { zh: sub.nameZh, en: sub.nameEn } : { zh: "未知", en: "Unknown" };
}

/**
 * 获取系列信息。
 */
function getSeriesInfo(seriesId: string) {
  return seriesList.find((s) => s.id === seriesId);
}

/**
 * 获取形态信息。
 */
function getFormInfo(formId: string) {
  return formList.find((f) => f.id === formId);
}

/**
 * 格式化素材为可读文本。
 */
function formatAsset(asset: AssetMetadata): string {
  const cat = getCategoryName(asset.category);
  const sub = getSubcategoryName(asset.category, asset.subcategory);
  const series = getSeriesInfo(asset.series);
  const form = getFormInfo(asset.form);
  const url = buildAssetUrl(asset);
  const path = buildAssetPath(asset);

  return [
    `**${asset.nameZh}** (${asset.nameEn})`,
    `  编号: ${asset.number}`,
    `  大类: ${cat.icon} ${cat.zh} / ${cat.en}`,
    `  子分类: ${sub.zh} / ${sub.en}`,
    `  系列: ${series?.nameZh ?? asset.series} / ${series?.nameEn ?? asset.series}`,
    `  形态: ${form?.nameZh ?? asset.form} / ${form?.nameEn ?? asset.form}`,
    `  路径: ${path}`,
    `  URL: ${url}`,
  ].join("\n");
}

/**
 * 在样例素材中搜索，支持中英文关键词匹配。
 */
function searchInAssets(
  query: string,
  filters?: {
    category?: string;
    subcategory?: string;
    series?: string;
    form?: string;
  },
): AssetMetadata[] {
  const trimmedQuery = query.trim();
  const q = trimmedQuery.toLowerCase();
  let results = sampleAssets;

  // 应用筛选条件
  if (filters?.category) {
    results = results.filter((a) => a.category === filters.category);
  }
  if (filters?.subcategory) {
    results = results.filter((a) => a.subcategory === filters.subcategory);
  }
  if (filters?.series) {
    results = results.filter((a) => a.series === filters.series);
  }
  if (filters?.form) {
    results = results.filter((a) => a.form === filters.form);
  }

  // 如果没有查询关键词，返回全部（经过筛选的）结果
  if (!q) {
    return results;
  }

  // 关键词搜索（支持中英文及 ID 匹配）
  return results.filter(
    (a) =>
      a.nameZh.includes(trimmedQuery) ||
      a.nameEn.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q),
  );
}

/**
 * 列出大类下所有样例素材。
 */
function listAssetsByCategory(categoryId: string): AssetMetadata[] {
  return sampleAssets.filter((a) => a.category === categoryId);
}

/**
 * 列出特定子分类下的所有样例素材。
 */
function listAssetsBySubcategory(
  categoryId: string,
  subcategoryId: string,
): AssetMetadata[] {
  return sampleAssets.filter(
    (a) => a.category === categoryId && a.subcategory === subcategoryId,
  );
}

// ---------------------------------------------------------------------------
// 创建 MCP Server 实例
// ---------------------------------------------------------------------------

const server = new McpServer(
  {
    name: "sciglyph-mcp",
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// ===========================================================================
// 工具 1: sciglyph_browse_categories — 浏览全部分类体系
// ===========================================================================

server.registerTool(
  "sciglyph_browse_categories",
  {
    title: "Browse Categories / 浏览分类体系",
    description:
      "List all categories, subcategories, series, and forms in the SciGlyph library. " +
      "Returns the complete taxonomy structure with bilingual (Chinese/English) names. " +
      "Use this tool first to understand the library's organization before searching for specific assets.\n\n" +
      "列出 SciGlyph 素材库的所有大类、子分类、系列和形态。" +
      "返回完整的分类体系结构（含中英双语名称）。" +
      "建议在搜索特定素材前先使用此工具了解素材库的组织结构。",
    inputSchema: {},
  },
  async () => {
    const categoryList = categories.map((cat) => {
      const subs = cat.subcategories
        .map((s) => `    - ${s.id}: ${s.nameZh} / ${s.nameEn}`)
        .join("\n");
      return `${cat.icon} ${cat.id}-${cat.name}\n  中文名: ${cat.nameZh}\n  英文名: ${cat.nameEn}\n  子分类:\n${subs}`;
    });

    const seriesInfo = seriesList
      .map(
        (s) =>
          `  - ${s.id}: ${s.nameZh} / ${s.nameEn}\n    ${s.descriptionZh}\n    ${s.descriptionEn}`,
      )
      .join("\n");

    const formInfo = formList
      .map(
        (f) =>
          `  - ${f.id}: ${f.nameZh} / ${f.nameEn}\n    ${f.descriptionZh}\n    ${f.descriptionEn}`,
      )
      .join("\n");

    const text = [
      `# SciGlyph 素材库分类体系 (v${LIBRARY_VERSION})`,
      ``,
      `素材总数: ~${TOTAL_ASSETS} | 许可: ${LICENSE} | 作者: ${AUTHOR}`,
      `网站: ${BASE_URL}`,
      ``,
      `## 大类与子分类 (Categories & Subcategories)`,
      ``,
      categoryList.join("\n\n"),
      ``,
      `## 系列 (Series)`,
      ``,
      seriesInfo,
      ``,
      `## 形态 (Forms)`,
      ``,
      formInfo,
    ].join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text,
        },
      ],
    };
  },
);

// ===========================================================================
// 工具 2: sciglyph_search_assets — 搜索素材
// ===========================================================================

server.registerTool(
  "sciglyph_search_assets",
  {
    title: "Search Assets / 搜索素材",
    description:
      "Search for scientific illustration assets in the SciGlyph library by keyword (Chinese or English). " +
      "Supports optional filtering by category, subcategory, series, and form. " +
      "Returns matching assets with bilingual names, asset paths, and direct SVG URLs.\n\n" +
      "通过关键词（中文或英文）搜索 SciGlyph 素材库中的科学插图素材。" +
      "支持按大类、子分类、系列、形态进行可选筛选。" +
      "返回匹配的素材列表（含中英文名称、路径和 SVG 直链）。",
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe(
          "Search keyword (Chinese or English). If omitted, returns all assets matching the filters. " +
          "搜索关键词（中文或英文）。如省略则返回符合筛选条件的全部素材。",
        ),
      category: z
        .string()
        .optional()
        .describe(
          "Category ID to filter by (e.g. '01' for Cells & Microbes). " +
          "按大类编号筛选（如 '01' 为细胞与微生物）。",
        ),
      subcategory: z
        .string()
        .optional()
        .describe(
          "Subcategory ID to filter by (e.g. 'morphology-arrangement'). " +
          "按子分类 ID 筛选（如 'morphology-arrangement'）。",
        ),
      series: z
        .string()
        .optional()
        .describe(
          "Series ID to filter by: 'classic', 'atlas', 'primitives', 'icons', 'lab-flow'. " +
          "按系列筛选：'classic'(经典插画), 'atlas'(图谱), 'primitives'(通用图元), 'icons'(图标), 'lab-flow'(实验室流程)。",
        ),
      form: z
        .string()
        .optional()
        .describe(
          "Form ID to filter by: 'illustration', 'diagram', 'icon'. " +
          "按形态筛选：'illustration'(插画), 'diagram'(示意图), 'icon'(图标)。",
        ),
      limit: z
        .number()
        .optional()
        .default(20)
        .describe(
          "Maximum number of results to return (default: 20). " +
          "返回结果的最大数量（默认: 20）。",
        ),
    },
  },
  async (args) => {
    const query = args.query ?? "";
    const limit = Math.max(1, args.limit ?? 20);

    // 验证筛选条件是否有效，收集无效项以便提示
    const invalidFilters: string[] = [];

    if (args.category && !categories.find((c) => c.id === args.category)) {
      invalidFilters.push(`大类 "${args.category}"`);
    }
    if (
      args.category &&
      args.subcategory &&
      !categories
        .find((c) => c.id === args.category)
        ?.subcategories.find((s) => s.id === args.subcategory)
    ) {
      invalidFilters.push(`子分类 "${args.subcategory}"`);
    }
    if (args.series && !seriesList.find((s) => s.id === args.series)) {
      invalidFilters.push(
        `系列 "${args.series}" (有效值: ${seriesList.map((s) => s.id).join(", ")})`,
      );
    }
    if (args.form && !formList.find((f) => f.id === args.form)) {
      invalidFilters.push(
        `形态 "${args.form}" (有效值: ${formList.map((f) => f.id).join(", ")})`,
      );
    }

    if (invalidFilters.length > 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `搜索条件包含无效的筛选参数。Invalid filter parameter(s).\n\n无效项:\n  - ${invalidFilters.join("\n  - ")}\n\n请使用 sciglyph_browse_categories 查看有效的分类、系列和形态 ID。`,
          },
        ],
        isError: true,
      };
    }

    const results = searchInAssets(query, {
      category: args.category,
      subcategory: args.subcategory,
      series: args.series,
      form: args.form,
    });

    const total = results.length;
    const limited = results.slice(0, limit);

    if (limited.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `未找到匹配的素材。No matching assets found.\n\n搜索条件 / Search criteria:\n  关键词: "${query}"\n  大类: ${args.category ?? "全部"}\n  子分类: ${args.subcategory ?? "全部"}\n  系列: ${args.series ?? "全部"}\n  形态: ${args.form ?? "全部"}\n\n提示: 请尝试使用更宽泛的关键词，或先使用 sciglyph_browse_categories 浏览全部分类。`,
          },
        ],
      };
    }

    const header = [
      `找到 ${total} 个匹配素材（显示前 ${limited.length} 个）`,
      `Found ${total} matching asset(s) (showing first ${limited.length})`,
      ``,
    ].join("\n");

    const body = limited.map((asset) => formatAsset(asset)).join("\n\n");

    const footer =
      total > limit
        ? `\n\n---\n还有 ${total - limit} 个结果未显示。${total - limit} more results not shown. 请缩小搜索范围或增加 limit 参数。`
        : "";

    return {
      content: [
        {
          type: "text" as const,
          text: header + body + footer,
        },
      ],
    };
  },
);

// ===========================================================================
// 工具 3: sciglyph_get_asset — 获取单个素材详情
// ===========================================================================

server.registerTool(
  "sciglyph_get_asset",
  {
    title: "Get Asset / 获取素材详情",
    description:
      "Get detailed information about a specific asset by its ID. " +
      "Returns bilingual name, category, subcategory, series, form, file path, and direct SVG URL.\n\n" +
      "根据素材 ID 获取单个素材的详细信息。" +
      "返回中英文名称、分类、子分类、系列、形态、文件路径和 SVG 直链。",
    inputSchema: {
      assetId: z
        .string()
        .describe(
          "Asset ID (filename without .svg extension), e.g. '001-coccus' or 'cs-016-cell-wall'. " +
          "素材 ID（文件名去掉 .svg 后缀），如 '001-coccus' 或 'cs-016-cell-wall'。",
        ),
    },
  },
  async (args) => {
    const asset = sampleAssets.find((a) => a.id === args.assetId);

    if (!asset) {
      // 尝试模糊匹配
      const fuzzy = sampleAssets.filter((a) =>
        a.id.toLowerCase().includes(args.assetId.toLowerCase()),
      );
      if (fuzzy.length > 0) {
        const suggestions = fuzzy
          .slice(0, 5)
          .map((a) => `  - ${a.id}: ${a.nameZh} (${a.nameEn})`)
          .join("\n");
        return {
          content: [
            {
              type: "text" as const,
              text: `未找到 ID 为 "${args.assetId}" 的素材。Asset not found.\n\n您是否在找以下素材？\nDid you mean one of these?\n${suggestions}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: `未找到 ID 为 "${args.assetId}" 的素材。Asset not found.\n\n请使用 sciglyph_search_assets 搜索素材，或使用 sciglyph_browse_categories 浏览分类。`,
          },
        ],
      };
    }

    const cat = getCategoryName(asset.category);
    const sub = getSubcategoryName(asset.category, asset.subcategory);
    const series = getSeriesInfo(asset.series);
    const form = getFormInfo(asset.form);
    const url = buildAssetUrl(asset);
    const path = buildAssetPath(asset);

    const text = [
      `# ${asset.nameZh} (${asset.nameEn})`,
      ``,
      `| 属性 | 中文 | English |`,
      `|------|------|---------|`,
      `| 编号 | ${asset.number} | ${asset.number} |`,
      `| 大类 | ${cat.icon} ${cat.zh} | ${cat.en} |`,
      `| 子分类 | ${sub.zh} | ${sub.en} |`,
      `| 系列 | ${series?.nameZh ?? asset.series} | ${series?.nameEn ?? asset.series} |`,
      `| 形态 | ${form?.nameZh ?? asset.form} | ${form?.nameEn ?? asset.form} |`,
      `| 素材 ID | ${asset.id} | ${asset.id} |`,
      ``,
      `## 文件路径`,
      ``,
      `\`\`\``,
      path,
      `\`\`\``,
      ``,
      `## SVG URL`,
      ``,
      `${url}`,
      ``,
      `## 使用说明`,
      ``,
      `- 许可: ${LICENSE}`,
      `- 使用时请注明来源: SciGlyph by ${AUTHOR}`,
      `- ⚠ 素材由 AI 辅助生成并经人工审查，使用前请自行核实科学准确性`,
      `- 可直接在 Markdown/HTML 中通过 URL 引用 SVG 文件`,
    ].join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text,
        },
      ],
    };
  },
);

// ===========================================================================
// 工具 4: sciglyph_list_by_category — 按分类列出素材
// ===========================================================================

server.registerTool(
  "sciglyph_list_by_category",
  {
    title: "List by Category / 按分类列出素材",
    description:
      "List all assets under a specific category or subcategory. " +
      "Use this to browse assets within a known category.\n\n" +
      "列出指定大类或子分类下的所有素材。" +
      "用于浏览已知分类下的素材列表。",
    inputSchema: {
      category: z
        .string()
        .describe(
          "Category ID (e.g. '01') or category name (e.g. 'cells-microbes'). " +
          "大类编号（如 '01'）或名称（如 'cells-microbes'）。",
        ),
      subcategory: z
        .string()
        .optional()
        .describe(
          "Subcategory ID (e.g. 'morphology-arrangement'). If omitted, lists all assets in the category. " +
          "子分类 ID（如 'morphology-arrangement'）。如省略则列出该大类下的所有素材。",
        ),
      limit: z
        .number()
        .optional()
        .default(50)
        .describe(
          "Maximum number of results (default: 50). " +
          "返回结果的最大数量（默认: 50）。",
        ),
    },
  },
  async (args) => {
    // 解析大类（支持 ID、英文 slug 或中英文名称，不区分大小写）
    const catInput = args.category.trim().toLowerCase();
    let cat: Category | undefined;
    if (/^\d+$/.test(catInput)) {
      cat = categories.find((c) => c.id === catInput);
    } else {
      cat = categories.find(
        (c) =>
          c.name === args.category.trim() ||
          c.name.toLowerCase() === catInput ||
          c.nameZh === args.category.trim() ||
          c.nameEn.toLowerCase() === catInput,
      );
    }

    if (!cat) {
      const validCats = categories
        .map((c) => `  ${c.id}-${c.name}: ${c.nameZh} / ${c.nameEn}`)
        .join("\n");
      return {
        content: [
          {
            type: "text" as const,
            text: `无效的大类: "${args.category}"。Invalid category.\n\n有效的大类:\n${validCats}`,
          },
        ],
      };
    }

    // 解析子分类（如有）
    let sub: Subcategory | undefined;
    if (args.subcategory) {
      const subInput = args.subcategory.trim().toLowerCase();
      sub = cat.subcategories.find(
        (s) =>
          s.id === args.subcategory!.trim() ||
          s.id.toLowerCase() === subInput ||
          s.nameZh === args.subcategory!.trim() ||
          s.nameEn.toLowerCase() === subInput,
      );
      if (!sub) {
        const validSubs = cat.subcategories
          .map((s) => `  ${s.id}: ${s.nameZh} / ${s.nameEn}`)
          .join("\n");
        return {
          content: [
            {
              type: "text" as const,
              text: `无效的子分类: "${args.subcategory}"。Invalid subcategory.\n\n大类 ${cat.id}-${cat.name} 的有效子分类:\n${validSubs}`,
            },
          ],
        };
      }
    }

    const limit = Math.max(1, args.limit ?? 50);
    let assets: AssetMetadata[];

    if (sub) {
      assets = listAssetsBySubcategory(cat.id, sub.id);
    } else {
      assets = listAssetsByCategory(cat.id);
    }

    const total = assets.length;
    const limited = assets.slice(0, limit);

    if (limited.length === 0) {
      const catInfo = `${cat.icon} ${cat.nameZh} / ${cat.nameEn}`;
      const subInfo = sub ? ` > ${sub.nameZh} / ${sub.nameEn}` : "";
      return {
        content: [
          {
            type: "text" as const,
            text: `${catInfo}${subInfo} 下暂无已收录的素材样例。\nNo indexed assets found under this category.\n\n该分类可能仍有素材，但未包含在当前元数据中。请访问 ${BASE_URL} 查看完整素材列表。`,
          },
        ],
      };
    }

    const header = sub
      ? `## ${cat.icon} ${cat.nameZh} / ${cat.nameEn} > ${sub.nameZh} / ${sub.nameEn}\n\n共 ${total} 个素材（显示前 ${limited.length} 个）`
      : `## ${cat.icon} ${cat.nameZh} / ${cat.nameEn}\n\n共 ${total} 个素材（显示前 ${limited.length} 个）`;

    const body = limited
      .map((a) => {
        const url = buildAssetUrl(a);
        return `- **${a.nameZh}** (${a.nameEn}) | ${a.series} | ${a.id}\n  ${url}`;
      })
      .join("\n");

    const footer =
      total > limit
        ? `\n\n---\n还有 ${total - limit} 个素材未显示。${total - limit} more assets not shown.`
        : "";

    return {
      content: [
        {
          type: "text" as const,
          text: header + "\n\n" + body + footer,
        },
      ],
    };
  },
);

// ===========================================================================
// 工具 5: sciglyph_get_url — 构建素材 URL
// ===========================================================================

server.registerTool(
  "sciglyph_get_url",
  {
    title: "Build Asset URL / 构建素材 URL",
    description:
      "Construct the direct SVG URL for an asset given its path components. " +
      "Useful when you know the exact category, subcategory, and filename but the asset is not in the indexed metadata.\n\n" +
      "根据路径组成部分构建素材的直接 SVG URL。" +
      "当已知确切的大类、子分类和文件名但素材不在已索引元数据中时使用。",
    inputSchema: {
      categoryId: z
        .string()
        .describe(
          "Category ID, e.g. '01'. 大类编号，如 '01'。",
        ),
      subcategoryId: z
        .string()
        .describe(
          "Subcategory ID, e.g. 'morphology-arrangement'. 子分类 ID，如 'morphology-arrangement'。",
        ),
      filename: z
        .string()
        .describe(
          "Asset filename without the .svg extension, e.g. '001-coccus'. " +
          "素材文件名（不含 .svg 后缀），如 '001-coccus'。",
        ),
    },
  },
  async (args) => {
    try {
      const prefix = buildPathPrefix(args.categoryId, args.subcategoryId);
      const url = `${BASE_URL}${prefix}${args.filename}.svg`;
      const path = `${prefix}${args.filename}.svg`;

      const cat = getCategoryName(args.categoryId);
      const sub = getSubcategoryName(args.categoryId, args.subcategoryId);

      // 检查是否在已索引素材中
      const indexed = sampleAssets.find((a) => a.id === args.filename);

      const indexedInfo = indexed
        ? `\n\n✅ 该素材在已索引元数据中找到:\n  名称: ${indexed.nameZh} (${indexed.nameEn})\n  系列: ${indexed.series}\n  形态: ${indexed.form}`
        : `\n\n⚠ 该素材不在已索引元数据中。URL 基于路径规则推断，请访问确认素材是否存在。`;

      const text = [
        `# 素材 URL`,
        ``,
        `| 属性 | 值 |`,
        `|------|-----|`,
        `| 大类 | ${cat.icon} ${cat.zh} / ${cat.en} (${args.categoryId}) |`,
        `| 子分类 | ${sub.zh} / ${sub.en} (${args.subcategoryId}) |`,
        `| 文件名 | ${args.filename}.svg |`,
        `| 相对路径 | ${path} |`,
        ``,
        `## SVG URL`,
        ``,
        `${url}`,
        indexedInfo,
        ``,
        `## 使用方法`,
        ``,
        `- Markdown: \`![${args.filename}](${url})\``,
        `- HTML: \`<img src="${url}" alt="${args.filename}" />\``,
        `- 许可: ${LICENSE}`,
      ].join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text,
          },
        ],
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        content: [
          {
            type: "text" as const,
            text: `构建 URL 失败: ${msg}\n\n请使用 sciglyph_browse_categories 查看有效的大类和子分类 ID。`,
          },
        ],
        isError: true,
      };
    }
  },
);

// ===========================================================================
// 工具 6: sciglyph_library_info — 获取素材库信息
// ===========================================================================

server.registerTool(
  "sciglyph_library_info",
  {
    title: "Library Info / 素材库信息",
    description:
      "Get general information about the SciGlyph library, including version, license, total assets, author, and URL.\n\n" +
      "获取 SciGlyph 素材库的概要信息，包括版本、许可、素材总数、作者和网址。",
    inputSchema: {},
  },
  async () => {
    const text = [
      `# SciGlyph 科学绘图素材库`,
      ``,
      `| 属性 | 值 |`,
      `|------|-----|`,
      `| 名称 | SciGlyph · 绘图素材库 | Scientific Illustration Assets |`,
      `| 版本 | v${LIBRARY_VERSION} |`,
      `| 许可 | ${LICENSE} |`,
      `| 素材总数 | ~${TOTAL_ASSETS} |`,
      `| 作者 | ${AUTHOR} |`,
      `| 网站 | ${BASE_URL} |`,
      `| MCP 版本 | v${SERVER_VERSION} |`,
      ``,
      `## 说明`,
      ``,
      `- SciGlyph 是一个科学绘图素材库，提供 SVG 格式的科学插图素材`,
      `- 涵盖 12 个大类、40+ 子分类、5 种系列、3 种形态`,
      `- 素材由 AI 辅助生成并经人工审查`,
      `- ⚠ 使用前请自行核实科学准确性`,
      `- 使用素材时请遵照 CC BY 4.0 许可协议注明来源`,
      ``,
      `## 相关工具`,
      ``,
      `| 工具 | 功能 |`,
      `|------|------|`,
      `| sciglyph_browse_categories | 浏览全部分类体系 |`,
      `| sciglyph_search_assets | 搜索素材 |`,
      `| sciglyph_get_asset | 获取单个素材详情 |`,
      `| sciglyph_list_by_category | 按分类列出素材 |`,
      `| sciglyph_get_url | 构建素材 URL |`,
      `| sciglyph_library_info | 素材库信息（本工具）|`,
      `| sciglyph_get_usage_examples | 使用示例 |`,
    ].join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text,
        },
      ],
    };
  },
);

// ===========================================================================
// 工具 7: sciglyph_get_usage_examples — 获取使用示例
// ===========================================================================

server.registerTool(
  "sciglyph_get_usage_examples",
  {
    title: "Usage Examples / 使用示例",
    description:
      "Get usage examples showing how to embed SciGlyph SVG assets in Markdown, HTML, and other contexts.\n\n" +
      "获取使用示例，展示如何在 Markdown、HTML 等场景中嵌入 SciGlyph SVG 素材。",
    inputSchema: {
      assetId: z
        .string()
        .optional()
        .describe(
          "Optional asset ID to generate specific examples for. If omitted, uses a sample asset. " +
          "可选的素材 ID，用于生成特定素材的使用示例。如省略则使用示例素材。",
        ),
    },
  },
  async (args) => {
    let asset: AssetMetadata;

    if (args.assetId) {
      const found = sampleAssets.find((a) => a.id === args.assetId);
      if (!found) {
        return {
          content: [
            {
              type: "text" as const,
              text: `未找到素材 ID "${args.assetId}"。Asset not found. 请使用 sciglyph_search_assets 搜索。`,
            },
          ],
        };
      }
      asset = found;
    } else {
      asset = sampleAssets[0]; // 默认使用第一个素材作为示例
    }

    if (!asset) {
      return {
        content: [
          {
            type: "text" as const,
            text: `当前素材库中没有可用的样例素材。No sample assets available.`,
          },
        ],
      };
    }

    const url = buildAssetUrl(asset);
    const cat = getCategoryName(asset.category);

    const text = [
      `# SciGlyph 素材使用示例`,
      ``,
      `以 **${asset.nameZh}** (${asset.nameEn}) 为例：`,
      ``,
      `素材 URL: ${url}`,
      ``,
      `## 1. Markdown 嵌入`,
      ``,
      "```markdown",
      `![${asset.nameEn}](${url})`,
      "```",
      ``,
      `效果:`,
      ``,
      `![${asset.nameEn}](${url})`,
      ``,
      `## 2. HTML 嵌入`,
      ``,
      "```html",
      `<!-- 直接引用 -->`,
      `<img src="${url}" alt="${asset.nameEn}" width="200" />`,
      ``,
      `<!-- 带链接 -->`,
      `<a href="${BASE_URL}">`,
      `  <img src="${url}" alt="${asset.nameEn}" width="200" />`,
      `</a>`,
      "```",
      ``,
      `## 3. CSS 背景图`,
      ``,
      "```css",
      `.sciglyph-${asset.id} {`,
      `  background-image: url("${url}");`,
      `  background-size: contain;`,
      `  background-repeat: no-repeat;`,
      `  background-position: center;`,
      `  width: 200px;`,
      `  height: 200px;`,
      `}`,
      "```",
      ``,
      `## 4. 引用规范`,
      ``,
      `根据 ${LICENSE} 许可协议，使用素材时需注明来源：`,
      ``,
      `> 来源: SciGlyph by ${AUTHOR}`,
      `> URL: ${BASE_URL}`,
      `> 许可: ${LICENSE}`,
      ``,
      `## 5. 分类信息`,
      ``,
      `| 属性 | 值 |`,
      `|------|-----|`,
      `| 大类 | ${cat.icon} ${cat.zh} / ${cat.en} |`,
      `| 子分类 | ${getSubcategoryName(asset.category, asset.subcategory).zh} |`,
      `| 系列 | ${getSeriesInfo(asset.series)?.nameZh ?? asset.series} |`,
      `| 形态 | ${getFormInfo(asset.form)?.nameZh ?? asset.form} |`,
    ].join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text,
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// 启动服务器
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[SciGlyph MCP] Fatal error:", err);
  process.exit(1);
});
