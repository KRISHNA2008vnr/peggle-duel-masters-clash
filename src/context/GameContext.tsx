
import React, { createContext, useContext, useReducer, useState } from 'react';
import { GameState, Player, Master, Peg, Ball, GamePhase } from '../types/game';
import { generateRandomLayout } from '../hooks/useGameLogic';
import PlayerNameModal from '../components/PlayerNameModal';

// Masters data with abilities
const masters: Master[] = [
  {
    id: 'bjorn',
    name: 'Bjorn the Unicorn',
    ability: 'Super Guide',
    description: 'Displays an extended trajectory path for accurate aiming.',
    color: 'master-bjorn'
  },
  {
    id: 'gnorman',
    name: 'Gnorman the Gnome',
    ability: 'Uber Volt',
    description: 'Electrifies pegs, causing chain reactions.',
    color: 'master-gnorman'
  },
  {
    id: 'luna',
    name: 'Luna the Ghost',
    ability: 'Nightshade',
    description: 'Blue pegs become invisible, allowing strategic shots.',
    color: 'master-luna'
  },
  {
    id: 'jeff',
    name: 'Jeff the Troll',
    ability: 'Boulder Throw',
    description: 'Heavy boulder destroys multiple pegs in a single shot.',
    color: 'master-jeff'
  },
  {
    id: 'berg',
    name: 'Berg the Yeti',
    ability: 'Deep Freeze',
    description: 'Freezes the board, making pegs slide instead of bounce.',
    color: 'master-berg'
  }
];

// Initial state
const initialState: GameState = {
  pegs: [],
  players: [
    {
      id: 1,
      name: 'Player 1',
      score: 0,
      master: null,
      shotsLeft: 10,
      totalShots: 10,
      activePlayer: true
    },
    {
      id: 2,
      name: 'Player 2',
      score: 0,
      master: null,
      shotsLeft: 10,
      totalShots: 10,
      activePlayer: false
    }
  ],
  currentPlayerId: 1,
  phase: 'selection',
  winner: null,
  ballActive: false,
  ball: null
};

// Action types
type Action = 
  | { type: 'SELECT_MASTER', playerId: number, master: Master }
  | { type: 'START_GAME' }
  | { type: 'SETUP_BOARD', pegs: Peg[] }
  | { type: 'UPDATE_BALL', ball: Ball }
  | { type: 'SWITCH_PLAYER' }
  | { type: 'SET_PHASE', phase: GamePhase }
  | { type: 'HIT_PEG', pegId: string, points: number }
  | { type: 'ACTIVATE_ABILITY', masterId: string }
  | { type: 'END_TURN' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_PLAYER_NAMES', player1Name: string, player2Name: string };

// Reducer
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SELECT_MASTER':
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.playerId ? { ...player, master: action.master } : player
        )
      };
    
    case 'SET_PLAYER_NAMES':
      return {
        ...state,
        players: [
          { ...state.players[0], name: action.player1Name },
          { ...state.players[1], name: action.player2Name }
        ]
      };
    
    case 'START_GAME':
      return {
        ...state,
        phase: 'aiming',
        pegs: generateRandomLayout({ green: 2, purple: 3 }) // Generate with specific special peg counts
      };
      
    case 'SETUP_BOARD':
      return {
        ...state,
        pegs: action.pegs
      };

    case 'UPDATE_BALL':
      return {
        ...state,
        ball: action.ball,
        ballActive: true
      };
      
    case 'SWITCH_PLAYER':
      return {
        ...state,
        currentPlayerId: state.currentPlayerId === 1 ? 2 : 1,
        players: state.players.map(player => ({
          ...player,
          activePlayer: player.id !== state.currentPlayerId
        })),
        ballActive: false,
        ball: null,
        phase: 'aiming'
      };
      
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.phase
      };
      
    case 'HIT_PEG':
      // Find the peg that was hit
      const hitPeg = state.pegs.find(peg => peg.id === action.pegId);
      if (!hitPeg || !hitPeg.active) return state;
      
      // Calculate points based on peg type
      let points = action.points;
      
      // Update current player's score
      const updatedPlayers = state.players.map(player => 
        player.id === state.currentPlayerId 
          ? { ...player, score: player.score + points } 
          : player
      );
      
      // Update pegs to mark the hit peg as inactive
      const updatedPegs = state.pegs.map(peg => 
        peg.id === action.pegId ? { ...peg, active: false } : peg
      );
      
      return {
        ...state,
        pegs: updatedPegs,
        players: updatedPlayers
      };
      
    case 'ACTIVATE_ABILITY':
      // In a full implementation, we'd have more complex ability logic here
      return state;
      
    case 'END_TURN':
      // Decrease shots left for current player
      const playersAfterTurn = state.players.map(player => 
        player.id === state.currentPlayerId 
          ? { ...player, shotsLeft: player.shotsLeft - 1 } 
          : player
      );
      
      // Check if the game is over
      const allShotsUsed = playersAfterTurn.every(player => player.shotsLeft === 0);
      
      if (allShotsUsed) {
        // Determine the winner
        const player1 = playersAfterTurn.find(p => p.id === 1)!;
        const player2 = playersAfterTurn.find(p => p.id === 2)!;
        let winner = null;
        
        if (player1.score > player2.score) {
          winner = player1;
        } else if (player2.score > player1.score) {
          winner = player2;
        } else {
          // It's a tie, but we'll handle this in the UI
          winner = null;
        }
        
        return {
          ...state,
          players: playersAfterTurn,
          phase: 'gameOver',
          winner,
          ballActive: false,
          ball: null
        };
      }
      
      return {
        ...state,
        players: playersAfterTurn,
        phase: 'waiting',
        ballActive: false
      };
      
    case 'END_GAME':
      return {
        ...state,
        phase: 'gameOver',
        ballActive: false
      };
      
    case 'RESET_GAME':
      return {
        ...initialState,
        players: [
          {
            id: 1,
            name: state.players[0].name, // Keep player names
            score: 0,
            master: null,
            shotsLeft: 10,
            totalShots: 10,
            activePlayer: true
          },
          {
            id: 2,
            name: state.players[1].name, // Keep player names
            score: 0,
            master: null,
            shotsLeft: 10,
            totalShots: 10,
            activePlayer: false
          }
        ]
      };
      
    default:
      return state;
  }
}

// Create the context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
  masters: Master[];
}>({
  state: initialState,
  dispatch: () => null,
  masters: masters
});

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [showPlayerNameModal, setShowPlayerNameModal] = useState(true);
  
  const handlePlayerNames = (player1Name: string, player2Name: string) => {
    dispatch({ type: 'SET_PLAYER_NAMES', player1Name, player2Name });
    setShowPlayerNameModal(false);
  };
  
  return (
    <GameContext.Provider value={{ state, dispatch, masters }}>
      <PlayerNameModal 
        open={showPlayerNameModal} 
        onSubmit={handlePlayerNames} 
      />
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
