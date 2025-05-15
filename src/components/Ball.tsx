
import React, { useRef, useEffect } from 'react';
import { Ball as BallType } from '../types/game';
import { createTrailEffect } from '../utils/animations';

interface BallProps {
  ball: BallType | null;
}

const Ball: React.FC<BallProps> = ({ ball }) => {
  const ballRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Find the game board element
    if (!boardRef.current) {
      boardRef.current = document.querySelector('[data-game-board]');
    }
    
    // Create trail effect
    if (ball && boardRef.current) {
      // Only create trail if the ball has moved significantly
      const distance = Math.sqrt(
        Math.pow(ball.x - lastPositionRef.current.x, 2) + 
        Math.pow(ball.y - lastPositionRef.current.y, 2)
      );
      
      if (distance > 5) {
        const trailElement = createTrailEffect(ball.x, ball.y, ball.radius * 0.8);
        boardRef.current.appendChild(trailElement);
        
        // Remove trail after animation
        setTimeout(() => {
          if (trailElement.parentNode) {
            trailElement.parentNode.removeChild(trailElement);
          }
        }, 300);
        
        // Update last position
        lastPositionRef.current = { x: ball.x, y: ball.y };
      }
    }
  }, [ball?.x, ball?.y]);

  if (!ball) return null;
  
  return (
    <div
      ref={ballRef}
      className="absolute bg-gradient-to-b from-white to-gray-200 rounded-full shadow-lg border border-gray-300 animate-pulse"
      style={{
        width: `${ball.radius * 2}px`,
        height: `${ball.radius * 2}px`,
        left: `${ball.x - ball.radius}px`,
        top: `${ball.y - ball.radius}px`,
        boxShadow: '0 0 10px rgba(255,255,255,0.8)',
        transition: 'box-shadow 0.2s ease'
      }}
    >
      {/* Shine effect */}
      <div 
        className="absolute rounded-full bg-white/50" 
        style={{
          width: '40%',
          height: '40%',
          top: '15%',
          left: '15%'
        }}
      />
    </div>
  );
};

export default Ball;
