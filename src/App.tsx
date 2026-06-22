/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, GameType, Achievement } from './types';
import DoodleHero from './components/DoodleHero';
import { DoodleCanvas } from './components/DoodleCanvas';
import { DoodleMorphCredit } from './components/DoodleMorphCredit';
import DoodleTicTacToe from './components/DoodleTicTacToe';
import DoodleRPS from './components/DoodleRPS';
import DoodleSnake from './components/DoodleSnake';
import DoodleMemory from './components/DoodleMemory';
import { Sparkles, Trophy, BookOpen, User, RotateCcw, Award, Lightbulb, Play, Volume2, VolumeX, Flame, Check, X, ShieldAlert, FileText } from 'lucide-react';

export default function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [activeGame, setActiveGame] = useState<GameType>('NONE');
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [lastLevel, setLastLevel] = useState<number>(1);
  const [funnyTip, setFunnyTip] = useState<string>('Pencils have feelings! Try not to break your eraser.');
  
  // Custom dialogs state 
  const [showWipeConfirm, setShowWipeConfirm] = useState<boolean>(false);
  
  // Peace & Gratitude Tribute metrics for Aman Sir
  const [gratitudeHearts, setGratitudeHearts] = useState<number>(() => {
    const saved = localStorage.getItem('doodle_gratitude_hearts');
    return saved ? parseInt(saved, 10) : 12;
  });
  const [curiositySparks, setCuriositySparks] = useState<number>(() => {
    const saved = localStorage.getItem('doodle_curiosity_sparks');
    return saved ? parseInt(saved, 10) : 8;
  });

  // Scrapbook Memory board state
  interface ScrapbookNote {
    id: string;
    author: string;
    message: string;
    date: string;
    sticker: string;
    role: string;
  }
  const [scrapbookNotes, setScrapbookNotes] = useState<ScrapbookNote[]>(() => {
    const saved = localStorage.getItem('doodle_scrapbook_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // safe fallback
      }
    }
    return [
      {
        id: '1',
        author: 'Aman Sir',
        role: 'ICT Teacher',
        message: 'This is an outstanding application of ICT! The state logic and notebook layouts display amazing curiosity and clean practical building. Tauheed, I am exceptionally proud of your digital sketchbook! Keep coding!',
        date: 'June 22, 2026',
        sticker: '🎓'
      },
      {
        id: '2',
        author: 'Tauheed',
        role: 'Student Creator',
        message: 'Aman Sir, thank you so much for introducing me to the beautiful world of computer technology and ICT. Without your logic rules, design structure, and motivating guidance, I could never have unlocked my true potential!',
        date: 'June 22, 2026',
        sticker: '💖'
      },
      {
        id: '3',
        author: 'Zain & Friends',
        role: 'Classmates',
        message: 'Awesome website bro! The classic games play so fast and smooth. Thank you Aman Sir for training our class in front-end design systems!',
        date: 'June 22, 2026',
        sticker: '⚡'
      }
    ];
  });

  // New Note fields
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('Friend');
  const [newMessage, setNewMessage] = useState<string>('');
  const [newSticker, setNewSticker] = useState<string>('⭐');

  // Backup compatibility for legacy signatures
  const [teacherName, setTeacherName] = useState<string>('Aman Sir');
  const [teacherRemarks, setTeacherRemarks] = useState<string>('');
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('A+');
  const [isCertified, setIsCertified] = useState<boolean>(false);

  // Audio state virtual simulation sound alerts
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [virtualBeep, setVirtualBeep] = useState<string>('');

  // Loaded cache storage on mounts
  useEffect(() => {
    const cached = localStorage.getItem('doodle_arcade_player_profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Player;
        setPlayer(parsed);
        setLastLevel(parsed.level || 1);
      } catch (e) {
        console.error("Failed to restore player cache:", e);
      }
    }
  }, []);

  // Set randomized funny doodling tips for high retention
  useEffect(() => {
    const tips = [
      "Pencils have feelings! Try not to break your graphite lead.",
      "Crank up the Snake Game speed in Settings to multiply XP yields faster!",
      "Doodle Bot uses neural ink nets. But it fails on diagonal tick-tac corners!",
      "Playing Local Friend mode? Remember to hide the screen while choosing Paper!",
      "A sharper memory beats any computer bot. Turn those tiles quick!",
      "Tauheed's website tracks all highscores permanently in your local paper binder.",
      "The pen is mightier than the sword, but a chunky red eraser is the safest tool!"
    ];

    const tipTimer = setInterval(() => {
      setFunnyTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 15000);

    return () => clearInterval(tipTimer);
  }, []);

  // Guarantee background freezes and scrolling is disabled while pop-up overlays are visible
  useEffect(() => {
    if (showWipeConfirm || showLevelUp) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showWipeConfirm, showLevelUp]);

  // Sound cue triggers visual trigger
  const playVirtualBeep = (message: string) => {
    if (!soundEnabled) return;
    setVirtualBeep(message);
    const audioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (audioContext) {
      try {
        const ctx = new audioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch (e) {
        // Safe play fail
      }
    }
    setTimeout(() => {
      setVirtualBeep('');
    }, 1500);
  };

  // Profile creator handler
  const handleProfileCreated = (newPlayer: Player) => {
    setPlayer(newPlayer);
    localStorage.setItem('doodle_arcade_player_profile', JSON.stringify(newPlayer));
    playVirtualBeep("📝 Notebook opened! Welcome!");
  };

  const handleGameXPReceived = (xpGained: number) => {
    if (!player) return;

    const updatedGamesPlayed = { ...player.gamesPlayed };
    if (activeGame !== 'NONE') {
      updatedGamesPlayed[activeGame] = (updatedGamesPlayed[activeGame] || 0) + 1;
    }

    const currentXP = player.totalXP + xpGained;
    
    // Formula for levels: Level 1 (0-99 XP), Level 2 (100-199 XP), Level 3 (200-349 XP), Level 4 (350-499 XP), Level 5 (500+ XP)
    let newLevel = 1;
    if (currentXP >= 500) newLevel = 5;
    else if (currentXP >= 350) newLevel = 4;
    else if (currentXP >= 200) newLevel = 3;
    else if (currentXP >= 100) newLevel = 2;

    const updatedProfile: Player = {
      ...player,
      totalXP: currentXP,
      gamesPlayed: updatedGamesPlayed,
      level: newLevel
    };

    setPlayer(updatedProfile);
    localStorage.setItem('doodle_arcade_player_profile', JSON.stringify(updatedProfile));

    if (newLevel > lastLevel) {
      setShowLevelUp(true);
      setLastLevel(newLevel);
      playVirtualBeep("🌟 UPGRADED! Level up!");
    } else {
      playVirtualBeep(`✍️ +${xpGained} XP Point saved!`);
    }
  };

  const handleWipeProfile = () => {
    setShowWipeConfirm(true);
    playVirtualBeep("❓ Open eraser dialogue...");
  };

  const handleConfirmWipe = () => {
    localStorage.removeItem('doodle_arcade_player_profile');
    setPlayer(null);
    setActiveGame('NONE');
    setLastLevel(1);
    setShowWipeConfirm(false);
    playVirtualBeep("✏️ Notebook erased clean! Profiles reset.");
  };

  // Formulate nice achievements list
  const getAchievements = (): Achievement[] => {
    if (!player) return [];
    
    let gamesCount = 0;
    if (player.gamesPlayed) {
      const keys = Object.keys(player.gamesPlayed) as GameType[];
      keys.forEach(key => {
        const val = player.gamesPlayed[key];
        if (val) {
          gamesCount += val;
        }
      });
    }

    return [
      {
        id: 'first_play',
        title: 'Ink Originator',
        description: 'Completed your notebook profile and loaded the game lobby.',
        isUnlocked: true,
        xpValue: 10
      },
      {
        id: 'lvl2',
        title: 'Apprentice Sketcher',
        description: 'Earned total over 100 points of XP to reach level 2.',
        isUnlocked: (player.level || 1) >= 2,
        xpValue: 30
      },
      {
        id: 'arcade_fan',
        title: 'Arcade Addict',
        description: 'Launched more than 5 rounds of miniature games.',
        isUnlocked: gamesCount >= 5,
        xpValue: 40
      },
      {
        id: 'grandmaster',
        title: 'Charcoal Master',
        description: 'Reach Level 4 or higher inside Tauheed\'s digital workbook.',
        isUnlocked: (player.level || 1) >= 4,
        xpValue: 100
      }
    ];
  };

  const getXPProgressPercent = (): number => {
    if (!player) return 0;
    const xp = player.totalXP;
    
    if (player.level === 1) return (xp / 100) * 100;
    if (player.level === 2) return ((xp - 100) / 100) * 100;
    if (player.level === 3) return ((xp - 200) / 150) * 100;
    if (player.level === 4) return ((xp - 350) / 150) * 100;
    return 100; // Level 5 is max
  };

  const getNextLevelThreshold = (): string => {
    if (!player) return '';
    if (player.level === 1) return '100 XP';
    if (player.level === 2) return '200 XP';
    if (player.level === 3) return '350 XP';
    if (player.level === 4) return '500 XP';
    return 'Doodle Overlord Max reached!';
  };

  return (
    <div className="min-h-screen bg-paper-cream text-ink-dark font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Decorative vertical notebook rings panel on the very left for immersive feel */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around py-12 pointer-events-none z-40 hidden md:flex border-r-2 border-dashed border-gray-300">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-10 h-5 notebook-binder rounded-full border border-gray-400/60 shadow-sm ml-[-12px]"></div>
        ))}
      </div>

      {/* Dynamic Sound Alert Toast */}
      {virtualBeep && (
        <div className="fixed top-4 right-4 z-50 bg-highlighter-yellow text-ink-dark border-2 border-ink-dark px-4 py-2 rounded-xl text-xs font-mono font-bold sketchy-border-sm shadow-md animate-bounce">
          🔊 Sound Cue: {virtualBeep}
        </div>
      )}

      {/* Level Up congratulatory overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 max-w-sm rounded-3xl border-3 border-ink-dark sketchy-shadow text-center animate-float">
            <span className="text-4xl">🌟</span>
            <h3 className="text-3xl font-giggle text-ink-blue mt-2">Notebook Level Up!</h3>
            <p className="font-hand text-lg text-ink-red font-extrabold mt-1">
              You upgraded to Level {player?.level}!
            </p>
            <p className="text-xs text-pencil-gray font-sans mt-3">
              Your sketch skill are expanding! New doodle power-ups have been registered inside your pencil.
            </p>
            <div className="mt-5">
              <button
                onClick={() => setShowLevelUp(false)}
                className="w-full py-2 bg-highlighter-green hover:bg-green-100 text-ink-dark font-sans font-bold sketchy-border text-sm cursor-pointer"
              >
                Awesome, back to pencil!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wipe Profile custom confirmation modal screen */}
      {showWipeConfirm && (
        <div 
          className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 pointer-events-auto touch-none"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="bg-white p-6 sm:p-8 max-w-md w-full rounded-3xl border-3 border-ink-red bg-paper-white sketchy-shadow-red animate-float text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-50 border border-dashed border-ink-red flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-ink-red animate-pulse" />
            </div>
            
            <h3 className="text-3xl font-giggle text-ink-red leading-none">
              Erase My Account?
            </h3>
            
            <p className="font-hand text-lg text-pencil-gray font-bold leading-normal">
              "Tauheed, wait! Are you sure you want to erase all your hard-earned XP, game levels, and notebook achievements?"
            </p>
            
            <p className="text-xs text-pencil-gray font-sans bg-amber-50 p-2.5 rounded-xl border border-dashed border-amber-300">
              This action will completely wipe your local browser memory cache and return you to the initial name & avatar orientation screen.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmWipe();
                }}
                className="flex-1 py-3 bg-ink-red hover:bg-red-800 text-white font-sans text-sm font-bold rounded-xl shadow-sm border border-black cursor-pointer transition-colors relative z-10"
              >
                🗑️ Yes, Erase Everything
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWipeConfirm(false);
                  playVirtualBeep("🛡️ Eraser cancelled safely!");
                }}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-ink-dark font-sans text-sm font-bold rounded-xl shadow-sm border-2 border-ink-dark cursor-pointer transition-colors relative z-10"
              >
                ✏️ No, Keep Studying
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLAYER PROFILE PROFILE CHECK */}
      {!player ? (
        <DoodleHero onProfileCreated={handleProfileCreated} />
      ) : (
        /* THE MAIN APP SCREEN VIEWPORT */
        <div className="flex-1 w-full max-w-6xl mx-auto pl-2 md:pl-12 pr-4 py-4 flex flex-col">
          
          {/* HEADER DASHBOARD BAR */}
          <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-gray-300">
            
            {/* Player details */}
            <div className="flex items-center gap-3.5 self-start">
              {/* Animated Avatar holder */}
              <div className="w-16 h-16 rounded-2xl bg-white sketchy-border-blue flex items-center justify-center relative shadow-sm shrink-0">
                {player.avatarId === 'boy_pencil' && (
                  <svg className="w-12 h-12 stroke-ink-dark fill-amber-100" viewBox="0 0 100 100">
                    <circle cx="50" cy="48" r="24" strokeWidth="2.5" />
                    <circle cx="43" cy="46" r="2.5" fill="#000" />
                    <circle cx="57" cy="46" r="2.5" fill="#000" />
                    <path d="M 45,56 Q 50,60 55,56" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {player.avatarId === 'girl_brush' && (
                  <svg className="w-12 h-12 stroke-ink-dark fill-pink-50" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="23" strokeWidth="2.5" />
                    <circle cx="43" cy="47" r="2" fill="#000" />
                    <circle cx="57" cy="47" r="2" fill="#000" />
                    <path d="M 46,57 Q 50,62 54,57" fill="none" strokeWidth="2" />
                  </svg>
                )}
                {player.avatarId === 'ninja_marker' && (
                  <svg className="w-12 h-12 stroke-white fill-ink-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="24" fill="#1e1e2d" />
                    <rect x="36" y="44" width="28" height="8" rx="2" fill="#fff" />
                    <circle cx="43" cy="48" r="1" fill="#000" />
                    <circle cx="57" cy="48" r="1" fill="#000" />
                  </svg>
                )}
                {player.avatarId === 'doodle_cloud' && (
                  <svg className="w-12 h-12 stroke-ink-blue fill-blue-50" viewBox="0 0 100 100">
                    <path d="M 25,60 C 15,60 12,50 18,42 Q 30,22 45,28 T 75,32 Q 85,50 72,55 T 50,65 Z" strokeWidth="2" />
                  </svg>
                )}
                {/* Level Tag badge overlay */}
                <span className="absolute bottom-[-8px] right-[-8px] w-6 h-6 rounded-full bg-ink-red text-white border-2 border-white flex items-center justify-center font-mono text-xs font-bold shadow animate-pulse">
                  {player.level}
                </span>
              </div>

              {/* Player text parameters */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-giggle text-2xl text-ink-dark uppercase tracking-tight">
                    {player.name}
                  </span>
                  <span className="font-sans text-[10px] text-pencil-gray font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-highlighter-yellow border border-dashed border-pencil-gray">
                    Grade {player.level <= 1 ? 'Novice' : player.level === 2 ? 'Apprentice' : player.level === 3 ? 'Professional' : player.level === 4 ? 'Grandmaster' : 'Tauheed\'s Heir'}
                  </span>
                </div>

                {/* Level progress bar */}
                <div className="w-48 sm:w-60">
                  <div className="flex justify-between items-center text-[10px] font-mono text-pencil-gray">
                    <span>XP Tracker: {player.totalXP} XP</span>
                    <span>Next Level at {getNextLevelThreshold()}</span>
                  </div>
                  <div className="w-full h-3.5 bg-gray-200 rounded-full border border-ink-dark px-0.5 py-0.5 overflow-hidden mt-0.5">
                    <div 
                      className="h-full bg-highlighter-green rounded-full border-r border-ink-dark transition-all duration-500"
                      style={{ width: `${getXPProgressPercent()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick settings utility shortcuts */}
            <div className="flex items-center gap-3 self-end md:self-center">
              {/* Virtual synth volume */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 sketchy-border-sm text-pencil-gray hover:text-ink-blue bg-white cursor-pointer"
                title={soundEnabled ? "Mute beep sound synthesize" : "Unmute active sound synth"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-ink-blue" /> : <VolumeX className="w-4 h-4 text-ink-red" />}
              </button>

              <button
                onClick={() => playVirtualBeep("🛎️ Desk Bell rung!")}
                className="p-2.5 bg-white sketchy-border-sm hover:bg-paper-cream cursor-pointer text-xs font-sans font-semibold flex items-center gap-1 text-pencil-gray hover:text-ink-dark"
                title="Ring the desk bell"
              >
                🔔 Ring Bell
              </button>

              <button
                onClick={handleWipeProfile}
                className="p-2 bg-white sketchy-border-sm text-ink-red hover:bg-red-50 text-xs font-sans font-bold flex items-center gap-1 cursor-pointer"
                id="btn-erase-notebook-profile"
                title="Erase cached profile data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Erase Profile</span>
              </button>
            </div>
          </header>

          {/* DYNAMIC MIDDLE ROUTE CONTENT */}
          <main className="flex-1 py-4 flex flex-col justify-center">
            
            {activeGame === 'NONE' ? (
              
              /* 1. LOBBY VIEWPORT: THE GAMES BENTO SELECTOR GRID */
              <div className="space-y-8" id="lobby-grid">
                
                {/* Hero Welcome banner */}
                <div className="bg-white p-6 rounded-3xl sketchy-border sketchy-shadow-blue text-center relative overflow-hidden" id="hero-lobby-board">
                  {/* Real notebook grid elements */}
                  <div className="absolute inset-0 paper-grid opacity-20 pointer-events-none"></div>

                  <h2 className="text-3xl sm:text-4xl font-giggle text-ink-blue leading-tight mb-2 transform rotate-[-0.5deg]">
                    Welcome to <span className="scribble-highlight">Tauheed's Sketchbook!</span>
                  </h2>
                  <p className="font-hand text-lg text-pencil-gray font-semibold max-w-2xl mx-auto">
                    "Draw lines, block friends, eat juicy apples in the classic Snake game, and expand your memory cells. It is simulated on real sketchbooks. Grab your pen ✏️"
                  </p>
                  
                  {/* Funny tip banner */}
                  <div className="mt-4 inline-flex items-center gap-2 bg-highlighter-yellow/30 border border-dashed border-ink-dark px-4 py-1.5 rounded-full text-xs font-hand text-ink-dark">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
                    <span><strong>Pro Doodle Tip:</strong> {funnyTip}</span>
                  </div>
                </div>

                {/* THE 4 MINI-GAMES ROW BOARD */}
                <div>
                  <h3 className="font-hand text-2xl text-ink-red underline decoration-wavy mb-4 block transform rotate-[1deg]">
                    Choose Your Sketchbook Battleground:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* GAME 1: TIC TAC TOE */}
                    <div 
                      onClick={() => {
                        setActiveGame('TIC_TAC_TOE');
                        playVirtualBeep("✏️ Grid Tic Tac Loaded!");
                      }}
                      className="bg-white p-5 rounded-2xl sketchy-border doodle-hover cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden group"
                      id="card-game-ttt"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-pencil-gray uppercase font-bold tracking-wide">01 • Pen & Paper</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-highlighter-yellow uppercase border border-dashed border-pencil-gray">
                            XP: x1.5
                          </span>
                        </div>
                        <h4 className="text-xl font-giggle text-ink-blue group-hover:underline">
                          Tic-Tac-Toe
                        </h4>
                        <p className="text-xs text-pencil-gray leading-relaxed font-sans">
                          Draw classic X and O symbols. Play with a friend on the same screen or try to beat the computer player!
                        </p>
                      </div>

                      {/* Small visual preview drawing */}
                      <div className="w-full flex justify-center py-2 opacity-80">
                        <svg className="w-16 h-12 stroke-gray-300 stroke-[1.5]" viewBox="0 0 60 40">
                          <path d="M20 5v30 M40 5v30 M5 13h50 M5 27h50" />
                          <circle cx="10" cy="9" r="4" fill="none" className="stroke-ink-red stroke-2" />
                          <path d="M26 23l8 8 M34 23l-8 8" className="stroke-ink-blue stroke-2" />
                        </svg>
                      </div>

                      <button className="w-full py-1.5 bg-ink-blue text-white font-sans text-xs font-bold rounded-lg group-hover:scale-105 cursor-pointer transition-transform text-center flex items-center justify-center gap-1">
                        <Play className="w-3 h-3 fill-white" />
                        <span>Play Tic-Tac-Toe</span>
                      </button>
                    </div>

                    {/* GAME 2: SNAKE GAME */}
                    <div 
                      onClick={() => {
                        setActiveGame('SNAKE');
                        playVirtualBeep("🐍 Snake game loaded!");
                      }}
                      className="bg-white p-5 rounded-2xl sketchy-border doodle-hover cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden group"
                      id="card-game-snake"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-pencil-gray uppercase font-bold tracking-wide">02 • Arcade Rush</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-highlighter-green uppercase border border-dashed border-pencil-gray">
                            XP: x2.0
                          </span>
                        </div>
                        <h4 className="text-xl font-giggle text-ink-dark group-hover:underline">
                          Snake Game
                        </h4>
                        <p className="text-xs text-pencil-gray leading-relaxed font-sans">
                          Guide your pencil snake around the paper grid to eat juicy red apples. Use arrow keys or screen buttons to slither.
                        </p>
                      </div>

                      <div className="w-full flex justify-center py-2 opacity-80">
                        <svg className="w-20 h-10 stroke-gray-300 stroke-2" viewBox="0 0 100 40" fill="none">
                          <path d="M 10,20 Q 20,30 30,20 T 50,20 T 70,20" className="stroke-pencil-gray stroke-[1.5] stroke-dasharray-2" />
                          <circle cx="70" cy="20" r="5" fill="#fdf" className="stroke-ink-blue stroke-2" />
                          <circle cx="85" cy="20" r="3" fill="#f00" className="stroke-ink-red animate-ping" />
                        </svg>
                      </div>

                      <button className="w-full py-1.5 bg-highlighter-green text-ink-dark font-sans text-xs font-bold rounded-lg border border-ink-dark group-hover:scale-105 cursor-pointer transition-transform text-center flex items-center justify-center gap-1">
                        <Play className="w-3 h-3 fill-ink-dark" />
                        <span>Play Snake Game</span>
                      </button>
                    </div>

                    {/* GAME 3: ROCK PAPER SCISSORS */}
                    <div 
                      onClick={() => {
                        setActiveGame('ROCK_PAPER_SCI_SPOCK');
                        playVirtualBeep("✊ Rock paper scissors loaded!");
                      }}
                      className="bg-white p-5 rounded-2xl sketchy-border-red doodle-hover cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden group"
                      id="card-game-rps"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-pencil-gray uppercase font-bold tracking-wide">03 • Face to Face</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-highlighter-pink uppercase border border-dashed border-pencil-gray">
                            XP: x1.0
                          </span>
                        </div>
                        <h4 className="text-xl font-giggle text-ink-red group-hover:underline">
                          Rock, Paper, Scissors
                        </h4>
                        <p className="text-xs text-pencil-gray leading-relaxed font-sans">
                          Play rock, paper, scissors against a friend on the same screen. Use the secret cover so they can't peek!
                        </p>
                      </div>

                      <div className="w-full flex justify-center py-2 opacity-80 text-xl gap-2 font-mono select-none">
                        ✊ ✋ ✌️
                      </div>

                      <button className="w-full py-1.5 bg-ink-red text-white font-sans text-xs font-bold rounded-lg group-hover:scale-105 cursor-pointer transition-transform text-center flex items-center justify-center gap-1">
                        <Play className="w-3 h-3 fill-white" />
                        <span>Play Gestures</span>
                      </button>
                    </div>

                    {/* GAME 4: MEMORY MATCH */}
                    <div 
                      onClick={() => {
                        setActiveGame('MEMORY_MATCH');
                        playVirtualBeep("🧠 Memory pairs loaded!");
                      }}
                      className="bg-white p-5 rounded-2xl sketchy-border-blue doodle-hover cursor-pointer flex flex-col justify-between h-64 relative overflow-hidden group"
                      id="card-game-memory"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-pencil-gray uppercase font-bold tracking-wide">04 • Quick Brain</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-highlighter-blue uppercase border border-dashed border-pencil-gray">
                            XP: x1.2
                          </span>
                        </div>
                        <h4 className="text-xl font-giggle text-ink-blue group-hover:underline">
                          Memory Match
                        </h4>
                        <p className="text-xs text-pencil-gray leading-relaxed font-sans">
                          Flip hand-drawn cards and find matching pairs of drawings. Match them style-by-style before the time runs out!
                        </p>
                      </div>

                      <div className="w-full flex justify-center py-2 gap-1.5 opacity-80">
                        <div className="w-5 h-6 bg-ink-dark rounded border border-gray-400"></div>
                        <div className="w-5 h-6 bg-white rounded border border-ink-blue text-[10px] flex items-center justify-center">🚀</div>
                        <div className="w-5 h-6 bg-ink-dark rounded border border-gray-300"></div>
                        <div className="w-5 h-6 bg-white rounded border border-ink-blue text-[10px] flex items-center justify-center">🚀</div>
                      </div>

                      <button className="w-full py-1.5 bg-highlighter-blue text-ink-dark font-sans text-xs font-bold rounded-lg border border-ink-dark group-hover:scale-105 cursor-pointer transition-transform text-center flex items-center justify-center gap-1">
                        <Play className="w-3 h-3 fill-ink-dark" />
                        <span>Play Memory Match</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* ACHIEVEMENTS AND WORKBOOK STATICS PANELS */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column achievements */}
                  <div className="col-span-1 md:col-span-8 p-5 bg-white sketchy-border relative shadow-sm">
                    <h3 className="font-hand text-2xl text-ink-blue border-b border-dashed border-gray-300 pb-2 mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-200 animate-bounce" />
                      <span>📓 Notebook Achievements & Stamps</span>
                    </h3>

                    <div className="space-y-3.5">
                      {getAchievements().map(ach => (
                        <div 
                          key={ach.id}
                          className={`p-3 rounded-xl border border-dashed flex items-center justify-between gap-4 transition-all ${
                            ach.isUnlocked 
                              ? 'bg-green-50/50 border-green-500' 
                              : 'bg-gray-50 border-gray-300 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`p-2 rounded-full border ${ach.isUnlocked ? 'bg-highlighter-green border-green-600' : 'bg-gray-200 border-gray-400'}`}>
                              <Award className={`w-4 h-4 ${ach.isUnlocked ? 'text-green-800' : 'text-gray-500'}`} />
                            </div>
                            <div>
                              <h5 className="text-sm font-hand font-extrabold text-ink-dark uppercase tracking-wide">
                                {ach.title}
                              </h5>
                              <p className="text-xs text-pencil-gray font-sans">
                                {ach.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {ach.isUnlocked ? (
                              <span className="text-xs font-mono font-bold text-green-700 bg-green-150 px-2 py-0.5 rounded">
                                Completed (+{ach.xpValue} XP)
                              </span>
                            ) : (
                              <span className="text-xs font-mono text-pencil-gray">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column simple developer dedication quotes */}
                  <div className="col-span-1 md:col-span-4 p-5 bg-[#fcfcf0] sketchy-border-red relative">
                    <h3 className="font-hand text-xl text-ink-red pb-1 border-b border-dashed border-red-300 mb-3 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-ink-red animate-pulse" />
                      <span>📝 Developer Dedication</span>
                    </h3>
                    
                    <p className="text-xs font-hand text-pencil-gray leading-relaxed mb-4">
                      This arcade was proudly handcrafted with ink by <strong>Tauheed</strong>. It honors the absolute playability of desktop mini games of our generations, bringing pencil graphics back to the modern web browser. 
                    </p>

                    <div className="bg-white p-3 border border-dashed border-pencil-gray rounded-xl">
                      <span className="text-[10px] font-mono text-pencil-gray font-bold uppercase block mb-1">
                        Tauheed's Notebook Sign-off:
                      </span>
                      <p className="font-giggle text-lg text-ink-dark tracking-wide">
                        "Make mistakes. Draw more lines. Erase if you must, but keep wiggling!"
                      </p>
                    </div>

                    <div className="text-center mt-4">
                      <span className="text-[10px] font-mono text-pencil-gray">
                        Offline storage safely synced in browser cache ✅
                      </span>
                    </div>
                  </div>

                </div>

                {/* 💝 SPECIAL TRIBUTE TO MY TEACHER & INTERACTIVE CLASSROOM SCRAPBOOK */}
                <div className="mt-8 space-y-8" id="classroom-tribute-scrapbook">
                  
                  {/* MAGIC SANDBOX PLAYGROUND & STAMP BOARD */}
                  <DoodleCanvas 
                    soundEnabled={soundEnabled} 
                    onAppreciationSent={(msg) => playVirtualBeep(msg)} 
                  />
                  
                  {/* PART 1: HEARTFELT TRIBUTE TO AMAN SIR */}
                  <div className="bg-[#fdfdf5] p-6 rounded-3xl sketchy-border-red relative shadow-sm overflow-hidden text-left" id="aman-sir-tribute">
                    {/* Double red line notebook margin border */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-red-300 pointer-events-none opacity-45"></div>
                    <div className="absolute inset-0 paper-grid opacity-15 pointer-events-none"></div>

                    <div className="relative z-10 pl-6 space-y-4">
                      {/* Section label */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-ink-red uppercase bg-highlighter-pink/30 px-2.5 py-0.5 rounded-full border border-dashed border-ink-red">
                          💝 Dev Tribute & Gratitude
                        </span>
                        <span className="text-xs font-mono text-pencil-gray">Classroom of 2026</span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-giggle text-3xl text-ink-red transform rotate-[-0.5deg]">
                          Thank You, Aman Sir! 🍎
                        </h3>
                        <p className="font-hand text-lg text-ink-dark leading-relaxed">
                          This entire application was made possible because of my incredible teacher, <strong>Aman Sir</strong>, who guided us through the subject of <strong>ICT (Information & Communication Technology)</strong>!
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-8 space-y-3 col-span-1">
                          <p className="text-xs text-pencil-gray leading-relaxed font-sans">
                            Aman Sir did not just teach us textbook definitions; he inspired us to think algorithmically and creatively. Through his motivating guidance, I learned how to build production-grade web systems like this interactive sketchbook. He pushed me to learn more, question limits, and made me genuinely curious about my own potential!
                          </p>
                          <p className="text-xs text-pencil-gray leading-relaxed font-sans italic border-l-2 border-dashed border-ink-blue pl-3 bg-blue-50/30 py-1 rounded">
                            "A great educator doesn't just hand you code; they hand you the eraser to write your own path!" — Tauheed's gratitude note to Aman Sir.
                          </p>
                        </div>

                        {/* Interactive Spark & Heart counters */}
                        <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-dashed border-pencil-gray flex flex-col gap-3 text-center col-span-1">
                          <span className="text-[10px] font-mono text-pencil-gray uppercase font-bold">Interactive Gratitude Console</span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newVal = gratitudeHearts + 1;
                                setGratitudeHearts(newVal);
                                localStorage.setItem('doodle_gratitude_hearts', newVal.toString());
                                playVirtualBeep("💖 Sent appreciation heart to Aman Sir!");
                              }}
                              className="p-2 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-300 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                            >
                              <span className="text-2xl group-hover:animate-bounce">💖</span>
                              <span className="text-xs font-mono font-bold mt-1 text-pink-700">{gratitudeHearts}</span>
                              <span className="text-[8px] uppercase tracking-wider text-pink-500 font-sans mt-0.5 font-semibold">Hearts Sent</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newVal = curiositySparks + 1;
                                setCuriositySparks(newVal);
                                localStorage.setItem('doodle_curiosity_sparks', newVal.toString());
                                playVirtualBeep("💡 Ignited a spark of curious potential!");
                              }}
                              className="p-2 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-300 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                            >
                              <span className="text-2xl group-hover:animate-pulse">💡</span>
                              <span className="text-xs font-mono font-bold mt-1 text-amber-700">{curiositySparks}</span>
                              <span className="text-[8px] uppercase tracking-wider text-amber-600 font-sans mt-0.5 font-semibold">Sparks Lit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PART 2: INTERACTIVE CLASSROOM SCRAPBOOK & MEMORY BOARD */}
                  <div className="bg-white p-6 rounded-3xl sketchy-border-blue relative shadow-sm text-left" id="classroom-scrapbook">
                    <div className="absolute inset-0 paper-grid opacity-15 pointer-events-none"></div>

                    <div className="relative z-10 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-gray-300 pb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-ink-blue uppercase block mb-0.5">
                            Interactive Memory Wall
                          </span>
                          <h3 className="font-giggle text-2xl text-ink-dark">
                            📖 Teacher & Friends Guestbook Scrapbook
                          </h3>
                        </div>
                        <span className="text-xs font-sans text-pencil-gray">
                          Pin your greetings, tips, or congratulations directly below!
                        </span>
                      </div>

                      {/* Sticky Notes Corkboard Grid */}
                      <div>
                        <span className="text-xs font-mono text-pencil-gray uppercase font-bold block mb-3">📍 Pinned Sketchbook Notes:</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {scrapbookNotes.map((note, idx) => {
                            // Give beautiful slight offsets or rotation angles based on index to look hand-pinned
                            const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-2deg]', 'rotate-[1.5deg]', 'rotate-[-0.5deg]'];
                            const rotation = rotations[idx % rotations.length];
                            const borders = ['sketchy-border-blue', 'sketchy-border-red', 'sketchy-border-yellow', 'sketchy-border'];
                            const border = borders[idx % borders.length];

                            return (
                              <div 
                                key={note.id}
                                className={`p-5 rounded-2xl bg-paper-cream/40 relative hover:scale-105 transition-all shadow-xs ${rotation} ${border}`}
                              >
                                {/* Pushpin rendering */}
                                <div className="absolute top-2 right-4 text-lg select-none opacity-85" title="Pinned Note">📌</div>
                                
                                <div className="flex justify-between items-start mb-2 pr-6">
                                  <div>
                                    <h4 className="font-giggle text-lg text-ink-blue tracking-tight">{note.author}</h4>
                                    <span className="text-[8px] uppercase tracking-wider font-sans font-bold text-pencil-gray px-1.5 py-0.5 rounded bg-gray-100 border border-dashed border-gray-300">
                                      {note.role}
                                    </span>
                                  </div>
                                  <span className="text-2xl select-none">{note.sticker}</span>
                                </div>

                                <p className="font-hand text-sm text-ink-dark leading-relaxed mb-3">
                                  "{note.message}"
                                </p>

                                <div className="text-right border-t border-dashed border-gray-300 pt-1.5">
                                  <span className="text-[9px] font-mono text-pencil-gray">{note.date}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Add Pinned Note Form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newAuthor.trim() || !newMessage.trim()) {
                            playVirtualBeep("⚠️ Author & Message required to pin!");
                            return;
                          }
                          const newNote: ScrapbookNote = {
                            id: Date.now().toString(),
                            author: newAuthor.trim(),
                            role: newRole.trim(),
                            message: newMessage.trim(),
                            sticker: newSticker,
                            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          };
                          const updated = [newNote, ...scrapbookNotes];
                          setScrapbookNotes(updated);
                          localStorage.setItem('doodle_scrapbook_notes', JSON.stringify(updated));
                          
                          // reset fields
                          setNewAuthor('');
                          setNewMessage('');
                          playVirtualBeep("📌 Pinned memory successfully onto the sketchbook board!");
                        }}
                        className="p-5 bg-paper-cream/20 rounded-2xl border border-dashed border-pencil-gray space-y-4"
                      >
                        <h4 className="font-hand text-lg text-ink-red font-bold">✍️ Leave Your Note/Message Onto The Scrapbook</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Your Name:</label>
                            <input 
                              type="text"
                              value={newAuthor}
                              onChange={(e) => setNewAuthor(e.target.value)}
                              placeholder="e.g. Aman Sir, Zain, Rohan"
                              className="w-full text-xs p-2.5 bg-white rounded-xl border border-ink-dark focus:border-ink-blue focus:outline-none placeholder-gray-400 font-hand text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Who Are You:</label>
                            <select 
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white rounded-xl border border-ink-dark focus:border-ink-blue focus:outline-none font-sans"
                            >
                              <option value="Teacher">My Awesome Teacher 🎓</option>
                              <option value="Friend">Classmate / Friend ⚡</option>
                              <option value="Sketcher">Doodle Fanatic ✏️</option>
                              <option value="Visitor">Guest Explorer ✨</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Select Sticker:</label>
                            <div className="flex gap-2">
                              {['💖', '💡', '🎓', '⚡', '⭐', '🔥'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    setNewSticker(st);
                                    playVirtualBeep("🏷️ Select " + st);
                                  }}
                                  className={`flex-1 py-1 text-center rounded-lg border text-lg cursor-pointer transition-all ${
                                    newSticker === st 
                                      ? 'bg-amber-100 border-2 border-amber-600 scale-110' 
                                      : 'bg-white border-dashed border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Your Message:</label>
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={2}
                            placeholder="Type congratulations, appreciation notes, or funny sketchbook remarks..."
                            className="w-full text-xs p-2.5 rounded-xl border border-ink-dark focus:border-ink-blue focus:outline-none bg-white font-hand text-base"
                          />
                        </div>

                        <div className="pt-1 text-right">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-ink-blue hover:bg-blue-800 text-white rounded-xl font-sans text-xs font-bold active:translate-y-0.5 cursor-pointer shadow-xs transition-transform inline-flex items-center gap-1"
                          >
                            <span>Pin Message onto Scrapbook</span>
                          </button>
                        </div>
                      </form>

                    </div>
                  </div>

                </div>

              </div>

            ) : (
              
              /* 2. ACTIVE Mini-Game VIEWPORT */
              <div className="bg-white p-4 sm:p-6 rounded-3xl sketchy-border-blue roomy-game-container">
                {activeGame === 'TIC_TAC_TOE' && (
                  <DoodleTicTacToe 
                    player={player} 
                    onGameEnd={handleGameXPReceived} 
                    onBack={() => {
                      setActiveGame('NONE');
                      playVirtualBeep("🛎️ Lobby returned!");
                    }} 
                  />
                )}
                {activeGame === 'SNAKE' && (
                  <DoodleSnake 
                    player={player} 
                    onGameEnd={handleGameXPReceived} 
                    onBack={() => {
                      setActiveGame('NONE');
                      playVirtualBeep("🛎️ Lobby returned!");
                    }} 
                  />
                )}
                {activeGame === 'ROCK_PAPER_SCI_SPOCK' && (
                  <DoodleRPS 
                    player={player} 
                    onGameEnd={handleGameXPReceived} 
                    onBack={() => {
                      setActiveGame('NONE');
                      playVirtualBeep("🛎️ Lobby returned!");
                    }} 
                  />
                )}
                {activeGame === 'MEMORY_MATCH' && (
                  <DoodleMemory 
                    player={player} 
                    onGameEnd={handleGameXPReceived} 
                    onBack={() => {
                      setActiveGame('NONE');
                      playVirtualBeep("🛎️ Lobby returned!");
                    }} 
                  />
                )}
              </div>

            )}

          </main>

          {/* DYNAMIC MORPHING HAND-CRAFTED BADGE */}
          <DoodleMorphCredit />

          {/* PAGE FOOTER */}
          <footer className="w-full text-center py-6 mt-8 border-t border-dashed border-gray-300 text-xs text-pencil-gray font-sans flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span>© 2026 <strong>Tauheed's Sketchbook Games</strong>. All hand-drawn pencil pixels reserved.</span>
            </div>
            <div className="flex gap-4">
              <span className="cursor-pointer hover:underline text-ink-blue" onClick={() => playVirtualBeep("✏️ Real notebook grids loaded!")}>Charcoal Texture</span>
              <span>•</span>
              <span className="cursor-pointer hover:underline text-ink-red" onClick={() => playVirtualBeep("💡 Tip: Try diagonal attacks!")}>Arcade Guides</span>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}
