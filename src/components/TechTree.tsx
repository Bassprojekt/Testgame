'use client';

import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { TECH_UPGRADES, TECH_UPGRADES as TECH, RARITY_COLORS } from '@/lib/gameData';

export default function TechTree() {
  const { state, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const techUpgrades = state.techUpgrades || {};

  const categories = [
    { id: 'all', name: 'Alle', icon: '🔬' },
    { id: 'combat', name: 'Kampf', icon: '⚔️' },
    { id: 'forge', name: 'Schmiede', icon: '⚒️' },
    { id: 'automation', name: 'Auto', icon: '⚙️' },
    { id: 'magic', name: 'Magie', icon: '✨' },
  ];

  const canAfford = (cost: Record<string, number>) => {
    return Object.entries(cost).every(([mat, amount]) => (state.materials[mat] || 0) >= amount);
  };

  const buyUpgrade = (upgrade: typeof TECH[0]) => {
    const currentLevel = techUpgrades[upgrade.id] || 0;
    if (currentLevel >= upgrade.maxLevel) return;
    if (!canAfford(upgrade.cost)) return;

    const scaledCost: Record<string, number> = {};
    Object.entries(upgrade.cost).forEach(([mat, amount]) => {
      scaledCost[mat] = Math.floor(amount * (1 + currentLevel * 0.5));
    });

    dispatch({ type: 'REMOVE_MATERIALS', materials: scaledCost });
    dispatch({ type: 'BUY_TECH', upgradeId: upgrade.id });
  };

  const getEffectDescription = (upgrade: typeof TECH[0], level: number) => {
    const value = upgrade.effectValue * (level + 1);
    if (upgrade.effect === 'attack' || upgrade.effect === 'defense' || upgrade.effect === 'damage') {
      return `+${Math.round(value * 100)}%`;
    }
    if (upgrade.effect === 'hp') return `+${Math.round(value * 100)}%`;
    if (upgrade.effect === 'forgeLevel') return `+${level + 1}`;
    if (upgrade.effect === 'autoCraft') return `Level ${level + 1}`;
    if (upgrade.effect === 'craftSpeed' || upgrade.effect === 'itemQuality') return `+${Math.round(value * 100)}%`;
    if (upgrade.effect === 'allStats') return `+${Math.round(value * 100)}%`;
    return `+${value}`;
  };

  const filteredTech = selectedCategory === 'all' 
    ? TECH_UPGRADES 
    : TECH_UPGRADES.filter(t => t.category === selectedCategory);

  const getEraColor = (era: string) => {
    const colors: Record<string, string> = {
      stone: '#8B7355',
      medieval: '#8B4513',
      modern: '#4A5568',
      space: '#1E3A5F',
      quantum: '#6B21A8',
    };
    return colors[era] || '#666';
  };

  return (
    <div className="tech-tree">
      <h2 className="section-title">🔬 Technologie Baum</h2>
      
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="tech-grid">
        {filteredTech.map(upgrade => {
          const currentLevel = techUpgrades[upgrade.id] || 0;
          const maxed = currentLevel >= upgrade.maxLevel;
          const affordable = canAfford(upgrade.cost);
          const eraColor = getEraColor(upgrade.era);

          return (
            <div key={upgrade.id} className={`tech-card ${maxed ? 'maxed' : ''} ${!affordable && !maxed ? 'locked' : ''}`}>
              <div className="tech-header" style={{ backgroundColor: eraColor }}>
                <span className="tech-icon">{upgrade.icon}</span>
                <span className="tech-name">{upgrade.nameDe}</span>
              </div>
              
              <div className="tech-info">
                <p className="tech-desc">{upgrade.descriptionDe}</p>
                <div className="tech-level">
                  <span>Level: {currentLevel}/{upgrade.maxLevel}</span>
                  <div className="level-bar">
                    <div className="level-fill" style={{ width: `${(currentLevel / upgrade.maxLevel) * 100}%` }} />
                  </div>
                </div>
                <p className="tech-effect">Effekt: {getEffectDescription(upgrade, currentLevel)}</p>
              </div>

              <div className="tech-cost">
                <span>Kosten:</span>
                {Object.entries(upgrade.cost).map(([mat, amount]) => (
                  <span key={mat} className="cost-item">
                    {mat}: {Math.floor(amount * (1 + currentLevel * 0.5))}
                  </span>
                ))}
              </div>

              <button
                className="buy-btn"
                disabled={maxed || !affordable}
                onClick={() => buyUpgrade(upgrade)}
              >
                {maxed ? 'MAX' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
