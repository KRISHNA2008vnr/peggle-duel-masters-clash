
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useGamePhysics, getPointsForPegType, BOARD_WIDTH, BOARD_HEIGHT } from '../hooks/useGameLogic';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import Peg from './Peg';
import Ball from './Ball';
import MasterAvatar from './MasterAvatar';

const LAUNCHER_Y = 50; // Position of the launcher at the top

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const [aimPosition, setAimPosition] = useState({ x: BOARD_WIDTH / 2, y: LAUNCHER_Y });
  const [isAbilityActive, setIsAbilityActive] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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
        
        // Add visual effect for multiplier
        if (boardRef.current) {
          const effectElement = document.createElement('div');
          effectElement.className = 'absolute text-yellow-300 font-bold text-2xl animate-fade-out z-30';
          effectElement.style.left = `${hitPeg.x}px`;
          effectElement.style.top = `${hitPeg.y - 30}px`;
          effectElement.textContent = 'x2';
          
          boardRef.current.appendChild(effectElement);
          
          // Remove effect after animation
          setTimeout(() => {
            if (effectElement.parentNode) {
              effectElement.parentNode.removeChild(effectElement);
            }
          }, 1000);
        }
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
  
  // Initialize game physics with higher FPS
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
  
  // Handle mouse/touch move for aiming
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (state.phase !== 'aiming' || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    let pointerX, pointerY;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      pointerX = e.touches[0].clientX - rect.left;
      pointerY = e.touches[0].clientY - rect.top;
    } else {
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    }
    
    // Calculate angle for aiming
    const dx = pointerX - aimPosition.x;
    const dy = pointerY - aimPosition.y;
    const angle = Math.atan2(dy, dx);
    
    // Update aim
    setAim(angle);
  };
  
  // Handle click/touch for shooting
  const handlePointerUp = () => {
    if (state.phase !== 'aiming' || state.ballActive) return;
    
    // Set phase to shooting
    dispatch({ type: 'SET_PHASE', phase: 'shooting' });
    
    // Calculate initial velocity based on aim angle with increased power
    const power = 20; // Increased from 15 for faster initial launch
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
      className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-blue-800"
      style={{ 
        width: `${BOARD_WIDTH}px`, 
        height: `${BOARD_HEIGHT}px`,
        backgroundImage: 'linear-gradient(180deg, rgba(100,130,220,0.8) 0%, rgba(70,90,180,0.8) 100%)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3), 0 0 30px rgba(0,0,255,0.3)',
        maxWidth: '100vw',
        maxHeight: isMobile ? '70vh' : '90vh',
        transform: isMobile ? 'scale(0.9)' : 'none'
      }}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onClick={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" 
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
           }}>
      </div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300/80 via-transparent to-transparent"></div>
      </div>
      
      {/* Pegs */}
      {state.pegs.map(peg => (
        <Peg key={peg.id} peg={peg} />
      ))}
      
      {/* Ball */}
      <Ball ball={state.ball} />
      
      {/* Launcher */}
      <div 
        className={`
          absolute z-30
          ${state.phase === 'aiming' ? 'animate-pulse' : ''}
        `}
        style={{
          width: '30px',
          height: '30px',
          left: `${aimPosition.x - 15}px`,
          top: `${aimPosition.y - 15}px`,
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(230,230,240,1) 60%, rgba(200,200,210,0.8) 100%)',
          borderRadius: '50%',
          border: '2px solid rgba(150,150,170,0.8)',
          boxShadow: '0 0 15px rgba(255,255,255,0.8), inset 0 0 8px rgba(0,0,0,0.2)'
        }}
      >
        <div className="absolute inset-0 rounded-full border border-white/30"></div>
      </div>
      
      {/* Trajectory guide */}
      {state.phase === 'aiming' && !state.ballActive && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
          <defs>
            <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
            </linearGradient>
          </defs>
          <polyline
            points={trajectoryPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={isAbilityActive && currentMaster?.id === 'bjorn' ? 'url(#trajectoryGradient)' : 'rgba(255, 255, 255, 0.5)'}
            strokeWidth="2"
            strokeDasharray="5,5"
            strokeLinecap="round"
          />
        </svg>
      )}
      
      {/* Game UI - Side panels */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-blue-900 to-blue-800 border-r-2 border-blue-700 opacity-80 z-30"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-900 to-blue-800 border-l-2 border-blue-700 opacity-80 z-30"></div>
      
      {/* Player indicators */}
      <div className="absolute top-2 left-20 right-20 flex justify-between items-center z-40">
        {/* Player 1 indicator */}
        <div className={`
          flex items-center space-x-2 p-2 rounded-lg
          ${state.currentPlayerId === 1 ? 
            'bg-gradient-to-r from-blue-600/90 to-blue-800/90 border border-blue-400 shadow-lg' :
            'bg-gradient-to-r from-gray-700/70 to-gray-900/70 border border-gray-600'}
        `}>
          <MasterAvatar
            master={state.players[0].master}
            isActive={state.currentPlayerId === 1}
            isAbilityActive={state.currentPlayerId === 1 && isAbilityActive}
          />
          <div className="ml-2">
            <div className="text-white font-bold text-shadow drop-shadow-md">{state.players[0].name}</div>
            <div className="text-xs font-medium text-blue-200">Shots: {state.players[0].shotsLeft}/{state.players[0].totalShots}</div>
            <div className="text-xs font-medium text-yellow-200 mt-1">Score: {state.players[0].score}</div>
          </div>
        </div>
        
        {/* Player 2 indicator */}
        <div className={`
          flex items-center space-x-2 p-2 rounded-lg
          ${state.currentPlayerId === 2 ? 
            'bg-gradient-to-r from-red-600/90 to-red-800/90 border border-red-400 shadow-lg' :
            'bg-gradient-to-r from-gray-700/70 to-gray-900/70 border border-gray-600'}
        `}>
          <div className="mr-2 text-right">
            <div className="text-white font-bold text-shadow drop-shadow-md">{state.players[1].name}</div>
            <div className="text-xs font-medium text-red-200">Shots: {state.players[1].shotsLeft}/{state.players[1].totalShots}</div>
            <div className="text-xs font-medium text-yellow-200 mt-1">Score: {state.players[1].score}</div>
          </div>
          <MasterAvatar
            master={state.players[1].master}
            isActive={state.currentPlayerId === 2}
            isAbilityActive={state.currentPlayerId === 2 && isAbilityActive}
          />
        </div>
      </div>
      
      {/* Game phase indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-gradient-to-r from-blue-900/90 to-indigo-900/90 border-2 border-blue-500/50 px-6 py-2 rounded-full">
          <div className="text-white font-bold text-shadow drop-shadow-lg flex items-center">
            {state.phase === 'aiming' ? 
              'Click to shoot' : 
              state.phase === 'shooting' ? 
              'Ball in play...' : 
              'Switching players...'}
          </div>
        </div>
      </div>
      
      {/* Ball count indicator */}
      <div className="absolute top-4 left-4 flex flex-col items-center z-40">
        <div className="bg-gradient-to-b from-blue-700 to-blue-900 border-2 border-blue-500 p-2 rounded-lg shadow-lg">
          <div className="text-white font-bold text-xl">
            {currentPlayer?.shotsLeft || 0}
          </div>
          <div className="text-xs text-blue-200 mt-1">Balls</div>
        </div>
      </div>
      
      {/* Score multiplier indicator */}
      <div className="absolute top-4 right-4 flex flex-col items-center z-40">
        <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 border-2 border-yellow-500 p-2 rounded-lg shadow-lg">
          <div className="text-yellow-300 font-bold text-xl flex items-center justify-center">
            x1
          </div>
          <div className="text-xs text-yellow-200 mt-1">Multiplier</div>
        </div>
      </div>
      
      {/* Special effects container */}
      <div id="effects-container" className="absolute inset-0 pointer-events-none z-50"></div>
      
      {/* Bottom bucket/catcher */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-t-2 border-blue-700 z-30"></div>
    </div>
  );
};

export default GameBoard;
