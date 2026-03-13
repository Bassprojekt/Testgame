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
      <div className="forge-header">
        <h2>⚒️ Schmiede</h2>
        <p>Stelle Waffen und Rüstungen her</p>
      </div>

      {craftResult && (
        <div className={`craft-result ${craftResult.success ? 'success' : 'error'}`}>
          {craftResult.message}
        </div>
      )}

      {crafting && (
        <div className="crafting-overlay">
          <div className="crafting-animation">
            <span className="hammer">🔨</span>
            <div className="fire">🔥</div>
            <p>Schmieden...</p>
          </div>
        </div>
      )}

      <div className="items-grid">
        {availableItems.map(item => {
          const era = ERAS.find(e => e.id === item.era);
          const craftable = canCraft(item);
          
          return (
            <div 
              key={item.id}
              className={`item-card ${selectedItem?.id === item.id ? 'selected' : ''} ${!craftable ? 'locked' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="item-icon">
                {item.type === 'weapon' ? '⚔️' : item.type === 'armor' ? '🛡️' : item.type === 'helmet' ? '⛑️' : '👢'}
              </div>
              <div className="item-info">
                <h4 style={{ color: RARITY_COLORS[item.rarity] }}>{item.nameDe}</h4>
                <div className="item-stats">
                  {item.attack > 0 && <span className="attack">⚔️ {item.attack}</span>}
                  {item.defense > 0 && <span className="defense">🛡️ {item.defense}</span>}
                </div>
                <span className="item-era">{era?.icon} {era?.nameDe}</span>
                <span className="item-rarity" style={{ color: RARITY_COLORS[item.rarity] }}>
                  {item.rarity}
                </span>
              </div>
              {!craftable && <div className="lock-overlay">🔒</div>}
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="craft-modal">
          <div className="modal-content">
            <h3>{selectedItem.nameDe} herstellen</h3>
            <div className="modal-stats">
              {selectedItem.attack > 0 && <p>Angriff: +{selectedItem.attack}</p>}
              {selectedItem.defense > 0 && <p>Verteidigung: +{selectedItem.defense}</p>}
            </div>
            <div className="materials-required">
              <h4>Benötigte Materialien:</h4>
              {Object.entries(selectedItem.materials).map(([mat, amount]) => {
                const have = state.materials[mat] || 0;
                const enough = have >= amount;
                return (
                  <div key={mat} className={`material-row ${enough ? '' : 'missing'}`}>
                    <span>{mat}</span>
                    <span>{have} / {amount}</span>
                  </div>
                );
              })}
            </div>
            <div className="modal-buttons">
              <button 
                className="btn-craft" 
                disabled={!canCraft(selectedItem) || crafting}
                onClick={() => handleCraft(selectedItem)}
              >
                {crafting ? 'Schmiede...' : 'Herstellen'}
              </button>
              <button className="btn-cancel" onClick={() => setSelectedItem(null)}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
