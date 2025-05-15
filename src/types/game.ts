
export type PegType = 'blue' | 'orange' | 'green' | 'purple';

export interface Peg {
  id: string;
  type: PegType;
  x: number;
  y: number;
  radius: number;
  active: boolean;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface Master {
  id: string;
  name: string;
  ability: string;
  description: string;
  color: string;
}

export interface Player {
  id: number;
  name: string;
  score: number;
  master: Master | null;
  shotsLeft: number;
  totalShots: number;
  activePlayer: boolean;
}

export type GamePhase = 'selection' | 'aiming' | 'shooting' | 'waiting' | 'gameOver';

export interface GameState {
  pegs: Peg[];
  players: Player[];
  currentPlayerId: number;
  phase: GamePhase;
  winner: Player | null;
  ballActive: boolean;
  ball: Ball | null;
}
