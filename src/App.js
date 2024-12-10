import React, { useState } from 'react';

const HearthstoneTracker = () => {
  const [screen, setScreen] = useState('login');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [decks, setDecks] = useState([]);

  const handleLogin = (user) => {
    setScreen('deck-selection');
  };

  const handleRegister = (user, password) => {
    setScreen('deck-selection');
  };

  const handleGuestLogin = () => {
    setScreen('deck-selection');
  };

  const handleAddDeck = (deckName) => {
    const newDeck = {
      id: decks.length > 0 ? Math.max(...decks.map(d => d.id)) + 1 : 1,
      name: deckName,
      matches: [],
      winRate: undefined
    };
    setDecks([...decks, newDeck]);
  };

  const handleRemoveDeck = (deckId) => {
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(updatedDecks);
    if (selectedDeck && selectedDeck.id === deckId) {
      setSelectedDeck(null);
      setScreen('deck-selection');
    }
  };

  const handleDeckSelect = (deck) => {
    setSelectedDeck(deck);
    setScreen('match-result');
  };

  return (
    <div>
      {screen === 'login' && (
        <div>
          <h1>Login</h1>
          <button onClick={() => handleLogin('User')}>Login</button>
          <button onClick={() => handleRegister('User', 'password')}>Register</button>
          <button onClick={handleGuestLogin}>Login as Guest</button>
        </div>
      )}
      {screen === 'deck-selection' && (
        <div>
          <h1>Deck Selection</h1>
          <button onClick={() => handleAddDeck('New Deck')}>Add Deck</button>
          <ul>
            {decks.map(deck => (
              <li key={deck.id}>
                {deck.name}
                <button onClick={() => handleDeckSelect(deck)}>Select</button>
                <button onClick={() => handleRemoveDeck(deck.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {screen === 'match-result' && selectedDeck && (
        <div>
          <h1>Match Result for {selectedDeck.name}</h1>
          <button onClick={() => setScreen('deck-selection')}>Back to Deck Selection</button>
        </div>
      )}
    </div>
  );
};

export default HearthstoneTracker;