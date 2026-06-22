/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { Sparkles, Trophy, ArrowLeft, RefreshCw, EyeOff, ShieldCheck, Heart } from 'lucide-react';

interface DoodleRPSProps {
  player: Player;
  onGameEnd: (xpGained: number) => void;
  onBack: () => void;
}

type Choice = 'ROCK' | 'PAPER' | 'SCISSORS';

const CHOICES: Choice[] = ['ROCK', 'PAPER', 'SCISSORS'];

const EXPLANATIONS = {
  'ROCK-SCISSORS': 'Rock smashes Scissors! 💥',
  'PAPER-ROCK': 'Paper wraps Rock! 📄',
  'SCISSORS-PAPER': 'Scissors cuts Paper! ✂️',
};

export default function DoodleRPS({ player, onGameEnd, onBack }: DoodleRPSProps) {
  const [gameMode, setGameMode] = useState<'COMPUTER' | 'FRIEND'>('COMPUTER');
  
  // Game state
  const [p1Choice, setP1Choice] = useState<Choice | null>(null);
  const [p2Choice, setP2Choice] = useState<Choice | null>(null);
  const [isP1ChoiceHidden, setIsP1ChoiceHidden] = useState<boolean>(false);
  const [roundResult, setRoundResult] = useState<string>('');
  const [winnerMessage, setWinnerMessage] = useState<string>('');
  
  // Scoreboard
  const [score, setScore] = useState<{ p1: number; p2: number; ties: number }>({ p1: 0, p2: 0, ties: 0 });
  const [bubbleText, setBubbleText] = useState<string>("Can you predict my ink flow?");
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // SVG doodle sketches for hands
  const renderHandDoodle = (choice: Choice, isOpponent: boolean = false) => {
    const flipClass = isOpponent ? 'scale-x-[-1]' : '';
    switch (choice) {
      case 'ROCK':
        return (
          <svg className={`w-24 h-24 stroke-ink-dark stroke-[2.5] fill-paper-cream animate-float ${flipClass}`} viewBox="0 0 100 100">
            {/* Hand-drawn fist */}
            <path d="M 30,50 C 30,35 45,35 45,50 C 45,35 60,35 60,50 C 60,35 75,35 75,50 C 75,40 85,45 80,65 C 75,80 50,85 30,80 C 20,70 25,55 30,50 Z" />
            <path d="M 30,50 Q 20,40 18,52" />
            {/* Details */}
            <path d="M 45,50 Q 40,65 42,75" />
            <path d="M 60,50 Q 58,65 58,74" />
            <path d="M 75,50 Q 72,62 70,70" />
            {/* Wrist */}
            <path d="M 32,80 L 25,95 M 55,83 L 50,96" strokeDasharray="3 3" />
          </svg>
        );
      case 'PAPER':
        return (
          <svg className={`w-24 h-24 stroke-ink-blue stroke-[2.5] fill-paper-cream animate-float ${flipClass}`} viewBox="0 0 100 100">
            {/* Palm & Fingers flat extended */}
            <path d="M 25,75 L 12,65 A 6,6 0 0,1 20,55 L 30,62 L 32,25 A 6,6 0 0,1 44,25 L 44,55 L 46,18 A 6,6 0 0,1 58,18 L 58,55 L 60,22 A 6,6 0 0,1 72,22 L 72,55 L 74,32 A 6,6 0 0,1 86,32 L 82,75 C 80,85 50,92 25,75 Z" />
            {/* Palm creases */}
            <path d="M 35,68 Q 50,75 65,68" />
            <path d="M 40,73 Q 50,80 60,74" />
          </svg>
        );
      case 'SCISSORS':
        return (
          <svg className={`w-24 h-24 stroke-ink-red stroke-[2.5] fill-paper-cream animate-float ${flipClass}`} viewBox="0 0 100 100">
            {/* Scissors peace hand */}
            <path d="M 25,75 C 18,65 22,50 32,55 L 35,58 L 28,15 A 6,6 0 0,1 40,15 L 48,50 L 58,12 A 6,6 0 0,1 70,12 L 64,55 L 74,58 C 82,62 80,72 74,80 C 65,90 40,88 25,75 Z" />
            {/* Folded fingers */}
            <path d="M 44,53 C 44,65 56,65 56,53" />
            <path d="M 52,60 Q 56,68 62,64" />
          </svg>
        );
      default:
        return null;
    }
  };

  const playRound = (playerChoice: Choice, opponentChoice: Choice) => {
    setIsShaking(true);
    setBubbleText("Ready... Set... DRAW!");

    setTimeout(() => {
      setIsShaking(false);
      setP1Choice(playerChoice);
      setP2Choice(opponentChoice);

      if (playerChoice === opponentChoice) {
        setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
        setRoundResult('TIE');
        setWinnerMessage("Great minds scribble alike! It's a draw.");
        setBubbleText("Tied! Our inks collided perfectly.");
        onGameEnd(5); // 5 XP for tie
      } else if (
        (playerChoice === 'ROCK' && opponentChoice === 'SCISSORS') ||
        (playerChoice === 'PAPER' && opponentChoice === 'ROCK') ||
        (playerChoice === 'SCISSORS' && opponentChoice === 'PAPER')
      ) {
        setScore(prev => ({ ...prev, p1: prev.p1 + 1 }));
        setRoundResult('PLAYER1');
        const comboKey = `${playerChoice}-${opponentChoice}` as keyof typeof EXPLANATIONS;
        setWinnerMessage(`${player.name} wins! ${EXPLANATIONS[comboKey] || ''}`);
        setBubbleText(`Argh! Your ${playerChoice.toLowerCase()} was too strong! 🎉 +15 XP`);
        onGameEnd(15); // 15 XP for win
      } else {
        setScore(prev => ({ ...prev, p2: prev.p2 + 1 }));
        setRoundResult('PLAYER2');
        const comboKey = `${opponentChoice}-${playerChoice}` as keyof typeof EXPLANATIONS;
        const oppName = gameMode === 'COMPUTER' ? 'Doodle Bot' : 'Friend';
        setWinnerMessage(`${oppName} wins! ${EXPLANATIONS[comboKey] || ''}`);
        setBubbleText(`Haha! My ${opponentChoice.toLowerCase()} wrapped you block-by-block!`);
        onGameEnd(5); // 5 XP consolation
      }
    }, 600);
  };

  // Human click
  const handleP1Select = (choice: Choice) => {
    if (isShaking) return;

    if (gameMode === 'COMPUTER') {
      const botChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
      playRound(choice, botChoice);
    } else {
      // Local friend play
      setP1Choice(choice);
      setIsP1ChoiceHidden(true);
      setBubbleText("P1 selection locked! Secretly pass the notepad to P2!");
    }
  };

  const handleP2Select = (choice: Choice) => {
    if (!p1Choice) return;
    setIsP1ChoiceHidden(false);
    playRound(p1Choice, choice);
  };

  const resetRound = () => {
    setP1Choice(null);
    setP2Choice(null);
    setIsP1ChoiceHidden(false);
    setRoundResult('');
    setWinnerMessage('');
    setBubbleText(gameMode === 'COMPUTER' ? "Go for 3 wins! Grab your pencil!" : "Play face-to-face! Turn the screen!");
  };

  const resetAllRpsScores = () => {
    setScore({ p1: 0, p2: 0, ties: 0 });
    resetRound();
  };

  // Change mode trigger
  useEffect(() => {
    resetAllRpsScores();
  }, [gameMode]);

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2" id="rps-window">
      {/* Top action pane */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 self-start px-3 py-1.5 sketchy-border sketchy-border-sm bg-white text-ink-dark cursor-pointer text-sm font-sans hover:bg-paper-cream hover:rotate-[-2deg] transition-transform duration-150"
          id="btn-back-rps"
        >
          <ArrowLeft className="w-4 h-4 text-ink-red" />
          <span>Back to Lobby</span>
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-giggle text-ink-red inline-block scribble-highlight-pink transform rotate-[1.5deg]" id="heading-rps">
            Pencil, Paper, Scissors!
          </h2>
          <p className="text-xs text-pencil-gray font-sans mt-1">
            Fast strokes, clever strategies, and instant paper action!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-highlighter-pink text-ink-dark border border-dashed border-pencil-gray">
            XP multiplier: x1.0
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-4">
        {/* Settings and rules column */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          <div className="sketchy-border p-4 bg-white sketchy-shadow-red relative">
            <h3 className="font-hand text-xl text-ink-blue border-b border-dashed border-gray-300 pb-1 mb-3">
              📝 Battle Rules
            </h3>

            {/* Game mode selection */}
            <div className="space-y-2 mb-4">
              <label className="text-xs text-pencil-gray font-semibold block uppercase">Battle Opponent:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGameMode('COMPUTER')}
                  className={`py-1 px-1 sketchy-border-sm text-xs cursor-pointer ${
                    gameMode === 'COMPUTER' ? 'bg-ink-red text-white' : 'bg-white text-ink-dark'
                  }`}
                >
                  Tauheed Bot
                </button>
                <button
                  onClick={() => setGameMode('FRIEND')}
                  className={`py-1 px-1 sketchy-border-sm text-xs cursor-pointer ${
                    gameMode === 'FRIEND' ? 'bg-ink-red text-white' : 'bg-white text-ink-dark'
                  }`}
                >
                  Local Friend ✏️
                </button>
              </div>
            </div>

            {/* Match scorecard */}
            <div className="bg-paper-cream p-3 sketchy-border-sm">
              <div className="text-xs text-pencil-gray font-bold text-center uppercase tracking-wider mb-2">
                📓 Match Counters
              </div>
              <div className="grid grid-cols-3 text-center border-b border-dashed border-ink-dark pb-1 font-mono text-xs font-semibold">
                <div>You</div>
                <div>Draws</div>
                <div>{gameMode === 'COMPUTER' ? 'Bot' : 'Friend'}</div>
              </div>
              <div className="grid grid-cols-3 text-center py-2 font-mono text-xl font-bold text-ink-blue">
                <span className="text-ink-dark">{score.p1}</span>
                <span className="text-pencil-gray text-base">{score.ties}</span>
                <span className="text-ink-red">{score.p2}</span>
              </div>
              <div className="flex gap-2 justify-center mt-1">
                <button
                  onClick={resetAllRpsScores}
                  className="text-[10px] uppercase font-bold text-ink-blue underline cursor-pointer hover:text-blue-700"
                >
                  Reset scores
                </button>
              </div>
            </div>
          </div>

          {/* Sketchy Speech bubble */}
          <div className="relative mt-2" id="commentary-rps">
            <div className="sketchy-border p-4 bg-[#fdfaf2] text-ink-dark text-sm relative rounded-xl font-hand leading-relaxed">
              <div className="absolute top-[-8px] left-[24px] w-4 h-4 bg-[#fdfaf2] rotate-45 border-t border-l border-ink-dark"></div>
              <span className="font-bold underline text-ink-blue text-xs block mb-1">
                {gameMode === 'COMPUTER' ? '🤖 Tauheed AI Bot:' : '✍️ Pencil Referee:'}
              </span>
              "{bubbleText}"
            </div>
          </div>
        </div>

        {/* Play interface column */}
        <div className="col-span-1 md:col-span-8 flex flex-col items-center">
          
          {/* Main Visualizer Area */}
          <div className="w-full h-64 bg-white sketchy-border sketchy-shadow-red relative overflow-hidden flex items-center justify-around p-4" id="battle-field">
            
            {/* Grid Notebook Texture Lines */}
            <div className="absolute inset-0 paper-grid opacity-30 pointer-events-none"></div>
            
            {/* Red binder margin line typical of real notebook pads */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l border-red-300 pointer-events-none"></div>

            {/* SHAKING ACTION STATE */}
            {isShaking ? (
              <div className="flex flex-col items-center gap-3 animate-bounce">
                <div className="flex gap-12">
                  <div className="transform rotate-[-20deg] scale-110 active:rotate-[20deg] transition-all">
                    {renderHandDoodle('ROCK', false)}
                  </div>
                  <div className="transform rotate-[20deg] scale-x-[-1] scale-110">
                    {renderHandDoodle('ROCK', true)}
                  </div>
                </div>
                <div className="font-hand text-xl text-pencil-gray font-bold uppercase tracking-widest animate-pulse">
                  Stroking Pencil...
                </div>
              </div>
            ) : (
              <>
                {/* Player 1 Selection Output */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs bg-ink-blue text-white font-mono px-2 py-0.5 rounded uppercase mb-2">
                    {player.name}
                  </span>
                  
                  {isP1ChoiceHidden ? (
                    <div className="w-24 h-24 bg-paper-cream sketchy-border-sm flex flex-col items-center justify-center p-2 text-center animate-pulse">
                      <EyeOff className="w-8 h-8 text-ink-red mb-1" />
                      <span className="text-[10px] font-mono text-pencil-gray uppercase font-semibold">
                        Scribbled Secret
                      </span>
                    </div>
                  ) : p1Choice ? (
                    renderHandDoodle(p1Choice, false)
                  ) : (
                    <div className="w-24 h-24 sketchy-border-sm border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-xs text-center font-hand">
                      Waiting for pencil sketch...
                    </div>
                  )}

                  {p1Choice && (
                    <span className="text-sm font-hand text-ink-blue font-bold mt-1 text-center">
                      Picked: {p1Choice}
                    </span>
                  )}
                </div>

                {/* VS Scribble Graphic Divider */}
                <div className="flex flex-col items-center justify-center relative">
                  <div className="w-10 h-10 rounded-full bg-ink-red text-white flex items-center justify-center font-giggle text-lg border-2 border-ink-dark shadow-md z-10 transform rotate-12">
                    VS
                  </div>
                  <div className="h-20 w-0.5 bg-dashed border-l border-pencil-gray absolute"></div>
                </div>

                {/* Opponent Selection (Player 2 or Bot) Output */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs bg-ink-red text-white font-mono px-2 py-0.5 rounded uppercase mb-2">
                    {gameMode === 'COMPUTER' ? 'Doodle Bot' : 'Friend player'}
                  </span>

                  {p2Choice ? (
                    renderHandDoodle(p2Choice, true)
                  ) : (
                    <div className="w-24 h-24 sketchy-border-sm border-dashed border-gray-300 flex items-center justify-center text-gray-300 text-xs text-center font-hand">
                      Waiting for scribble...
                    </div>
                  )}

                  {p2Choice && (
                    <span className="text-sm font-hand text-ink-red font-bold mt-1 text-center">
                      Picked: {p2Choice}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Winner Text Overlay at the bottom of the board */}
            {winnerMessage && (
              <div className="absolute bottom-2 left-0 right-0 text-center bg-highlighter-yellow py-1 border-t border-b border-ink-dark font-hand text-base font-bold animate-pulse text-indigo-900 shadow">
                {winnerMessage}
              </div>
            )}
          </div>

          {/* ACTIVE GAME PLAY SELECTION CONTROLS */}
          <div className="mt-8 w-full">
            
            {/* STEP 1: PLAYER 1 CHOOSES */}
            {!p1Choice && (
              <div className="text-center">
                <p className="text-sm font-sans font-bold text-ink-dark mb-3">
                  {player.name}, draw your tactical shape:
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {CHOICES.map(choice => (
                    <button
                      key={choice}
                      onClick={() => handleP1Select(choice)}
                      className="flex flex-col items-center p-3 sm:py-4 bg-white sketchy-border-blue doodle-hover cursor-pointer"
                    >
                      {choice === 'ROCK' && '✊ Rock'}
                      {choice === 'PAPER' && '✋ Paper'}
                      {choice === 'SCISSORS' && '✌️ Scissors'}
                      <span className="text-[10px] font-mono mt-1 text-pencil-gray">Sketch it!</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: LOCAL FRIEND PLAY - DEVICE HANDOVER WITH CONFIDENTIALITY COVER */}
            {gameMode === 'FRIEND' && p1Choice && isP1ChoiceHidden && (
              <div className="p-4 bg-paper-cream sketchy-border text-center max-w-md mx-auto animate-float">
                <p className="font-hand text-lg text-ink-red font-bold mb-3">
                  🕵️ Secret Pencil Handoff!
                </p>
                <p className="text-xs text-pencil-gray mb-4">
                  Pass the device to your physical friend. Make sure you don't peek at previous ink drawings!
                </p>
                <div className="w-full p-2 border-t border-dashed border-gray-300 pt-3">
                  <p className="text-sm font-bold text-ink-dark mb-2">Friend's turn! Select secretly:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {CHOICES.map(choice => (
                      <button
                        key={`friend-${choice}`}
                        onClick={() => handleP2Select(choice)}
                        className="py-2.5 bg-white sketchy-border-red hover:bg-red-50 text-xs font-bold cursor-pointer"
                      >
                        {choice === 'ROCK' ? '✊ Rock' : choice === 'PAPER' ? '✋ Paper' : '✌️ Scissors'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ROUND END REWIPE & CLEAN */}
            {p1Choice && p2Choice && !isP1ChoiceHidden && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={resetRound}
                  className="flex items-center gap-2 px-6 py-2 bg-highlighter-green hover:bg-green-100 text-ink-dark font-sans font-bold sketchy-border sketchy-shadow cursor-pointer text-sm"
                  id="btn-rps-next"
                >
                  <RefreshCw className="w-4 h-4 text-ink-blue" />
                  <span>Next Doodle Throw</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-center font-mono text-[10px] text-pencil-gray mt-6 max-w-sm">
            💡 Doodle Fun: Rock beats scissors, scissors cuts paper, paper blinds rock. Standard pencils have deep memories!
          </div>
        </div>

      </div>
    </div>
  );
}
