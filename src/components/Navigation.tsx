'use client';

import { useState } from 'react';

export type TabType = 'forge' | 'inventory' | 'battle' | 'materials' | 'techtree' | 'pets' | 'dungeon';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: string; color: string }[] = [
  { id: 'forge', label: 'Schmiede', icon: '⚒️', color: '#f59e0b' },
  { id: 'inventory', label: 'Inventar', icon: '🎒', color: '#3b82f6' },
  { id: 'battle', label: 'Kampf', icon: '⚔️', color: '#ef4444' },
  { id: 'dungeon', label: 'Dungeon', icon: '🏰', color: '#8b5cf6' },
  { id: 'pets', label: 'Pets', icon: '🐾', color: '#22c55e' },
  { id: 'techtree', label: 'Tech', icon: '🔬', color: '#06b6d4' },
  { id: 'materials', label: 'Material', icon: '📦', color: '#ec4899' },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const activeTabData = tabs.find(t => t.id === activeTab);
  
  return (
    <nav className="game-nav">
      <div className="nav-track">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={{ '--tab-color': tab.color } as React.CSSProperties}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {activeTab === tab.id && (
              <span className="tab-indicator" style={{ backgroundColor: tab.color }} />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
