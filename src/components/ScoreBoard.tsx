
import React from 'react';
import { Player } from '../types/game';
import { useMobile } from '@/hooks/use-mobile';

interface ScoreBoardProps {
  players: Player[];
  currentPlayerId: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, currentPlayerId }) => {
  const { isMobile } = useMobile();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-peggle-background text-white p-3 md:p-4 rounded-lg shadow-md">
      {players.map((player) => (
        <div 
          key={player.id} 
          className={`flex flex-col items-center p-2 rounded-lg transition-all w-full md:w-auto mb-2 md:mb-0 ${
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
          
          <div className="text-2xl md:text-3xl font-bold">{player.score}</div>
          
          <div className="mt-1 md:mt-2 text-xs md:text-sm">
            Shots Left: {player.shotsLeft}/{player.totalShots}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
