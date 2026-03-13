'use client';

import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { Item, RARITY_COLORS, ERAS } from '@/lib/gameData';

export default function Inventory() {
  const { state, dispatch, calculateStats } = useGame();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const equipItem = (item: Item) => {
    dispatch({ type: 'EQUIP_ITEM', item, slot: item.type as keyof typeof state.equipment });
  };

  const getEquipmentIcon = (slot: keyof typeof state.equipment) => {
    const item = state.equipment[slot];
    if (!item) {
      return slot === 'weapon' ? '⚔️' : slot === 'armor' ? '🛡️' : slot === 'helmet' ? '⛑️' : '👢';
    }
    return item.type === 'weapon' ? '⚔️' : item.type === 'armor' ? '🛡️' : item.type === 'helmet' ? '⛑️' : '👢';
  };

  const stats = calculateStats();

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>🎒 Inventar</h2>
        <div className="current-stats">
          <div className="stat">
            <span className="stat-icon">⚔️</span>
            <span className="stat-value">{stats.attack}</span>
            <span className="stat-label">Angriff</span>
          </div>
          <div className="stat">
            <span className="stat-icon">🛡️</span>
            <span className="stat-value">{stats.defense}</span>
            <span className="stat-label">Verteidigung</span>
          </div>
        </div>
      </div>

      <div className="equipment-slots">
        <h3>Ausrüstung</h3>
        <div className="slots-grid">
          {(['weapon', 'armor', 'helmet', 'boots'] as const).map(slot => {
            const item = state.equipment[slot];
            return (
              <div 
                key={slot} 
                className={`equipment-slot ${item ? 'equipped' : ''}`}
                onClick={() => item && setSelectedItem(item)}
              >
                <span className="slot-icon">{getEquipmentIcon(slot)}</span>
                {item && (
                  <div className="equipped-item">
                    <span className="item-name" style={{ color: RARITY_COLORS[item.rarity] }}>
                      {item.nameDe}
                    </span>
                    {item.attack > 0 && <span className="stat">⚔️{item.attack}</span>}
                    {item.defense > 0 && <span className="stat">🛡️{item.defense}</span>}
                  </div>
                )}
                <span className="slot-label">{slot}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="inventory-items">
        <h3>Inventar ({state.inventory.length} Gegenstände)</h3>
        {state.inventory.length === 0 ? (
          <p className="empty-inventory">Keine Gegenstände im Inventar. Kämpfe oder schmiede neue Gegenstände!</p>
        ) : (
          <div className="items-grid">
            {state.inventory.map((item, index) => {
              const era = ERAS.find(e => e.id === item.era);
              const isEquipped = Object.values(state.equipment).some(e => e?.id === item.id);
              
              return (
                <div 
                  key={`${item.id}-${index}`}
                  className={`item-card ${isEquipped ? 'equipped' : ''}`}
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
                    {isEquipped && <span className="equipped-badge">Ausgerüstet</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="item-modal" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: RARITY_COLORS[selectedItem.rarity] }}>{selectedItem.nameDe}</h3>
            <div className="modal-details">
              <p>Typ: {selectedItem.type}</p>
              <p>Seltenheit: <span style={{ color: RARITY_COLORS[selectedItem.rarity] }}>{selectedItem.rarity}</span></p>
              <p>Era: {ERAS.find(e => e.id === selectedItem.era)?.nameDe}</p>
              {selectedItem.attack > 0 && <p>Angriff: +{selectedItem.attack}</p>}
              {selectedItem.defense > 0 && <p>Verteidigung: +{selectedItem.defense}</p>}
            </div>
            <div className="modal-buttons">
              {!Object.values(state.equipment).some(e => e?.id === selectedItem.id) && (
                <button className="btn-equip" onClick={() => { equipItem(selectedItem); setSelectedItem(null); }}>
                  Ausrüsten
                </button>
              )}
              <button className="btn-close" onClick={() => setSelectedItem(null)}>
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
