
import React, { useState, useEffect } from 'react';
import { Master } from '../types/game';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  
  const getMasterBorderColor = () => {
    switch (master.id) {
      case 'bjorn': return 'border-blue-400';
      case 'gnorman': return 'border-yellow-400';
      case 'luna': return 'border-purple-400';
      case 'jeff': return 'border-pink-400';
      case 'berg': return 'border-cyan-400';
      default: return 'border-gray-400';
    }
  };

  const getMasterBackgroundGradient = () => {
    switch (master.id) {
      case 'bjorn': return 'bg-gradient-to-b from-blue-500 to-blue-700';
      case 'gnorman': return 'bg-gradient-to-b from-yellow-500 to-amber-600';
      case 'luna': return 'bg-gradient-to-b from-purple-500 to-purple-800';
      case 'jeff': return 'bg-gradient-to-b from-pink-500 to-rose-700';
      case 'berg': return 'bg-gradient-to-b from-cyan-500 to-blue-700';
      default: return 'bg-gradient-to-b from-blue-500 to-blue-700';
    }
  };
  
  const getMasterImage = () => {
    switch (master.id) {
      case 'bjorn': return '/lovable-uploads/47d8f459-e970-4c0f-be45-27358debd5e4.png';
      case 'gnorman': return '/lovable-uploads/47d8f459-e970-4c0f-be45-27358debd5e4.png';
      case 'luna': return '/lovable-uploads/47d8f459-e970-4c0f-be45-27358debd5e4.png';
      case 'jeff': return '/lovable-uploads/47d8f459-e970-4c0f-be45-27358debd5e4.png';
      case 'berg': return '/lovable-uploads/47d8f459-e970-4c0f-be45-27358debd5e4.png';
      default: return '';
    }
  };

  return (
    <div className={`relative ${isActive ? 'scale-110' : ''} transition-all duration-300`}>
      <div className={`
        relative rounded-full overflow-hidden
        ${isActive ? 'ring-4 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : ''} 
        ${animate ? 'animate-pulse' : ''}
        ${isAbilityActive ? 'ring-4 ring-yellow-400 animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.8)]' : ''}
      `}>
        <Avatar className={`w-16 h-16 border-4 ${getMasterBorderColor()}`}>
          <AvatarImage src={getMasterImage()} alt={master.name} className="object-cover" />
          <AvatarFallback className={`${getMasterBackgroundGradient()} text-white font-bold text-xl`}>
            {master.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        {/* Glowing effect for active ability */}
        {isAbilityActive && (
          <div className="absolute inset-0 bg-yellow-400/20 mix-blend-overlay animate-pulse rounded-full"></div>
        )}
      </div>
      
      {/* Active ability badge */}
      {isAbilityActive && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-xs font-bold px-3 py-1 rounded-full animate-bounce shadow-lg border border-yellow-300 text-black">
          ACTIVE!
        </div>
      )}
      
      {/* Master title text */}
      <div className={`
        absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center
        font-bold text-xs px-2 py-1 rounded-md shadow-md w-24
        ${getMasterBackgroundGradient()} text-white opacity-90
        ${isActive ? 'opacity-100' : 'opacity-70'}
      `}>
        {master.name}
      </div>
      
      {/* Active player indicator triangle */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white shadow-md"></div>
      )}
    </div>
  );
};

export default MasterAvatar;
