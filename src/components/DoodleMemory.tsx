/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { Sparkles, Trophy, ArrowLeft, RefreshCw, Landmark, Brain, Timer } from 'lucide-react';

interface DoodleMemoryProps {
  player: Player;
  onGameEnd: (xpGained: number) => void;
  onBack: () => void;
}

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ['🎨', '🚀', '💡', '☕', '⚡', '🍦', '❤️', '🌟'];

export default function DoodleMemory({ player, onGameEnd, onBack }: DoodleMemoryProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [gameMode, setGameMode] = useState<'SOLO' | 'VS_BOT'>('SOLO');
  const [currentTurn, setCurrentTurn] = useState<'PLAYER' | 'BOT'>('PLAYER');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [scores, setScores] = useState<{ player: number; bot: number }>({ player: 0, bot: 0 });
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isBoardLocked, setIsBoardLocked] = useState<boolean>(false);
  const [bubbleComments, setBubbleComments] = useState<string>("Click two cards to find sketchy pairs! Memory is muscles!");
  
  // Bot memory bank: stores [symbol] -> set of indexes where it has seen this symbol
  const [botSeenCards, setBotSeenCards] = useState<{ [symbol: string]: number[] }>({});

  const initializeCards = () => {
    // Duplicate symbols for pairs & shuffle
    const pairedSymbols = [...SYMBOLS, ...SYMBOLS];
    const shuffled = pairedSymbols
      .map((sym, index) => ({ id: index, symbol: sym, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setSelectedIdxs([]);
    setTurns(0);
    setTimeLeft(60);
    setScores({ player: 0, bot: 0 });
    setBotSeenCards({});
    setCurrentTurn('PLAYER');
    setIsGameActive(true);
    setIsBoardLocked(false);
    setBubbleComments(gameMode === 'SOLO' ? "Game started! Beat the 60 seconds clock!" : "Draw first! Bot is watching closely.");
  };

  useEffect(() => {
    initializeCards();
  }, [gameMode]);

  // Solo timer tick
  useEffect(() => {
    if (!isGameActive || gameMode !== 'SOLO') return;

    if (timeLeft <= 0) {
      handleGameOver(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isGameActive, gameMode]);

  // Handle player card clicks
  const handleCardClick = (index: number) => {
    if (isBoardLocked || cards[index].isFlipped || cards[index].isMatched || (gameMode === 'VS_BOT' && currentTurn === 'BOT')) {
      return;
    }

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    // Save symbol inside bot's memory bank
    const symbol = cards[index].symbol;
    updateBotMemory(symbol, index);

    const newSelected = [...selectedIdxs, index];
    setSelectedIdxs(newSelected);

    if (newSelected.length === 2) {
      setIsBoardLocked(true);
      setTurns(prev => prev + 1);
      
      const [firstIdx, secondIdx] = newSelected;
      
      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Matched!
        setTimeout(() => {
          const matchedBoard = [...updated];
          matchedBoard[firstIdx].isMatched = true;
          matchedBoard[secondIdx].isMatched = true;
          setCards(matchedBoard);
          setSelectedIdxs([]);
          setIsBoardLocked(false);

          if (gameMode === 'VS_BOT') {
            setScores(prev => ({ ...prev, player: prev.player + 1 }));
            setBubbleComments("Excellent match! Keep drawing!");
            // Player gets another turn in vs_bot for a successful match!
          } else {
            setBubbleComments("Nice matching eyes! Find another pair!");
          }

          // Check win condition
          if (matchedBoard.every(c => c.isMatched)) {
            handleGameOver(true);
          }
        }, 600);
      } else {
        // Did not match
        setTimeout(() => {
          const resetBoard = [...updated];
          resetBoard[firstIdx].isFlipped = false;
          resetBoard[secondIdx].isFlipped = false;
          setCards(resetBoard);
          setSelectedIdxs([]);
          
          if (gameMode === 'VS_BOT') {
            setCurrentTurn('BOT');
            setBubbleComments("Darn, no match. Handing pencil over to Doodle bot!");
          } else {
            setBubbleComments("Ah! Keep looking, the canvas was different.");
          }
          setIsBoardLocked(false);
        }, 1100);
      }
    }
  };

  // Bot logic
  useEffect(() => {
    if (gameMode === 'VS_BOT' && currentTurn === 'BOT' && isGameActive && !isBoardLocked) {
      setIsBoardLocked(true);
      const thinkTime = 1200 + Math.random() * 800;
      
      setTimeout(() => {
        makeBotMove();
      }, thinkTime);
    }
  }, [currentTurn, gameMode, isGameActive, isBoardLocked]);

  const makeBotMove = () => {
    const unMatchedCards = cards.map((c, i) => c.isMatched ? null : i).filter(v => v !== null) as number[];
    if (unMatchedCards.length === 0) return;

    // 1. Check bot memory for existing unmatched pairs it remembers both indices of
    let choiceOneIdx = -1;
    let choiceTwoIdx = -1;

    for (const symbol in botSeenCards) {
      const idxs = botSeenCards[symbol].filter(i => !cards[i].isMatched);
      if (idxs.length >= 2) {
        // Bot remembers where two matching cards are!
        choiceOneIdx = idxs[0];
        choiceTwoIdx = idxs[1];
        break;
      }
    }

    // 2. If no full pair in memory but can remember one seen card of a pair:
    if (choiceOneIdx === -1) {
      // Pick a random card first
      const randomIdx = unMatchedCards[Math.floor(Math.random() * unMatchedCards.length)];
      const symbolOfFirst = cards[randomIdx].symbol;

      // Check if we remember having seen that symbol elsewhere
      const rememberedIndices = botSeenCards[symbolOfFirst]?.filter(i => i !== randomIdx && !cards[i].isMatched) || [];
      
      if (rememberedIndices.length > 0) {
        // Bot remembers!
        choiceOneIdx = randomIdx;
        choiceTwoIdx = rememberedIndices[0];
      } else {
        // Pick first as random, second as another completely random
        choiceOneIdx = randomIdx;
        const remainder = unMatchedCards.filter(i => i !== randomIdx);
        choiceTwoIdx = remainder[Math.floor(Math.random() * remainder.length)];
      }
    }

    // Flip choice one
    const updated = [...cards];
    updated[choiceOneIdx].isFlipped = true;
    setCards(updated);
    updateBotMemory(cards[choiceOneIdx].symbol, choiceOneIdx);

    // After mini delay, flip choice two
    setTimeout(() => {
      const updatedDouble = [...updated];
      updatedDouble[choiceTwoIdx].isFlipped = true;
      setCards(updatedDouble);
      updateBotMemory(cards[choiceTwoIdx].symbol, choiceTwoIdx);

      // Verifymatch
      if (cards[choiceOneIdx].symbol === cards[choiceTwoIdx].symbol) {
        // Match!
        setTimeout(() => {
          const matchedBoard = [...updatedDouble];
          matchedBoard[choiceOneIdx].isMatched = true;
          matchedBoard[choiceTwoIdx].isMatched = true;
          setCards(matchedBoard);
          setScores(prev => ({ ...prev, bot: prev.bot + 1 }));
          
          const praises = [
            "Boasting brain! bot matching 🌟",
            "Aha, my sketchy memory recalled that!",
            "Point for the machine!",
            "Bingo! Found that doodle card."
          ];
          setBubbleComments(praises[Math.floor(Math.random() * praises.length)]);
          setIsBoardLocked(false);

          // Bot keeps turn upon matching
          if (matchedBoard.every(c => c.isMatched)) {
            handleGameOver(true);
          } else {
            // Keep matching
            setCurrentTurn('BOT');
          }
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          const resetBoard = [...updatedDouble];
          resetBoard[choiceOneIdx].isFlipped = false;
          resetBoard[choiceTwoIdx].isFlipped = false;
          setCards(resetBoard);
          setCurrentTurn('PLAYER');
          setBubbleComments("Doodle bot missed! Your turn with the pencil!");
          setIsBoardLocked(false);
        }, 1100);
      }
    }, 850);
  };

  const updateBotMemory = (symbol: string, index: number) => {
    setBotSeenCards(prev => {
      const current = prev[symbol] || [];
      if (!current.includes(index)) {
        return { ...prev, [symbol]: [...current, index] };
      }
      return prev;
    });
  };

  const handleGameOver = (allMatched: boolean) => {
    setIsGameActive(false);
    if (gameMode === 'SOLO') {
      if (allMatched) {
        // Player won solo!
        const xp = Math.max(10, timeLeft / 2) + 15;
        const xpGained = Math.round(xp);
        setBubbleComments(`🎉 VICTORY! Solved grid with ${timeLeft} seconds left! +${xpGained} XP awarded!`);
        onGameEnd(xpGained);
      } else {
        setBubbleComments("⏳ Out of time! Pencils down! Try matching cards faster!");
        onGameEnd(5); // 5 XP consolation
      }
    } else {
      // vs Bot
      if (scores.player > scores.bot) {
        setBubbleComments(`💥 VICTORY! You defeated Doodle Bot ${scores.player} to ${scores.bot}! +25 XP!`);
        onGameEnd(25);
      } else if (scores.player < scores.bot) {
        setBubbleComments(`Doodle Bot wins ${scores.bot} to ${scores.player}! Try another memory match!`);
        onGameEnd(8);
      } else {
        setBubbleComments(`A perfect tie! Both brains matched ${scores.player} cards. Perfect balance!`);
        onGameEnd(12);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2" id="memory-pane">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 self-start px-3 py-1.5 sketchy-border sketchy-border-sm bg-white text-ink-dark cursor-pointer text-sm font-sans hover:bg-paper-cream hover:rotate-[-2deg]"
          id="btn-on-back-mem"
        >
          <ArrowLeft className="w-4 h-4 text-ink-red" />
          <span>Back to Lobby</span>
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-giggle text-ink-blue inline-block scribble-highlight transform rotate-[-0.5deg]" id="heading-mem">
            Sketch Memory Match
          </h2>
          <p className="text-xs text-pencil-gray font-sans mt-1">
            Turn over doodle tiles and memorize where they sketch!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-highlighter-green text-ink-dark border border-dashed border-pencil-gray">
            XP multiplier: x1.2
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-4">
        {/* Settings sidepanel */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          <div className="sketchy-border p-4 bg-white sketchy-shadow-blue relative">
            <h3 className="font-hand text-xl text-ink-red border-b border-dashed border-gray-300 pb-1 mb-3">
              🧠 Brain Mode
            </h3>

            {/* Choose match style */}
            <div className="space-y-1 mb-4">
              <label className="text-xs text-pencil-gray font-semibold block uppercase">Target Match Style:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGameMode('SOLO')}
                  className={`py-1 px-1.5 sketchy-border-sm text-xs cursor-pointer ${
                    gameMode === 'SOLO' ? 'bg-ink-blue text-white' : 'bg-white text-ink-dark'
                  }`}
                >
                  Solo Beat the Clock
                </button>
                <button
                  onClick={() => setGameMode('VS_BOT')}
                  className={`py-1 px-1.5 sketchy-border-sm text-xs cursor-pointer ${
                    gameMode === 'VS_BOT' ? 'bg-ink-blue text-white' : 'bg-white text-ink-dark'
                  }`}
                >
                  Vs Doodle Bot 🤖
                </button>
              </div>
            </div>

            {/* Scorecard panel */}
            <div className="bg-paper-cream p-3 sketchy-border-sm space-y-2">
              {gameMode === 'SOLO' ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-pencil-gray font-hand flex items-center gap-1">
                      <Timer className="w-4 h-4 text-ink-red" /> Timer limit:
                    </span>
                    <span className={`font-mono font-bold text-lg ${timeLeft < 15 ? 'text-ink-red animate-pulse font-extrabold' : 'text-ink-dark'}`}>
                      {timeLeft} sec
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-dashed border-gray-300 pt-1.5">
                    <span className="text-pencil-gray font-sans">Turns spent:</span>
                    <span className="font-mono text-ink-dark">{turns} attempts</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-center font-bold font-mono text-[10px] text-pencil-gray uppercase tracking-wider mb-1">
                    📖 Memory Ledger
                  </div>
                  <div className="grid grid-cols-2 text-center border-b border-dashed border-gray-300 pb-1 text-xs">
                    <div className="text-ink-blue font-bold">You</div>
                    <div className="text-ink-red font-bold">Doodle Bot</div>
                  </div>
                  <div className="grid grid-cols-2 text-center py-1 font-mono text-lg font-bold">
                    <span className="text-ink-dark">{scores.player} pairs</span>
                    <span className="text-ink-red">{scores.bot} pairs</span>
                  </div>
                  <div className="text-center text-[10.5px] border-t border-dashed border-gray-200 pt-1">
                    Active Turn: <strong className="text-ink-blue">{currentTurn === 'PLAYER' ? 'Your Turn' : 'Bot Brain'}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dialogue commentary */}
          <div className="relative mt-2" id="commentary-mem">
            <div className="sketchy-border p-4 bg-[#fbfdfb] text-ink-dark text-xs relative rounded-xl font-hand leading-relaxed">
              <div className="absolute top-[-8px] left-[24px] w-4 h-4 bg-[#fbfdfb] rotate-45 border-t border-l border-ink-dark"></div>
              <span className="font-bold underline text-ink-red text-[11px] block mb-1">
                💬 Teacher Tauheed Bot:
              </span>
              "{bubbleComments}"
            </div>
          </div>
        </div>

        {/* Play workspace view column */}
        <div className="col-span-1 md:col-span-8 flex flex-col items-center">
          
          {/* Active board area */}
          <div className="bg-paper-cream w-full max-w-[420px] aspect-square p-4 rounded-2xl sketchy-border sketchy-shadow relative overflow-hidden flex items-center justify-center">
            
            {/* Real aesthetic notebook sheet grids */}
            <div className="absolute inset-0 paper-grid opacity-30 pointer-events-none"></div>

            {/* Left red margin line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l border-red-300 pointer-events-none opacity-50"></div>

            {/* GAME OVER CARD BLOCK overlay */}
            {!isGameActive && (
              <div className="z-20 text-center px-6 py-8 bg-white/95 sketchy-border max-w-xs mx-auto animate-float">
                <div className="w-12 h-12 bg-highlighter-yellow rounded-full flex items-center justify-center mx-auto mb-2 border border-dashed border-ink-dark">
                  <Brain className="w-6 h-6 text-ink-blue" />
                </div>
                <h4 className="font-hand text-lg font-bold text-ink-dark mb-1">Grid Solved / Settled!</h4>
                <p className="text-[11px] text-pencil-gray mb-3 leading-relaxed font-sans">
                  The boards have been erased and are ready for clean chalk pencils.
                </p>
                <button
                  onClick={initializeCards}
                  className="px-5 py-1.5 bg-highlighter-green text-xs font-sans font-bold sketchy-border-sm cursor-pointer"
                  id="btn-mem-start-fresh"
                >
                  Shuffle New Deck
                </button>
              </div>
            )}

            {/* ACTIVE CARD ROW RENDER */}
            {isGameActive && (
              <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-3">
                {cards.map((card, idx) => {
                  const isRevealed = card.isFlipped || card.isMatched;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      disabled={isRevealed || isBoardLocked || (gameMode === 'VS_BOT' && currentTurn === 'BOT')}
                      className={`w-full h-full sketchy-border-sm flex items-center justify-center relative cursor-pointer font-giggle text-3xl transition-all duration-300 transform rounded-lg select-none ${
                        isRevealed 
                          ? 'bg-white rotate-y-180 sketchy-border-sm-blue text-ink-blue' 
                          : 'bg-ink-dark text-white hover:bg-pencil-gray hover:scale-105 active:scale-95 shadow-[3px_4px_0px_0px_#222]'
                      }`}
                      id={`mem-card-${idx}`}
                    >
                      {isRevealed ? (
                        <span className="flex items-center justify-center animate-pulse">{card.symbol}</span>
                      ) : (
                        /* Sketchy notebook cover design for card back */
                        <svg className="w-6 h-6 stroke-white stroke-[1.5] opacity-60" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
                          <path d="M9 9l6 6M15 9l-6 6" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick controls underneath */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={initializeCards}
              className="flex items-center gap-2 px-5 py-2 bg-highlighter-blue hover:bg-blue-100 text-ink-dark font-sans font-bold sketchy-border sketchy-shadow cursor-pointer text-sm"
              id="btn-mem-reshuffle"
            >
              <RefreshCw className="w-4 h-4 text-ink-red" />
              <span>Reshuffle Board</span>
            </button>
          </div>

          <div className="text-center font-mono text-[10px] text-pencil-gray mt-5 max-w-sm">
            💡 Doodle Trick: Doodle Bot memorizes every matched card you flip! Try matching things immediately before the bot plays.
          </div>
        </div>

      </div>
    </div>
  );
}
