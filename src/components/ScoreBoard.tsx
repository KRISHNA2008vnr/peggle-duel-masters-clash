
import React from 'react';
import { Player } from '../types/game';

interface ScoreBoardProps {
  players: Player[];
  currentPlayerId: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="flex justify-between items-center bg-peggle-background text-white p-4 rounded-lg shadow-md">
      {players.map((player) => (
        <div 
          key={player.id} 
          className={`flex flex-col items-center p-2 rounded-lg transition-all ${
            player.id === currentPlayerId ? 'bg-white/20 shadow-lg scale-105' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{player.name}</h3>
            {player.master && (
              <span className={`text-${player.master.color} text-sm italic`}>
                ({player.master.name})
              </span>
            )}
          </div>
          
          <div className="text-3xl font-bold">{player.score}</div>
          
          <div className="mt-2 text-sm">
            Shots Left: {player.shotsLeft}/{player.totalShots}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
