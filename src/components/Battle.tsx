'use client';

import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/lib/gameStore';
import { ENEMIES, ERAS, Enemy } from '@/lib/gameData';

export default function Battle() {
  const { state, dispatch, calculateStats } = useGame();
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [autoBattle, setAutoBattle] = useState(false);
  const battleRef = useRef<HTMLDivElement>(null);

  const stats = calculateStats();
  
  const availableEnemies = ENEMIES.filter(enemy => {
    const eraIndex = ERAS.findIndex(e => e.id === enemy.era);
    const playerEraIndex = ERAS.findIndex(e => e.id === state.currentEra);
    return eraIndex <= playerEraIndex;
  });

  const startBattle = (enemy: Enemy) => {
    dispatch({ type: 'START_BATTLE', enemy });
    setSelectedEnemy(null);
  };

  useEffect(() => {
    if (!state.isFighting || !state.currentEnemy) return;

    const interval = setInterval(() => {
      const playerDamage = Math.max(1, stats.attack - state.currentEnemy!.defense / 2);
      const enemyDamage = Math.max(1, state.currentEnemy!.attack - stats.defense / 2);

      dispatch({ type: 'DAMAGE_ENEMY', damage: Math.floor(playerDamage) });
      dispatch({ type: 'ADD_BATTLE_LOG', message: `Du dealst ${Math.floor(playerDamage)} Schaden!` });

      if (state.enemyHp - playerDamage <= 0) {
        dispatch({ type: 'ADD_BATTLE_LOG', message: `🎉 Du hast gewonnen! +${state.currentEnemy!.goldReward} Gold` });
        dispatch({ type: 'END_BATTLE', won: true });
        return;
      }

      setTimeout(() => {
        dispatch({ type: 'DAMAGE_PLAYER', damage: Math.floor(enemyDamage) });
        dispatch({ type: 'ADD_BATTLE_LOG', message: `Gegner dealt ${Math.floor(enemyDamage)} Schaden!` });

        if (state.playerHp - enemyDamage <= 0) {
          dispatch({ type: 'ADD_BATTLE_LOG', message: '💀 Du wurdest besiegt!' });
          dispatch({ type: 'END_BATTLE', won: false });
        }
      }, 500);

    }, 1000);

    return () => clearInterval(interval);
  }, [state.isFighting, state.currentEnemy]);

  useEffect(() => {
    if (battleRef.current) {
      battleRef.current.scrollTop = battleRef.current.scrollHeight;
    }
  }, [state.battleLog]);

  if (state.isFighting && state.currentEnemy) {
    const enemyMaxHp = state.currentEnemy.hp;
    
    return (
      <div className="battle-container fighting">
        <div className="battle-arena">
          <div className="player-battle">
            <div className="character">🧙‍♂️</div>
            <div className="hp-bar">
              <div 
                className="hp-fill" 
                style={{ width: `${(state.playerHp / state.maxPlayerHp) * 100}%` }}
              />
              <span className="hp-text">{state.playerHp} / {state.maxPlayerHp}</span>
            </div>
            <div className="player-stats-battle">
              <span>⚔️ {stats.attack}</span>
              <span>🛡️ {stats.defense}</span>
            </div>
          </div>

          <div className="vs">VS</div>

          <div className="enemy-battle">
            <div className="enemy-icon">{state.currentEnemy.icon}</div>
            <h3>{state.currentEnemy.nameDe}</h3>
            <div className="hp-bar enemy">
              <div 
                className="hp-fill" 
                style={{ width: `${(state.enemyHp / enemyMaxHp) * 100}%` }}
              />
              <span className="hp-text">{state.enemyHp} / {enemyMaxHp}</span>
            </div>
            <div className="enemy-stats">
              <span>⚔️ {state.currentEnemy.attack}</span>
              <span>🛡️ {state.currentEnemy.defense}</span>
            </div>
          </div>
        </div>

        <div className="battle-log" ref={battleRef}>
          {state.battleLog.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>

        <button 
          className="btn-flee"
          onClick={() => dispatch({ type: 'END_BATTLE', won: false })}
        >
          Fliehen
        </button>
      </div>
    );
  }

  return (
    <div className="battle-container">
      <div className="battle-header">
        <h2>⚔️ Kampf</h2>
        <p>Wähle einen Gegner zum Kämpfen</p>
      </div>

      <div className="enemies-section">
        {ERAS.filter(era => {
          const eraIndex = ERAS.findIndex(e => e.id === era.id);
          const playerEraIndex = ERAS.findIndex(e => e.id === state.currentEra);
          return eraIndex <= playerEraIndex;
        }).map(era => {
          const eraEnemies = availableEnemies.filter(e => e.era === era.id);
          if (eraEnemies.length === 0) return null;
          
          return (
            <div key={era.id} className="era-section">
              <h3>{era.icon} {era.nameDe}</h3>
              <div className="enemies-grid">
                {eraEnemies.map(enemy => (
                  <div 
                    key={enemy.id} 
                    className="enemy-card"
                    onClick={() => setSelectedEnemy(enemy)}
                  >
                    <div className="enemy-icon">{enemy.icon}</div>
                    <div className="enemy-info">
                      <h4>{enemy.nameDe}</h4>
                      <div className="enemy-stats">
                        <span>❤️ {enemy.hp}</span>
                        <span>⚔️ {enemy.attack}</span>
                        <span>🛡️ {enemy.defense}</span>
                      </div>
                      <div className="rewards">
                        <span>💰 {enemy.goldReward}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedEnemy && (
        <div className="enemy-modal" onClick={() => setSelectedEnemy(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-enemy-icon">{selectedEnemy.icon}</div>
            <h3>{selectedEnemy.nameDe}</h3>
            <div className="modal-enemy-stats">
              <p>❤️ HP: {selectedEnemy.hp}</p>
              <p>⚔️ Angriff: {selectedEnemy.attack}</p>
              <p>🛡️ Verteidigung: {selectedEnemy.defense}</p>
            </div>
            <div className="rewards-section">
              <h4>Belohnung:</h4>
              <p>💰 {selectedEnemy.goldReward} Gold</p>
              <div className="material-rewards">
                {Object.entries(selectedEnemy.materials).map(([mat, amount]) => (
                  <span key={mat} className="reward-material">{mat}: {amount}</span>
                ))}
              </div>
            </div>
            <div className="modal-buttons">
              <button 
                className="btn-fight"
                onClick={() => startBattle(selectedEnemy)}
              >
                Kämpfen!
              </button>
              <button className="btn-cancel" onClick={() => setSelectedEnemy(null)}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
