
import React, { useState, useEffect } from 'react';
import { Master } from '../types/game';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MasterAvatarProps {
  master: Master | null;
  isActive: boolean;
  isAbilityActive: boolean;
}

const MasterAvatar: React.FC<MasterAvatarProps> = ({ master, isActive, isAbilityActive }) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (isAbilityActive) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAbilityActive]);

  if (!master) return null;
  
  const getBackgroundColor = () => {
    switch (master.id) {
      case 'bjorn': return 'bg-gradient-to-b from-blue-400 to-blue-600';
      case 'gnorman': return 'bg-gradient-to-b from-yellow-400 to-yellow-600';
      case 'luna': return 'bg-gradient-to-b from-purple-400 to-purple-600';
      case 'jeff': return 'bg-gradient-to-b from-pink-400 to-pink-600';
      case 'berg': return 'bg-gradient-to-b from-cyan-400 to-cyan-600';
      default: return 'bg-gradient-to-b from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`relative ${isActive ? 'ring-2 ring-white' : ''}`}>
      <Avatar 
        className={`
          w-20 h-20 ${getBackgroundColor()} shadow-lg
          transition-all duration-300
          ${animate ? 'animate-pulse scale-110' : ''}
          ${isAbilityActive ? 'ring-4 ring-yellow-400' : ''}
        `}
      >
        <AvatarImage src={`/avatars/${master.id}.png`} alt={master.name} />
        <AvatarFallback className="text-white font-bold text-2xl">
          {master.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      {isAbilityActive && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-md">
          ACTIVE!
        </div>
      )}
      
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
      )}
    </div>
  );
};

export default MasterAvatar;
