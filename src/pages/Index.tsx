
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
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-peggle-background">
        Peggle 2: Local Duel Mode
      </h1>
      
      {/* Main content based on game phase */}
      {state.phase === 'selection' ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Choose Your Peggle Masters</h2>
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
          
          <div className="mt-6">
            <GameBoard />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {state.phase === 'aiming' ? 
                'Click to shoot' : 
                state.phase === 'shooting' ? 
                'Ball in play...' : 
                'Switching players...'}
            </p>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
};

export default Index;
