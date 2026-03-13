'use client';

import { useState } from 'react';
import { GameProvider } from '@/lib/gameStore';
import Header from '@/components/Header';
import Navigation, { TabType } from '@/components/Navigation';
import Forge from '@/components/Forge';
import Inventory from '@/components/Inventory';
import Battle from '@/components/Battle';
import Materials from '@/components/Materials';

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
