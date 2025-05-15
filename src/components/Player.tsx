
import React from 'react';
import { Player as PlayerType, Master } from '../types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PlayerProps {
  player: PlayerType;
  masters: Master[];
  onSelectMaster: (masterId: string) => void;
}

const Player: React.FC<PlayerProps> = ({ player, masters, onSelectMaster }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-center mb-4">{player.name}</h2>
      
      {player.master ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            Selected Master: <span className={`text-${player.master.color}`}>{player.master.name}</span>
          </h3>
          <p className="text-gray-600 mt-2">Ability: {player.master.ability}</p>
          <p className="text-gray-500 text-sm mt-1">{player.master.description}</p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-center mb-4">Select a Peggle Master</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {masters.map((master) => (
              <Card
                key={master.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors border-2 hover:border-${master.color}`}
                onClick={() => onSelectMaster(master.id)}
              >
                <h4 className={`font-bold text-${master.color}`}>{master.name}</h4>
                <p className="text-xs mt-1">{master.ability}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
