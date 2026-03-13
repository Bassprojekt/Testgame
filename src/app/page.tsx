'use client';

import { useState } from 'react';
import { GameProvider } from '@/lib/gameStore';
import Header from '@/components/Header';
import Navigation, { TabType } from '@/components/Navigation';
import Forge from '@/components/Forge';
import Inventory from '@/components/Inventory';
import Battle from '@/components/Battle';
import Materials from '@/components/Materials';
import TechTree from '@/components/TechTree';
import Pets from '@/components/Pets';
import Dungeon from '@/components/Dungeon';

function GameContent() {
  const [activeTab, setActiveTab] = useState<TabType>('forge');

  return (
    <div className="game-app">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'forge' && <Forge />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'battle' && <Battle />}
        {activeTab === 'materials' && <Materials />}
        {activeTab === 'techtree' && <TechTree />}
        {activeTab === 'pets' && <Pets />}
        {activeTab === 'dungeon' && <Dungeon />}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
