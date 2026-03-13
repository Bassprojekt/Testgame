'use client';

import { useState } from 'react';

export type TabType = 'forge' | 'inventory' | 'battle' | 'materials' | 'techtree' | 'pets' | 'dungeon';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'forge', label: 'Schmiede', icon: '⚒️' },
  { id: 'inventory', label: 'Inventar', icon: '🎒' },
  { id: 'battle', label: 'Kampf', icon: '⚔️' },
  { id: 'dungeon', label: 'Dungeon', icon: '🏰' },
  { id: 'pets', label: 'Pets', icon: '🐾' },
  { id: 'techtree', label: 'Tech', icon: '🔬' },
  { id: 'materials', label: 'Material', icon: '📦' },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="game-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
