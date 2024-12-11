import React, { useState } from 'react';

// List of Hearthstone heroes (classes)
const HEARTHSTONE_HEROES = [
  'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 
  'Rogue', 'Shaman', 'Warlock', 'Warrior', 'Demon Hunter', 'Dead Knight'
];

interface Deck {
  id: number;
  name: string;
  matches: any[];
  winRate?: number;
}

interface MatchResultProps {
  deck: Deck;
  onMatchComplete: (match: {
    deck: string;
    opponent: string;
    opponentClass: string;
    result: 'win' | 'loss';
    date: string;
  }) => void;
}

const MatchResult: React.FC<MatchResultProps> = ({ deck, onMatchComplete }) => {
  const [opponentClass, setOpponentClass] = useState('');
  const [result, setResult] = useState<'win' | 'loss' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponentClass) {
      alert('Please select an opponent class');
      return;
    }

    if (result === null) {
      alert('Please select match result');
      return;
    }

    const match = {
      deck: deck.name,
      opponent: opponentClass,
      opponentClass: opponentClass,
      result: result,
      date: new Date().toISOString()
    };

    onMatchComplete(match);
    // Reset form
    setOpponentClass('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Record Match for {deck.name}
        </h2>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl text-white mb-4">Select Opponent Class</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {HEARTHSTONE_HEROES.map((hero) => (
              <button
                key={hero}
                onClick={() => setOpponentClass(hero)}
                className={`
                  p-4 rounded-lg transition duration-300
                  ${opponentClass === hero 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                `}
              >
                {hero}
              </button>
            ))}
          </div>

          {opponentClass && (
            <div className="mt-6">
              <h3 className="text-xl text-white mb-4">Match Result</h3>
              <div className="flex justify-center space-x-8">
                <button
                  onClick={() => setResult('win')}
                  className={`
                    px-8 py-4 text-xl rounded-lg transition duration-300
                    ${result === 'win' 
                      ? 'bg-green-600 text-white scale-105' 
                      : 'bg-gray-700 text-gray-300 hover:bg-green-800'}
                  `}
                >
                  Victory
                </button>
                <button
                  onClick={() => setResult('loss')}
                  className={`
                    px-8 py-4 text-xl rounded-lg transition duration-300
                    ${result === 'loss' 
                      ? 'bg-red-600 text-white scale-105' 
                      : 'bg-gray-700 text-gray-300 hover:bg-red-800'}
                  `}
                >
                  Defeat
                </button>
              </div>
            </div>
          )}

          {opponentClass && result !== null && (
            <div className="mt-6 text-center">
              <button
                onClick={handleSubmit}
                className="
                  bg-blue-600 hover:bg-blue-700 text-white 
                  px-10 py-3 rounded-lg text-xl 
                  transition duration-300
                "
              >
                Submit Match
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchResult;