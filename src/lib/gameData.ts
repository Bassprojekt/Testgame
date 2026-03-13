export type Era = 'stone' | 'medieval' | 'modern' | 'space' | 'quantum';

export interface EraInfo {
  id: Era;
  name: string;
  nameDe: string;
  requiredForgeLevel: number;
  color: string;
  icon: string;
}

export const ERAS: EraInfo[] = [
  { id: 'stone', name: 'Stone Age', nameDe: 'Steinzeit', requiredForgeLevel: 1, color: '#8B7355', icon: '🪨' },
  { id: 'medieval', name: 'Medieval Age', nameDe: 'Mittelalter', requiredForgeLevel: 5, color: '#8B4513', icon: '⚔️' },
  { id: 'modern', name: 'Modern Age', nameDe: 'Moderne Ära', requiredForgeLevel: 15, color: '#4A5568', icon: '🔫' },
  { id: 'space', name: 'Space Age', nameDe: 'Weltraum', requiredForgeLevel: 30, color: '#1E3A5F', icon: '🚀' },
  { id: 'quantum', name: 'Quantum Age', nameDe: 'Quantenära', requiredForgeLevel: 50, color: '#6B21A8', icon: '⚛️' },
];

export type ItemType = 'weapon' | 'armor' | 'helmet' | 'boots';

export interface Item {
  id: string;
  name: string;
  nameDe: string;
  type: ItemType;
  era: Era;
  tier: number;
  attack: number;
  defense: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requiredLevel: number;
  materials: Record<string, number>;
  image?: string;
}

