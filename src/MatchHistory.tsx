import React from 'react';

interface Match {
  deck: string;
  opponent: string;
  result: 'win' | 'loss';
  date: string;
}

interface MatchHistoryProps {
  matches: Match[];
  onClear: () => void;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches, onClear }) => {
  // Sort matches by date, most recent first
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Match History</h1>
          {matches.length > 0 && (
            <button 
              onClick={onClear}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-300"
            >
              Clear History
            </button>
          )}
        </div>

        {matches.length === 0 ? (
          <p className="text-gray-400 text-center">No matches recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {sortedMatches.map((match, index) => (
              <div 
                key={index} 
                className={`
                  bg-gray-800 p-4 rounded flex justify-between items-center
                  ${match.result === 'win' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}
                `}
              >
                <div>
                  <h2 className="text-white font-semibold">{match.deck}</h2>
                  <p className="text-gray-400">
                    vs {match.opponent} - {' '}
                    <span className={match.result === 'win' ? 'text-green-400' : 'text-red-400'}>
                      {match.result.toUpperCase()}
                    </span>
                  </p>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(match.date).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;