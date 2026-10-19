/**
 * SciGlyph 素材库分类体系定义
 *
 * 数据来源：https://zengzichao.github.io/SciGlyph/
 * 版本：v1.0.0 | 许可：CC BY 4.0 | 素材总数：~2830
 */

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

export interface Subcategory {
  /** 子分类 ID，如 "morphology-arrangement" */
  id: string;
  nameZh: string;
  nameEn: string;
}

export interface Category {
  /** 大类编号，如 "01" */
  id: string;
  /** 英文 slug，如 "cells-microbes"，对应素材路径中的目录名 */
  name: string;
  nameZh: string;
  nameEn: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Series {
  id: string;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
}

export interface Form {
  id: string;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
}

export interface AssetMetadata {
  /** 素材文件名（不含 .svg），如 "001-coccus" */
  id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  subcategory: string;
  series: string;
  form: string;
  number: string;
}

// ---------------------------------------------------------------------------
// 常量
// ---------------------------------------------------------------------------

export const BASE_URL = "https://zengzichao.github.io/SciGlyph/";
export const ASSETS_PREFIX = "assets/";
export const LIBRARY_VERSION = "1.0.0";
export const LICENSE = "CC BY 4.0";
export const TOTAL_ASSETS = 2830;
export const AUTHOR = "ZengZichao";

// ---------------------------------------------------------------------------
// 分类体系（12 个大类）
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  {
    id: "01", name: "cells-microbes", nameZh: "细胞与微生物", nameEn: "Cells & Microbes", icon: "🦠",
    subcategories: [
      { id: "morphology-arrangement", nameZh: "形态与排列", nameEn: "Morphology & Arrangement" },
      { id: "cell-structures", nameZh: "细胞结构", nameEn: "Cell Structures" },
      { id: "cell-envelope", nameZh: "细胞包膜", nameEn: "Cell Envelope" },
    ],
  },
  {
    id: "02", name: "genetics-omics", nameZh: "遗传与组学", nameEn: "Genetics & Omics", icon: "🧬",
    subcategories: [
      { id: "dna-rna", nameZh: "DNA 与 RNA", nameEn: "DNA & RNA" },
      { id: "genes-genomes", nameZh: "基因与基因组", nameEn: "Genes & Genomes" },
      { id: "omics", nameZh: "组学图谱", nameEn: "Omics Maps" },
      { id: "regulation", nameZh: "调控元件", nameEn: "Regulatory Elements" },
    ],
  },
  {
    id: "03", name: "metabolism-phenotype", nameZh: "代谢与表型", nameEn: "Metabolism & Phenotype", icon: "⚗️",
    subcategories: [
      { id: "metabolic-pathways", nameZh: "代谢途径", nameEn: "Metabolic Pathways" },
      { id: "enzymes", nameZh: "酶与催化", nameEn: "Enzymes & Catalysis" },
      { id: "phenotypes", nameZh: "表型特征", nameEn: "Phenotypic Traits" },
      { id: "antibiotic-resistance", nameZh: "耐药机制", nameEn: "Antibiotic Resistance" },
    ],
  },
  {
    id: "04", name: "phylogeny-evolution", nameZh: "系统发育与进化", nameEn: "Phylogeny & Evolution", icon: "🌳",
    subcategories: [
      { id: "phylogenetic-trees", nameZh: "系统发育树", nameEn: "Phylogenetic Trees" },
      { id: "taxonomic-ranks", nameZh: "分类等级", nameEn: "Taxonomic Ranks" },
      { id: "evolution", nameZh: "进化机制", nameEn: "Evolutionary Mechanisms" },
    ],
  },
  {
    id: "05", name: "ecology-application", nameZh: "生态与应用", nameEn: "Ecology & Application", icon: "🌱",
    subcategories: [
      { id: "ecology", nameZh: "生态关系", nameEn: "Ecological Interactions" },
      { id: "biogeochemical-cycles", nameZh: "生物地球化学循环", nameEn: "Biogeochemical Cycles" },
      { id: "biotechnology", nameZh: "生物技术", nameEn: "Biotechnology" },
      { id: "food-microbiology", nameZh: "食品微生物", nameEn: "Food Microbiology" },
    ],
  },
  {
    id: "06", name: "experimental-methods", nameZh: "实验方法", nameEn: "Experimental Methods", icon: "🔬",
    subcategories: [
      { id: "staining", nameZh: "染色与镜检", nameEn: "Staining & Microscopy" },
      { id: "culture", nameZh: "培养技术", nameEn: "Culture Techniques" },
      { id: "molecular-methods", nameZh: "分子方法", nameEn: "Molecular Methods" },
      { id: "identification", nameZh: "鉴定方法", nameEn: "Identification Methods" },
    ],
  },
  {
    id: "07", name: "labware-consumables", nameZh: "器皿与耗材", nameEn: "Labware & Consumables", icon: "🧪",
    subcategories: [
      { id: "glassware", nameZh: "玻璃器皿", nameEn: "Glassware" },
      { id: "plasticware", nameZh: "塑料耗材", nameEn: "Plasticware" },
      { id: "culture-vessels", nameZh: "培养容器", nameEn: "Culture Vessels" },
      { id: "measurement", nameZh: "量器", nameEn: "Measuring Devices" },
    ],
  },
  {
    id: "08", name: "instruments-devices", nameZh: "仪器与装置", nameEn: "Instruments & Devices", icon: "📡",
    subcategories: [
      { id: "microscopes", nameZh: "显微镜", nameEn: "Microscopes" },
      { id: "analytical", nameZh: "分析仪器", nameEn: "Analytical Instruments" },
      { id: "incubators", nameZh: "培养与环控设备", nameEn: "Incubators & Environmental" },
      { id: "general-equipment", nameZh: "通用设备", nameEn: "General Equipment" },
    ],
  },
  {
    id: "09", name: "safety-signage", nameZh: "安全与标识", nameEn: "Safety & Signage", icon: "⚠️",
    subcategories: [
      { id: "biohazard", nameZh: "生物危害标识", nameEn: "Biohazard Signs" },
      { id: "chemical-safety", nameZh: "化学品安全", nameEn: "Chemical Safety" },
      { id: "ppe", nameZh: "个人防护", nameEn: "Personal Protective Equipment" },
      { id: "warning-labels", nameZh: "警示标签", nameEn: "Warning Labels" },
    ],
  },
  {
    id: "10", name: "plate-components", nameZh: "图版构件", nameEn: "Plate Components", icon: "🖼️",
    subcategories: [
      { id: "frames-borders", nameZh: "边框与框线", nameEn: "Frames & Borders" },
      { id: "labels-arrows", nameZh: "标注与箭头", nameEn: "Labels & Arrows" },
      { id: "scale-bars", nameZh: "比例尺", nameEn: "Scale Bars" },
      { id: "color-schemes", nameZh: "配色方案", nameEn: "Color Schemes" },
    ],
  },
  {
    id: "11", name: "charts-diagrams", nameZh: "图表与流程", nameEn: "Charts & Diagrams", icon: "📊",
    subcategories: [
      { id: "flowcharts", nameZh: "流程图构件", nameEn: "Flowchart Elements" },
      { id: "statistical-charts", nameZh: "统计图表", nameEn: "Statistical Charts" },
      { id: "venn-diagrams", nameZh: "维恩图", nameEn: "Venn Diagrams" },
      { id: "timeline", nameZh: "时间线", nameEn: "Timelines" },
    ],
  },
  {
    id: "12", name: "icons-ui", nameZh: "图标与 UI", nameEn: "Icons & UI", icon: "✨",
    subcategories: [
      { id: "ui-elements", nameZh: "界面元素", nameEn: "UI Elements" },
      { id: "navigation", nameZh: "导航图标", nameEn: "Navigation Icons" },
      { id: "status-indicators", nameZh: "状态指示器", nameEn: "Status Indicators" },
      { id: "miscellaneous", nameZh: "杂项图标", nameEn: "Miscellaneous Icons" },
    ],
  },
];

