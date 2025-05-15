
import React from 'react';
import { Peg as PegType } from '../types/game';

interface PegProps {
  peg: PegType;
}

const Peg: React.FC<PegProps> = ({ peg }) => {
  if (!peg.active) return null;
  
  const getPegColor = () => {
    switch (peg.type) {
      case 'blue':
        return 'bg-peggle-blue';
      case 'orange':
        return 'bg-peggle-orange';
      case 'green':
        return 'bg-peggle-green';
      case 'purple':
        return 'bg-peggle-purple';
      default:
        return 'bg-peggle-blue';
    }
  };

  const getPegBorder = () => {
    switch (peg.type) {
      case 'blue':
        return 'border-blue-300';
      case 'orange':
        return 'border-orange-300';
      case 'green':
        return 'border-green-300';
      case 'purple':
        return 'border-purple-300';
      default:
        return 'border-blue-300';
    }
  };

  return (
    <div
      className={`absolute rounded-full border-2 ${getPegColor()} ${getPegBorder()} shadow-lg transition-transform duration-100`}
      style={{
        width: `${peg.radius * 2}px`,
        height: `${peg.radius * 2}px`,
        left: `${peg.x - peg.radius}px`,
        top: `${peg.y - peg.radius}px`,
        transform: 'translate(0, 0)'
      }}
    />
  );
};

export default Peg;
