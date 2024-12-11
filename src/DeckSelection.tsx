import React, { useState } from 'react';

interface Deck {
  id: number;
  name: string;
  matches: any[];
  winRate?: number;
}

interface DeckSelectionProps {
  username: string;
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onAddDeck: (deckName: string) => void;
  onRemoveDeck: (deckId: number) => void;
}

const DeckSelection: React.FC<DeckSelectionProps> = ({ 
  username, 
  decks, 
  onSelectDeck, 
  onAddDeck, 
  onRemoveDeck 
}) => {
  const [newDeckName, setNewDeckName] = useState('');

  const handleAddDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeckName.trim()) {
      onAddDeck(newDeckName.trim());
      setNewDeckName('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome, {username}
        </h1>

        {/* Add New Deck */}
        <form onSubmit={handleAddDeck} className="mb-6">
          <div className="flex">
            <input 
              type="text" 
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Enter deck name" 
              className="w-full p-2 bg-gray-800 text-white rounded-l"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r transition duration-300"
            >
              Add Deck
            </button>
          </div>
        </form>

        {/* Deck List */}
        <div className="grid gap-4">
          {decks.length === 0 ? (
            <p className="text-gray-400">No decks yet. Add a new deck!</p>
          ) : (
            decks.map((deck) => (
              <div 
                key={deck.id} 
                className="bg-gray-800 p-4 rounded flex justify-between items-center hover:bg-gray-700 transition duration-300"
              >
                <div>
                  <h2 className="text-white font-semibold">{deck.name}</h2>
                  <p className="text-gray-400">
                    {deck.matches ? `${deck.matches.length} matches` : '0 matches'}
                    {deck.winRate !== undefined && 
                      ` | Win Rate: ${(deck.winRate * 100).toFixed(1)}%`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onSelectDeck(deck)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition duration-300"
                  >
                    Play
                  </button>
                  <button 
                    onClick={() => onRemoveDeck(deck.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckSelection;