'use client';

import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { PETS, RARITY_COLORS, Era } from '@/lib/gameData';

export default function Pets() {
  const { state, dispatch } = useGame();
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  const canAfford = (cost: Record<string, number>) => {
    return Object.entries(cost).every(([mat, amount]) => (state.materials[mat] || 0) >= amount);
  };

  const buyPet = (pet: typeof PETS[0]) => {
    if (!canAfford(pet.cost)) return;
    if (state.pets.some(p => p.id === pet.id)) return;

    dispatch({ type: 'REMOVE_MATERIALS', materials: pet.cost });
    dispatch({ type: 'BUY_PET', pet: { ...pet, level: 1, xp: 0 } });
  };

  const toggleActivePet = (petId: string) => {
    dispatch({ type: 'SET_ACTIVE_PET', petId: state.activePet === petId ? null : petId });
  };

  const ownedPets = state.pets;
  const availablePets = PETS.filter(p => !ownedPets.some(op => op.id === p.id));

  const getEraColor = (era: string) => {
    const colors: Record<string, string> = {
      stone: '#8B7355',
      medieval: '#8B4513',
      modern: '#4A5568',
      space: '#1E3A5F',
      quantum: '#6B21A8',
    };
    return colors[era] || '#666';
  };

  const petTypeIcons = {
    combat: '⚔️',
    gather: '⛏️',
    special: '⭐',
  };

  return (
    <div className="pets">
      <h2 className="section-title">🐾 Haustiere</h2>

      {ownedPets.length > 0 && (
        <div className="owned-pets">
          <h3>Deine Pets</h3>
          <div className="pets-grid">
            {ownedPets.map(pet => (
              <div
                key={pet.id}
                className={`pet-card owned ${state.activePet === pet.id ? 'active' : ''}`}
                onClick={() => toggleActivePet(pet.id)}
              >
                <div className="pet-icon" style={{ borderColor: RARITY_COLORS[pet.rarity] }}>
                  {pet.icon}
                </div>
                <div className="pet-info">
                  <span className="pet-name" style={{ color: RARITY_COLORS[pet.rarity] }}>
                    {pet.nameDe}
                  </span>
                  <span className="pet-type">{petTypeIcons[pet.type]}</span>
                  <span className="pet-bonus">
                    +{pet.bonusValue} {pet.bonusType}
                  </span>
                  <span className="pet-level">Level {pet.level}</span>
                </div>
                {state.activePet === pet.id && <span className="active-badge">Aktiv</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pet-shop">
        <h3>Pet Shop</h3>
        <div className="pets-grid">
          {availablePets.map(pet => {
            const affordable = canAfford(pet.cost);
            const eraColor = getEraColor(pet.era);

            return (
              <div key={pet.id} className={`pet-card ${!affordable ? 'locked' : ''}`}>
                <div className="pet-icon" style={{ borderColor: RARITY_COLORS[pet.rarity] }}>
                  {pet.icon}
                </div>
                <div className="pet-info">
                  <span className="pet-name" style={{ color: RARITY_COLORS[pet.rarity] }}>
                    {pet.nameDe}
                  </span>
                  <span className="pet-type">{petTypeIcons[pet.type]}</span>
                  <span className="pet-rarity">{pet.rarity}</span>
                  <span className="pet-bonus">
                    +{pet.bonusValue} {pet.bonusType}
                  </span>
                </div>
                <div className="pet-cost">
                  {Object.entries(pet.cost).map(([mat, amount]) => (
                    <span key={mat} className="cost-item">{mat}: {amount}</span>
                  ))}
                </div>
                <button
                  className="buy-btn"
                  disabled={!affordable}
                  onClick={() => buyPet(pet)}
                >
                  Kaufen
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