// ---------------------------------------------------------------------------
// 系列定义（5 个系列）
// ---------------------------------------------------------------------------

export const seriesList: Series[] = [
  { id: "classic", nameZh: "经典插画", nameEn: "Classic Illustration", descriptionZh: "经典风格科学插画，注重细节与艺术表现力", descriptionEn: "Classic-style scientific illustrations with emphasis on detail and artistic expression" },
  { id: "atlas", nameZh: "图谱", nameEn: "Atlas", descriptionZh: "图谱风格插图，标准化、规范化的科学绘图", descriptionEn: "Atlas-style illustrations, standardized and normalized scientific drawings" },
  { id: "primitives", nameZh: "通用图元", nameEn: "Primitives", descriptionZh: "基础图元，简约几何风格，适合组合构建复杂插图", descriptionEn: "Primitive elements, minimalist geometric style, suitable for composing complex illustrations" },
  { id: "icons", nameZh: "24×24 图标", nameEn: "24×24 Icons", descriptionZh: "24×24 像素小图标，适合界面和文档使用", descriptionEn: "24×24 pixel small icons, suitable for UI and document usage" },
  { id: "lab-flow", nameZh: "实验室流程", nameEn: "Lab Flow", descriptionZh: "实验室流程图构件，用于构建实验操作流程图", descriptionEn: "Laboratory flowchart elements for constructing experimental procedure diagrams" },
];

// ---------------------------------------------------------------------------
// 形态定义（3 种形态）
// ---------------------------------------------------------------------------

export const formList: Form[] = [
  { id: "illustration", nameZh: "插画", nameEn: "Illustration", descriptionZh: "详细科学插画，具有丰富细节", descriptionEn: "Detailed scientific illustrations with rich visual information" },
  { id: "diagram", nameZh: "示意图", nameEn: "Diagram", descriptionZh: "简化示意图，突出关键结构与关系", descriptionEn: "Simplified diagrams highlighting key structures and relationships" },
  { id: "icon", nameZh: "图标", nameEn: "Icon", descriptionZh: "精简图标，适合小尺寸展示", descriptionEn: "Compact icons suitable for small-size display" },
];