export const ITEMS: Item[] = [
  // Stone Age
  { id: 'stone_sword', name: 'Stone Sword', nameDe: 'Steinschwert', type: 'weapon', era: 'stone', tier: 1, attack: 5, defense: 0, rarity: 'common', requiredLevel: 1, materials: { stone: 10 } },
  { id: 'stone_axe', name: 'Stone Axe', nameDe: 'Steinaxt', type: 'weapon', era: 'stone', tier: 1, attack: 7, defense: 0, rarity: 'common', requiredLevel: 1, materials: { stone: 12 } },
  { id: 'stone_armor', name: 'Stone Armor', nameDe: 'Steinrüstung', type: 'armor', era: 'stone', tier: 1, attack: 0, defense: 8, rarity: 'common', requiredLevel: 1, materials: { stone: 15 } },
  { id: 'stone_helmet', name: 'Stone Helmet', nameDe: 'Steinhelm', type: 'helmet', era: 'stone', tier: 1, attack: 0, defense: 4, rarity: 'common', requiredLevel: 1, materials: { stone: 8 } },
  { id: 'stone_boots', name: 'Stone Boots', nameDe: 'Steinstiefel', type: 'boots', era: 'stone', tier: 1, attack: 0, defense: 3, rarity: 'common', requiredLevel: 1, materials: { stone: 6 } },
  
  // Medieval
  { id: 'iron_sword', name: 'Iron Sword', nameDe: 'Eisenschwert', type: 'weapon', era: 'medieval', tier: 2, attack: 15, defense: 0, rarity: 'common', requiredLevel: 5, materials: { iron: 15, wood: 5 } },
  { id: 'steel_sword', name: 'Steel Sword', nameDe: 'Stahlschwert', type: 'weapon', era: 'medieval', tier: 2, attack: 22, defense: 0, rarity: 'rare', requiredLevel: 8, materials: { steel: 20, leather: 10 } },
  { id: 'knight_armor', name: 'Knight Armor', nameDe: 'Ritterrüstung', type: 'armor', era: 'medieval', tier: 2, attack: 0, defense: 25, rarity: 'rare', requiredLevel: 10, materials: { steel: 30, leather: 15 } },
  { id: 'royal_crown', name: 'Royal Crown', nameDe: 'Königskrone', type: 'helmet', era: 'medieval', tier: 2, attack: 0, defense: 12, rarity: 'epic', requiredLevel: 12, materials: { gold: 25, diamond: 5 } },
  { id: 'knight_boots', name: 'Knight Boots', nameDe: 'Ritterstiefel', type: 'boots', era: 'medieval', tier: 2, attack: 0, defense: 10, rarity: 'rare', requiredLevel: 8, materials: { leather: 15, steel: 10 } },
  
  // Modern
  { id: 'rifle', name: 'Assault Rifle', nameDe: 'Sturmgewehr', type: 'weapon', era: 'modern', tier: 3, attack: 45, defense: 0, rarity: 'common', requiredLevel: 15, materials: { steel: 30, oil: 20 } },
  { id: 'plasma_gun', name: 'Plasma Gun', nameDe: 'Plasmagewehr', type: 'weapon', era: 'modern', tier: 3, attack: 65, defense: 0, rarity: 'rare', requiredLevel: 20, materials: { plasma: 25, titanium: 20 } },
  { id: 'kevlar_vest', name: 'Kevlar Vest', nameDe: 'Kevlarweste', type: 'armor', era: 'modern', tier: 3, attack: 0, defense: 40, rarity: 'common', requiredLevel: 15, materials: { kevlar: 25, steel: 15 } },
  { id: 'tactical_helmet', name: 'Tactical Helmet', nameDe: 'Taktischer Helm', type: 'helmet', era: 'modern', tier: 3, attack: 0, defense: 20, rarity: 'rare', requiredLevel: 18, materials: { titanium: 20, kevlar: 15 } },
  { id: 'tactical_boots', name: 'Tactical Boots', nameDe: 'Taktische Stiefel', type: 'boots', era: 'modern', tier: 3, attack: 0, defense: 15, rarity: 'common', requiredLevel: 15, materials: { leather: 20, steel: 10 } },
  
  // Space
  { id: 'laser_blaster', name: 'Laser Blaster', nameDe: 'Laserblaster', type: 'weapon', era: 'space', tier: 4, attack: 100, defense: 0, rarity: 'rare', requiredLevel: 30, materials: { crystal: 30, plasma: 25 } },
  { id: 'plasma_cannon', name: 'Plasma Cannon', nameDe: 'Plasmakanone', type: 'weapon', era: 'space', tier: 4, attack: 150, defense: 0, rarity: 'epic', requiredLevel: 35, materials: { plasma: 40, crystal: 30, uranium: 15 } },
  { id: 'spacesuit', name: 'Spacesuit', nameDe: 'Raumanzug', type: 'armor', era: 'space', tier: 4, attack: 0, defense: 70, rarity: 'rare', requiredLevel: 30, materials: { titanium: 40, crystal: 20 } },
  { id: 'space_helmet', name: 'Space Helmet', nameDe: 'Raumhelm', type: 'helmet', era: 'space', tier: 4, attack: 0, defense: 35, rarity: 'rare', requiredLevel: 30, materials: { titanium: 25, crystal: 15 } },
  { id: 'magnetic_boots', name: 'Magnetic Boots', nameDe: 'Magnetstiefel', type: 'boots', era: 'space', tier: 4, attack: 0, defense: 25, rarity: 'rare', requiredLevel: 32, materials: { titanium: 20, plasma: 15 } },
  
  // Quantum
  { id: 'quantum_saber', name: 'Quantum Saber', nameDe: 'Quantensäbel', type: 'weapon', era: 'quantum', tier: 5, attack: 250, defense: 0, rarity: 'legendary', requiredLevel: 50, materials: { quantum_crystal: 30, dark_matter: 20 } },
  { id: 'quantum_blade', name: 'Quantum Blade', nameDe: 'Quantenklinge', type: 'weapon', era: 'quantum', tier: 5, attack: 350, defense: 0, rarity: 'legendary', requiredLevel: 55, materials: { quantum_crystal: 50, dark_matter: 30, antimatter: 10 } },
  { id: 'quantum_armor', name: 'Quantum Armor', nameDe: 'Quantenrüstung', type: 'armor', era: 'quantum', tier: 5, attack: 0, defense: 150, rarity: 'legendary', requiredLevel: 50, materials: { quantum_crystal: 40, dark_matter: 25 } },
  { id: 'quantum_helmet', name: 'Quantum Helmet', nameDe: 'Quantenhelm', type: 'helmet', era: 'quantum', tier: 5, attack: 0, defense: 75, rarity: 'legendary', requiredLevel: 52, materials: { quantum_crystal: 30, dark_matter: 15 } },
  { id: 'quantum_boots', name: 'Quantum Boots', nameDe: 'Quantenstiefel', type: 'boots', era: 'quantum', tier: 5, attack: 0, defense: 50, rarity: 'legendary', requiredLevel: 50, materials: { quantum_crystal: 25, dark_matter: 10 } },
];

export interface Material {
  id: string;
  name: string;
  nameDe: string;
  era: Era;
  icon: string;
}

export const MATERIALS: Material[] = [
  { id: 'stone', name: 'Stone', nameDe: 'Stein', era: 'stone', icon: '🪨' },
  { id: 'wood', name: 'Wood', nameDe: 'Holz', era: 'stone', icon: '🪵' },
  { id: 'iron', name: 'Iron', nameDe: 'Eisen', era: 'medieval', icon: '⛓️' },
  { id: 'steel', name: 'Steel', nameDe: 'Stahl', era: 'medieval', icon: '🔩' },
  { id: 'leather', name: 'Leather', nameDe: 'Leder', era: 'medieval', icon: '🟤' },
  { id: 'gold', name: 'Gold', nameDe: 'Gold', era: 'medieval', icon: '💰' },
  { id: 'diamond', name: 'Diamond', nameDe: 'Diamant', era: 'medieval', icon: '💎' },
  { id: 'oil', name: 'Oil', nameDe: 'Öl', era: 'modern', icon: '🛢️' },
  { id: 'kevlar', name: 'Kevlar', nameDe: 'Kevlar', era: 'modern', icon: '🛡️' },
  { id: 'titanium', name: 'Titanium', nameDe: 'Titan', era: 'modern', icon: '⚪' },
  { id: 'plasma', name: 'Plasma', nameDe: 'Plasma', era: 'space', icon: '🔵' },
  { id: 'crystal', name: 'Crystal', nameDe: 'Kristall', era: 'space', icon: '💠' },
  { id: 'uranium', name: 'Uranium', nameDe: 'Uran', era: 'space', icon: '☢️' },
  { id: 'quantum_crystal', name: 'Quantum Crystal', nameDe: 'Quantenkristall', era: 'quantum', icon: '🔮' },
  { id: 'dark_matter', name: 'Dark Matter', nameDe: 'Dunkle Materie', era: 'quantum', icon: '🕳️' },
  { id: 'antimatter', name: 'Antimatter', nameDe: 'Antimaterie', era: 'quantum', icon: '⚛️' },
];

