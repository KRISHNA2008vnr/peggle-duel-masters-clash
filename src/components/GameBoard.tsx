
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useGamePhysics, getPointsForPegType, BOARD_WIDTH, BOARD_HEIGHT } from '../hooks/useGameLogic';
import Peg from './Peg';
import Ball from './Ball';

const LAUNCHER_Y = 50; // Position of the launcher at the top

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const [aimPosition, setAimPosition] = useState({ x: BOARD_WIDTH / 2, y: LAUNCHER_Y });
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Handle peg hit event
  const handleHitPeg = (pegId: string) => {
    const hitPeg = state.pegs.find(peg => peg.id === pegId);
    if (hitPeg && hitPeg.active) {
      const points = getPointsForPegType(hitPeg.type);
      dispatch({ type: 'HIT_PEG', pegId, points });
      
      if (hitPeg.type === 'green') {
        // Trigger master ability
        const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
        if (currentPlayer?.master) {
          dispatch({ type: 'ACTIVATE_ABILITY', masterId: currentPlayer.master.id });
        }
      }
    }
  };
  
  // Initialize game physics
  const { ball, launchBall, setAim, aimAngle, calculateTrajectory } = useGamePhysics(
    state.pegs.filter(peg => peg.active),
    handleHitPeg
  );
  
  // Update ball position in game state
  useEffect(() => {
    if (state.phase === 'shooting' && ball) {
      dispatch({ type: 'UPDATE_BALL', ball });
    } else if (state.phase === 'shooting' && !ball && state.ballActive) {
      // Ball has fallen out of play
      dispatch({ type: 'END_TURN' });
      
      // After a short delay, switch players
      setTimeout(() => {
        dispatch({ type: 'SWITCH_PLAYER' });
      }, 1000);
    }
  }, [ball, state.phase, state.ballActive, dispatch]);
  
  // Handle mouse move for aiming
  const handleMouseMove = (e: React.MouseEvent) => {
    if (state.phase !== 'aiming' || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate angle for aiming
    const dx = mouseX - aimPosition.x;
    const dy = mouseY - aimPosition.y;
    const angle = Math.atan2(dy, dx);
    
    // Update aim
    setAim(angle);
  };
  
  // Handle mouse click for shooting
  const handleMouseClick = () => {
    if (state.phase !== 'aiming' || state.ballActive) return;
    
    // Set phase to shooting
    dispatch({ type: 'SET_PHASE', phase: 'shooting' });
    
    // Calculate initial velocity based on aim angle
    const power = 15; // Adjust power as needed
    const vx = Math.cos(aimAngle) * power;
    const vy = Math.sin(aimAngle) * power;
    
    // Launch ball
    launchBall(aimPosition.x, aimPosition.y, vx, vy);
  };
  
  // Calculate trajectory for display
  const trajectoryPoints = calculateTrajectory(aimPosition.x, aimPosition.y, aimAngle);
  
  return (
    <div 
      ref={boardRef}
      className="relative bg-peggle-background rounded-lg shadow-xl overflow-hidden"
      style={{ width: `${BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
    >
      {/* Pegs */}
      {state.pegs.map(peg => (
        <Peg key={peg.id} peg={peg} />
      ))}
      
      {/* Ball */}
      <Ball ball={state.ball} />
      
      {/* Launcher */}
      <div 
        className="absolute bg-white rounded-full border-2 border-gray-400"
        style={{
          width: '20px',
          height: '20px',
          left: `${aimPosition.x - 10}px`,
          top: `${aimPosition.y - 10}px`,
          zIndex: 10
        }}
      />
      
      {/* Trajectory guide */}
      {state.phase === 'aiming' && !state.ballActive && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <polyline
            points={trajectoryPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      )}
      
      {/* Current player indicator */}
      <div className="absolute top-2 left-2 bg-white/20 px-4 py-2 rounded-full text-white font-semibold">
        {state.players.find(p => p.id === state.currentPlayerId)?.name}'s turn
      </div>
    </div>
  );
};

export default GameBoard;
