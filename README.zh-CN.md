# SciGlyph MCP Server

> 适配 [SciGlyph 科学绘图素材库](https://zengzichao.github.io/SciGlyph/) 的 MCP (Model Context Protocol) 服务
>
> **版本: 0.1.0** | [English Documentation](README.md)

## 概述

**SciGlyph MCP** 是一个基于 Model Context Protocol (MCP) 的服务端程序，用于适配 [SciGlyph 科学绘图素材库](https://zengzichao.github.io/SciGlyph/)。它让 AI 助手（如 Claude、Cursor 等）能够直接浏览、搜索、获取 SciGlyph 库中的科学插图素材（SVG 格式），从而在科研写作、教学材料制作、学术报告等场景中高效地引用和嵌入科学插图。

### 关于 SciGlyph

SciGlyph 是一个科学绘图素材库，提供约 2830 个 SVG 格式的科学插图素材，涵盖微生物学、遗传学、生态学等多个学科领域。素材由 AI 辅助生成并经人工审查，采用 CC BY 4.0 许可协议。

- **网站**: <https://zengzichao.github.io/SciGlyph/>
- **版本**: v1.0.0
- **许可**: CC BY 4.0
- **作者**: ZengZichao

## 功能特性

- 🔍 **关键词搜索**: 支持中英文关键词搜索素材
- 📂 **分类浏览**: 浏览完整的分类体系（12 个大类、40+ 子分类）
- 🎨 **多维筛选**: 按大类、子分类、系列、形态进行筛选
- 🔗 **URL 构建**: 自动构建素材的 SVG 直链 URL
- 📝 **使用示例**: 生成 Markdown、HTML、CSS 等多种格式的使用示例
- 🌐 **双语支持**: 所有工具描述和输出均包含中英文双语信息

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或其他包管理器

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd SciGlyph-MCP

# 安装依赖
npm install

# 编译 TypeScript
npm run build
```

### 配置 MCP 客户端

#### Cursor

将以下配置添加到 Cursor 的 MCP 设置中（`~/.cursor/mcp.json`）：

```json
{
  "mcpServers": {
    "sciglyph": {
      "command": "node",
      "args": ["/你的路径/SciGlyph-MCP/dist/index.js"]
    }
  }
}
```

#### Claude Desktop

编辑 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "sciglyph": {
      "command": "node",
      "args": ["/你的路径/SciGlyph-MCP/dist/index.js"]
    }
  }
}
```

#### Claude Code

```bash
claude mcp add sciglyph node /你的路径/SciGlyph-MCP/dist/index.js
```

#### VS Code（需 MCP 扩展）

在 `settings.json` 中添加：

```json
{
  "mcp.servers": {
    "sciglyph": {
      "command": "node",
      "args": ["/你的路径/SciGlyph-MCP/dist/index.js"]
    }
  }
}
```

> ⚠️ 请将 `/你的路径/` 替换为实际的项目绝对路径。

## MCP 工具列表

本服务提供以下 7 个工具：

### 1. `sciglyph_browse_categories` — 浏览分类体系

列出 SciGlyph 素材库的所有大类、子分类、系列和形态。

**参数**: 无

**使用场景**: 首次使用时了解素材库的组织结构。

**示例输出**:

```
🦠 01-cells-microbes
  中文名: 细胞与微生物
  英文名: Cells & Microbes
  子分类:
    - morphology-arrangement: 形态与排列 / Morphology & Arrangement
    - cell-structures: 细胞结构 / Cell Structures
    - cell-envelope: 细胞包膜 / Cell Envelope
...
```

### 2. `sciglyph_search_assets` — 搜索素材

通过关键词搜索 SciGlyph 素材库中的素材，支持可选筛选。

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | string | 否 | 搜索关键词（中文或英文） |
| `category` | string | 否 | 大类编号（如 `01`） |
| `subcategory` | string | 否 | 子分类 ID（如 `morphology-arrangement`） |
| `series` | string | 否 | 系列 ID（`classic`/`atlas`/`primitives`/`icons`/`lab-flow`） |
| `form` | string | 否 | 形态 ID（`illustration`/`diagram`/`icon`） |
| `limit` | number | 否 | 最大返回数量（默认 20） |

**示例**:

```
搜索关键词: "球菌"
筛选: 大类=01, 系列=classic
```

### 3. `sciglyph_get_asset` — 获取素材详情

根据素材 ID 获取单个素材的详细信息。

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `assetId` | string | 是 | 素材 ID（文件名去掉 `.svg`），如 `001-coccus` |

### 4. `sciglyph_list_by_category` — 按分类列出素材

列出指定大类或子分类下的所有素材。

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `category` | string | 是 | 大类编号或名称（如 `01` 或 `cells-microbes`） |
| `subcategory` | string | 否 | 子分类 ID |
| `limit` | number | 否 | 最大返回数量（默认 50） |

### 5. `sciglyph_get_url` — 构建素材 URL

根据路径组成部分构建素材的 SVG 直链 URL。

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `categoryId` | string | 是 | 大类编号（如 `01`） |
| `subcategoryId` | string | 是 | 子分类 ID（如 `morphology-arrangement`） |
| `filename` | string | 是 | 文件名（不含 `.svg` 后缀） |

**使用场景**: 当已知素材路径但素材不在已索引元数据中时，可直接构建 URL。

### 6. `sciglyph_library_info` — 素材库信息

获取 SciGlyph 素材库的概要信息。

**参数**: 无

### 7. `sciglyph_get_usage_examples` — 使用示例

获取如何在 Markdown、HTML、CSS 等场景中嵌入 SciGlyph SVG 素材的示例。

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `assetId` | string | 否 | 指定素材 ID，如省略则使用示例素材 |

## 分类体系

### 大类（12 个）

| 编号 | 英文 slug | 中文名 | 英文名 | 图标 |
|------|-----------|--------|--------|------|
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

### 系列（5 个）

| ID | 中文名 | 英文名 | 说明 |
|----|--------|--------|------|
| classic | 经典插画 | Classic Illustration | 经典风格科学插画，注重细节与艺术表现力 |
| atlas | 图谱 | Atlas | 图谱风格插图，标准化、规范化的科学绘图 |
| primitives | 通用图元 | Primitives | 基础图元，简约几何风格，适合组合构建复杂插图 |
| icons | 24×24 图标 | 24×24 Icons | 24×24 像素小图标，适合界面和文档使用 |
| lab-flow | 实验室流程 | Lab Flow | 实验室流程图构件，用于构建实验操作流程图 |

### 形态（3 种）

| ID | 中文名 | 英文名 | 说明 |
|----|--------|--------|------|
| illustration | 插画 | Illustration | 详细科学插画，具有丰富细节 |
| diagram | 示意图 | Diagram | 简化示意图，突出关键结构与关系 |
| icon | 图标 | Icon | 精简图标，适合小尺寸展示 |

## 素材路径格式

SciGlyph 素材的 URL 遵循以下格式：

```
https://zengzichao.github.io/SciGlyph/assets/{大类编号}-{大类名称}/{子分类}/{编号}-{素材名}.svg
```

**示例**:

```
https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg
```

## 使用示例

### 在 Markdown 中嵌入

```markdown
![球菌](https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg)
```

### 在 HTML 中嵌入

```html
<img src="https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg"
     alt="球菌" width="200" />
```

### 在 CSS 中使用

```css
.coccus {
  background-image: url("https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 200px;
}
```

### 引用规范

根据 CC BY 4.0 许可协议，使用素材时需注明来源：

> 来源: SciGlyph by ZengZichao
> URL: <https://zengzichao.github.io/SciGlyph/>
> 许可: CC BY 4.0

## 项目结构

```
SciGlyph-MCP/
├── src/
│   ├── index.ts                    # MCP Server 主入口
│   └── data/
│       ├── catalog.ts              # 分类体系定义（大类、系列、形态等）
│       └── sample-assets.ts        # 素材元数据样例
├── dist/                           # 编译输出（自动生成）
├── package.json                    # 项目配置
├── tsconfig.json                   # TypeScript 配置
├── mcp-config.example.txt          # 各客户端配置说明
├── test-mcp.mjs                    # 集成测试脚本
├── LICENSE                         # MIT 许可证
├── README.md                       # 英文说明文档
├── README.zh-CN.md                 # 中文说明文档（本文件）
└── .gitignore
```

## 开发命令

```bash
# 编译
npm run build

# 监听模式编译
npm run dev

# 启动服务
npm start

# 运行测试
npm test

# 使用 MCP Inspector 调试
npm run inspector

# 清理编译产物
npm run clean
```

## 技术栈

- **TypeScript** 5.7+ — 类型安全
- **@modelcontextprotocol/sdk** — MCP 官方 SDK
- **Zod** — 参数校验
- **Node.js** 18+ — 运行时

## 常见问题

### Q: 素材总数约 2830 个，但元数据样例中没有找到某个素材怎么办？

A: 当前版本收录了 SciGlyph 网站首页可见的全部素材元数据。对于未收录的素材，可以使用 `sciglyph_get_url` 工具，根据路径规则（大类编号、子分类 ID、文件名）直接构建 SVG URL。建议先访问 [SciGlyph 网站](https://zengzichao.github.io/SciGlyph/) 查看完整素材列表以获取准确的路径信息。

### Q: 素材的科学准确性如何保证？

A: SciGlyph 素材由 AI 辅助生成并经人工审查，但使用前请自行核实科学准确性。MCP Server 仅提供素材的检索和 URL 构建功能，不对素材内容的科学准确性承担责任。

### Q: 是否支持本地部署素材文件？

A: 当前版本仅提供在线 URL 引用方式。所有 SVG 文件托管在 GitHub Pages 上，通过 URL 直接引用。如需本地部署，可从 [SciGlyph 仓库](https://github.com/ZengZichao/SciGlyph) 下载素材文件。

### Q: 如何在 MCP Inspector 中调试？

A: 运行 `npm run inspector`，然后在浏览器中打开 Inspector 界面，即可交互式测试各个工具。

## 许可证

MIT License — 本 MCP Server 代码采用 MIT 许可证。

SciGlyph 素材库本身采用 CC BY 4.0 许可，使用素材时请遵照相应许可协议。

## 作者

**ZengZichao**

- SciGlyph 网站: <https://zengzichao.github.io/SciGlyph/>
