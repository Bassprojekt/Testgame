'use client';

import { useGame } from '@/lib/gameStore';
import { ERAS, RARITY_COLORS, Item } from '@/lib/gameData';
import { useState } from 'react';

export default function Header() {
  const { state } = useGame();
  const currentEra = ERAS.find(e => e.id === state.currentEra);
  const xpToLevel = state.playerLevel * 100;
  const forgeXpToLevel = state.forgeLevel * 200;

  return (
    <header className="game-header">
      <div className="era-display">
        <span className="era-icon">{currentEra?.icon}</span>
        <span className="era-name">{currentEra?.nameDe}</span>
      </div>
      
      <div className="resources">
        <div className="resource gold">
          <span className="icon">💰</span>
          <span className="value">{state.gold.toLocaleString()}</span>
        </div>
      </div>

      <div className="player-stats">
        <div className="stat-row">
          <span className="label">Spieler</span>
          <span className="level">Lv. {state.playerLevel}</span>
          <div className="xp-bar">
            <div 
              className="xp-fill player" 
              style={{ width: `${(state.playerXp / xpToLevel) * 100}%` }}
            />
          </div>
        </div>
        <div className="stat-row">
          <span className="label">Schmiede</span>
          <span className="level">Lv. {state.forgeLevel}</span>
          <div className="xp-bar">
            <div 
              className="xp-fill forge" 
              style={{ width: `${(state.forgeXp / forgeXpToLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="hp-bar-container">
        <div className="hp-bar">
          <div 
            className="hp-fill" 
            style={{ width: `${(state.playerHp / state.maxPlayerHp) * 100}%` }}
          />
          <span className="hp-text">{state.playerHp} / {state.maxPlayerHp} HP</span>
        </div>
      </div>
    </header>
  );
}
