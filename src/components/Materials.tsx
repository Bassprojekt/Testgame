'use client';

import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { MATERIALS, ERAS, Era } from '@/lib/gameData';

export default function Materials() {
  const { state, dispatch } = useGame();
  const [buyMaterial, setBuyMaterial] = useState<string | null>(null);
  const [buyAmount, setBuyAmount] = useState(1);

  const availableMaterials = MATERIALS.filter(mat => {
    const eraIndex = ERAS.findIndex(e => e.id === mat.era);
    const playerEraIndex = ERAS.findIndex(e => e.id === state.currentEra);
    return eraIndex <= playerEraIndex;
  });

  const getMaterialPrice = (materialId: string) => {
    const prices: Record<string, number> = {
      stone: 1,
      wood: 2,
      iron: 5,
      steel: 10,
      leather: 8,
      gold: 50,
      diamond: 100,
      oil: 15,
      kevlar: 25,
      titanium: 40,
      plasma: 60,
      crystal: 80,
      uranium: 120,
      quantum_crystal: 200,
      dark_matter: 300,
      antimatter: 500,
    };
    return prices[materialId] || 10;
  };

  const handleBuy = () => {
    if (!buyMaterial) return;
    const price = getMaterialPrice(buyMaterial) * buyAmount;
    if (state.gold >= price) {
      dispatch({ type: 'ADD_GOLD', amount: -price });
      dispatch({ type: 'ADD_MATERIAL', material: buyMaterial, amount: buyAmount });
      setBuyMaterial(null);
      setBuyAmount(1);
    }
  };

  const handleGather = (materialId: string) => {
    dispatch({ type: 'ADD_MATERIAL', material: materialId, amount: 3 });
  };

  return (
    <div className="materials-container">
      <div className="materials-header">
        <h2>📦 Materialien</h2>
        <div className="gold-display">
          <span className="icon">💰</span>
          <span className="value">{state.gold.toLocaleString()}</span>
        </div>
      </div>

      <div className="gather-section">
        <h3>⛏️ Sammeln</h3>
        <p>Sammle kostenlose Materialien</p>
        <div className="gather-buttons">
          {availableMaterials.slice(0, 4).map(mat => (
            <button 
              key={mat.id}
              className="gather-btn"
              onClick={() => handleGather(mat.id)}
            >
              {mat.icon} {mat.nameDe}
            </button>
          ))}
        </div>
      </div>

      <div className="materials-list">
        <h3>Alle Materialien</h3>
        {ERAS.filter(era => {
          const eraIndex = ERAS.findIndex(e => e.id === era.id);
          const playerEraIndex = ERAS.findIndex(e => e.id === state.currentEra);
          return eraIndex <= playerEraIndex;
        }).map(era => {
          const eraMaterials = availableMaterials.filter(m => m.era === era.id);
          if (eraMaterials.length === 0) return null;
          
          return (
            <div key={era.id} className="era-materials">
              <h4>{era.icon} {era.nameDe}</h4>
              <div className="materials-grid">
                {eraMaterials.map(mat => (
                  <div 
                    key={mat.id} 
                    className="material-card"
                    onClick={() => setBuyMaterial(mat.id)}
                  >
                    <span className="material-icon">{mat.icon}</span>
                    <span className="material-name">{mat.nameDe}</span>
                    <span className="material-amount">
                      {state.materials[mat.id] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {buyMaterial && (
        <div className="buy-modal" onClick={() => setBuyMaterial(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Kaufen: {MATERIALS.find(m => m.id === buyMaterial)?.nameDe}</h3>
            <div className="buy-form">
              <div className="amount-selector">
                <button onClick={() => setBuyAmount(Math.max(1, buyAmount - 1))}>-</button>
                <span>{buyAmount}</span>
                <button onClick={() => setBuyAmount(buyAmount + 1)}>+</button>
              </div>
              <p className="total-price">
                Preis: {getMaterialPrice(buyMaterial) * buyAmount} 💰
              </p>
            </div>
            <div className="modal-buttons">
              <button 
                className="btn-buy"
                disabled={state.gold < getMaterialPrice(buyMaterial) * buyAmount}
                onClick={handleBuy}
              >
                Kaufen
              </button>
              <button className="btn-cancel" onClick={() => setBuyMaterial(null)}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
