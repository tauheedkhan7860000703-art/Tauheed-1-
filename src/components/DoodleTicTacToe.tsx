/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, ScoreBoard } from '../types';
import { Sparkles, RefreshCw, User, HelpCircle, Trophy, ArrowLeft } from 'lucide-react';

interface DoodleTicTacToeProps {
  player: Player;
  onGameEnd: (xpGained: number) => void;
  onBack: () => void;
}

type CellValue = 'X' | 'O' | null;

export default function DoodleTicTacToe({ player, onGameEnd, onBack }: DoodleTicTacToeProps) {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [mode, setMode] = useState<'COMPUTER' | 'LOCAL'>('COMPUTER');
  const [difficulty, setDifficulty] = useState<'EASY' | 'SMART'>('SMART');
  const [player2Name, setPlayer2Name] = useState<string>('Doodle Bot');
  const [winnerInfo, setWinnerInfo] = useState<{ winner: CellValue; line: number[] | null }>({ winner: null, line: null });
  const [score, setScore] = useState<{ p1: number; p2: number; draws: number }>({ p1: 0, p2: 0, draws: 0 });
  const [aiIsThinking, setAiIsThinking] = useState<boolean>(false);
  const [doodleBubble, setDoodleBubble] = useState<string>('Can you beat my sketchy brain?');

  const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // Update Opponent name if mode changes
  useEffect(() => {
    if (mode === 'LOCAL') {
      setPlayer2Name('Friend ✏️');
      setDoodleBubble('Challenge your friend on the same desk!');
    } else {
      setPlayer2Name('Doodle Bot 🤖');
      setDoodleBubble('Can you beat my sketchy brain?');
    }
    resetBoardOnly();
  }, [mode]);

  // AI moves when board changes and it is O's turn
  useEffect(() => {
    if (mode === 'COMPUTER' && !isXNext && !winnerInfo.winner && !board.every(cell => cell !== null)) {
      setAiIsThinking(true);
      const timer = setTimeout(() => {
        makeAiMove();
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, mode]);

  const checkWinner = (currentBoard: CellValue[]) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'DRAW' as CellValue, line: null };
    }
    return { winner: null, line: null };
  };

  const handleClick = (index: number) => {
    if (board[index] || winnerInfo.winner || aiIsThinking) return;

    // Human Player moves
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winStatus = checkWinner(newBoard);
    if (winStatus.winner) {
      handleGameEndResult(winStatus);
    } else {
      setIsXNext(!isXNext);
      if (mode === 'LOCAL') {
        const nextUser = !isXNext ? player.name : 'Friend';
        setDoodleBubble(`Your turn, ${nextUser}! Draw carefully!`);
      } else {
        setDoodleBubble('Let me think... what is my next line?');
      }
    }
  };

  const makeAiMove = () => {
    const emptyIndices = board.map((cell, idx) => cell === null ? idx : null).filter(val => val !== null) as number[];
    if (emptyIndices.length === 0) return;

    let targetIndex = emptyIndices[0];

    if (difficulty === 'EASY') {
      // Pick random
      targetIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else {
      // SMART difficulty:
      // 1. Can AI win on this turn?
      let foundMove = false;
      for (const idx of emptyIndices) {
        const testBoard = [...board];
        testBoard[idx] = 'O';
        if (checkWinner(testBoard).winner === 'O') {
          targetIndex = idx;
          foundMove = true;
          break;
        }
      }

      // 2. Can player win on this turn? Block them!
      if (!foundMove) {
        for (const idx of emptyIndices) {
          const testBoard = [...board];
          testBoard[idx] = 'X';
          if (checkWinner(testBoard).winner === 'X') {
            targetIndex = idx;
            foundMove = true;
            break;
          }
        }
      }

      // 3. Take center if available
      if (!foundMove && board[4] === null) {
        targetIndex = 4;
        foundMove = true;
      }

      // 4. Take random corner
      if (!foundMove) {
        const corners = [0, 2, 6, 8].filter(c => board[c] === null);
        if (corners.length > 0) {
          targetIndex = corners[Math.floor(Math.random() * corners.length)];
          foundMove = true;
        }
      }

      // 5. Fallback random
      if (!foundMove) {
        targetIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    }

    const newBoard = [...board];
    newBoard[targetIndex] = 'O';
    setBoard(newBoard);
    setAiIsThinking(false);

    const winStatus = checkWinner(newBoard);
    if (winStatus.winner) {
      handleGameEndResult(winStatus);
    } else {
      setIsXNext(true);
      const comments = [
        "Aha! Check out this sketch!",
        "Block that if you can!",
        "Your move! Make it count!",
        "Is that all you got?",
        "Ah, my lead is beautiful!"
      ];
      setDoodleBubble(comments[Math.floor(Math.random() * comments.length)]);
    }
  };

  const handleGameEndResult = (result: { winner: CellValue; line: number[] | null }) => {
    setWinnerInfo(result);
    if (result.winner === 'X') {
      setScore(prev => ({ ...prev, p1: prev.p1 + 1 }));
      setDoodleBubble(`BOOM! Congrats ${player.name}, you won! 🎉 +20 XP`);
      onGameEnd(20); // Award 20 XP
    } else if (result.winner === 'O') {
      setScore(prev => ({ ...prev, p2: prev.p2 + 1 }));
      if (mode === 'COMPUTER') {
        setDoodleBubble("Victory is mine! Study my doodle path! 🤖");
        onGameEnd(5); // Consolation 5 XP
      } else {
        setDoodleBubble("Friend has won! Excellent pencil skills! ✏️");
        onGameEnd(15);
      }
    } else {
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      setDoodleBubble("It's a draw! Ink was matched perfectly!");
      onGameEnd(10); // Draw 10 XP
    }
  };

  const resetBoardOnly = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo({ winner: null, line: null });
    setAiIsThinking(false);
    if (mode === 'COMPUTER') {
      setDoodleBubble("Fresh slate! Ready to test your pencil?");
    } else {
      setDoodleBubble(`${player.name} vs Friend! Draw your symbols!`);
    }
  };

  const resetScores = () => {
    setScore({ p1: 0, p2: 0, draws: 0 });
    resetBoardOnly();
    setDoodleBubble("Counters wiped clean! Grab your eraser!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2" id="ttt-pane">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 self-start px-3 py-1.5 sketchy-border sketchy-border-sm bg-white text-ink-dark cursor-pointer text-sm font-sans hover:bg-paper-cream hover:rotate-[-2deg] transition-transform duration-150"
          id="btn-on-back-ttt"
        >
          <ArrowLeft className="w-4 h-4 text-ink-red" />
          <span>Back to Lobby</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-3xl font-giggle text-ink-blue inline-block scribble-highlight transform rotate-[-1deg]" id="heading-ttt">
            Sketchy Tic-Tac-Toe
          </h2>
          <p className="text-xs text-pencil-gray font-sans mt-1">
            Draw your path to sketchy domination!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-highlighter-green text-ink-dark border border-dashed border-pencil-gray">
            XP multiplier: x1.5
          </span>
        </div>
      </div>

      {/* Lobby Menu Selection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-4">
        
        {/* Game Mode Selector Widget */}
        <div className="col-span-1 md:col-span-4 space-y-4" id="lobby-selectors">
          <div className="sketchy-border p-4 bg-white sketchy-shadow relative">
            <h3 className="font-hand text-xl text-ink-red border-b border-dashed border-gray-300 pb-1 mb-3">
              ✏️ Game Setting
            </h3>
            
            {/* Play vs choice */}
            <div className="space-y-2 mb-4">
              <label className="text-xs text-pencil-gray font-semibold block uppercase">Opponent Mode:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode('COMPUTER')}
                  className={`py-1 px-2 sketchy-border-sm text-sm cursor-pointer transition-all ${
                    mode === 'COMPUTER' 
                      ? 'bg-ink-blue text-white' 
                      : 'bg-white text-ink-dark hover:bg-paper-cream'
                  }`}
                >
                  Doodle Bot (AI)
                </button>
                <button
                  onClick={() => setMode('LOCAL')}
                  className={`py-1 px-2 sketchy-border-sm text-sm cursor-pointer transition-all ${
                    mode === 'LOCAL' 
                      ? 'bg-ink-blue text-white' 
                      : 'bg-white text-ink-dark hover:bg-paper-cream'
                  }`}
                >
                  Local Friend
                </button>
              </div>
            </div>

            {/* Difficulty selection if vs bot */}
            {mode === 'COMPUTER' && (
              <div className="space-y-2 mb-4">
                <label className="text-xs text-pencil-gray font-semibold block uppercase">Brain Level:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDifficulty('EASY')}
                    className={`py-1 px-1 sketchy-border-sm text-xs cursor-pointer ${
                      difficulty === 'EASY' ? 'bg-highlighter-pink text-ink-dark font-bold' : 'bg-white'
                    }`}
                  >
                    Scribble (Easy)
                  </button>
                  <button
                    onClick={() => setDifficulty('SMART')}
                    className={`py-1 px-1 sketchy-border-sm text-xs cursor-pointer ${
                      difficulty === 'SMART' ? 'bg-highlighter-yellow text-ink-dark font-bold animate-pulse' : 'bg-white'
                    }`}
                  >
                    Brainy (Smart)
                  </button>
                </div>
              </div>
            )}

            {/* Scorecard table */}
            <div className="bg-paper-cream p-2.5 sketchy-border-sm mt-3">
              <div className="text-xs text-pencil-gray font-bold text-center uppercase tracking-wider mb-2">
                📓 Score Pad
              </div>
              <div className="grid grid-cols-3 text-center border-b border-dashed border-ink-dark pb-1 font-mono text-sm font-semibold">
                <div>You</div>
                <div>Draws</div>
                <div>{player2Name.split(' ')[0]}</div>
              </div>
              <div className="grid grid-cols-3 text-center py-2 font-mono text-lg font-bold text-ink-blue">
                <span className="text-ink-dark text-xl">{score.p1}</span>
                <span className="text-pencil-gray">{score.draws}</span>
                <span className="text-ink-red text-xl">{score.p2}</span>
              </div>
              <div className="flex gap-2.5 mt-2 justify-center">
                <button
                  onClick={resetScores}
                  className="text-[10px] uppercase font-bold text-ink-red underline cursor-pointer hover:text-red-700"
                >
                  Reset scoreboard
                </button>
              </div>
            </div>
          </div>

          {/* Artistic character speech bubble */}
          <div className="relative mt-2" id="character-commentary">
            <div className="sketchy-border-blue p-4 bg-paper-cream text-ink-blue text-sm relative rounded-xl font-hand leading-relaxed">
              <div className="absolute top-[-8px] left-[24px] w-4 h-4 bg-paper-cream rotate-45 border-t border-l border-ink-blue"></div>
              <span className="font-bold underline text-ink-dark text-xs block mb-1">
                {mode === 'COMPUTER' ? '✏️ Tauheed Bot:' : '📝 Desk Rules:'}
              </span>
              "{doodleBubble}"
            </div>
          </div>
        </div>

        {/* Dynamic game grid workspace */}
        <div className="col-span-1 md:col-span-8 flex flex-col items-center">
          
          {/* Active status indicator banner */}
          <div className="w-full text-center py-2 mb-3 bg-highlighter-yellow/30 border border-dashed border-ink-dark rounded-lg flex items-center justify-center gap-2 font-hand text-base">
            {winnerInfo.winner ? (
              <span className="text-ink-red font-bold animate-bounce flex items-center gap-1.5">
                <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-200" />
                {winnerInfo.winner === 'DRAW' ? "✏️ It's a Perfect tie!" : `🎉 Winner: ${winnerInfo.winner === 'X' ? player.name : player2Name}!`}
              </span>
            ) : aiIsThinking ? (
              <span className="text-pencil-gray animate-pulse flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-ink-blue" />
                Doodle Bot is drawing its line...
              </span>
            ) : (
              <span className="text-ink-dark">
                Turn indicator: <strong className="text-ink-blue">{isXNext ? player.name : player2Name}</strong> ({isXNext ? 'X' : 'O'})
              </span>
            )}
          </div>

          {/* The Tic Tac Toe Grid */}
          <div className="bg-[#f0ece3] p-4 rounded-2xl sketchy-border sketchy-shadow-blue w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] grid grid-cols-3 gap-3 relative">
            {/* Draw grid borders with lovely messy overlapping layers */}
            {board.map((cell, idx) => {
              const isWinningCell = winnerInfo.line?.includes(idx);
              return (
                <button
                  key={idx}
                  id={`ttt-cell-${idx}`}
                  onClick={() => handleClick(idx)}
                  disabled={cell !== null || winnerInfo.winner !== null || aiIsThinking}
                  className={`w-full h-full bg-white sketchy-border-sm cursor-pointer transition-all duration-150 flex items-center justify-center relative overflow-hidden group hover:scale-[1.03] ${
                    isWinningCell 
                      ? 'bg-highlighter-yellow/80 border-ink-red shadow-[0_0_12px_rgba(234,179,8,0.4)]' 
                      : cell === null ? 'hover:bg-paper-cream' : ''
                  }`}
                >
                  {/* Draw beautiful custom Vector doodles inside */}
                  {cell === 'X' && (
                    <svg className="w-10 h-10 sm:w-16 sm:h-16 stroke-ink-blue stroke-[3.5]" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4 L20 20" className="draw-path" strokeLinecap="round" />
                      <path d="M20 4 L4 20" className="draw-path" strokeLinecap="round" style={{ animationDelay: '0.2s' }} />
                    </svg>
                  )}
                  {cell === 'O' && (
                    <svg className="w-10 h-10 sm:w-16 sm:h-16 stroke-ink-red stroke-[3]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="8" className="draw-path" strokeLinecap="round" strokeDasharray="100 100" />
                    </svg>
                  )}
                  {cell === null && !winnerInfo.winner && !aiIsThinking && (
                    <span className="opacity-0 group-hover:opacity-20 text-xs font-mono text-pencil-gray uppercase select-none">
                      {isXNext ? 'X' : 'O'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Command controls under game */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={resetBoardOnly}
              className="flex items-center gap-2 px-5 py-2 px-6 bg-highlighter-green hover:bg-green-200 text-ink-dark font-bold font-sans sketchy-border sketchy-shadow-blue cursor-pointer text-sm hover:rotate-[1.5deg] active:scale-95 transition-transform duration-100"
              id="btn-ttt-restart"
            >
              <RefreshCw className="w-4 h-4 text-ink-blue" />
              <span>{winnerInfo.winner ? 'Draw New Grid' : 'Wipe Clean & Retry'}</span>
            </button>
          </div>

          <div className="text-center font-mono text-[10px] text-pencil-gray mt-5 max-w-sm">
            💡 Doodle Trick: Computer Bot blocks your columns first. Try attacking corners in diagonal crossbars!
          </div>
        </div>

      </div>
    </div>
  );
}
