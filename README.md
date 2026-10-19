# SciGlyph MCP Server

> An MCP (Model Context Protocol) server for the [SciGlyph Scientific Illustration Assets](https://zengzichao.github.io/SciGlyph/) library
>
> **Version: 0.1.0** | [中文文档](README.zh-CN.md)

## Overview

**SciGlyph MCP** is a Model Context Protocol (MCP) server that provides access to the [SciGlyph Scientific Illustration Assets](https://zengzichao.github.io/SciGlyph/) library. It enables AI assistants (such as Claude, Cursor, etc.) to browse, search, and retrieve scientific illustration assets (SVG format) from the SciGlyph library, making it easy to reference and embed scientific illustrations in research writing, educational materials, academic reports, and more.

### About SciGlyph

SciGlyph is a scientific illustration asset library providing approximately 2,830 SVG-format scientific illustration assets covering microbiology, genetics, ecology, and other scientific disciplines. Assets are AI-assisted and human-reviewed, licensed under CC BY 4.0.

- **Website**: <https://zengzichao.github.io/SciGlyph/>
- **Version**: v1.0.0
- **License**: CC BY 4.0
- **Author**: ZengZichao

## Features

- 🔍 **Keyword Search**: Search assets by Chinese or English keywords
- 📂 **Category Browsing**: Browse the complete taxonomy (12 categories, 40+ subcategories)
- 🎨 **Multi-dimensional Filtering**: Filter by category, subcategory, series, and form
- 🔗 **URL Construction**: Automatically build direct SVG URLs for assets
- 📝 **Usage Examples**: Generate usage examples in Markdown, HTML, CSS, and other formats
- 🌐 **Bilingual Support**: All tool descriptions and outputs include both Chinese and English

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or other package manager

### Installation

```bash
# Clone the project
git clone <repository-url>
cd SciGlyph-MCP

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Configure MCP Client

#### Cursor

Add the following to Cursor's MCP settings (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "sciglyph": {
      "command": "node",
      "args": ["/your/path/to/SciGlyph-MCP/dist/index.js"]
    }
  }
}
```

#### Claude Desktop

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sciglyph": {
      "command": "node",
      "args": ["/your/path/to/SciGlyph-MCP/dist/index.js"]
    }
  }
}
```

#### Claude Code

```bash
claude mcp add sciglyph node /your/path/to/SciGlyph-MCP/dist/index.js
```

#### VS Code (with MCP extension)

Add to `settings.json`:

```json
{
  "mcp.servers": {
    "sciglyph": {
      "command": "node",
      "args": ["/your/path/to/SciGlyph-MCP/dist/index.js"]
    }
  }
}
```

> ⚠️ Replace `/your/path/to/` with the actual absolute path to the project.

## MCP Tools

This server provides the following 7 tools:

### 1. `sciglyph_browse_categories` — Browse Categories

Lists all categories, subcategories, series, and forms in the SciGlyph library.

**Parameters**: None

**Use case**: Use this first to understand the library's organization before searching for specific assets.

**Example output**:

```
🦠 01-cells-microbes
  Chinese: 细胞与微生物
  English: Cells & Microbes
  Subcategories:
    - morphology-arrangement: Morphology & Arrangement
    - cell-structures: Cell Structures
    - cell-envelope: Cell Envelope
...
```

### 2. `sciglyph_search_assets` — Search Assets

Search for assets in the SciGlyph library by keyword, with optional filtering.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No | Search keyword (Chinese or English) |
| `category` | string | No | Category ID (e.g., `01`) |
| `subcategory` | string | No | Subcategory ID (e.g., `morphology-arrangement`) |
| `series` | string | No | Series ID (`classic`/`atlas`/`primitives`/`icons`/`lab-flow`) |
| `form` | string | No | Form ID (`illustration`/`diagram`/`icon`) |
| `limit` | number | No | Max results (default: 20) |

**Example**:

```
Query: "coccus"
Filter: category=01, series=classic
```

### 3. `sciglyph_get_asset` — Get Asset Details

Get detailed information about a specific asset by its ID.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetId` | string | Yes | Asset ID (filename without `.svg`), e.g., `001-coccus` |

### 4. `sciglyph_list_by_category` — List by Category

List all assets under a specific category or subcategory.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | Yes | Category ID or name (e.g., `01` or `cells-microbes`) |
| `subcategory` | string | No | Subcategory ID |
| `limit` | number | No | Max results (default: 50) |

### 5. `sciglyph_get_url` — Build Asset URL

Construct the direct SVG URL for an asset given its path components.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categoryId` | string | Yes | Category ID (e.g., `01`) |
| `subcategoryId` | string | Yes | Subcategory ID (e.g., `morphology-arrangement`) |
| `filename` | string | Yes | Filename without `.svg` extension |

**Use case**: When you know the exact path but the asset is not in the indexed metadata.

### 6. `sciglyph_library_info` — Library Info

Get general information about the SciGlyph library.

**Parameters**: None

### 7. `sciglyph_get_usage_examples` — Usage Examples

Get examples showing how to embed SciGlyph SVG assets in Markdown, HTML, CSS, and other contexts.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetId` | string | No | Specific asset ID; if omitted, uses a sample asset |

## Taxonomy

### Categories (12)

