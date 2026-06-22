/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { Sparkles, Trophy, ArrowLeft, RotateCcw, Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DoodleSnakeProps {
  player: Player;
  onGameEnd: (xpGained: number) => void;
  onBack: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Position {
  x: number;
  y: number;
}

const BOARD_SIZE = 15; // 15x15 grid
const SPEED_CONFIGS = {
  EASY: 200,
  MEDIUM: 140,
  FAST: 90
};

export default function DoodleSnake({ player, onGameEnd, onBack }: DoodleSnakeProps) {
  const [snake, setSnake] = useState<Position[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 }
  ]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [nextDir, setNextDir] = useState<Direction>('UP');
  const [food, setFood] = useState<Position>({ x: 3, y: 3 });
  const [foodType, setFoodType] = useState<'APPLE' | 'STRAWBERRY' | 'BANANA' | 'CHERRY' | 'ORANGE' | 'GRAPE'>('APPLE');
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('IDLE');
  const [speed, setSpeed] = useState<keyof typeof SPEED_CONFIGS>('MEDIUM');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('doodle_snake_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [bubbleComments, setBubbleComments] = useState<string>("Feed the snake but avoid the red binder line!");

  const lastTickedDirRef = useRef<Direction>('UP');

  // Keep state sync ref to read latest values inside our stable loop
  const stateRef = useRef({
    snake,
    direction,
    nextDir,
    food,
    foodType,
    currentScore,
    gameState,
    speed
  });

  useEffect(() => {
    stateRef.current = {
      snake,
      direction,
      nextDir,
      food,
      foodType,
      currentScore,
      gameState,
      speed
    };
  }, [snake, direction, nextDir, food, foodType, currentScore, gameState, speed]);

  const isOpposite = (d1: Direction, d2: Direction) => {
    if (d1 === 'UP' && d2 === 'DOWN') return true;
    if (d1 === 'DOWN' && d2 === 'UP') return true;
    if (d1 === 'LEFT' && d2 === 'RIGHT') return true;
    if (d1 === 'RIGHT' && d2 === 'LEFT') return true;
    return false;
  };

  const trySetDirection = (newDir: Direction) => {
    const lastTicked = lastTickedDirRef.current;
    if (!isOpposite(newDir, lastTicked)) {
      setNextDir(newDir);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          trySetDirection('UP');
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          trySetDirection('DOWN');
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          trySetDirection('LEFT');
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          trySetDirection('RIGHT');
          e.preventDefault();
          break;
        case ' ':
          togglePause();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const generateFoodRandom = (currentSnake: Position[]) => {
    let attempts = 0;
    while (attempts < 200) {
      const rx = Math.floor(Math.random() * BOARD_SIZE);
      const ry = Math.floor(Math.random() * BOARD_SIZE);
      const conflict = currentSnake.some(s => s.x === rx && s.y === ry);
      if (!conflict) {
        setFood({ x: rx, y: ry });
        const types: ('APPLE' | 'STRAWBERRY' | 'BANANA' | 'CHERRY' | 'ORANGE' | 'GRAPE')[] = [
          'APPLE', 'STRAWBERRY', 'BANANA', 'CHERRY', 'ORANGE', 'GRAPE'
        ];
        setFoodType(types[Math.floor(Math.random() * types.length)]);
        return;
      }
      attempts++;
    }
    // Fallback safe position
    setFood({ x: 1, y: 1 });
  };

  // Stable Game tick loop running strictly in interval timing
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const ms = SPEED_CONFIGS[speed];
    const interval = setInterval(() => {
      const current = stateRef.current;
      
      // Update direction states
      const activeDir = current.nextDir;
      setDirection(activeDir);
      lastTickedDirRef.current = activeDir;

      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        // Move head in actual queued direction
        switch (activeDir) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Boundary hit checks
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setTimeout(() => handleGameOver(), 0);
          return prevSnake;
        }

        // Self hit check
        const hitSelf = prevSnake.some((seg) => seg.x === head.x && seg.y === head.y);
        if (hitSelf) {
          setTimeout(() => handleGameOver(), 0);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food hit check
        const currentFood = current.food;
        if (head.x === currentFood.x && head.y === currentFood.y) {
          let scoreInc = 10;
          let fruitName = "Apple";
          let emoji = "🍎";
          
          if (current.foodType === 'STRAWBERRY') { scoreInc = 15; fruitName = "Strawberry"; emoji = "🍓"; }
          else if (current.foodType === 'BANANA') { scoreInc = 15; fruitName = "Banana"; emoji = "🍌"; }
          else if (current.foodType === 'CHERRY') { scoreInc = 25; fruitName = "Cherries"; emoji = "🍒"; }
          else if (current.foodType === 'ORANGE') { scoreInc = 20; fruitName = "Orange"; emoji = "🍊"; }
          else if (current.foodType === 'GRAPE') { scoreInc = 30; fruitName = "Grapes"; emoji = "🍇"; }

          setCurrentScore((prevScore) => {
            const nextScore = prevScore + scoreInc;
            const comments = [
              `Munch! That ${fruitName} was juicy and sweet! ${emoji}`,
              `Healthy snake diet! Loved the ${fruitName}! ${emoji}`,
              `Doodle snake grew longer after swallowing a whole ${fruitName}! ${emoji}`,
              `Crunch crunch... tasty ${fruitName} fuel! ${emoji}`,
              `Slippery green python snack power: +${scoreInc} points!`
            ];
            setBubbleComments(comments[Math.floor(Math.random() * comments.length)]);
            return nextScore;
          });

          generateFoodRandom(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, ms);

    return () => clearInterval(interval);
  }, [gameState, speed]);

  const handleGameOver = () => {
    setGameState('GAMEOVER');
    
    // We fetch and store score correctly
    const current = stateRef.current;
    const finalScore = current.currentScore;
    
    const savedHighScore = localStorage.getItem('doodle_snake_highscore');
    const prevHigh = savedHighScore ? parseInt(savedHighScore, 10) : 0;

    if (finalScore > prevHigh) {
      setHighScore(finalScore);
      localStorage.setItem('doodle_snake_highscore', finalScore.toString());
      setBubbleComments(`🏆 NEW REGISTER DECLARED! You scored ${finalScore}! Unbelievable Sketching!`);
    } else {
      setBubbleComments(`Oof! You collided with a binder outline! Final Score: ${finalScore}. Try again!`);
    }

    // Transfer game rewards
    const gainedXp = Math.floor(finalScore / 2) + 5; 
    onGameEnd(gainedXp);
  };

  const startNewGame = () => {
    const initialSnake = [
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 7, y: 9 }
    ];
    setSnake(initialSnake);
    setDirection('UP');
    setNextDir('UP');
    lastTickedDirRef.current = 'UP';
    setCurrentScore(0);
    generateFoodRandom(initialSnake);
    setGameState('PLAYING');
    setBubbleComments("Wiggle-wiggle! Use Arrow Keys or the hand-sketched pad below to crawl!");
  };

  const togglePause = () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      setBubbleComments("Time frozen! Take a breath and relax your hand.");
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
      setBubbleComments("Repositioned! Let's resume the crawl!");
    }
  };

  const handleKeyPadChange = (dir: Direction) => {
    if (gameState !== 'PLAYING') return;
    trySetDirection(dir);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2" id="snake-pane">
      {/* Page header controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 self-start px-3 py-1.5 sketchy-border sketchy-border-sm bg-white text-ink-dark cursor-pointer text-sm font-sans hover:bg-paper-cream hover:rotate-[-2deg]"
          id="btn-back-snake"
        >
          <ArrowLeft className="w-4 h-4 text-ink-red" />
          <span>Back to Lobby</span>
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-giggle text-ink-blue inline-block scribble-highlight transform rotate-[1deg]" id="heading-snake">
            Scribble Snake Game
          </h2>
          <p className="text-xs text-pencil-gray font-sans mt-1">
            Chomp sketchy treats and expand your ink tail length!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-highlighter-green text-ink-dark border border-dashed border-pencil-gray">
            XP multiplier: x2.0
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
        {/* Settings widget and keypad controls */}
        <div className="col-span-1 lg:col-span-4 space-y-4">
          <div className="sketchy-border p-4 bg-white sketchy-shadow relative">
            <h3 className="font-hand text-xl text-ink-red border-b border-dashed border-gray-300 pb-1 mb-3">
              🐍 Snake Game Lab
            </h3>

            {/* Speed settings config */}
            <div className="space-y-1 mb-4">
              <label className="text-xs text-pencil-gray font-semibold block uppercase">Crawl Speed:</label>
              <div className="grid grid-cols-3 gap-1">
                {(['EASY', 'MEDIUM', 'FAST'] as const).map(s => (
                  <button
                    key={s}
                    disabled={gameState === 'PLAYING'}
                    onClick={() => setSpeed(s)}
                    className={`py-1 text-xs sketchy-border-sm cursor-pointer ${
                      speed === s ? 'bg-ink-blue text-white font-bold' : 'bg-white text-ink-dark disabled:opacity-40'
                    }`}
                  >
                    {s === 'EASY' ? 'Slow' : s === 'MEDIUM' ? 'Avg' : 'Turbo'}
                  </button>
                ))}
              </div>
              {gameState === 'PLAYING' && (
                <span className="text-[10px] text-pencil-gray text-center block">
                  Speed locked while wiggling
                </span>
              )}
            </div>

            {/* Dynamic ledger metrics */}
            <div className="bg-paper-cream p-3 sketchy-border-sm space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-pencil-gray font-hand">Ink length:</span>
                <span className="font-mono font-bold text-ink-red">{snake.length} segments</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-dashed border-gray-300 pt-1.5">
                <span className="text-pencil-gray font-hand">Match Points:</span>
                <span className="font-mono font-bold text-ink-blue text-base">{currentScore} pts</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-dashed border-gray-300 pt-1.5 bg-yellow-50 px-1 py-0.5 rounded">
                <span className="text-pencil-gray font-hand flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500 fill-yellow-200" />
                  All-time High:
                </span>
                <span className="font-mono font-bold text-indigo-900 text-base">{highScore} pts</span>
              </div>
            </div>
          </div>

          {/* Teacher assistant bubble advice */}
          <div className="relative mt-2" id="commentary-snake">
            <div className="sketchy-border p-4 bg-[#fdfdf6] text-ink-dark text-xs relative rounded-xl font-hand leading-relaxed">
              <div className="absolute top-[-8px] left-[24px] w-4 h-4 bg-[#fdfdf6] rotate-45 border-t border-l border-ink-dark"></div>
              <span className="font-bold underline text-ink-red text-[11px] block mb-1">
                🐍 Snake Game Guide:
              </span>
              "{bubbleComments}"
            </div>
          </div>
        </div>

        {/* Game view column */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-center">
          
          {/* Active play field */}
          <div className="bg-paper-cream w-full max-w-[380px] sm:max-w-[420px] aspect-square rounded-2xl sketchy-border sketchy-shadow-blue relative overflow-hidden flex flex-col items-center justify-center">
            
            {/* Real aesthetic notebook sheet grids */}
            <div className="absolute inset-0 paper-grid opacity-50 pointer-events-none"></div>

            {/* Left red double binder margin */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 border-l border-red-300 pointer-events-none opacity-60"></div>

            {/* GAME BOARD DRAWING REGION */}
            {gameState === 'IDLE' && (
              <div className="z-10 text-center px-6 py-8 bg-white/95 sketchy-border-sm max-w-xs mx-auto animate-float">
                <div className="w-16 h-16 bg-highlighter-yellow rounded-full flex items-center justify-center mx-auto mb-3 border border-dashed border-ink-dark">
                  <Play className="w-8 h-8 text-ink-blue fill-ink-blue ml-1" />
                </div>
                <h4 className="font-hand text-xl font-bold text-ink-dark mb-1">Scribble Arena Ready</h4>
                <p className="text-xs text-pencil-gray mb-4 font-sans">
                  The snake is starving of ink points! Move using arrow keys or on-screen keys.
                </p>
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-highlighter-green hover:bg-green-100 text-ink-dark font-sans font-bold sketchy-border-sm cursor-pointer text-sm"
                  id="btn-play-starts-snake"
                >
                  Draw Snake!
                </button>
              </div>
            )}

            {gameState === 'PAUSED' && (
              <div className="z-10 text-center px-6 py-8 bg-white/95 sketchy-border-sm max-w-xs mx-auto">
                <h4 className="font-hand text-xl font-bold text-ink-red mb-1">Crawl Suspended</h4>
                <p className="text-xs text-pencil-gray mb-4 font-sans">
                  Current score: {currentScore} points locked!
                </p>
                <button
                  onClick={togglePause}
                  className="px-5 py-2 bg-highlighter-blue hover:bg-blue-100 text-ink-dark font-sans font-bold sketchy-border-sm cursor-pointer text-sm"
                >
                  Resume Sketching
                </button>
              </div>
            )}

            {gameState === 'GAMEOVER' && (
              <div className="z-10 text-center px-6 py-8 bg-white/95 sketchy-border p-4 max-w-xs mx-auto shadow-xl">
                <h4 className="font-giggle text-2xl font-bold text-ink-red mb-1">💥 COLLISION!</h4>
                <p className="text-xs text-pencil-gray mb-3 font-sans">
                  Your snake ran out of notebook space or ate its own tail.
                </p>
                <div className="bg-paper-cream p-2 sketchy-border-sm mb-4 text-xs font-mono">
                  Final Ink Score: <strong className="text-ink-blue text-sm">{currentScore}</strong> pt
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={startNewGame}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-highlighter-green text-xs font-sans font-bold sketchy-border-sm cursor-pointer hover:bg-green-100"
                    id="btn-snake-retry"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Run again</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE GRID DRAWING */}
            {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
              <div 
                className="w-full h-full p-2 grid gap-[1px]"
                style={{
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
                  const gx = idx % BOARD_SIZE;
                  const gy = Math.floor(idx / BOARD_SIZE);

                  const isHead = snake[0].x === gx && snake[0].y === gy;
                  const snakeSegmentIndex = snake.findIndex(seg => seg.x === gx && seg.y === gy);
                  const isSnake = snakeSegmentIndex !== -1;
                  const isFood = food.x === gx && food.y === gy;

                  return (
                    <div
                      key={idx}
                      className="w-full h-full flex items-center justify-center relative rounded-[3px]"
                    >
                      {/* Snake Head visual representation */}
                       {isHead ? (
                        <div 
                          className="w-full h-full rounded-md bg-[#16a34a] border-1.5 border-slate-950 flex items-center justify-center relative transition-all duration-100 shadow-sm"
                          style={{
                            transform: direction === 'UP' ? 'rotate(0deg)' : direction === 'DOWN' ? 'rotate(180deg)' : direction === 'LEFT' ? 'rotate(-90deg)' : 'rotate(90deg)',
                            borderRadius: '25% 25% 15% 15% / 30% 30% 20% 20%' // Nokia rounded square brick style
                          }}
                        >
                          {/* Nokia Retro Square Pixel Eyes */}
                          <div className="absolute top-1 left-1.5 w-2 h-2 bg-[#dcfce7] border border-black flex items-center justify-center">
                            <div className="w-1 h-1 bg-black"></div>
                          </div>
                          <div className="absolute top-1 right-1.5 w-2 h-2 bg-[#dcfce7] border border-black flex items-center justify-center">
                            <div className="w-1 h-1 bg-black"></div>
                          </div>
                          
                          {/* Cute pencil nostrils */}
                          <div className="absolute top-4 left-2 w-0.5 h-0.5 bg-black rounded-full"></div>
                          <div className="absolute top-4 right-2 w-0.5 h-0.5 bg-black rounded-full"></div>

                          {/* Forked red snake tongue wiggling ahead */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center select-none animate-pulse">
                            <span className="text-red-600 font-sans text-xs font-black tracking-tighter leading-none origin-bottom scale-y-125 transform scale-x-125">⑂</span>
                          </div>

                          {/* Tiny golden crown */}
                          <div className="absolute top-[-7px] right-[-4px] text-[9px] select-none transform rotate-[15deg] filter drop-shadow-sm">👑</div>
                        </div>
                      ) : isSnake ? (
                        /* Nokia green connected snake body scales, but doodle style */
                        <div 
                          className={`w-[90%] h-[90%] border border-slate-950 flex flex-col items-center justify-center select-none hover:scale-105 transition-transform relative`}
                          style={{
                            backgroundColor: snakeSegmentIndex % 2 === 0 ? '#15803d' : '#22c55e', // Alternating Nokia Greens
                            color: '#ffffff',
                            borderRadius: '4px', // Nokia grid blocks
                            transform: `scale(${Math.max(0.72, 1 - (snakeSegmentIndex * 0.02))})`,
                            opacity: Math.max(0.7, 1 - (snakeSegmentIndex / snake.length))
                          }}
                          title={`Snake segment #${snakeSegmentIndex}`}
                        >
                          {/* Vintage Nokia Segment Core Dark Dot */}
                          <div className="w-2 h-2 bg-emerald-950 rounded-[1px] opacity-40"></div>
                        </div>
                      ) : isFood ? (
                        /* Target food fruit doodles */
                        <div className="w-[100%] h-[100%] flex items-center justify-center animate-bounce drop-shadow-sm filter">
                          {foodType === 'APPLE' && (
                            <span className="text-xl select-none" title="Delicious Apple">🍎</span>
                          )}
                          {foodType === 'STRAWBERRY' && (
                            <span className="text-xl select-none" title="Sweet Strawberry">🍓</span>
                          )}
                          {foodType === 'BANANA' && (
                            <span className="text-xl select-none" title="Ripe Banana">🍌</span>
                          )}
                          {foodType === 'CHERRY' && (
                            <span className="text-xl select-none" title="Ripe Cherries">🍒</span>
                          )}
                          {foodType === 'ORANGE' && (
                            <span className="text-xl select-none" title="Juicy Orange">🍊</span>
                          )}
                          {foodType === 'GRAPE' && (
                            <span className="text-xl select-none" title="Purple Grape Bunch">🍇</span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DYNAMIC ON-SCREEN SKETCH CONTROLLERS */}
          {gameState === 'PLAYING' && (
            <div className="mt-4 flex flex-col items-center gap-1.5" id="snake-controls">
              <span className="text-[10px] font-mono text-pencil-gray uppercase font-semibold">
                ✍️ Touch scribble keypad:
              </span>
              
              {/* Joypad arrows wrapper */}
              <div className="relative w-40 h-32 flex justify-center items-center">
                {/* UP BUTTON */}
                <button
                  onClick={() => handleKeyPadChange('UP')}
                  className="absolute top-0 w-11 h-11 sketchy-border-sm bg-white hover:bg-paper-cream flex items-center justify-center cursor-pointer active:scale-90 shadow-sm"
                  title="UP stroke"
                >
                  <ChevronUp className="w-5 h-5 text-ink-blue" />
                </button>

                {/* LEFT BUTTON */}
                <button
                  onClick={() => handleKeyPadChange('LEFT')}
                  className="absolute left-0 w-11 h-11 sketchy-border-sm bg-white hover:bg-paper-cream flex items-center justify-center cursor-pointer active:scale-90 shadow-sm"
                  title="LEFT stroke"
                >
                  <ChevronLeft className="w-5 h-5 text-ink-blue" />
                </button>

                {/* PAUSE BUTTON (Center) */}
                <button
                  onClick={togglePause}
                  className="absolute w-10 h-10 rounded-full border border-dashed border-ink-dark bg-paper-cream flex items-center justify-center cursor-pointer text-xs font-bold hover:bg-highlighter-yellow"
                  title="PAUSE sketch"
                >
                  <Pause className="w-4 h-4 text-pencil-gray" />
                </button>

                {/* RIGHT BUTTON */}
                <button
                  onClick={() => handleKeyPadChange('RIGHT')}
                  className="absolute right-0 w-11 h-11 sketchy-border-sm bg-white hover:bg-paper-cream flex items-center justify-center cursor-pointer active:scale-90 shadow-sm"
                  title="RIGHT stroke"
                >
                  <ChevronRight className="w-5 h-5 text-ink-blue" />
                </button>

                {/* DOWN BUTTON */}
                <button
                  onClick={() => handleKeyPadChange('DOWN')}
                  className="absolute bottom-0 w-11 h-11 sketchy-border-sm bg-white hover:bg-paper-cream flex items-center justify-center cursor-pointer active:scale-90 shadow-sm"
                  title="DOWN stroke"
                >
                  <ChevronDown className="w-5 h-5 text-ink-blue" />
                </button>
              </div>
            </div>
          )}

          {gameState === 'PLAYING' && (
            <div className="flex gap-4 mt-2">
              <button
                onClick={togglePause}
                className="text-xs uppercase font-bold text-ink-red tracking-wider underline cursor-pointer hover:text-red-700"
              >
                Suspent/Pause Play session
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
