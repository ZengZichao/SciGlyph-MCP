/**
 * 从 SciGlyph 网站首页提取的素材元数据样例
 *
 * 素材路径格式:
 *   assets/{categoryId}-{categoryName}/{subcategory}/{number}-{name}.svg
 *
 * 例如:
 *   https://zengzichao.github.io/SciGlyph/assets/01-cells-microbes/morphology-arrangement/001-coccus.svg
 *
 * 网站素材总数约 2830 个，此处收录了首页可见的素材。
 * 对于未收录的素材，MCP Server 会通过路径推断方式提供 URL。
 */

import type { AssetMetadata } from "./catalog.js";

// 辅助函数：精简素材定义
function a(
  id: string, nameZh: string, nameEn: string,
  category: string, subcategory: string,
  series: string, form: string, number: string,
): AssetMetadata {
  return { id, nameZh, nameEn, category, subcategory, series, form, number };
}

export const sampleAssets: AssetMetadata[] = [
  // ===== 01-cells-microbes / morphology-arrangement / classic (001–032) =====
  a("001-coccus", "球菌", "Coccus", "01", "morphology-arrangement", "classic", "illustration", "001"),
  a("002-diplococcus", "双球菌", "Diplococcus", "01", "morphology-arrangement", "classic", "illustration", "002"),
  a("003-streptococcus", "链球菌", "Streptococcus", "01", "morphology-arrangement", "classic", "illustration", "003"),
  a("004-tetrad", "四联球菌", "Tetrad", "01", "morphology-arrangement", "classic", "illustration", "004"),
  a("005-sarcina", "八叠球菌", "Sarcina", "01", "morphology-arrangement", "classic", "illustration", "005"),
  a("006-staphylococcus", "葡萄球菌", "Staphylococcus", "01", "morphology-arrangement", "classic", "illustration", "006"),
  a("007-bacillus", "杆菌", "Bacillus", "01", "morphology-arrangement", "classic", "illustration", "007"),
  a("008-coccobacillus", "球杆菌", "Coccobacillus", "01", "morphology-arrangement", "classic", "illustration", "008"),
  a("009-fusiform", "梭形菌", "Fusiform", "01", "morphology-arrangement", "classic", "illustration", "009"),
  a("010-vibrio", "弧菌", "Vibrio", "01", "morphology-arrangement", "classic", "illustration", "010"),
  a("011-comma", "逗号弧菌", "Comma-shaped", "01", "morphology-arrangement", "classic", "illustration", "011"),
  a("012-spirillum", "螺旋菌", "Spirillum", "01", "morphology-arrangement", "classic", "illustration", "012"),
  a("013-helical-bacillus", "螺旋杆菌", "Helical Bacillus", "01", "morphology-arrangement", "classic", "illustration", "013"),
  a("014-spirochete", "螺旋体", "Spirochete", "01", "morphology-arrangement", "classic", "illustration", "014"),
  a("015-leptospira", "钩端螺旋体", "Leptospira", "01", "morphology-arrangement", "classic", "illustration", "015"),
  a("016-helicobacter", "螺杆菌", "Helicobacter", "01", "morphology-arrangement", "classic", "illustration", "016"),
  a("017-filamentous", "丝状菌", "Filamentous", "01", "morphology-arrangement", "classic", "illustration", "017"),
  a("018-streptomyces-chain", "链霉菌孢子链", "Streptomyces Spore Chain", "01", "morphology-arrangement", "classic", "illustration", "018"),
  a("019-branching-mycelium", "分枝菌丝", "Branching Mycelium", "01", "morphology-arrangement", "classic", "illustration", "019"),
  a("020-sheathed-filament", "鞘状丝状体", "Sheathed Filament", "01", "morphology-arrangement", "classic", "illustration", "020"),
  a("021-square-bacterium", "方形细菌", "Square Bacterium", "01", "morphology-arrangement", "classic", "illustration", "021"),
  a("022-stellate", "星状菌", "Stellate", "01", "morphology-arrangement", "classic", "illustration", "022"),
  a("023-crescent", "新月形菌", "Crescent", "01", "morphology-arrangement", "classic", "illustration", "023"),
  a("024-mycobacterial-cords", "抗酸菌索状成束", "Mycobacterial Cords", "01", "morphology-arrangement", "classic", "illustration", "024"),
  a("025-filament-branching-pattern", "丝状分枝模式图", "Filament Branching Pattern", "01", "morphology-arrangement", "classic", "illustration", "025"),
  a("026-binary-fission", "二分裂", "Binary Fission", "01", "morphology-arrangement", "classic", "illustration", "026"),
  a("027-budding", "芽殖", "Budding", "01", "morphology-arrangement", "classic", "illustration", "027"),
  a("028-fragmentation", "断裂生殖", "Fragmentation", "01", "morphology-arrangement", "classic", "illustration", "028"),
  a("029-multiple-fission", "复分裂", "Multiple Fission", "01", "morphology-arrangement", "classic", "illustration", "029"),
  a("030-septum", "隔膜结构", "Septum", "01", "morphology-arrangement", "classic", "illustration", "030"),
  a("031-elongation-growth", "伸长-分裂周期", "Elongation-Growth Cycle", "01", "morphology-arrangement", "classic", "illustration", "031"),
  a("032-colony-to-cell", "菌落→细胞放大尺度关系", "Colony-to-Cell Scale", "01", "morphology-arrangement", "classic", "illustration", "032"),

  // ===== 01-cells-microbes / morphology-arrangement / atlas (033–069) =====
  a("033-coccus-2", "球菌", "Coccus", "01", "morphology-arrangement", "atlas", "illustration", "033"),
  a("034-diplococcus-2", "双球菌", "Diplococcus", "01", "morphology-arrangement", "atlas", "illustration", "034"),
  a("035-streptococcus-2", "链球菌", "Streptococcus", "01", "morphology-arrangement", "atlas", "illustration", "035"),
  a("036-tetrad-2", "四联球菌", "Tetrad", "01", "morphology-arrangement", "atlas", "illustration", "036"),
  a("037-sarcina-2", "八叠球菌", "Sarcina", "01", "morphology-arrangement", "atlas", "illustration", "037"),
  a("038-staphylococcus-2", "葡萄球菌", "Staphylococcus", "01", "morphology-arrangement", "atlas", "illustration", "038"),
  a("039-bacillus-2", "杆菌", "Bacillus", "01", "morphology-arrangement", "atlas", "illustration", "039"),
  a("040-streptobacillus", "链杆菌", "Streptobacillus", "01", "morphology-arrangement", "atlas", "illustration", "040"),
  a("041-fusiform-2", "梭形杆菌", "Fusiform", "01", "morphology-arrangement", "atlas", "illustration", "041"),
  a("042-coccobacillus-2", "球杆菌", "Coccobacillus", "01", "morphology-arrangement", "atlas", "illustration", "042"),
  a("043-curved-rod", "弯曲杆菌", "Curved Rod", "01", "morphology-arrangement", "atlas", "illustration", "043"),
  a("044-fusobacterium", "梭杆菌", "Fusobacterium", "01", "morphology-arrangement", "atlas", "illustration", "044"),
  a("045-spirillum-2", "螺菌", "Spirillum", "01", "morphology-arrangement", "atlas", "illustration", "045"),
  a("046-vibrio-2", "弧菌", "Vibrio", "01", "morphology-arrangement", "atlas", "illustration", "046"),
  a("047-filamentous-2", "丝状菌", "Filamentous", "01", "morphology-arrangement", "atlas", "illustration", "047"),
  a("048-sheathed-filament-2", "鞘丝状菌", "Sheathed Filament", "01", "morphology-arrangement", "atlas", "illustration", "048"),
  a("049-streptomyces", "链霉菌型放线菌", "Streptomyces", "01", "morphology-arrangement", "atlas", "illustration", "049"),
  a("050-budding-2", "出芽菌", "Budding", "01", "morphology-arrangement", "atlas", "illustration", "050"),
  a("051-caulobacter", "柄细菌", "Caulobacter", "01", "morphology-arrangement", "atlas", "illustration", "051"),
  a("052-stella", "星形菌", "Stella", "01", "morphology-arrangement", "atlas", "illustration", "052"),
  a("053-square-archaeon", "方形古菌", "Square Archaeon", "01", "morphology-arrangement", "atlas", "illustration", "053"),
  a("054-nostoc", "念珠藻", "Nostoc", "01", "morphology-arrangement", "atlas", "illustration", "054"),
  a("055-synechococcus", "聚球藻", "Synechococcus", "01", "morphology-arrangement", "atlas", "illustration", "055"),
  a("056-oscillatoria", "颤藻", "Oscillatoria", "01", "morphology-arrangement", "atlas", "illustration", "056"),
  a("057-leptospira-2", "钩端螺旋体", "Leptospira", "01", "morphology-arrangement", "atlas", "illustration", "057"),
  a("058-inclusion", "包涵体", "Inclusion Body", "01", "morphology-arrangement", "atlas", "illustration", "058"),
  a("059-chryseobacterium", "金黄杆菌", "Chryseobacterium", "01", "morphology-arrangement", "atlas", "illustration", "059"),
  a("060-giant-sulfur", "巨型硫细菌", "Giant Sulfur Bacterium", "01", "morphology-arrangement", "atlas", "illustration", "060"),
  a("061-planktothrix", "浮丝藻", "Planktothrix", "01", "morphology-arrangement", "atlas", "illustration", "061"),
  a("062-myxobacteria", "黏细菌", "Myxobacteria", "01", "morphology-arrangement", "atlas", "illustration", "062"),
  a("063-square-halo", "方形盐古菌细胞片层", "Square Haloarchaeon Cell Layer", "01", "morphology-arrangement", "atlas", "illustration", "063"),
  a("064-mycoplasma", "支原体", "Mycoplasma", "01", "morphology-arrangement", "atlas", "illustration", "064"),
  a("065-lform", "L型细菌", "L-form Bacteria", "01", "morphology-arrangement", "atlas", "illustration", "065"),
  a("066-endospore-central", "内生孢子(中央)", "Endospore (Central)", "01", "morphology-arrangement", "atlas", "illustration", "066"),
  a("067-endospore-terminal", "内生孢子(端生)", "Endospore (Terminal)", "01", "morphology-arrangement", "atlas", "illustration", "067"),
  a("068-endospore-subterminal", "内生孢子(副端生)", "Endospore (Subterminal)", "01", "morphology-arrangement", "atlas", "illustration", "068"),
  a("069-planctomycetes-budding", "芽殖浮霉菌", "Planctomycetes Budding", "01", "morphology-arrangement", "atlas", "illustration", "069"),

  // ===== 01-cells-microbes / morphology-arrangement / primitives (070–072) =====
  a("070-bacterium-rod", "杆菌", "Bacterium (Rod)", "01", "morphology-arrangement", "primitives", "illustration", "070"),
  a("071-bacterium-coccus", "球菌", "Bacterium (Coccus)", "01", "morphology-arrangement", "primitives", "illustration", "071"),
  a("072-bacterium-spiral", "螺菌", "Bacterium (Spiral)", "01", "morphology-arrangement", "primitives", "illustration", "072"),

  // ===== 01-cells-microbes / cell-structures / classic (001–034) =====
  a("cs-001-flagellum", "鞭毛总览", "Flagellum Overview", "01", "cell-structures", "classic", "illustration", "001"),
  a("cs-002-monotrichous", "单极鞭毛", "Monotrichous", "01", "cell-structures", "classic", "illustration", "002"),
  a("cs-003-amphitrichous", "双极鞭毛", "Amphitrichous", "01", "cell-structures", "classic", "illustration", "003"),
  a("cs-004-lophotrichous", "丛生鞭毛", "Lophotrichous", "01", "cell-structures", "classic", "illustration", "004"),
  a("cs-005-peritrichous", "周生鞭毛", "Peritrichous", "01", "cell-structures", "classic", "illustration", "005"),
  a("cs-006-lashing-flagellum", "弯曲鞭毛", "Lashing Flagellum", "01", "cell-structures", "classic", "illustration", "006"),
  a("cs-007-fimbriae", "菌毛", "Fimbriae", "01", "cell-structures", "classic", "illustration", "007"),
  a("cs-008-sex-pilus", "性菌毛", "Sex Pilus", "01", "cell-structures", "classic", "illustration", "008"),
  a("cs-009-capsule", "荚膜", "Capsule", "01", "cell-structures", "classic", "illustration", "009"),
  a("cs-010-biofilm", "生物膜", "Biofilm", "01", "cell-structures", "classic", "illustration", "010"),
  a("cs-011-basal-body", "鞭毛基体", "Basal Body", "01", "cell-structures", "classic", "illustration", "011"),
  a("cs-012-hook", "钩鞭毛体", "Hook", "01", "cell-structures", "classic", "illustration", "012"),
  a("cs-013-filament", "鞭毛丝", "Filament", "01", "cell-structures", "classic", "illustration", "013"),
  a("cs-014-flagellar-anchor", "鞭毛锚定", "Flagellar Anchor", "01", "cell-structures", "classic", "illustration", "014"),
  a("cs-015-motor-rotor", "马达转子", "Motor Rotor", "01", "cell-structures", "classic", "illustration", "015"),
  a("cs-016-cell-wall", "细胞壁", "Cell Wall", "01", "cell-structures", "classic", "illustration", "016"),
  a("cs-017-peptidoglycan", "肽聚糖网", "Peptidoglycan", "01", "cell-structures", "classic", "illustration", "017"),
  a("cs-018-gram-negative-envelope", "革兰阴性包被", "Gram-negative Envelope", "01", "cell-structures", "classic", "illustration", "018"),
  a("cs-019-outer-membrane", "外膜", "Outer Membrane", "01", "cell-structures", "classic", "illustration", "019"),
  a("cs-020-nucleoid", "拟核", "Nucleoid", "01", "cell-structures", "classic", "illustration", "020"),
  a("cs-021-plasmid", "质粒", "Plasmid", "01", "cell-structures", "classic", "illustration", "021"),
  a("cs-022-ribosome", "核糖体", "Ribosome", "01", "cell-structures", "classic", "illustration", "022"),
  a("cs-023-rrna-operon", "rRNA 操纵子", "rRNA Operon", "01", "cell-structures", "classic", "illustration", "023"),
  a("cs-024-transcription-translation", "转录翻译偶联", "Transcription-Translation Coupling", "01", "cell-structures", "classic", "illustration", "024"),
  a("cs-025-endospore", "芽孢整体", "Endospore", "01", "cell-structures", "classic", "illustration", "025"),
  a("cs-026-spore-coat", "芽孢衣", "Spore Coat", "01", "cell-structures", "classic", "illustration", "026"),
  a("cs-027-spore-cortex", "芽孢皮层", "Spore Cortex", "01", "cell-structures", "classic", "illustration", "027"),
  a("cs-028-parasporal-crystal", "伴孢晶体", "Parasporal Crystal", "01", "cell-structures", "classic", "illustration", "028"),
  a("cs-029-metachromatic-granule", "异染粒", "Metachromatic Granule", "01", "cell-structures", "classic", "illustration", "029"),
  a("cs-030-phb-granule", "PHB 贮藏颗粒", "PHB Granule", "01", "cell-structures", "classic", "illustration", "030"),
  a("cs-031-sulfur-granule", "硫粒", "Sulfur Granule", "01", "cell-structures", "classic", "illustration", "031"),
  a("cs-032-gas-vacuole", "气泡", "Gas Vacuole", "01", "cell-structures", "classic", "illustration", "032"),
  a("cs-033-magnetosome", "磁小体", "Magnetosome", "01", "cell-structures", "classic", "illustration", "033"),
  a("cs-034-carboxysome", "羧酶体", "Carboxysome", "01", "cell-structures", "classic", "illustration", "034"),

  // ===== 01-cells-microbes / cell-envelope / atlas (001–014) =====
  a("ce-001-gram-negative-2", "革兰氏阴性菌包被", "Gram-negative Envelope", "01", "cell-envelope", "atlas", "illustration", "001"),
  a("ce-002-gram-positive-2", "革兰氏阳性菌包被", "Gram-positive Envelope", "01", "cell-envelope", "atlas", "illustration", "002"),
  a("ce-003-archaea-slayer", "古菌S层", "Archaea S-layer", "01", "cell-envelope", "atlas", "illustration", "003"),
  a("ce-004-pseudomurein", "假肽聚糖", "Pseudomurein", "01", "cell-envelope", "atlas", "illustration", "004"),
  a("ce-005-methanochondroitin", "甲烷软骨素层", "Methanochondroitin", "01", "cell-envelope", "atlas", "illustration", "005"),
  a("ce-006-slap-layer", "S层相关蛋白", "SLAP Layer", "01", "cell-envelope", "atlas", "illustration", "006"),
  a("ce-007-mycobacterium", "分枝杆菌包被", "Mycobacterium Envelope", "01", "cell-envelope", "atlas", "illustration", "007"),
  a("ce-008-omv", "外膜囊泡", "Outer Membrane Vesicle", "01", "cell-envelope", "atlas", "illustration", "008"),
  a("ce-009-periplasm", "周质空间", "Periplasm", "01", "cell-envelope", "atlas", "illustration", "009"),
  a("ce-010-amyloid-sheath", "淀粉样鞘蛋白", "Amyloid Sheath", "01", "cell-envelope", "atlas", "illustration", "010"),
  a("ce-011-leptospira-om", "钩端螺旋体外膜", "Leptospira Outer Membrane", "01", "cell-envelope", "atlas", "illustration", "011"),
  a("ce-012-cyanobacteria-sheath", "蓝细菌胶鞘", "Cyanobacteria Sheath", "01", "cell-envelope", "atlas", "illustration", "012"),
  a("ce-013-lps-structure", "脂多糖结构", "LPS Structure", "01", "cell-envelope", "atlas", "illustration", "013"),
  a("ce-014-pg-monomer", "肽聚糖单体", "Peptidoglycan Monomer", "01", "cell-envelope", "atlas", "illustration", "014"),
];
