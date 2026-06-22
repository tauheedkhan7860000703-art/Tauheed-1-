import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const DoodleMorphCredit: React.FC = () => {
  const words = [
    "Made with Love by Tauheed 💖",
    "Designed & Sketched by Tauheed 🎨",
    "Compiled with Code by Tauheed 🚀",
    "Handcrafted with Graphite by Tauheed ✏️",
    "Polished for Teachers & Friends by Tauheed 🏆"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Classic typewriter morphing effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentIndex];

    if (!isDeleting) {
      // Typing
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        setTypingSpeed(80 + Math.random() * 40); // Natural random human variation
      }, typingSpeed);

      if (displayText === currentWord) {
        // Hold before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      // Deleting
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setTypingSpeed(40);
      }, typingSpeed);

      if (displayText === "") {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setTypingSpeed(150);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex]);

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-12 mb-4 text-center relative max-w-lg mx-auto" id="doodle-morph-badge">
      
      {/* Background custom style tag for organic liquid ink morphing animation */}
      <style>{`
        @keyframes inkMorphBlob {
          0% {
            border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
            transform: rotate(0deg) scale(1);
          }
          33% {
            border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%;
            transform: rotate(45deg) scale(1.03);
          }
          66% {
            border-radius: 28% 72% 35% 65% / 40% 42% 58% 60%;
            transform: rotate(-30deg) scale(0.97);
          }
          100% {
            border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
            transform: rotate(360deg) scale(1);
          }
        }
        .morphing-ink-blob {
          animation: inkMorphBlob 15s infinite ease-in-out;
        }
      `}</style>

      {/* Decorative Morphing Ink Canvas Outer Ring */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600 to-green-500 rounded-full opacity-10 blur-xl"></div>
      
      {/* Liquid morphing paper badge item */}
      <div className="relative w-72 h-36 flex flex-col items-center justify-center border-2 border-slate-950 bg-white morphing-ink-blob shadow-md p-6 overflow-hidden">
        {/* Sketchy binder paper background pattern inside badging */}
        <div className="absolute inset-0 paper-grid opacity-15 pointer-events-none"></div>

        {/* Small sparkling side dots */}
        <div className="absolute top-4 left-6 text-emerald-600 animate-bounce text-xs">✨</div>
        <div className="absolute bottom-4 right-6 text-amber-500 animate-bounce delay-150 text-xs">⭐</div>

        {/* Floating Heart icon */}
        <div className="mb-2 bg-rose-50 border border-rose-300 w-8 h-8 rounded-full flex items-center justify-center shadow-xs">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        {/* Dynamic morphing text element */}
        <div className="h-10 flex items-center justify-center">
          <span className="font-hand font-extrabold text-slate-900 text-sm sm:text-base tracking-wide whitespace-normal leading-tight h-auto">
            {displayText}
            <span className="inline-block w-1 h-4 bg-slate-900 ml-0.5 animate-pulse"></span>
          </span>
        </div>

        {/* Small watermark tag inside */}
        <span className="text-[9px] font-mono font-bold tracking-widest text-[#15803d] uppercase mt-2 select-none">
          ⭐ Academic Art Certificate ⭐
        </span>
      </div>

      {/* Underlined feedback note */}
      <p className="text-[11px] font-hand text-pencil-gray font-bold max-w-xs mt-3 leading-tight opacity-80">
        "A piece of functional code is worth a thousand textbook pages!" Let's keep exploring!
      </p>

    </div>
  );
};
