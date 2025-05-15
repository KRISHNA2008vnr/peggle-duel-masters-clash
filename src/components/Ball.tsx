
import React from 'react';
import { Ball as BallType } from '../types/game';

interface BallProps {
  ball: BallType | null;
}

const Ball: React.FC<BallProps> = ({ ball }) => {
  if (!ball) return null;
  
  return (
    <div
      className="absolute bg-white rounded-full shadow-lg border-2 border-gray-200"
      style={{
        width: `${ball.radius * 2}px`,
        height: `${ball.radius * 2}px`,
        left: `${ball.x - ball.radius}px`,
        top: `${ball.y - ball.radius}px`
      }}
    />
  );
};

export default Ball;
