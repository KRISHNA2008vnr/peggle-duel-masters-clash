
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
        className={`absolute rounded-full animate-scale-up animate-fade-out`}
        style={{
          width: `${peg.radius * 2}px`,
          height: `${peg.radius * 2}px`,
          left: `${peg.x - peg.radius}px`,
          top: `${peg.y - peg.radius}px`,
          backgroundColor: getPegColor(peg.type, true),
          border: `2px solid ${getPegBorderColor(peg.type, true)}`,
        }}
      />
    );
  }
  
  if (!peg.active) return null;

  return (
    <div
      className={`
        absolute rounded-full border-2 shadow-lg transition-all duration-100
        ${glow ? 'animate-pulse' : ''}
      `}
      style={{
        width: `${peg.radius * 2}px`,
        height: `${peg.radius * 2}px`,
        left: `${peg.x - peg.radius}px`,
        top: `${peg.y - peg.radius}px`,
        backgroundColor: getPegColor(peg.type),
        borderColor: getPegBorderColor(peg.type),
        boxShadow: getSpecialEffects(peg.type, glow),
      }}
    />
  );
};

const getPegColor = (type: string, hit: boolean = false) => {
  const opacity = hit ? '80' : '';
  
  switch (type) {
    case 'blue':
      return `rgba(52, 152, 219, ${hit ? '0.8' : '1'})`;
    case 'orange':
      return `rgba(255, 159, 67, ${hit ? '0.8' : '1'})`;
    case 'green':
      return `rgba(46, 204, 113, ${hit ? '0.8' : '1'})`;
    case 'purple':
      return `rgba(155, 89, 182, ${hit ? '0.8' : '1'})`;
    default:
      return `rgba(52, 152, 219, ${hit ? '0.8' : '1'})`;
  }
};

const getPegBorderColor = (type: string, hit: boolean = false) => {
  const opacity = hit ? '80' : '';
  
  switch (type) {
    case 'blue':
      return `rgba(41, 128, 185, ${hit ? '0.8' : '1'})`;
    case 'orange':
      return `rgba(243, 156, 18, ${hit ? '0.8' : '1'})`;
    case 'green':
      return `rgba(39, 174, 96, ${hit ? '0.8' : '1'})`;
    case 'purple':
      return `rgba(142, 68, 173, ${hit ? '0.8' : '1'})`;
    default:
      return `rgba(41, 128, 185, ${hit ? '0.8' : '1'})`;
  }
};

const getSpecialEffects = (type: string, glow: boolean) => {
  if (type === 'green' && glow) {
    return '0 0 10px 5px rgba(46, 204, 113, 0.7)';
  }
  
  if (type === 'purple' && glow) {
    return '0 0 10px 5px rgba(155, 89, 182, 0.7)';
  }
  
  if (type === 'orange') {
    return '0 0 5px 2px rgba(255, 159, 67, 0.5)';
  }
  
  return 'none';
};

export default Peg;
