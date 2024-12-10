import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';


const Navigation = ({ currentScreen, setScreen }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-full shadow-lg flex divide-x divide-gray-700">
      <button
        onClick={() => setScreen('login')}
        className={`p-3 ${currentScreen === 'login' ? 'bg-blue-600' : 'hover:bg-gray-700'} transition duration-300`}
      >
        Login
      </button>
      <button
        onClick={() => setScreen('deck-selection')}
        className={`p-3 ${currentScreen === 'deck-selection' ? 'bg-blue-600' : 'hover:bg-gray-700'} transition duration-300`}
      >
        Decks
      </button>
      <button
        onClick={() => setScreen('match-history')}
        className={`p-3 ${currentScreen === 'match-history' ? 'bg-blue-600' : 'hover:bg-gray-700'} transition duration-300`}
      >
        History
      </button>
    </div>
  );
};

const HearthstoneTracker = () => {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('Guest');
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [matches, setMatches] = useState([]);
  const [decks, setDecks] = useState([]);

  const handleLogin = (user) => {
    setUsername(user);
    setScreen('deck-selection');
  };

  const handleRegister = (user, password) => {
    setUsername(user);
    setScreen('deck-selection');
  };

  const handleGuestLogin = () => {
    setUsername('Guest');
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

  const handleMatchComplete = (match) => {
    const newMatches = [...matches, match];
    setMatches(newMatches);
    
    const updatedDecks = decks.map(deck => {
      if (deck.name === match.deck) {
        const deckMatches = [...(deck.matches || []), match];
        const wins = deckMatches.filter(m => m.result === 'win').length;
        const winRate = wins / deckMatches.length;
        return { ...deck, matches: deckMatches, winRate: winRate };
      }
      return deck;
    });
    
    setDecks(updatedDecks);
  };

  const handleClearHistory = () => {
    setMatches([]);
    const resetDecks = decks.map(deck => ({ ...deck, matches: [], winRate: undefined }));
    setDecks(resetDecks);
  };

  const renderScreen = () => {
    switch(screen) {
      case 'login':
        return (
          <AuthPage 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
            onGuestLogin={handleGuestLogin} 
          />
        );
      case 'deck-selection':
        return (
          <DeckSelection 
            username={username} 
            onSelectDeck={handleDeckSelect} 
            decks={decks} 
            onAddDeck={handleAddDeck} 
            onRemoveDeck={handleRemoveDeck} 
          />
        );
      case 'match-result':
        return (
          <MatchResult 
            deck={selectedDeck} 
            onMatchComplete={handleMatchComplete} 
          />
        );
      case 'match-history':
        return (
          <MatchHistory 
            matches={matches} 
            onClear={handleClearHistory} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans">
      {renderScreen()}
      <Navigation currentScreen={screen} setScreen={setScreen} />
    </div>
  );
};

const AuthPage = ({ onLogin, onRegister, onGuestLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister(username, password);
    } else {
      onLogin(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Hearthstone Tracker
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded" 
              required 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-300"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <div className="flex justify-between mt-4">
            <button 
              type="button" 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-300 hover:text-blue-200"
            >
              {isRegistering ? 'Switch to Login' : 'Switch to Register'}
            </button>
            <button 
              type="button" 
              onClick={onGuestLogin}
              className="text-green-300 hover:text-green-200"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeckSelection = ({ username, onSelectDeck, decks, onAddDeck, onRemoveDeck }) => {
  const [newDeckName, setNewDeckName] = useState('');

  const handleAddDeck = () => {
    if (newDeckName.trim()) {
      onAddDeck(newDeckName.trim());
      setNewDeckName('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome, {username}</h1>
        <span className="text-white text-xl">👤</span>
      </div>
      <h2 className="text-xl text-gray-300 mb-4">Your Decks</h2>
      <div className="mb-6 flex">
        <input 
          type="text" 
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
          placeholder="Enter new deck name"
          className="flex-grow p-2 bg-gray-700 text-white rounded-l" 
        />
        <button 
          onClick={handleAddDeck}
          className="bg-green-600 text-white p-2 rounded-r hover:bg-green-700 transition duration-300 transform hover:scale-105 active:scale-95"
        >
          Add Deck
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {decks.map((deck) => (
          <div key={deck.id} className="relative group">
            <button 
              onClick={() => onSelectDeck(deck)}
              className="w-full bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-300 text-left transform hover:scale-102 active:scale-98"
            >
              {deck.name}
              <div className="text-sm text-gray-400">
                {deck.matches && deck.matches.length > 0 
                  ? `Win Rate: ${(deck.winRate * 100).toFixed(1)}% (${
                      deck.matches.filter(m => m.result === 'win').length
                    }:${
                      deck.matches.filter(m => m.result === 'lose').length
                    })`
                  : 'No matches'}
              </div>
            </button>
            <button 
              onClick={() => onRemoveDeck(deck.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const MatchResult = ({ deck, onMatchComplete }) => {
  const [selectedOpponentClass, setSelectedOpponentClass] = useState(null);
  const [savedMatchStatus, setSavedMatchStatus] = useState(null);

  const hearthstoneClasses = [
    'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 
    'Rogue', 'Shaman', 'Warlock', 'Warrior', 'Demon Hunter', 'Death Knight'
  ];

  const handleResult = (result) => {
    if (selectedOpponentClass) {
      onMatchComplete({ 
        deck: deck.name, 
        opponentClass: selectedOpponentClass, 
        result 
      });
      setSavedMatchStatus(result);
      setTimeout(() => {
        setSavedMatchStatus(null);
        setSelectedOpponentClass(null);
      }, 2000);
    } else {
      alert('Please select opponent class first');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{deck.name}</h1>
        <span className="text-white text-xl">📊</span>
      </div>
      <div className="mb-6">
        <h2 className="text-xl text-gray-300 mb-4">Select Opponent Class</h2>
        <div className="grid grid-cols-4 gap-3">
          {hearthstoneClasses.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedOpponentClass(className)}
              className={`p-3 rounded-lg transition duration-300 ${
                selectedOpponentClass === className 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <button 
          onClick={() => handleResult('win')}
          className="bg-green-600 text-white p-4 rounded-lg w-full hover:bg-green-700 transition duration-300"
        >
          WIN
        </button>
        <button 
          onClick={() => handleResult('lose')}
          className="bg-red-600 text-white p-4 rounded-lg w-full hover:bg-red-700 transition duration-300"
        >
          LOSE
        </button>
      </div>
      {savedMatchStatus && (
        <div className={`fixed inset-x-0 top-0 z-50 flex justify-center ${
          savedMatchStatus === 'win' ? 'text-green-600' : 'text-red-600'
        }`}>
          <div className="bg-white shadow-lg rounded-b-lg p-4 flex items-center space-x-2 animate-bounce">
            <CheckCircle size={24} />
            <span className="font-bold">
              {savedMatchStatus === 'win' ? 'Win' : 'Loss'} Saved Successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const MatchHistory = ({ matches, onClear }) => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Match History</h1>
        <button 
          onClick={onClear}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Clear History
        </button>
      </div>
      {matches.length === 0 ? (
        <p className="text-gray-400 text-center">No matches recorded yet</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                match.result === 'win' 
                  ? 'bg-green-800 text-green-100' 
                  : 'bg-red-800 text-red-100'
              }`}
            >
              <div className="flex justify-between">
                <span>{match.deck}</span>
                <span>vs {match.opponentClass}</span>
                <span>{match.result.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HearthstoneTracker;
