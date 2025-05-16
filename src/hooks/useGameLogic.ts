
import { useState, useEffect } from 'react';
import { Peg, Ball, Master } from '../types/game';
import { toast } from '@/hooks/use-toast';

// Constants for the game
export const BOARD_WIDTH = 800;
export const BOARD_HEIGHT = 600;
export const PEG_RADIUS = 15;
export const BALL_RADIUS = 10;
export const GRAVITY = 0.25; // Increased from 0.2 for faster vertical movement
export const FRICTION = 0.99; // Increased from 0.98 for less slowdown
export const BOUNCE_FACTOR = 0.8; // Increased from 0.7 for more lively bounces
export const FRAME_RATE = 60; // Higher frame rate for smoother animation

// Function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Function to generate a random layout of pegs
export const generateRandomLayout = (specialPegCount: { green: number, purple: number } = { green: 2, purple: 3 }): Peg[] => {
  const pegs: Peg[] = [];
  const gridSize = 50; // Space between pegs
  const margin = 100; // Margin from the edges
  
  // Create a grid layout with some randomization
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 12; col++) {
      // Skip some positions randomly to create a more interesting layout
      if (Math.random() < 0.3) continue;
      
      // Calculate position with slight randomization
      const x = margin + col * gridSize + Math.random() * 20 - 10;
      const y = margin + row * gridSize + Math.random() * 20 - 10;
      
      // Create standard blue pegs
      pegs.push({
        id: generateId(),
        type: 'blue',
        x,
        y,
        radius: PEG_RADIUS,
        active: true
      });
    }
  }
  
  // Now convert some random pegs to orange
  const orangeCount = Math.floor(pegs.length * 0.2); // 20% of pegs are orange
  
  for (let i = 0; i < orangeCount && i < pegs.length; i++) {
    const randomIndex = Math.floor(Math.random() * pegs.length);
    if (pegs[randomIndex].type === 'blue') { // Only convert blue pegs
      pegs[randomIndex].type = 'orange';
    } else {
      // Try again
      i--;
    }
  }
  
  // Create special pegs (green and purple)
  // This ensures they're distributed across the board
  const specialTypes = [
    ...Array(specialPegCount.green).fill('green'), 
    ...Array(specialPegCount.purple).fill('purple')
  ];
  
  for (const specialType of specialTypes) {
    let placed = false;
    
    while (!placed) {
      const randomIndex = Math.floor(Math.random() * pegs.length);
      if (pegs[randomIndex].type === 'blue') {
        pegs[randomIndex].type = specialType as 'green' | 'purple';
        placed = true;
      }
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
export const useGamePhysics = (
  activePegs: Peg[],
  currentMaster: Master | null,
  isAbilityActive: boolean,
  onHitPeg: (pegId: string) => void,
  onAbilityActivated: () => void
) => {
  const [ball, setBall] = useState<Ball | null>(null);
  const [aimAngle, setAimAngle] = useState<number>(0);
  const [trajectoryLength, setTrajectoryLength] = useState<number>(10);
  
  // Update trajectory length based on active ability
  useEffect(() => {
    if (isAbilityActive && currentMaster?.id === 'bjorn') {
      setTrajectoryLength(25); // Bjorn's longer trajectory
      toast({
        title: "Super Guide Active!",
        description: "Your trajectory path is extended",
      });
    } else {
      setTrajectoryLength(10);
    }
  }, [isAbilityActive, currentMaster]);
  
  // Function to launch the ball
  const launchBall = (startX: number, startY: number, velocityX: number, velocityY: number) => {
    // Adjust velocity based on active abilities
    let adjustedVx = velocityX * 1.5; // Increased initial velocity by 50%
    let adjustedVy = velocityY * 1.5; // Increased initial velocity by 50%
    let adjustedRadius = BALL_RADIUS;
    
    // Boulder Throw ability - bigger ball with more power
    if (isAbilityActive && currentMaster?.id === 'jeff') {
      adjustedRadius = BALL_RADIUS * 1.8;
      adjustedVx *= 1.3; // Further increase for boulder throw
      adjustedVy *= 1.3; // Further increase for boulder throw
      toast({
        title: "Boulder Throw Active!",
        description: "Your ball is larger and more powerful",
      });
    }
    
    // Create the ball with appropriate properties
    setBall({
      x: startX,
      y: startY,
      vx: adjustedVx,
      vy: adjustedVy,
      radius: adjustedRadius
    });
  };
  
  // Function to update ball position based on physics
  const updateBallPosition = (currentBall: Ball): Ball | null => {
    if (!currentBall) return null;
    
    // Apply gravity and friction
    let friction = FRICTION;
    let gravity = GRAVITY;
    
    // Deep Freeze ability - reduced friction
    if (isAbilityActive && currentMaster?.id === 'berg') {
      friction = 0.995; // Less friction for slippery effect
      gravity = 0.2; // Slightly reduced gravity, but still faster than original
    }
    
    const newVx = currentBall.vx * friction;
    const newVy = currentBall.vy * friction + gravity;
    
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
    
    if (newX < currentBall.radius) {
      finalX = currentBall.radius;
      finalVx = -newVx * BOUNCE_FACTOR;
    } else if (newX > BOARD_WIDTH - currentBall.radius) {
      finalX = BOARD_WIDTH - currentBall.radius;
      finalVx = -newVx * BOUNCE_FACTOR;
    }
    
    // Return updated ball
    return {
      x: finalX,
      y: newY,
      vx: finalVx,
      vy: newVy,
      radius: currentBall.radius
    };
  };
  
  // Animation frame hook for physics simulation with improved frame rate
  useEffect(() => {
    if (!ball) return;
    
    // Use requestAnimationFrame for smoother animations
    let animationFrameId: number;
    let lastTime = performance.now();
    const frameInterval = 1000 / FRAME_RATE;
    
    const gameLoop = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);
      
      const deltaTime = currentTime - lastTime;
      
      // Only update physics at the desired frame rate
      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);
        
        // Check collisions with pegs
        let updatedBall = { ...ball };
        
        // For Luna's ability, only check collisions with non-blue pegs
        const visiblePegs = isAbilityActive && currentMaster?.id === 'luna'
          ? activePegs.filter(peg => peg.type !== 'blue')
          : activePegs;
        
        let hitPegIds: string[] = [];
        
        // Check all pegs for collision
        for (const peg of visiblePegs) {
          if (checkCollision(updatedBall, peg)) {
            updatedBall = handleCollision(updatedBall, peg);
            hitPegIds.push(peg.id);
          }
        }
        
        // Process hits - in reverse to avoid index shifting issues
        for (let i = hitPegIds.length - 1; i >= 0; i--) {
          // For Gnorman's ability, chain reactions to nearby pegs
          if (isAbilityActive && currentMaster?.id === 'gnorman' && activePegs.find(p => p.id === hitPegIds[i])?.type !== 'green') {
            // Find nearby pegs and mark them as hit too
            const hitPeg = activePegs.find(p => p.id === hitPegIds[i]);
            if (hitPeg) {
              const nearbyPegs = activePegs.filter(p => {
                if (!p.active || hitPegIds.includes(p.id)) return false;
                
                const dx = p.x - hitPeg.x;
                const dy = p.y - hitPeg.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                return distance < 80; // Chain reaction distance
              });
              
              // Add these pegs to hit list
              hitPegIds.push(...nearbyPegs.map(p => p.id));
            }
          }
          
          onHitPeg(hitPegIds[i]);
        }
        
        // If we hit a green peg, activate the ability
        const hitGreenPeg = hitPegIds.some(id => {
          const peg = activePegs.find(p => p.id === id);
          return peg && peg.type === 'green';
        });
        
        if (hitGreenPeg) {
          onAbilityActivated();
        }
        
        // Update ball position
        const newBallPosition = updateBallPosition(updatedBall);
        
        // If ball is out of play (null), cancel animation frame
        if (!newBallPosition) {
          cancelAnimationFrame(animationFrameId);
          setBall(null);
          return;
        }
        
        // Update ball state
        setBall(newBallPosition);
      }
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [ball, activePegs, onHitPeg, isAbilityActive, currentMaster, onAbilityActivated]);
  
  // Function to set the aim angle for the trajectory
  const setAim = (angle: number) => {
    setAimAngle(angle);
  };
  
  // Calculate trajectory points for aiming
  const calculateTrajectory = (startX: number, startY: number, angle: number, length: number = trajectoryLength) => {
    const points = [];
    const velocityX = Math.cos(angle) * 10;
    const velocityY = Math.sin(angle) * 10;
    let x = startX;
    let y = startY;
    let vx = velocityX;
    let vy = velocityY;
    
    // Use customized trajectory for super guide
    const trajectoryFriction = isAbilityActive && currentMaster?.id === 'bjorn' ? 0.99 : FRICTION;
    const trajectoryGravity = GRAVITY;
    
    for (let i = 0; i < length; i++) {
      x += vx;
      y += vy;
      vx *= trajectoryFriction;
      vy = vy * trajectoryFriction + trajectoryGravity;
      
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
    calculateTrajectory,
    trajectoryLength
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
