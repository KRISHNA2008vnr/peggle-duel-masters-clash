
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useGamePhysics, getPointsForPegType, BOARD_WIDTH, BOARD_HEIGHT } from '../hooks/useGameLogic';
import { toast } from '@/hooks/use-toast';
import Peg from './Peg';
import Ball from './Ball';
import MasterAvatar from './MasterAvatar';

const LAUNCHER_Y = 50; // Position of the launcher at the top

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const [aimPosition, setAimPosition] = useState({ x: BOARD_WIDTH / 2, y: LAUNCHER_Y });
  const [isAbilityActive, setIsAbilityActive] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Get current player and their master
  const currentPlayer = state.players.find(p => p.id === state.currentPlayerId);
  const currentMaster = currentPlayer?.master || null;
  
  // Reset ability when changing players
  useEffect(() => {
    setIsAbilityActive(false);
  }, [state.currentPlayerId]);
  
  // Handle peg hit event
  const handleHitPeg = (pegId: string) => {
    const hitPeg = state.pegs.find(peg => peg.id === pegId);
    if (hitPeg && hitPeg.active) {
      const points = getPointsForPegType(hitPeg.type);
      
      // Apply purple peg multiplier
      let finalPoints = points;
      if (hitPeg.type === 'purple') {
        finalPoints = points * 2; // Double points for purple pegs
        
        toast({
          title: "Multiplier Activated!",
          description: `${finalPoints} points (2x bonus)`,
          variant: "default",
        });
      }
      
      dispatch({ type: 'HIT_PEG', pegId, points: finalPoints });
    }
  };
  
  // Handle ability activation
  const handleAbilityActivated = () => {
    if (currentMaster) {
      toast({
        title: `${currentMaster.ability} Activated!`,
        description: currentMaster.description,
        variant: "default",
      });
      
      setIsAbilityActive(true);
      
      // Ability lasts for the current shot only
      setTimeout(() => {
        dispatch({ type: 'ACTIVATE_ABILITY', masterId: currentMaster.id });
      }, 100);
    }
  };
  
  // Initialize game physics
  const { ball, launchBall, setAim, aimAngle, calculateTrajectory, trajectoryLength } = useGamePhysics(
    state.pegs.filter(peg => peg.active),
    currentMaster,
    isAbilityActive,
    handleHitPeg,
    handleAbilityActivated
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
        setIsAbilityActive(false);
      }, 1500);
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
    
    // Play sound effect
    playSound('launch');
  };
  
  // Play sound effects
  const playSound = (type: 'launch' | 'hit' | 'ability') => {
    // In a real implementation, this would play actual sounds
    console.log(`Playing ${type} sound`);
  };
  
  // Calculate trajectory for display
  const trajectoryPoints = calculateTrajectory(aimPosition.x, aimPosition.y, aimAngle, trajectoryLength);
  
  return (
    <div 
      ref={boardRef}
      data-game-board
      className="relative bg-gradient-to-b from-peggle-background to-purple-900 rounded-lg shadow-xl overflow-hidden"
      style={{ width: `${BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-purple-900/40"></div>
      
      {/* Pegs */}
      {state.pegs.map(peg => (
        <Peg key={peg.id} peg={peg} />
      ))}
      
      {/* Ball */}
      <Ball ball={state.ball} />
      
      {/* Launcher */}
      <div 
        className={`
          absolute bg-white rounded-full border-2 border-gray-400 shadow-lg
          ${state.phase === 'aiming' ? 'animate-pulse' : ''}
        `}
        style={{
          width: '24px',
          height: '24px',
          left: `${aimPosition.x - 12}px`,
          top: `${aimPosition.y - 12}px`,
          zIndex: 10
        }}
      />
      
      {/* Trajectory guide */}
      {state.phase === 'aiming' && !state.ballActive && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <polyline
            points={trajectoryPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={isAbilityActive && currentMaster?.id === 'bjorn' ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 255, 255, 0.5)'}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      )}
      
      {/* Player indicators */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center">
        {/* Player 1 indicator */}
        <div className={`flex items-center space-x-2 p-2 rounded-lg ${state.currentPlayerId === 1 ? 'bg-blue-600/70' : 'bg-gray-800/30'}`}>
          <MasterAvatar
            master={state.players[0].master}
            isActive={state.currentPlayerId === 1}
            isAbilityActive={state.currentPlayerId === 1 && isAbilityActive}
          />
          <div>
            <div className="text-white font-bold">{state.players[0].name}</div>
            <div className="text-xs text-white/70">Shots: {state.players[0].shotsLeft}/{state.players[0].totalShots}</div>
          </div>
        </div>
        
        {/* Player 2 indicator */}
        <div className={`flex items-center space-x-2 p-2 rounded-lg ${state.currentPlayerId === 2 ? 'bg-red-600/70' : 'bg-gray-800/30'}`}>
          <div className="text-right">
            <div className="text-white font-bold">{state.players[1].name}</div>
            <div className="text-xs text-white/70">Shots: {state.players[1].shotsLeft}/{state.players[1].totalShots}</div>
          </div>
          <MasterAvatar
            master={state.players[1].master}
            isActive={state.currentPlayerId === 2}
            isAbilityActive={state.currentPlayerId === 2 && isAbilityActive}
          />
        </div>
      </div>
      
      {/* Game phase indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-2 rounded-full text-white font-semibold">
        {state.phase === 'aiming' ? 
          'Click to shoot' : 
          state.phase === 'shooting' ? 
          'Ball in play...' : 
          'Switching players...'}
      </div>
      
      {/* Special effects container */}
      <div id="effects-container" className="absolute inset-0 pointer-events-none"></div>
    </div>
  );
};

export default GameBoard;
