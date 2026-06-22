/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player } from '../types';
import { Sparkles, User, Pencil, ArrowRight, BookOpen, ChevronRight, Stars, Award, Lightbulb, GraduationCap } from 'lucide-react';

interface DoodleHeroProps {
  onProfileCreated: (player: Player) => void;
}

export default function DoodleHero({ onProfileCreated }: DoodleHeroProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'ninja' | 'sketcher'>('boy');
  const [avatarId, setAvatarId] = useState<string>('boy_pencil');
  const [formError, setFormError] = useState<string>('');
  const [step, setStep] = useState<number>(1); // 1: Name entry, 2: Avatar selection

  const AVATARS = [
    {
      id: 'boy_pencil',
      name: 'Pencil Boy',
      gender: 'boy' as const,
      description: 'Quick with lines. Carries a yellow 2B pencil behind his ear.',
      svg: (
        <svg className="w-16 h-16 stroke-ink-dark stroke-[2] fill-amber-100" viewBox="0 0 100 100">
          <circle cx="50" cy="45" r="22" strokeWidth="2.5" />
          {/* Paper hat */}
          <path d="M 24,28 L 50,4 L 76,28 Z" fill="#fff" strokeWidth="2.5" />
          <path d="M 33,28 L 50,14 L 67,28 Z" fill="#ebf2ff" />
          {/* Eyes */}
          <circle cx="42" cy="44" r="2.5" fill="#1e1e2d" />
          <circle cx="58" cy="44" r="2.5" fill="#1e1e2d" />
          {/* Mouth */}
          <path d="M 45,55 Q 50,60 55,55" strokeWidth="2.5" strokeLinecap="round" />
          {/* Eye pencil */}
          <rect x="18" y="32" width="12" height="4" transform="rotate(-15, 18, 32)" fill="#ea580c" />
          <path d="M 28,29 L 33,31" />
        </svg>
      )
    },
    {
      id: 'girl_brush',
      name: 'Marker Girl',
      gender: 'girl' as const,
      description: 'Ink specialist. Loves drawing colorful rainbows and friendly cats.',
      svg: (
        <svg className="w-16 h-16 stroke-ink-dark stroke-[2] fill-pink-50" viewBox="0 0 100 100">
          <circle cx="50" cy="46" r="21" strokeWidth="2.5" />
          {/* Hair loops */}
          <circle cx="28" cy="35" r="11" fill="#ec4899" />
          <circle cx="72" cy="35" r="11" fill="#ec4899" />
          {/* Fringe hair */}
          <path d="M 29,35 Q 50,42 71,35" fill="none" strokeWidth="3" />
          {/* Eyes with lashes */}
          <circle cx="43" cy="45" r="2" fill="#1e1e2d" />
          <path d="M 40,41 L 43,43" strokeWidth="2" />
          <circle cx="57" cy="45" r="2" fill="#1e1e2d" />
          <path d="M 60,41 L 57,43" strokeWidth="2" />
          {/* Cheek pink */}
          <ellipse cx="38" cy="51" rx="4" ry="2" fill="#fbcfe8" stroke="none" />
          <ellipse cx="62" cy="51" rx="4" ry="2" fill="#fbcfe8" stroke="none" />
          {/* Mouth */}
          <path d="M 46,55 Q 50,62 54,55" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'ninja_marker',
      name: 'Ink Ninja',
      gender: 'ninja' as const,
      description: 'Quiet strategist. Sneaks lines onto the grid in seconds.',
      svg: (
        <svg className="w-16 h-16 stroke-white stroke-[2] fill-ink-dark" viewBox="0 0 100 100">
          <circle cx="50" cy="46" r="22" stroke="none" />
          {/* Black mask */}
          <path d="M 29,46 C 29,32 71,32 71,46 C 71,60 29,60 29,46" fill="#1e1e2d" stroke="#000" strokeWidth="2.5" />
          {/* Eye cutout */}
          <rect x="36" y="40" width="28" height="10" rx="3" fill="#fdfbf7" stroke="#1e1e2d" strokeWidth="2" />
          {/* Stern Ninja eyes */}
          <path d="M 40,45 L 45,43" stroke="#1e1e2d" strokeWidth="2" />
          <path d="M 60,45 L 55,43" stroke="#1e1e2d" strokeWidth="2" />
          <circle cx="43" cy="46" r="1.5" fill="#000" />
          <circle cx="57" cy="46" r="1.5" fill="#000" />
          {/* Red forehead band */}
          <path d="M 31,31 L 69,31 L 66,26 L 34,26 Z" fill="#cc2525" stroke="#cc2525" />
        </svg>
      )
    },
    {
      id: 'doodle_cloud',
      name: 'Doodle Cloud',
      gender: 'sketcher' as const,
      description: 'Abstract thinker. Imagines castles in the notebook lines.',
      svg: (
        <svg className="w-16 h-16 stroke-ink-blue stroke-[2.2] fill-blue-50" viewBox="0 0 100 100">
          {/* Cloud body */}
          <path d="M 30,65 C 20,65 15,55 22,45 C 15,32 30,22 45,28 C 55,15 75,20 75,35 C 85,40 85,55 75,60 C 75,65 70,68 62,65 C 50,75 35,72 30,65 Z" strokeWidth="2.5" />
          {/* Smiley eyes */}
          <path d="M 38,42 Q 42,39 44,42" fill="none" strokeWidth="2.5" />
          <path d="M 52,42 Q 56,39 58,42" fill="none" strokeWidth="2.5" />
          {/* Rosy cheeks */}
          <ellipse cx="36" cy="49" rx="3" ry="1.5" fill="#bfdbfe" stroke="none" />
          <ellipse cx="60" cy="49" rx="3" ry="1.5" fill="#bfdbfe" stroke="none" />
          {/* Smile */}
          <path d="M 44,49 Q 48,54 52,49" fill="none" strokeWidth="2" />
        </svg>
      )
    }
  ];

  const handleOpenNotebook = () => {
    setIsOpen(true);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please input a creative username.');
      return;
    }
    if (name.length > 12) {
      setFormError('Name should be under 12 characters.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleCompleteSetup = () => {
    const selectedAvatar = AVATARS.find(a => a.id === avatarId);
    const resolvedGender = selectedAvatar ? selectedAvatar.gender : gender;

    const newPlayer: Player = {
      name: name.trim(),
      gender: resolvedGender,
      avatarId: avatarId,
      totalXP: 0,
      gamesPlayed: {},
      highScores: {},
      level: 1
    };

    onProfileCreated(newPlayer);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Floating background decorative assets */}
      <div className="absolute top-12 left-12 opacity-15 animate-float pointer-events-none hidden md:block">
        <svg className="w-20 h-20 stroke-ink-blue stroke-[1.5]" viewBox="0 0 100 100">
          <path d="M 10,50 Q 30,10 50,50 T 90,50" fill="none" strokeDasharray="3 3" />
          <path d="M 45,45 L 55,55 M 55,45 L 45,55" />
        </svg>
      </div>
      <div className="absolute bottom-16 right-16 opacity-15 animate-float pointer-events-none hidden md:block" style={{ animationDelay: '1.5s' }}>
        <svg className="w-16 h-16 stroke-ink-red stroke-[1.5]" viewBox="0 0 100 100">
          <polygon points="50,10 60,40 90,40 65,60 75,90 50,70 25,90 35,60 10,40 40,40" fill="none" />
        </svg>
      </div>

      {!isOpen ? (
        /* HERO LANDING PREVIEW (CLOSED NOTEBOOK STYLE) */
        <div 
          className="w-full max-w-lg bg-ink-blue text-white rounded-3xl p-8 shadow-[12px_14px_0px_0px_#1e1e2d] border-4 border-ink-dark cursor-pointer transform hover:rotate-[-1deg] hover:scale-[1.01] transition-transform duration-300 relative group"
          onClick={handleOpenNotebook}
          id="closed-notebook"
        >
          {/* Realistic brass binder rings */}
          <div className="absolute left-[-16px] top-12 flex flex-col gap-6 z-10">
            {[1, 2, 3, 4, 5].map(v => (
              <div key={v} className="w-8 h-4 rounded-full notebook-binder border border-gray-600 shadow-md"></div>
            ))}
          </div>

          <div className="flex justify-between items-center border-b border-blue-400/30 pb-3 mb-10">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 uppercase tracking-widest font-mono font-bold">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Interactive Exhibition</span>
            </div>
            <span className="text-[10px] text-gray-200 font-mono tracking-wider bg-black/30 px-2.5 py-0.5 rounded-full border border-blue-400/20">
              Grade A+ Workspace
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-giggle leading-none tracking-tight transform rotate-[-2deg] text-yellow-300 drop-shadow-md text-center py-2">
              <span className="relative inline-block text-white">
                The Sketch Book
                {/* Real Handdrawn red line under the title */}
                <svg className="absolute left-0 right-0 bottom-[-6px] w-full h-3 overflow-visible pointer-events-none" viewBox="0 0 100 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 2,5 Q 25,2 50,6 T 98,4 M 5,7 Q 45,4 95,5" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              <br/>
              <span className="text-yellow-300 font-semibold text-3xl sm:text-4xl block mt-2">Arcade Grid!</span>
            </h1>

            <p className="font-hand text-lg sm:text-xl text-blue-100 leading-relaxed font-semibold text-center">
              "Welcome to my hand-made notebook of miniature games! Simple to play, loaded with fun, and fully playable offline."
            </p>

            {/* Teacher's Welcome Sign */}
            <div className="bg-blue-900/40 border border-dashed border-blue-300/30 p-4 rounded-xl flex items-start gap-3">
              <Award className="w-8 h-8 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-sans font-bold text-gray-200 block uppercase tracking-wide">
                  To My Teacher:
                </span>
                <p className="text-xs font-hand text-blue-200 leading-normal">
                  Thank you for testing my workbook! I made beautiful games, a score calculator, and local saving for you to review and grade. Click below to begin.
                </p>
              </div>
            </div>

            <div className="text-xs text-blue-200 border-t border-dashed border-blue-400/50 pt-4 flex items-center justify-between font-sans">
              <span>✏️ Styled in carbon graphite ink</span>
              <span className="font-mono bg-ink-dark/40 px-2 py-0.5 rounded text-amber-200">Teacher Approved</span>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-highlighter-yellow text-ink-dark font-sans font-bold text-base px-8 py-3.5 rounded-xl border-3 border-ink-dark shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-y-[4px] cursor-pointer transition-transform duration-100"
                id="btn-open-notebook"
              >
                <BookOpen className="w-5 h-5 text-ink-red animate-pulse" />
                <span>Open Sketch Book</span>
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ONBOARDING PROFILE PROFILE CREATOR WIZARD */
        <div className="w-full max-w-xl bg-paper-cream rounded-3xl p-6 sm:p-8 border-3 border-ink-dark sketchy-shadow-lg relative overflow-hidden" id="notebook-onboarding">
          {/* Grid lines inside notebook */}
          <div className="absolute inset-0 paper-grid opacity-30 pointer-events-none"></div>

          {/* Binder ring hole dots on left */}
          <div className="absolute left-3 top-0 bottom-0 flex flex-col justify-around py-4 z-10 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-ink-dark"></div>
            ))}
          </div>

          <div className="pl-6">
            
            {/* Header progress info */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-pencil-gray uppercase font-semibold">
                New Player Profile / Step {step} of 2
              </span>
              <span className="text-[10px] bg-highlighter-yellow uppercase font-bold px-2 py-0.5 rounded border border-dashed border-pencil-gray">
                Offline Safe
              </span>
            </div>

            {/* STEP 1: TYPING PROFILE NICKNAME */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-giggle text-ink-blue inline-block scribble-highlight transform rotate-[-1deg]">
                    What is your name?
                  </h3>
                  <p className="text-xs text-pencil-gray font-sans mt-1.5">
                    Enter the name you want featured on the scoreboard.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase block text-ink-dark">
                    Your Name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (formError) setFormError('');
                      }}
                      placeholder="e.g. Guest Pencil"
                      className="w-full px-4 py-4 bg-white sketchy-border-blue text-lg text-ink-dark font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ink-blue"
                      maxLength={12}
                      autoFocus
                      id="onboarding-name-input"
                    />
                    <Pencil className="absolute right-4 top-4.5 w-5 h-5 text-pencil-gray animate-bounce" />
                  </div>
                  
                  {formError && (
                    <p className="text-xs text-ink-red font-semibold animate-pulse">
                      ⚠️ {formError}
                    </p>
                  )}

                  {/* Preset prompt helper */}
                  <div className="pt-2 flex gap-2 flex-wrap items-center">
                    <span className="text-[10px] text-pencil-gray uppercase font-mono font-bold">Suggested:</span>
                    {["Tauheed", "Student", "Guest", "Gamer"].map(preset => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setName(preset)}
                        className="text-xs px-2 py-0.5 rounded bg-white sketchy-border-sm hover:bg-paper-cream cursor-pointer font-sans"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-highlighter-pink text-ink-dark font-sans font-bold px-6 py-3.5 sketchy-border sketchy-shadow cursor-pointer hover:rotate-[1deg] active:scale-95 transition-transform"
                    id="btn-onboarding-next"
                  >
                    <span>Choose my avatar</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: AVATAR & GENDER SELECTION */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-giggle text-ink-red inline-block scribble-highlight-pink transform rotate-[1.5deg]">
                    Pick Your Pencil Avatar
                  </h3>
                  <p className="text-xs text-pencil-gray font-sans mt-1">
                    Select the character illustration that perfectly represents your playing attitude.
                  </p>
                </div>

                {/* Avatar selection grid */}
                <div className="grid grid-cols-2 gap-4">
                  {AVATARS.map(avatar => {
                    const isSelected = avatarId === avatar.id;
                    return (
                      <button
                        type="button"
                        key={avatar.id}
                        onClick={() => {
                          setAvatarId(avatar.id);
                          setGender(avatar.gender);
                        }}
                        className={`p-3 bg-white text-left sketchy-border-sm flex flex-col items-center justify-between relative cursor-pointer group transition-all duration-150 hover:scale-[1.02] ${
                          isSelected 
                            ? 'bg-yellow-50 sketchy-border-sm-blue ring-3 ring-ink-blue ring-offset-2' 
                            : 'hover:bg-paper-cream'
                        }`}
                        id={`avatar-choice-${avatar.id}`}
                      >
                        {avatar.svg}
                        <div className="text-center mt-2 w-full">
                          <span className="font-hand text-base font-extrabold text-ink-dark block font-bold">
                            {avatar.name}
                          </span>
                          <span className="text-[10.5px] text-pencil-gray block leading-tight font-sans mt-1 px-1 h-auto min-h-[40px] opacity-90 break-words whitespace-normal">
                            {avatar.description}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-ink-blue text-white text-[9px] font-mono uppercase font-bold tracking-wider animate-pulse">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit row */}
                <div className="pt-4 flex justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-pencil-gray hover:text-ink-dark underline font-sans cursor-pointer"
                  >
                    Go Back to Name Input
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteSetup}
                    className="flex items-center gap-2 bg-highlighter-green text-ink-dark font-sans font-bold px-8 py-3.5 sketchy-border sketchy-shadow cursor-pointer hover:rotate-[-1.5deg] active:scale-95 transition-transform"
                    id="btn-onboarding-complete"
                  >
                    <span>Enter Doodle Lobby!</span>
                    <Stars className="w-5 h-5 text-ink-blue animate-pulse" />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-pencil-gray font-mono mt-2">
                    🛡️ Privacy Protected: Nickname is hosted purely within your web browser cache. No tracking pixels used.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
