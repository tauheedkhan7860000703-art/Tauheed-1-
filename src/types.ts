/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameType = 'TIC_TAC_TOE' | 'SNAKE' | 'ROCK_PAPER_SCI_SPOCK' | 'MEMORY_MATCH' | 'NONE';

export type GameMode = 'COMPUTER' | 'LOCAL_FRIEND';

export interface Player {
  name: string;
  gender: 'boy' | 'girl' | 'ninja' | 'sketcher';
  avatarId: string;
  totalXP: number;
  gamesPlayed: { [key in GameType]?: number };
  highScores: { [key in GameType]?: number };
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  xpValue: number;
}

export interface ScoreBoard {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  draws: number;
}