| ID | Slug | Chinese | English | Icon |
|----|------|---------|---------|------|
| 01 | cells-microbes | 细胞与微生物 | Cells & Microbes | 🦠 |
| 02 | genetics-omics | 遗传与组学 | Genetics & Omics | 🧬 |
| 03 | metabolism-phenotype | 代谢与表型 | Metabolism & Phenotype | ⚗️ |
| 04 | phylogeny-evolution | 系统发育与进化 | Phylogeny & Evolution | 🌳 |
| 05 | ecology-application | 生态与应用 | Ecology & Application | 🌱 |
| 06 | experimental-methods | 实验方法 | Experimental Methods | 🔬 |
| 07 | labware-consumables | 器皿与耗材 | Labware & Consumables | 🧪 |
| 08 | instruments-devices | 仪器与装置 | Instruments & Devices | 📡 |
| 09 | safety-signage | 安全与标识 | Safety & Signage | ⚠️ |
| 10 | plate-components | 图版构件 | Plate Components | 🖼️ |
| 11 | charts-diagrams | 图表与流程 | Charts & Diagrams | 📊 |
| 12 | icons-ui | 图标与 UI | Icons & UI | ✨ |

### Series (5)

| ID | Chinese | English | Description |
|----|---------|---------|-------------|
| classic | 经典插画 | Classic Illustration | Classic-style scientific illustrations with emphasis on detail and artistic expression |
| atlas | 图谱 | Atlas | Atlas-style illustrations, standardized and normalized scientific drawings |
| primitives | 通用图元 | Primitives | Primitive elements, minimalist geometric style, suitable for composing complex illustrations |
| icons | 24×24 图标 | 24×24 Icons | 24×24 pixel small icons, suitable for UI and document usage |
| lab-flow | 实验室流程 | Lab Flow | Laboratory flowchart elements for constructing experimental procedure diagrams |

### Forms (3)

| ID | Chinese | English | Description |
|----|---------|---------|-------------|
| illustration | 插画 | Illustration | Detailed scientific illustrations with rich visual information |
| diagram | 示意图 | Diagram | Simplified diagrams highlighting key structures and relationships |
| icon | 图标 | Icon | Compact icons suitable for small-size display |

## Asset URL Format

SciGlyph asset URLs follow this format:

```
https://zengzichao.github.io/SciGlyph/assets/{categoryId}-{categoryName}/{subcategory}/{number}-{name}.svg
```

**Example**:

```
https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg
```

## Usage Examples

### Embed in Markdown

```markdown
![Coccus](https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg)
```

### Embed in HTML

```html
<img src="https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg"
     alt="Coccus" width="200" />
```

### Use in CSS

```css
.coccus {
  background-image: url("https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 200px;
}
```

### Attribution

Under the CC BY 4.0 license, attribution is required when using assets:

> Source: SciGlyph by ZengZichao
> URL: <https://zengzichao.github.io/SciGlyph/>
> License: CC BY 4.0

## Project Structure

```
SciGlyph-MCP/
├── src/
│   ├── index.ts                    # MCP Server entry point
│   └── data/
│       ├── catalog.ts              # Taxonomy definitions (categories, series, forms)
│       └── sample-assets.ts        # Asset metadata samples
├── dist/                           # Build output (auto-generated)
├── package.json                    # Project configuration
├── tsconfig.json                   # TypeScript configuration
├── mcp-config.example.txt          # Configuration guide for various clients
├── test-mcp.mjs                    # Integration test script
├── LICENSE                         # MIT License
├── README.md                       # English documentation (this file)
├── README.zh-CN.md                 # Chinese documentation
└── .gitignore
```

## Development Commands

```bash
# Build
npm run build

# Watch mode
npm run dev

# Start server
npm start

# Run tests
npm test

# Debug with MCP Inspector
npm run inspector

# Clean build output
npm run clean
```

## Tech Stack

- **TypeScript** 5.7+ — Type safety
- **@modelcontextprotocol/sdk** — Official MCP SDK
- **Zod** — Parameter validation
- **Node.js** 18+ — Runtime

## FAQ

### Q: The library has ~2,830 assets, but I can't find a specific asset in the metadata. What should I do?

A: The current version includes metadata for all assets visible on the SciGlyph homepage. For assets not in the indexed metadata, use the `sciglyph_get_url` tool to construct the SVG URL based on path components (category ID, subcategory ID, filename). We recommend visiting the [SciGlyph website](https://zengzichao.github.io/SciGlyph/) to find the exact path information.

### Q: How is the scientific accuracy of the assets ensured?

A: SciGlyph assets are AI-assisted and human-reviewed, but please verify scientific accuracy before use. The MCP Server only provides asset search and URL construction functionality and does not take responsibility for the scientific accuracy of asset content.

### Q: Can I host the asset files locally?

A: The current version only supports online URL references. All SVG files are hosted on GitHub Pages. To host locally, download the asset files from the [SciGlyph repository](https://github.com/ZengZichao/SciGlyph).

### Q: How do I debug with the MCP Inspector?

A: Run `npm run inspector`, then open the Inspector interface in your browser to interactively test the tools.

## License

MIT License — This MCP Server code is licensed under the MIT License.

The SciGlyph asset library itself is licensed under CC BY 4.0. Please follow the corresponding license when using assets.

## Author

**ZengZichao**

- SciGlyph Website: <https://zengzichao.github.io/SciGlyph/>
