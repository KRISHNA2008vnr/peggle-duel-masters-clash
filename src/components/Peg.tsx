
import React, { useState, useEffect } from 'react';
import { Peg as PegType } from '../types/game';

interface PegProps {
  peg: PegType;
}

const Peg: React.FC<PegProps> = ({ peg }) => {
  const [isHit, setIsHit] = useState(false);
  const [glow, setGlow] = useState(false);
  
  useEffect(() => {
    // Apply glow effect to special pegs
    if (peg.type === 'purple' || peg.type === 'green') {
      setGlow(true);
      
      // Pulse the glow
      const interval = setInterval(() => {
        setGlow(prev => !prev);
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [peg.type]);
  
  useEffect(() => {
    // When peg becomes inactive, show hit animation
    if (!peg.active && !isHit) {
      setIsHit(true);
    }
  }, [peg.active, isHit]);

  if (!peg.active && isHit) {
    // For hit pegs, show a brief animation before disappearing
    return (
      <div
        className="absolute rounded-full animate-scale-up animate-fade-out z-10"
        style={{
          width: `${peg.radius * 2}px`,
          height: `${peg.radius * 2}px`,
          left: `${peg.x - peg.radius}px`,
          top: `${peg.y - peg.radius}px`,
          background: `radial-gradient(circle, ${getPegInnerColor(peg.type, true)} 60%, ${getPegOuterColor(peg.type, true)} 100%)`,
          boxShadow: `0 0 10px 2px ${getPegGlowColor(peg.type, true)}`,
          border: `2px solid ${getPegBorderColor(peg.type, true)}`,
        }}
      >
        {/* Shine effect */}
        <div 
          className="absolute rounded-full bg-white/50" 
          style={{
            width: '30%',
            height: '30%',
            top: '15%',
            left: '15%'
          }}
        />
      </div>
    );
  }
  
  if (!peg.active) return null;

  return (
    <div
      className={`
        absolute rounded-full border-2 shadow-lg z-0
        ${glow ? 'animate-pulse' : ''}
      `}
      style={{
        width: `${peg.radius * 2}px`,
        height: `${peg.radius * 2}px`,
        left: `${peg.x - peg.radius}px`,
        top: `${peg.y - peg.radius}px`,
        background: `radial-gradient(circle, ${getPegInnerColor(peg.type)} 60%, ${getPegOuterColor(peg.type)} 100%)`,
        borderColor: getPegBorderColor(peg.type),
        boxShadow: getSpecialEffects(peg.type, glow),
      }}
    >
      {/* Shine effect */}
      <div 
        className="absolute rounded-full bg-white/50" 
        style={{
          width: '30%',
          height: '30%',
          top: '15%',
          left: '15%'
        }}
      />
      
      {/* Inner glow for special pegs */}
      {(peg.type === 'purple' || peg.type === 'green' || peg.type === 'orange') && (
        <div 
          className={`absolute inset-0 rounded-full ${glow ? 'animate-pulse' : ''}`}
          style={{
            background: `radial-gradient(circle, transparent 50%, ${getPegGlowColor(peg.type, false, 0.3)} 100%)`,
          }}
        />
      )}
    </div>
  );
};

const getPegInnerColor = (type: string, hit: boolean = false) => {
  const opacity = hit ? '0.8' : '1';
  
  switch (type) {
    case 'blue':
      return `rgba(70, 170, 240, ${opacity})`;
    case 'orange':
      return `rgba(255, 140, 0, ${opacity})`;
    case 'green':
      return `rgba(60, 220, 130, ${opacity})`;
    case 'purple':
      return `rgba(170, 100, 220, ${opacity})`;
    default:
      return `rgba(70, 170, 240, ${opacity})`;
  }
};

const getPegOuterColor = (type: string, hit: boolean = false) => {
  const opacity = hit ? '0.8' : '1';
  
  switch (type) {
    case 'blue':
      return `rgba(30, 130, 220, ${opacity})`;
    case 'orange':
      return `rgba(220, 110, 0, ${opacity})`;
    case 'green':
      return `rgba(30, 180, 100, ${opacity})`;
    case 'purple':
      return `rgba(140, 60, 190, ${opacity})`;
    default:
      return `rgba(30, 130, 220, ${opacity})`;
  }
};

const getPegBorderColor = (type: string, hit: boolean = false) => {
  const opacity = hit ? '0.8' : '1';
  
  switch (type) {
    case 'blue':
      return `rgba(20, 100, 200, ${opacity})`;
    case 'orange':
      return `rgba(200, 90, 0, ${opacity})`;
    case 'green':
      return `rgba(20, 160, 80, ${opacity})`;
    case 'purple':
      return `rgba(120, 40, 160, ${opacity})`;
    default:
      return `rgba(20, 100, 200, ${opacity})`;
  }
};

const getPegGlowColor = (type: string, hit: boolean = false, opacity: number = 0.7) => {
  const hitOpacity = hit ? opacity * 0.5 : opacity;
  
  switch (type) {
    case 'blue':
      return `rgba(100, 200, 255, ${hitOpacity})`;
    case 'orange':
      return `rgba(255, 160, 50, ${hitOpacity})`;
    case 'green':
      return `rgba(80, 255, 150, ${hitOpacity})`;
    case 'purple':
      return `rgba(190, 120, 255, ${hitOpacity})`;
    default:
      return `rgba(100, 200, 255, ${hitOpacity})`;
  }
};

const getSpecialEffects = (type: string, glow: boolean) => {
  if (type === 'green' && glow) {
    return '0 0 15px 5px rgba(50, 230, 130, 0.8)';
  }
  
  if (type === 'purple' && glow) {
    return '0 0 15px 5px rgba(180, 110, 240, 0.8)';
  }
  
  if (type === 'orange') {
    return '0 0 8px 2px rgba(255, 140, 20, 0.5)';
  }
  
  return '0 0 5px rgba(255, 255, 255, 0.3)';
};

export default Peg;
