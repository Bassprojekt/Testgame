'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Era, Item, Enemy, ERAS, ITEMS, ENEMIES, MATERIALS, TechUpgrade, Pet, DungeonFloor, DUNGEONS } from './gameData';

export interface PlayerEquipment {
  weapon: Item | null;
  armor: Item | null;
  helmet: Item | null;
  boots: Item | null;
}

interface GameState {
  gold: number;
  materials: Record<string, number>;
  playerLevel: number;
  playerXp: number;
  forgeLevel: number;
  forgeXp: number;
  currentEra: Era;
  equipment: PlayerEquipment;
  inventory: Item[];
  currentEnemy: Enemy | null;
  enemyHp: number;
  isFighting: boolean;
  battleLog: string[];
  playerHp: number;
  maxPlayerHp: number;
  techUpgrades: Record<string, number>;
  pets: Pet[];
  activePet: string | null;
  currentDungeon: number;
  dungeonProgress: number;
  battleAnimations: { type: 'attack' | 'damage' | 'heal' | 'special'; target: 'player' | 'enemy'; value?: number }[];
}

type GameAction =
  | { type: 'ADD_GOLD'; amount: number }
  | { type: 'ADD_MATERIAL'; material: string; amount: number }
  | { type: 'ADD_MATERIALS'; materials: Record<string, number> }
  | { type: 'REMOVE_MATERIALS'; materials: Record<string, number> }
  | { type: 'LEVEL_UP' }
  | { type: 'FORGE_LEVEL_UP' }
  | { type: 'SET_ERA'; era: Era }
  | { type: 'EQUIP_ITEM'; item: Item; slot: keyof PlayerEquipment }
  | { type: 'ADD_TO_INVENTORY'; item: Item }
  | { type: 'START_BATTLE'; enemy: Enemy }
  | { type: 'DAMAGE_ENEMY'; damage: number }
  | { type: 'DAMAGE_PLAYER'; damage: number }
  | { type: 'END_BATTLE'; won: boolean }
  | { type: 'ADD_BATTLE_LOG'; message: string }
  | { type: 'LOAD_SAVE'; state: GameState }
  | { type: 'UPDATE_PLAYER_HP'; hp: number }
  | { type: 'BUY_TECH'; upgradeId: string }
  | { type: 'BUY_PET'; pet: Pet }
  | { type: 'SET_ACTIVE_PET'; petId: string | null }
  | { type: 'START_DUNGEON'; floor: number }
  | { type: 'DUNGEON_PROGRESS'; progress: number }
  | { type: 'ADD_BATTLE_ANIMATION'; animation: { type: 'attack' | 'damage' | 'heal' | 'special'; target: 'player' | 'enemy'; value?: number } }
  | { type: 'CLEAR_BATTLE_ANIMATIONS' };

const initialState: GameState = {
  gold: 100,
  materials: {
    stone: 50,
    wood: 30,
  },
  playerLevel: 1,
  playerXp: 0,
  forgeLevel: 1,
  forgeXp: 0,
  currentEra: 'stone',
  equipment: {
    weapon: null,
    armor: null,
    helmet: null,
    boots: null,
  },
  inventory: [],
  currentEnemy: null,
  enemyHp: 0,
  isFighting: false,
  battleLog: [],
  playerHp: 100,
  maxPlayerHp: 100,
  techUpgrades: {},
  pets: [],
  activePet: null,
  currentDungeon: 0,
  dungeonProgress: 0,
  battleAnimations: [],
};

