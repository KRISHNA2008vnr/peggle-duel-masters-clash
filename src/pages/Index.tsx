
import React from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import Player from '../components/Player';
import ScoreBoard from '../components/ScoreBoard';
import GameOverModal from '../components/GameOverModal';

const GameContent = () => {
  const { state, dispatch, masters } = useGame();
  
  const handleSelectMaster = (playerId: number, masterId: string) => {
    const selectedMaster = masters.find(m => m.id === masterId);
    if (selectedMaster) {
      dispatch({ type: 'SELECT_MASTER', playerId, master: selectedMaster });
      
      // Check if both players have selected masters
      const bothPlayersSelected = state.players.every(p => 
        p.id === playerId ? true : p.master !== null
      );
      
      if (bothPlayersSelected) {
        dispatch({ type: 'START_GAME' });
      }
    }
  };
  
  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
        Peggle 2: Local Duel Mode
      </h1>
      
      {/* Main content based on game phase */}
      {state.phase === 'selection' ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">Choose Your Peggle Masters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {state.players.map(player => (
              <Player 
                key={player.id}
                player={player}
                masters={masters}
                onSelectMaster={(masterId) => handleSelectMaster(player.id, masterId)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <ScoreBoard
            players={state.players}
            currentPlayerId={state.currentPlayerId}
          />
          
          <div className="mt-6 relative">
            {/* Game board container with shadow effects */}
            <div className="relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(123,40,255,0.4)]">
              <GameBoard />
            </div>
            
            {/* Game tips */}
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-300 italic">
                {state.phase === 'aiming' ? 
                  'Tip: Aim carefully to hit green pegs and activate your master power!' : 
                  state.phase === 'shooting' ? 
                  'Watch the ball physics in action!' : 
                  'Get ready for the next turn...'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Game over modal */}
      {state.phase === 'gameOver' && (
        <GameOverModal
          players={state.players}
          winner={state.winner}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-purple-900 bg-fixed overflow-auto">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOC0xLjc5LTQtNC00cy00IDEuNzkyLTQgNCAyIDQgNCA0IDItMi43OTIgNC00eiIgLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>
      
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
};

export default Index;
