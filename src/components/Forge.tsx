'use client';

import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { ITEMS, ERAS, Item, RARITY_COLORS } from '@/lib/gameData';

export default function Forge() {
  const { state, dispatch, calculateStats } = useGame();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [crafting, setCrafting] = useState(false);
  const [craftResult, setCraftResult] = useState<{ success: boolean; message: string } | null>(null);

  const availableItems = ITEMS.filter(item => {
    const eraIndex = ERAS.findIndex(e => e.id === item.era);
    const forgeEraIndex = ERAS.findIndex(e => e.id === state.currentEra);
    return eraIndex <= forgeEraIndex && item.requiredLevel <= state.playerLevel;
  });

  const canCraft = (item: Item) => {
    if (state.forgeLevel < item.requiredLevel) return false;
    return Object.entries(item.materials).every(([mat, amount]) => {
      return (state.materials[mat] || 0) >= amount;
    });
  };

  const handleCraft = async (item: Item) => {
    if (!canCraft(item)) return;
    
    setCrafting(true);
    setCraftResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const xpGain = item.tier * 50;
    let newForgeXp = state.forgeXp + xpGain;
    let newForgeLevel = state.forgeLevel;
    const xpToLevel = state.forgeLevel * 200;

    if (newForgeXp >= xpToLevel) {
      newForgeXp -= xpToLevel;
      newForgeLevel++;
    }

    dispatch({ type: 'REMOVE_MATERIALS', materials: item.materials });
    dispatch({ type: 'ADD_TO_INVENTORY', item });
    dispatch({ type: 'FORGE_LEVEL_UP' });
    
    setCrafting(false);
    setCraftResult({ 
      success: true, 
      message: `${item.nameDe} hergestellt! +${xpGain} Schmiede-XP` 
    });
    setSelectedItem(null);

    setTimeout(() => setCraftResult(null), 3000);
  };

  return (
    <div className="forge-container">
      <div className="section-header">
        <div className="section-icon">⚒️</div>
        <div className="section-text">
          <h2 className="section-title">Schmiede</h2>
          <p>Stelle mächtige Waffen und Rüstungen her</p>
        </div>
      </div>

      {craftResult && (
        <div className={`toast-notification ${craftResult.success ? 'success' : 'error'}`}>
          <span className="toast-icon">✨</span>
          <span>{craftResult.message}</span>
        </div>
      )}

      {crafting && (
        <div className="crafting-overlay">
          <div className="crafting-animation">
            <div className="anvil-container">
              <span className="hammer">🔨</span>
            </div>
            <div className="fire-container">
              <span className="fire">🔥</span>
              <span className="fire delay">🔥</span>
              <span className="fire delay-2">🔥</span>
            </div>
            <p>Wird geschmiedet...</p>
          </div>
        </div>
      )}

      <div className="items-grid modern">
        {availableItems.map(item => {
          const era = ERAS.find(e => e.id === item.era);
          const craftable = canCraft(item);
          
          return (
            <div 
              key={item.id}
              className={`item-card modern ${selectedItem?.id === item.id ? 'selected' : ''} ${!craftable ? 'locked' : ''}`}
              style={{ '--rarity-color': RARITY_COLORS[item.rarity] } as React.CSSProperties}
              onClick={() => setSelectedItem(item)}
            >
              <div className="item-glow" style={{ background: RARITY_COLORS[item.rarity] }} />
              <div className="item-icon modern">
                {item.type === 'weapon' ? '⚔️' : item.type === 'armor' ? '🛡️' : item.type === 'helmet' ? '⛑️' : '👢'}
              </div>
              <div className="item-info">
                <h4 style={{ color: RARITY_COLORS[item.rarity] }}>{item.nameDe}</h4>
                <div className="item-stats">
                  {item.attack > 0 && <span className="stat attack">⚔️ +{item.attack}</span>}
                  {item.defense > 0 && <span className="stat defense">🛡️ +{item.defense}</span>}
                </div>
                <div className="item-meta">
                  <span className="item-era">{era?.icon}</span>
                  <span className="item-rarity" style={{ color: RARITY_COLORS[item.rarity] }}>
                    {item.rarity}
                  </span>
                </div>
              </div>
              {!craftable && <div className="lock-overlay">🔒</div>}
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="craft-modal" onClick={() => setSelectedItem(null)}>
          <div className="modal-content modern" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderColor: RARITY_COLORS[selectedItem.rarity] }}>
              <div className="modal-icon">
                {selectedItem.type === 'weapon' ? '⚔️' : selectedItem.type === 'armor' ? '🛡️' : selectedItem.type === 'helmet' ? '⛑️' : '👢'}
              </div>
              <h3 style={{ color: RARITY_COLORS[selectedItem.rarity] }}>{selectedItem.nameDe}</h3>
            </div>
            <div className="modal-stats">
              {selectedItem.attack > 0 && <p><span className="stat-icon">⚔️</span> Angriff: <strong>+{selectedItem.attack}</strong></p>}
              {selectedItem.defense > 0 && <p><span className="stat-icon">🛡️</span> Verteidigung: <strong>+{selectedItem.defense}</strong></p>}
            </div>
            <div className="materials-required modern">
              <h4><span className="material-icon">📦</span> Benötigte Materialien</h4>
              {Object.entries(selectedItem.materials).map(([mat, amount]) => {
                const have = state.materials[mat] || 0;
                const enough = have >= amount;
                return (
                  <div key={mat} className={`material-row ${enough ? 'enough' : 'missing'}`}>
                    <span className="material-name">{mat}</span>
                    <span className="material-amount">
                      <span className={enough ? 'has-enough' : 'not-enough'}>{have}</span>
                      <span className="separator">/</span>
                      <span className="required">{amount}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="modal-buttons">
              <button 
                className="btn-craft modern" 
                disabled={!canCraft(selectedItem) || crafting}
                onClick={() => handleCraft(selectedItem)}
              >
                <span className="btn-icon">⚒️</span>
                {crafting ? 'Schmiede...' : 'Herstellen'}
              </button>
              <button className="btn-cancel modern" onClick={() => setSelectedItem(null)}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