export interface Enemy {
  id: string;
  name: string;
  nameDe: string;
  era: Era;
  hp: number;
  attack: number;
  defense: number;
  goldReward: number;
  materials: Record<string, number>;
  icon: string;
}

export const ENEMIES: Enemy[] = [
  // Stone Age
  { id: 'wolf', name: 'Wolf', nameDe: 'Wolf', era: 'stone', hp: 30, attack: 5, defense: 0, goldReward: 5, materials: { stone: 2 }, icon: '🐺' },
  { id: 'sabertooth', name: 'Sabertooth', nameDe: 'Säbelzahn', era: 'stone', hp: 60, attack: 12, defense: 2, goldReward: 12, materials: { stone: 5 }, icon: '🐯' },
  { id: 'dino', name: 'Dinosaur', nameDe: 'Dinosaurier', era: 'stone', hp: 120, attack: 20, defense: 5, goldReward: 25, materials: { stone: 10 }, icon: '🦖' },
  
  // Medieval
  { id: 'bandit', name: 'Bandit', nameDe: 'Bandit', era: 'medieval', hp: 100, attack: 15, defense: 5, goldReward: 20, materials: { iron: 5 }, icon: '👺' },
  { id: 'knight', name: 'Evil Knight', nameDe: 'Böser Ritter', era: 'medieval', hp: 200, attack: 30, defense: 15, goldReward: 40, materials: { steel: 8 }, icon: '🗡️' },
  { id: 'dragon', name: 'Dragon', nameDe: 'Drache', era: 'medieval', hp: 500, attack: 50, defense: 20, goldReward: 100, materials: { gold: 10, diamond: 3 }, icon: '🐉' },
  
  // Modern
  { id: 'soldier', name: 'Soldier', nameDe: 'Soldat', era: 'modern', hp: 300, attack: 40, defense: 20, goldReward: 50, materials: { steel: 10 }, icon: '💂' },
  { id: 'tank', name: 'Tank', nameDe: 'Panzer', era: 'modern', hp: 800, attack: 80, defense: 50, goldReward: 150, materials: { titanium: 15, oil: 10 }, icon: '🚜' },
  { id: 'mech', name: 'Mech', nameDe: 'Mech', era: 'modern', hp: 1200, attack: 120, defense: 70, goldReward: 300, materials: { titanium: 25, plasma: 10 }, icon: '🤖' },
  
  // Space
  { id: 'alien', name: 'Alien', nameDe: 'Außerirdischer', era: 'space', hp: 1000, attack: 100, defense: 40, goldReward: 200, materials: { crystal: 15 }, icon: '👽' },
  { id: 'robot', name: 'Space Robot', nameDe: 'Weltraumroboter', era: 'space', hp: 2000, attack: 150, defense: 80, goldReward: 400, materials: { titanium: 20, plasma: 15 }, icon: '🔧' },
  { id: 'spaceship', name: 'Spaceship', nameDe: 'Raumschiff', era: 'space', hp: 5000, attack: 250, defense: 150, goldReward: 1000, materials: { crystal: 30, uranium: 10 }, icon: '🛸' },
  
  // Quantum
  { id: 'shadow', name: 'Shadow', nameDe: 'Schatten', era: 'quantum', hp: 3000, attack: 200, defense: 100, goldReward: 500, materials: { dark_matter: 10 }, icon: '👻' },
  { id: 'time_walker', name: 'Time Walker', nameDe: 'Zeitreisender', era: 'quantum', hp: 8000, attack: 400, defense: 200, goldReward: 1500, materials: { quantum_crystal: 20 }, icon: '⏰' },
  { id: 'quantum_beast', name: 'Quantum Beast', nameDe: 'Quantenungeheuer', era: 'quantum', hp: 15000, attack: 600, defense: 300, goldReward: 5000, materials: { quantum_crystal: 30, dark_matter: 15, antimatter: 5 }, icon: '🦑' },
];

export const RARITY_COLORS: Record<string, string> = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};
