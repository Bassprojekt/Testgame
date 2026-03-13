'use client';

import { useGame } from '@/lib/gameStore';
import { ERAS, RARITY_COLORS, Item } from '@/lib/gameData';
import { useState } from 'react';

export default function Header() {
  const { state, calculateStats } = useGame();
  const currentEra = ERAS.find(e => e.id === state.currentEra);
  const xpToLevel = state.playerLevel * 100;
  const forgeXpToLevel = state.forgeLevel * 200;
  const stats = calculateStats();
  
  const activePet = state.pets?.find(p => p.id === state.activePet);

  return (
    <header className="game-header">
      <div className="header-top">
        <div className="era-badge" style={{ backgroundColor: currentEra?.color }}>
          <span className="era-icon">{currentEra?.icon}</span>
          <span className="era-name">{currentEra?.nameDe}</span>
        </div>
        
        <div className="resources-row">
          <div className="resource gold">
            <span className="icon">💰</span>
            <span className="value">{state.gold.toLocaleString()}</span>
          </div>
          {activePet && (
            <div className="resource pet-active">
              <span className="icon">{activePet.icon}</span>
              <span className="value">+{activePet.bonusValue} {activePet.bonusType}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="stats-row">
        <div className="stat-box player-stat">
          <span className="stat-label">Krieger</span>
          <span className="stat-level">Lv. {state.playerLevel}</span>
          <div className="stat-bars">
            <div className="bar-row">
              <span className="bar-label">XP</span>
              <div className="xp-bar small">
                <div 
                  className="xp-fill player" 
                  style={{ width: `${(state.playerXp / xpToLevel) * 100}%` }}
                />
              </div>
              <span className="bar-value">{state.playerXp}/{xpToLevel}</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">HP</span>
              <div className="hp-bar small">
                <div 
                  className="hp-fill" 
                  style={{ width: `${(state.playerHp / state.maxPlayerHp) * 100}%` }}
                />
              </div>
              <span className="bar-value">{state.playerHp}/{state.maxPlayerHp}</span>
            </div>
          </div>
          <div className="stat-combat">
            <span className="stat-attack">⚔️ {stats.attack}</span>
            <span className="stat-defense">🛡️ {stats.defense}</span>
          </div>
        </div>
        
        <div className="stat-box forge-stat">
          <span className="stat-label">Schmiede</span>
          <span className="stat-level">Lv. {state.forgeLevel}</span>
          <div className="bar-row">
            <span className="bar-label">XP</span>
            <div className="xp-bar small">
              <div 
                className="xp-fill forge" 
                style={{ width: `${(state.forgeXp / forgeXpToLevel) * 100}%` }}
              />
            </div>
            <span className="bar-value">{state.forgeXp}/{forgeXpToLevel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
