import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import GameBoard from '../components/GameBoard';
import Player from '../components/Player';
import ScoreBoard from '../components/ScoreBoard';
import GameOverModal from '../components/GameOverModal';
import ControllerInstructions from '../components/ControllerInstructions';
import { useGamepad } from '@/hooks/useGamepad';
import { Gamepad } from 'lucide-react';

const GameContent = () => {
  const { state, dispatch, masters } = useGame();
  const [showInstructions, setShowInstructions] = useState(true);
  const gamepad = useGamepad();
  
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

  // Auto-hide instructions after a delay
  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 10000); // Hide after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [showInstructions]);

  // Show controller connected notification
  useEffect(() => {
    if (gamepad.connected) {
      const controllerName = navigator.getGamepads()[0]?.id || "Xbox Controller";
      const controllerType = controllerName.includes("Xbox") ? "Xbox" : "Game";
      
      // Toast notification for controller connection
      // This would be implemented if we had a toast system
    }
  }, [gamepad.connected]);
  
  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      {/* Show controller instructions at start */}
      {state.phase !== 'selection' && (
        <ControllerInstructions
          open={showInstructions}
          onOpenChange={setShowInstructions}
        />
      )}
      
      {/* Fancy title with better styling */}
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-center relative z-10 drop-shadow-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
            PEGGLE 2
          </span>
        </h1>
        <div className="text-2xl md:text-3xl font-semibold text-center text-yellow-300 mt-2 drop-shadow-lg">
          Local Duel Mode
        </div>
        <div className="absolute h-32 w-full max-w-md left-1/2 -translate-x-1/2 -z-10 blur-xl opacity-30 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full"></div>
      </div>

      {/* Controller support indicator */}
      {gamepad.connected && (
        <div className="mb-4 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 px-4 py-2 rounded-full shadow-lg border border-purple-400/50">
          <div className="flex items-center gap-2 text-white">
            <Gamepad className="h-5 w-5 text-purple-300" />
            <span className="font-medium">Controller Connected</span>
            <button
              onClick={() => setShowInstructions(true)}
              className="text-xs bg-purple-800/50 px-2 py-1 rounded ml-2 hover:bg-purple-700/50"
            >
              Show Controls
            </button>
          </div>
        </div>
      )}
      
      {/* Main content based on game phase */}
      {state.phase === 'selection' ? (
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-center mb-2 text-white">Choose Your Peggle Masters</h2>
            <p className="text-gray-300 max-w-lg mx-auto">
              Select a master with unique powers to help you clear pegs and score points!
            </p>
          </div>
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
            {/* Game board container with enhanced shadow effects */}
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/50 to-purple-500/50 blur-xl -z-10"></div>
              <GameBoard />
              <div className="absolute -inset-4 -z-20 bg-gradient-to-r from-cyan-400/20 via-blue-500/5 to-purple-600/20 rounded-2xl blur-xl"></div>
            </div>
            
            {/* Game tips */}
            <div className="mt-4 text-center">
              <p className="text-sm text-yellow-200 italic font-medium">
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
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOC0xLjc5LTQtNC00cy00IDEuNzkyLTQgNCAyIDQgNCA0IDItMi43OTIgNC00eiIgLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-transparent"></div>
      </div>
      
      {/* Particle effects - simulated with fixed elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-3 w-3 rounded-full bg-blue-300/40 top-1/4 left-1/3 animate-pulse"></div>
        <div className="absolute h-2 w-2 rounded-full bg-purple-300/30 top-1/3 left-2/3 animate-ping"></div>
        <div className="absolute h-4 w-4 rounded-full bg-pink-300/20 top-2/3 left-1/4 animate-pulse"></div>
        <div className="absolute h-2 w-2 rounded-full bg-yellow-300/30 top-1/2 left-3/4 animate-ping"></div>
      </div>
      
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
};

export default Index;
