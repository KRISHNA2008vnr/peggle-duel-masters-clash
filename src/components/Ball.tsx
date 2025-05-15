
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
      className="absolute rounded-full z-20"
      style={{
        width: `${ball.radius * 2}px`,
        height: `${ball.radius * 2}px`,
        left: `${ball.x - ball.radius}px`,
        top: `${ball.y - ball.radius}px`,
        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(230,230,240,1) 70%, rgba(200,200,210,1) 100%)',
        boxShadow: '0 0 15px rgba(255,255,255,0.8), inset 0 0 8px rgba(0,0,0,0.2)',
        border: '1px solid rgba(180,180,190,0.8)'
      }}
    >
      {/* Shine effect */}
      <div 
        className="absolute rounded-full bg-white/80" 
        style={{
          width: '40%',
          height: '40%',
          top: '15%',
          left: '15%'
        }}
      />
      
      {/* Secondary shine */}
      <div 
        className="absolute rounded-full bg-white/40" 
        style={{
          width: '20%',
          height: '20%',
          bottom: '25%',
          right: '20%'
        }}
      />
    </div>
  );
};

export default Ball;