function calculatePlayerStats(state: GameState) {
  let attack = state.playerLevel * 5;
  let defense = 0;
  
  if (state.equipment.weapon) attack += state.equipment.weapon.attack;
  if (state.equipment.armor) defense += state.equipment.armor.defense;
  if (state.equipment.helmet) defense += state.equipment.helmet.defense;
  if (state.equipment.boots) defense += state.equipment.boots.defense;
  
  return { attack, defense };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_GOLD':
      return { ...state, gold: state.gold + action.amount };
    
    case 'ADD_MATERIAL':
      return {
        ...state,
        materials: {
          ...state.materials,
          [action.material]: (state.materials[action.material] || 0) + action.amount,
        },
      };
    
    case 'ADD_MATERIALS':
      const newMaterials = { ...state.materials };
      Object.entries(action.materials).forEach(([mat, amount]) => {
        newMaterials[mat] = (newMaterials[mat] || 0) + amount;
      });
      return { ...state, materials: newMaterials };
    
    case 'REMOVE_MATERIALS':
      const reducedMaterials = { ...state.materials };
      Object.entries(action.materials).forEach(([mat, amount]) => {
        reducedMaterials[mat] = Math.max(0, (reducedMaterials[mat] || 0) - amount);
      });
      return { ...state, materials: reducedMaterials };
    
    case 'LEVEL_UP': {
      const newLevel = state.playerLevel + 1;
      const eraIndex = ERAS.findIndex(e => e.id === state.currentEra);
      const currentEraInfo = ERAS[eraIndex];
      let newEra = state.currentEra;
      
      if (newLevel >= 10 && eraIndex < 1) newEra = 'medieval';
      else if (newLevel >= 20 && eraIndex < 2) newEra = 'modern';
      else if (newLevel >= 35 && eraIndex < 3) newEra = 'space';
      else if (newLevel >= 55 && eraIndex < 4) newEra = 'quantum';
      
      return {
        ...state,
        playerLevel: newLevel,
        playerXp: 0,
        maxPlayerHp: 100 + (newLevel - 1) * 20,
        playerHp: 100 + (newLevel - 1) * 20,
        currentEra: newEra,
      };
    }
    
    case 'FORGE_LEVEL_UP':
      return {
        ...state,
        forgeLevel: state.forgeLevel + 1,
        forgeXp: 0,
      };
    
    case 'SET_ERA':
      return { ...state, currentEra: action.era };
    
    case 'EQUIP_ITEM': {
      const newEquipment = { ...state.equipment };
      newEquipment[action.slot] = action.item;
      return { ...state, equipment: newEquipment };
    }
    
    case 'ADD_TO_INVENTORY':
      return { ...state, inventory: [...state.inventory, action.item] };
    
    case 'START_BATTLE':
      return {
        ...state,
        currentEnemy: action.enemy,
        enemyHp: action.enemy.hp,
        isFighting: true,
        battleLog: [`⚔️ Kampf gegen ${action.enemy.nameDe} begonnen!`],
      };
    
    case 'DAMAGE_ENEMY':
      return {
        ...state,
        enemyHp: Math.max(0, state.enemyHp - action.damage),
      };
    
    case 'DAMAGE_PLAYER':
      return {
        ...state,
        playerHp: Math.max(0, state.playerHp - action.damage),
      };
    
    case 'UPDATE_PLAYER_HP':
      return {
        ...state,
        playerHp: Math.min(action.hp, state.maxPlayerHp),
      };
    
    case 'END_BATTLE': {
      const newInventory = [...state.inventory];
      let newGold = state.gold;
      let newXp = state.playerXp;
      let newMaterials = { ...state.materials };
      
      if (action.won && state.currentEnemy) {
        newGold += state.currentEnemy.goldReward;
        newXp += state.currentEnemy.goldReward * 2;
        Object.entries(state.currentEnemy.materials).forEach(([mat, amount]) => {
          newMaterials[mat] = (newMaterials[mat] || 0) + amount;
        });
        
        const craftedItem = ITEMS.filter(i => i.era === state.currentEra)[Math.floor(Math.random() * 3)];
        if (craftedItem) {
          newInventory.push(craftedItem);
        }
      }
      
      let newPlayerLevel = state.playerLevel;
      let newPlayerXp = newXp;
      let newEra = state.currentEra;
      const xpToLevel = state.playerLevel * 100;
      
      if (newPlayerXp >= xpToLevel) {
        newPlayerXp -= xpToLevel;
        newPlayerLevel++;
        
        const eraIndex = ERAS.findIndex(e => e.id === state.currentEra);
        if (newPlayerLevel >= 10 && eraIndex < 1) newEra = 'medieval';
        else if (newPlayerLevel >= 20 && eraIndex < 2) newEra = 'modern';
        else if (newPlayerLevel >= 35 && eraIndex < 3) newEra = 'space';
        else if (newPlayerLevel >= 55 && eraIndex < 4) newEra = 'quantum';
      }
      
      return {
        ...state,
        gold: newGold,
        playerXp: newPlayerXp,
        playerLevel: newPlayerLevel,
        currentEra: newEra,
        materials: newMaterials,
        inventory: newInventory,
        isFighting: false,
        currentEnemy: null,
        enemyHp: 0,
        maxPlayerHp: 100 + (newPlayerLevel - 1) * 20,
        playerHp: 100 + (newPlayerLevel - 1) * 20,
      };
    }
    
    case 'ADD_BATTLE_LOG':
      return {
        ...state,
        battleLog: [...state.battleLog.slice(-4), action.message],
      };
    
    case 'LOAD_SAVE':
      return action.state;
    
    case 'BUY_TECH': {
      const newTech = { ...state.techUpgrades };
      newTech[action.upgradeId] = (newTech[action.upgradeId] || 0) + 1;
      return { ...state, techUpgrades: newTech };
    }
    
    case 'BUY_PET':
      return { ...state, pets: [...state.pets, action.pet] };
    
    case 'SET_ACTIVE_PET':
      return { ...state, activePet: action.petId };
    
    case 'START_DUNGEON':
      return { ...state, currentDungeon: action.floor, dungeonProgress: 0, isFighting: true };
    
    case 'DUNGEON_PROGRESS':
      return { ...state, dungeonProgress: action.progress };
    
    case 'ADD_BATTLE_ANIMATION':
      return { ...state, battleAnimations: [...state.battleAnimations, action.animation] };
    
    case 'CLEAR_BATTLE_ANIMATIONS':
      return { ...state, battleAnimations: [] };
    
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  calculateStats: () => { attack: number; defense: number };
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('forgeMasterSave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVE', state: parsed });
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('forgeMasterSave', JSON.stringify(state));
  }, [state]);

  const calculateStats = () => calculatePlayerStats(state);

  return (
    <GameContext.Provider value={{ state, dispatch, calculateStats }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
