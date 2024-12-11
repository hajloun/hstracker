import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';

// Import your components
import DeckSelection from './DeckSelection.tsx';
import MatchResult from './MatchResult.tsx';
import MatchHistory from './MatchHistory.tsx';

// Firebase configuration (replace with your own config from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyB3L2T6rXdeiz0UJZKjoXz75_gJBaKftR0",
  authDomain: "hsdecktracker-8cebf.firebaseapp.com",
  databaseURL: "https://hsdecktracker-8cebf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hsdecktracker-8cebf",
  storageBucket: "hsdecktracker-8cebf.firebasestorage.app",
  messagingSenderId: "420608176140",
  appId: "1:420608176140:web:0df493251a0f43af77fe29",
  measurementId: "G-5G4HNJ43BE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const Navigation = ({ currentScreen, setScreen, user, handleLogout }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-full shadow-lg flex divide-x divide-gray-700">
      {user ? (
        <>
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
          <button
            onClick={handleLogout}
            className="p-3 hover:bg-gray-700 transition duration-300"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => setScreen('login')}
          className={`p-3 ${currentScreen === 'login' ? 'bg-blue-600' : 'hover:bg-gray-700'} transition duration-300`}
        >
          Login
        </button>
      )}
    </div>
  );
};

const HearthstoneTracker = () => {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [matches, setMatches] = useState([]);
  const [decks, setDecks] = useState([]);

  // Load user data on auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await loadUserData(authUser.uid);
        setScreen('deck-selection');
      } else {
        setUser(null);
        setDecks([]);
        setMatches([]);
        setScreen('login');
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user's decks and matches from Firestore
  const loadUserData = async (userId) => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDecks(userData.decks || []);
        setMatches(userData.matches || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Save user data to Firestore
  const saveUserData = async (updatedDecks, updatedMatches) => {
    if (!user) return;

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, { decks: updatedDecks, matches: updatedMatches }, { merge: true });
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setScreen('deck-selection');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      
      // Create initial user document in Firestore
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        decks: [],
        matches: []
      });

      setScreen('deck-selection');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddDeck = async (deckName) => {
    const newDeck = {
      id: decks.length > 0 ? Math.max(...decks.map(d => d.id)) + 1 : 1,
      name: deckName,
      matches: [],
      winRate: undefined
    };
    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    await saveUserData(updatedDecks, matches);
  };

  const handleRemoveDeck = async (deckId) => {
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(updatedDecks);
    await saveUserData(updatedDecks, matches);
    
    if (selectedDeck && selectedDeck.id === deckId) {
      setSelectedDeck(null);
      setScreen('deck-selection');
    }
  };

  const handleDeckSelect = (deck) => {
    setSelectedDeck(deck);
    setScreen('match-result');
  };

  const handleMatchComplete = async (match) => {
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
    await saveUserData(updatedDecks, newMatches);
  };

  const handleClearHistory = async () => {
    setMatches([]);
    const resetDecks = decks.map(deck => ({ ...deck, matches: [], winRate: undefined }));
    setDecks(resetDecks);
    await saveUserData(resetDecks, []);
  };

  const renderScreen = () => {
    switch(screen) {
      case 'login':
        return (
          <AuthPage 
            onLogin={handleLogin} 
            onRegister={handleRegister}
          />
        );
      case 'deck-selection':
        return (
          <DeckSelection 
            username={user?.email || 'User'} 
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
      <Navigation 
        currentScreen={screen} 
        setScreen={setScreen} 
        user={user}
        handleLogout={handleLogout}
      />
    </div>
  );
};

const AuthPage = ({ onLogin, onRegister }) => {
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
            <label htmlFor="username" className="block text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
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
          <div className="flex justify-center mt-4">
            <button 
              type="button" 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-300 hover:text-blue-200"
            >
              {isRegistering ? 'Switch to Login' : 'Switch to Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// The rest of the components (DeckSelection, MatchResult, MatchHistory) remain the same as in the original file

export default HearthstoneTracker;