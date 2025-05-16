
import React from 'react';
import { Player } from '../types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameOverModalProps {
  players: Player[];
  winner: Player | null;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ players, winner, onRestart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <Card className="w-full max-w-md p-4 md:p-6 bg-white rounded-lg shadow-2xl animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">Game Over!</h2>
        
        {winner ? (
          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-semibold">
              {winner.name} Wins!
            </h3>
            <p className="mt-2 text-base md:text-lg">
              Final Score: <span className="font-bold">{winner.score}</span> points
            </p>
            {winner.master && (
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Playing as {winner.master.name}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-semibold">It's a Tie!</h3>
            <p className="mt-2 text-base md:text-lg">
              Both players scored {players[0].score} points
            </p>
          </div>
        )}
        
        <div className="flex justify-between mb-4 md:mb-6">
          {players.map(player => (
            <div key={player.id} className="text-center">
              <h4 className="font-semibold">{player.name}</h4>
              <p className="text-xl font-bold">{player.score}</p>
              {player.master && (
                <p className={`text-xs md:text-sm text-${player.master.color}`}>
                  {player.master.name}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onRestart}
            className="px-6 md:px-8 py-2 bg-peggle-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
          >
            Play Again
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameOverModal;
