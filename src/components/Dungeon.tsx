'use client';

import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { DUNGEONS, Enemy } from '@/lib/gameData';

export default function Dungeon() {
  const { state, dispatch, calculateStats } = useGame();
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [dungeonEnemies, setDungeonEnemies] = useState<Enemy[]>([]);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [inDungeon, setInDungeon] = useState(false);
  const [dungeonHp, setDungeonHp] = useState({ player: 100, enemy: 0 });
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [combatAnimations, setCombatAnimations] = useState<{ type: string; text: string }[]>([]);

  const getStats = () => {
    const base = calculateStats();
    const petBonus = state.pets.find(p => p.id === state.activePet);
    return {
      attack: Math.floor(base.attack * (1 + (petBonus?.bonusValue || 0) / 100)),
      defense: Math.floor(base.defense * (1 + (petBonus?.bonusValue || 0) / 100)),
    };
  };

  const startDungeon = (floorIndex: number) => {
    const floor = DUNGEONS[floorIndex];
    if (state.playerLevel < floor.requiredLevel) return;
    
    setSelectedFloor(floorIndex);
    setDungeonEnemies([...floor.enemies, floor.boss]);
    setCurrentEnemyIndex(0);
    setInDungeon(true);
    setDungeonHp({
      player: state.playerHp,
      enemy: floor.enemies[0].hp,
    });
    setCombatLog([`🗡️ Betrete ${floor.nameDe}...`]);
    setCombatAnimations([]);
  };

  const attack = () => {
    const stats = getStats();
    const enemy = dungeonEnemies[currentEnemyIndex];
    const damage = Math.max(1, Math.floor(stats.attack * (1 + Math.random() * 0.3)));
    const newEnemyHp = dungeonHp.enemy - damage;
    
    setCombatAnimations(prev => [...prev, { type: 'attack', text: `-${damage}` }]);
    setTimeout(() => setCombatAnimations(prev => prev.slice(1)), 500);

    if (newEnemyHp <= 0) {
      const newIndex = currentEnemyIndex + 1;
      if (newIndex >= dungeonEnemies.length) {
        const floor = DUNGEONS[selectedFloor!];
        dispatch({ type: 'ADD_GOLD', amount: floor.rewards.gold || 0 });
        dispatch({ type: 'ADD_MATERIALS', materials: floor.rewards });
        dispatch({ type: 'ADD_MATERIALS', materials: enemy.materials });
        setCombatLog(prev => [...prev, `🎉 Dungeon abgeschlossen! Belohnung erhalten!`]);
        setTimeout(() => {
          setInDungeon(false);
          setSelectedFloor(null);
        }, 2000);
      } else {
        setCurrentEnemyIndex(newIndex);
        setDungeonHp(prev => ({ ...prev, enemy: dungeonEnemies[newIndex].hp }));
        setCombatLog(prev => [...prev, `👹 Neuer Gegner: ${dungeonEnemies[newIndex].nameDe}`]);
      }
    } else {
      const enemyDamage = Math.max(1, Math.floor((enemy.attack - stats.defense * 0.5) * (1 + Math.random() * 0.2)));
      const newPlayerHp = dungeonHp.player - enemyDamage;
      
      setDungeonHp(prev => ({ ...prev, enemy: newEnemyHp, player: newPlayerHp }));
      setCombatLog(prev => [...prev, `Du machst ${damage} Schaden! Gegner macht ${enemyDamage} Schaden!`]);

      if (newPlayerHp <= 0) {
        setCombatLog(prev => [...prev, `💀 Du wurdest besiegt!`]);
        setTimeout(() => {
          setInDungeon(false);
          setSelectedFloor(null);
        }, 2000);
      }
    }
  };

  const flee = () => {
    setInDungeon(false);
    setSelectedFloor(null);
  };

  return (
    <div className="dungeon">
      <h2 className="section-title">🏰 Dungeon</h2>

      {!inDungeon ? (
        <div className="dungeon-list">
          {DUNGEONS.map((floor, index) => {
            const unlocked = state.playerLevel >= floor.requiredLevel;
            const completed = state.currentDungeon > index;

            return (
              <div key={floor.id} className={`dungeon-card ${!unlocked ? 'locked' : ''}`}>
                <div className="dungeon-icon">{floor.icon}</div>
                <div className="dungeon-info">
                  <h3>Level {floor.id}: {floor.nameDe}</h3>
                  <p>Benötigt: Level {floor.requiredLevel}</p>
                  <div className="dungeon-rewards">
                    <span>Belohnung:</span>
                    {Object.entries(floor.rewards).map(([mat, amount]) => (
                      <span key={mat} className="reward-item">{mat}: {amount}</span>
                    ))}
                  </div>
                </div>
                <button
                  className="start-btn"
                  disabled={!unlocked}
                  onClick={() => startDungeon(index)}
                >
                  {completed ? 'Erneut' : 'Start'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dungeon-combat">
          <div className="combat-header">
            <h3>{DUNGEONS[selectedFloor!].nameDe} - Gegner {currentEnemyIndex + 1}/{dungeonEnemies.length}</h3>
          </div>

          <div className="combat-arena">
            <div className="character player">
              <div className="character-icon">🧑</div>
              <div className="hp-bar">
                <div className="hp-fill" style={{ width: `${(dungeonHp.player / state.maxPlayerHp) * 100}%` }} />
              </div>
              <span className="hp-text">{dungeonHp.player}/{state.maxPlayerHp}</span>
            </div>

            <div className="vs">VS</div>

            <div className="character enemy">
              <div className={`character-icon ${combatAnimations.length > 0 ? 'hit' : ''}`}>
                {dungeonEnemies[currentEnemyIndex].icon}
                {combatAnimations.map((anim, i) => (
                  <span key={i} className="damage-text">{anim.text}</span>
                ))}
              </div>
              <div className="hp-bar enemy">
                <div className="hp-fill" style={{ width: `${(dungeonHp.enemy / dungeonEnemies[currentEnemyIndex].hp) * 100}%` }} />
              </div>
              <span className="hp-text">{dungeonHp.enemy}/{dungeonEnemies[currentEnemyIndex].hp}</span>
              <span className="enemy-name">{dungeonEnemies[currentEnemyIndex].nameDe}</span>
            </div>
          </div>

          <div className="combat-log">
            {combatLog.slice(-4).map((log, i) => (
              <p key={i}>{log}</p>
            ))}
          </div>

          <div className="combat-actions">
            <button className="attack-btn" onClick={attack}>⚔️ Angriff</button>
            <button className="flee-btn" onClick={flee}>🏃 Fliehen</button>
          </div>
        </div>
      )}
    </div>
  );
}
