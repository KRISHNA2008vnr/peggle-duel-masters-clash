
import { useState, useEffect } from 'react';
import { Peg, Ball } from '../types/game';

// Constants for the game
export const BOARD_WIDTH = 800;
export const BOARD_HEIGHT = 600;
export const PEG_RADIUS = 15;
export const BALL_RADIUS = 10;
export const GRAVITY = 0.2;
export const FRICTION = 0.98;
export const BOUNCE_FACTOR = 0.7;

// Function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Function to generate a random layout of pegs
export const generateRandomLayout = (): Peg[] => {
  const pegs: Peg[] = [];
  const gridSize = 50; // Space between pegs
  const margin = 100; // Margin from the edges
  
  // Create a grid layout with some randomization
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // Skip some positions randomly to create a more interesting layout
      if (Math.random() < 0.3) continue;
      
      // Calculate position with slight randomization
      const x = margin + col * gridSize + Math.random() * 20 - 10;
      const y = margin + row * gridSize + Math.random() * 20 - 10;
      
      // Determine peg type based on probabilities
      let type: 'blue' | 'orange' | 'green' | 'purple';
      const rand = Math.random();
      
      if (rand < 0.7) {
        type = 'blue'; // 70% blue
      } else if (rand < 0.9) {
        type = 'orange'; // 20% orange
      } else if (rand < 0.95) {
        type = 'green'; // 5% green
      } else {
        type = 'purple'; // 5% purple
      }
      
      // Create the peg
      pegs.push({
        id: generateId(),
        type,
        x,
        y,
        radius: PEG_RADIUS,
        active: true
      });
    }
  }
  
  return pegs;
};

// Function to check collisions between ball and pegs
const checkCollision = (ball: Ball, peg: Peg): boolean => {
  if (!peg.active) return false;
  
  const dx = ball.x - peg.x;
  const dy = ball.y - peg.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance < ball.radius + peg.radius;
};

// Function to handle collision physics
const handleCollision = (ball: Ball, peg: Peg): Ball => {
  const dx = ball.x - peg.x;
  const dy = ball.y - peg.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Avoid division by zero
  if (distance === 0) return ball;
  
  // Calculate unit normal vector
  const nx = dx / distance;
  const ny = dy / distance;
  
  // Calculate the reflection direction
  const dotProduct = (ball.vx * nx) + (ball.vy * ny);
  
  // Update velocity with bounce factor
  const newVx = ball.vx - 2 * dotProduct * nx * BOUNCE_FACTOR;
  const newVy = ball.vy - 2 * dotProduct * ny * BOUNCE_FACTOR;
  
  // Update position to prevent sticking
  const overlap = ball.radius + peg.radius - distance;
  const newX = ball.x + overlap * nx;
  const newY = ball.y + overlap * ny;
  
  return {
    ...ball,
    x: newX,
    y: newY,
    vx: newVx,
    vy: newVy
  };
};

// Hook for game physics and interactions
export const useGamePhysics = (activePegs: Peg[], onHitPeg: (pegId: string) => void) => {
  const [ball, setBall] = useState<Ball | null>(null);
  const [aimAngle, setAimAngle] = useState<number>(0);
  
  // Function to launch the ball
  const launchBall = (startX: number, startY: number, velocityX: number, velocityY: number) => {
    setBall({
      x: startX,
      y: startY,
      vx: velocityX,
      vy: velocityY,
      radius: BALL_RADIUS
    });
  };
  
  // Function to update ball position based on physics
  const updateBallPosition = (currentBall: Ball): Ball | null => {
    if (!currentBall) return null;
    
    // Apply gravity and friction
    const newVx = currentBall.vx * FRICTION;
    const newVy = currentBall.vy * FRICTION + GRAVITY;
    
    // Calculate new position
    const newX = currentBall.x + newVx;
    const newY = currentBall.y + newVy;
    
    // Check if ball is out of bounds (bottom)
    if (newY > BOARD_HEIGHT + 100) {
      return null; // Ball is out of play
    }
    
    // Check wall collisions
    let finalVx = newVx;
    let finalX = newX;
    
    if (newX < BALL_RADIUS) {
      finalX = BALL_RADIUS;
      finalVx = -newVx * BOUNCE_FACTOR;
    } else if (newX > BOARD_WIDTH - BALL_RADIUS) {
      finalX = BOARD_WIDTH - BALL_RADIUS;
      finalVx = -newVx * BOUNCE_FACTOR;
    }
    
    // Return updated ball
    return {
      x: finalX,
      y: newY,
      vx: finalVx,
      vy: newVy,
      radius: BALL_RADIUS
    };
  };
  
  // Animation frame hook for physics simulation
  useEffect(() => {
    if (!ball) return;
    
    const gameLoop = setInterval(() => {
      // Check collisions with pegs
      let updatedBall = { ...ball };
      let hitPegId: string | null = null;
      
      // Check all pegs for collision
      for (const peg of activePegs) {
        if (checkCollision(updatedBall, peg)) {
          updatedBall = handleCollision(updatedBall, peg);
          hitPegId = peg.id;
          break;
        }
      }
      
      // If a peg was hit, trigger the callback
      if (hitPegId) {
        onHitPeg(hitPegId);
      }
      
      // Update ball position
      const newBallPosition = updateBallPosition(updatedBall);
      
      // If ball is out of play (null), clear the interval
      if (!newBallPosition) {
        clearInterval(gameLoop);
        setBall(null);
        return;
      }
      
      // Update ball state
      setBall(newBallPosition);
    }, 16); // ~60 FPS
    
    return () => clearInterval(gameLoop);
  }, [ball, activePegs, onHitPeg]);
  
  // Function to set the aim angle for the trajectory
  const setAim = (angle: number) => {
    setAimAngle(angle);
  };
  
  // Calculate trajectory points for aiming
  const calculateTrajectory = (startX: number, startY: number, angle: number, length: number = 10) => {
    const points = [];
    const velocityX = Math.cos(angle) * 10;
    const velocityY = Math.sin(angle) * 10;
    let x = startX;
    let y = startY;
    let vx = velocityX;
    let vy = velocityY;
    
    for (let i = 0; i < length; i++) {
      x += vx;
      y += vy;
      vy += GRAVITY;
      
      points.push({ x, y });
      
      // Stop trajectory if it would hit a wall
      if (x < 0 || x > BOARD_WIDTH) {
        break;
      }
    }
    
    return points;
  };
  
  return {
    ball,
    launchBall,
    setAim,
    aimAngle,
    calculateTrajectory
  };
};

// Points values for different peg types
export const getPointsForPegType = (type: string): number => {
  switch (type) {
    case 'blue': return 10;
    case 'orange': return 100;
    case 'green': return 250;
    case 'purple': return 500;
    default: return 10;
  }
};
