import React, { useRef, useState, useEffect } from 'react';
import { Paintbrush, Eraser, Volume2, Sparkles, AlertCircle, RefreshCw, Music, Award, HelpCircle } from 'lucide-react';

interface DoodleCanvasProps {
  soundEnabled: boolean;
  onAppreciationSent: (message: string) => void;
}

interface StampItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const DoodleCanvas: React.FC<DoodleCanvasProps> = ({ soundEnabled, onAppreciationSent }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#1e293b'); // Charcoal ink
  const [penWidth, setPenWidth] = useState<number>(3);
  const [activeTool, setActiveTool] = useState<'PENCIL' | 'ERASER' | 'STAMP'>('PENCIL');
  
  // Stamp options (perfect for kids and your niece!)
  const [selectedStamp, setSelectedStamp] = useState<string>('🦋');
  const [stamps, setStamps] = useState<StampItem[]>([]);

  // Sound Synth States (for classrooms, demonstrating computer hardware sound-wave generation)
  const [synthWaveform, setSynthWaveform] = useState<OscillatorType>('triangle');
  const [synthFreq, setSynthFreq] = useState<number>(440);
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);
  const [bubbleText, setBubbleText] = useState<string>("Try freehand drawing, stamp sweet animals, or test my ICT sound board waves! 🎧");

  const colors = [
    { name: 'Charcoal Ink ✏️', value: '#1e293b' },
    { name: 'Classroom Red 🍎', value: '#e11d48' },
    { name: 'Highlighter Green 🟢', value: '#16a34a' },
    { name: 'Royal Blue ✒️', value: '#2563eb' },
    { name: 'Gold Sparkle 💛', value: '#ca8a04' },
    { name: 'Highlighter Pink 🌸', value: '#db2777' },
  ];

  const stampsList = [
    { emoji: '🦋', label: 'Butterfly' },
    { emoji: '🐱', label: 'Kitten' },
    { emoji: '🐶', label: 'Puppy' },
    { emoji: '🦄', label: 'Unicorn' },
    { emoji: '🌈', label: 'Rainbow' },
    { emoji: '🎈', label: 'Balloon' },
    { emoji: '🍀', label: 'Clover' },
    { emoji: '⭐', label: 'Glow Star' },
    { emoji: '🏆', label: 'Winner Cup' },
  ];

  // Synthesize sound effects using standard AudioContext logic safely
  const triggerCustomSynthSound = (frequency: number, type: OscillatorType = 'triangle', duration = 0.15, sweep = false) => {
    if (!soundEnabled) return;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(frequency, now);

      if (sweep) {
        // Creative sweep sweep frequency upwards (sound jump)
        osc.frequency.exponentialRampToValueAtTime(frequency * 2.2, now + duration);
      }

      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch (_) {
      // Audio fails are caught gracefully
    }
  };

  // Fun sound cues built mathematically to impress on ICT classes!
  const playRetroSoundEffect = (fxType: 'BELL' | 'SCRIBBLE' | 'COIN' | 'JUMP' | 'TRIUMPH') => {
    if (!soundEnabled) return;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      if (fxType === 'BELL') {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // Sweet bell chime A5

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(885, now); // Slight detune for ring resonance

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
        setBubbleText("🔔 *Ding Dong!* Electric ICT Classroom Bell Rang!");
        onAppreciationSent("Classroom Electric Bell ringing!");
      }

      else if (fxType === 'SCRIBBLE') {
        // Fast scratchy noise burst imitating a heavy pencil doodle
        for (let i = 0; i < 6; i++) {
          const t = now + (i * 0.05);
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100 + (Math.random() * 300), t);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          gain.gain.setValueAtTime(0.015, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
          osc.start(t);
          osc.stop(t + 0.04);
        }
        setBubbleText("✏️ *Skritch Skrotch!* Virtual pencil sketching graphite noises!");
      }

      else if (fxType === 'COIN') {
        // Classical twin 8-bit coin jump
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5 note
        osc.frequency.setValueByEventAtTime(1318.51, now + 0.08); // E6 note
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.setValueAtTime(0.04, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.3);
        setBubbleText("🪙 *Kling!* +10 Bonus XP Coin Collect Sound triggered!");
      }

      else if (fxType === 'JUMP') {
        // Synthesizer frequency sweep rising up!
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        setBubbleText("🚀 *Zoooom!* Ascending frequency wave! Logic Sweep!");
      }

      else if (fxType === 'TRIUMPH') {
        // Gorgeous major triad chord arpeggio
        const chordNotes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        chordNotes.forEach((freq, idx) => {
          const delay = idx * 0.1;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + delay);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          gain.gain.setValueAtTime(0.04, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.6);
          osc.start(now + delay);
          osc.stop(now + delay + 0.6);
        });
        setBubbleText("🏆 *Dada-da-daaa!* ICT Excellence Academic Fanfare Chord!");
        onAppreciationSent("ICT Triumph Chord triggered! Outstanding coding progress on display!");
      }

    } catch (e) {
      // context errors
    }
  };

  // Real-time custom-wave play loop on mouse dragging
  const testInteractiveWave = () => {
    triggerCustomSynthSound(synthFreq, synthWaveform, 0.2, false);
  };

  // Adjust canvas width relative to actual container wrapper bounds
  const resizeCanvasToContainer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = 300; // Fixed aesthetic height

      // Redraw simple layout helpers or lines
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
      }
    }
  };

  useEffect(() => {
    resizeCanvasToContainer();
    window.addEventListener('resize', resizeCanvasToContainer);
    return () => window.removeEventListener('resize', resizeCanvasToContainer);
  }, []);

  // Set default initial stylus specs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = activeTool === 'ERASER' ? '#ffffff' : penColor;
      ctx.lineWidth = activeTool === 'ERASER' ? 30 : penWidth;
    }
  }, [penColor, penWidth, activeTool]);

  // Handle Freehand Mouse events
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startWriting = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getCoordinates(e);

    if (activeTool === 'STAMP') {
      // Place a sweet stick-on emoji stamp! Perfect for kids/your niece.
      const scaleRange = 0.8 + Math.random() * 0.4;
      const angleRange = -20 + Math.random() * 40;
      const newStamp: StampItem = {
        id: Date.now().toString() + Math.random().toString(),
        emoji: selectedStamp,
        x: pos.x,
        y: pos.y,
        scale: scaleRange,
        rotation: angleRange
      };
      setStamps([...stamps, newStamp]);
      
      // play customized synth squeek corresponding to the stamp placement!
      const pitches = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C,D,E,F,G,A,B
      const pitch = pitches[Math.floor(Math.random() * pitches.length)];
      triggerCustomSynthSound(pitch, 'sine', 0.12, true);
      
      setBubbleText(`Stamped a matching cute little ${selectedStamp} mascot! Tap to add more!`);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
      
      // play tiny high frequency scratch sound for feedback
      if (soundEnabled && Math.random() > 0.4) {
        triggerCustomSynthSound(400 + Math.random() * 100, 'triangle', 0.05);
      }
    }
  };

  const drawProgress = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === 'STAMP') return;
    const pos = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      // Occasional pencil drawing noise loop
      if (soundEnabled && Math.random() > 0.85) {
        triggerCustomSynthSound(150 + Math.random() * 100, activeTool === 'ERASER' ? 'sine' : 'sawtooth', 0.03);
      }
    }
  };

  const endWriting = () => {
    setIsDrawing(false);
  };

  const handleClearEverything = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStamps([]);
    setBubbleText("✏️ Sheet wiped clean and pristine! Ready for new ICT ideas!");
    playRetroSoundEffect('SCRIBBLE');
  };

  return (
    <div className="bg-[#fcfdf8] p-6 rounded-3xl sketchy-border-blue relative shadow-sm overflow-hidden text-left" id="doodle-sandbox-board">
      {/* Absolute background paper watermarks */}
      <div className="absolute inset-0 paper-grid opacity-15 pointer-events-none"></div>

      <div className="relative z-10 space-y-5">
        
        {/* Header decoration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-gray-300 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-ink-blue uppercase bg-blue-100 px-2.5 py-0.5 rounded-full border border-dashed border-ink-blue inline-block">
              🎨 Interactive Sandbox Creator
            </span>
            <h3 className="font-giggle text-2xl text-ink-dark flex items-center gap-1.5 leading-none">
              <span>Creative Ink Sandbox & Sound Playground</span>
            </h3>
            <p className="text-xs text-pencil-gray font-sans">
              Freehand sketch signatures, stamp funny icons for kids, and play synthesized waves built with raw code.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleClearEverything}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-ink-red font-semibold font-sans text-xs rounded-xl border border-dashed border-ink-red cursor-pointer transition-all active:scale-95 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3 text-ink-red" />
            <span>Wipe Sandbox Slate</span>
          </button>
        </div>

        {/* Bubble Teacher Bot comment box */}
        <div className="bg-amber-50/50 rounded-xl p-3 border border-dashed border-amber-300 flex items-start gap-2.5 relative">
          <span className="text-2xl animate-spin select-none">🧙‍♂️</span>
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-amber-800 font-bold">Interactive Sandbox Guide</span>
            <p className="text-xs text-ink-dark font-sans leading-relaxed">
              {bubbleText}
            </p>
          </div>
        </div>

        {/* Main Grid: Left Side Interactive Sheet, Right Side Wave Synth Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: VIRTUAL WRITE-ON SHEET (Lg: 8 cols) */}
          <div className="lg:col-span-8 space-y-3 col-span-1">
            <div className="flex flex-wrap gap-2 items-center text-xs">
              
              {/* Tool selections */}
              <div className="flex bg-white rounded-lg border border-ink-dark overflow-hidden divide-x divide-ink-dark">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('PENCIL');
                    setBubbleText("Pencil stylus active. Custom charcoal graphite is loaded!");
                    playRetroSoundEffect('SCRIBBLE');
                  }}
                  className={`px-3 py-1.5 font-bold font-sans cursor-pointer flex items-center gap-1 transition-all ${
                    activeTool === 'PENCIL' ? 'bg-highlighter-yellow text-ink-dark font-black' : 'bg-white text-pencil-gray hover:bg-slate-50'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>Pencil Stylus</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('ERASER');
                    setBubbleText("Eraser block loaded! Drag across lines to clean graphite tracks.");
                    triggerCustomSynthSound(220, 'sine', 0.15);
                  }}
                  className={`px-3 py-1.5 font-bold font-sans cursor-pointer flex items-center gap-1 transition-all ${
                    activeTool === 'ERASER' ? 'bg-highlighter-pink text-ink-dark font-black' : 'bg-white text-pencil-gray hover:bg-slate-50'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser Pad</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('STAMP');
                    setBubbleText("Stamp mascot active! Select a cute emoji from below and click anywhere inside the paper sheet!");
                    triggerCustomSynthSound(880, 'sine', 0.12, true);
                  }}
                  className={`px-3 py-1.5 font-bold font-sans cursor-pointer flex items-center gap-1 transition-all ${
                    activeTool === 'STAMP' ? 'bg-highlighter-green text-ink-dark font-black' : 'bg-white text-pencil-gray hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Stamp Stickers</span>
                </button>
              </div>

              {/* Responsive colors, only visible if pencil tool is selected */}
              {activeTool === 'PENCIL' && (
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-dashed border-slate-300">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        setPenColor(c.value);
                        triggerCustomSynthSound(440 + colors.indexOf(c) * 80, 'sine', 0.08);
                      }}
                      className="w-5 h-5 rounded-full border border-black/30 cursor-pointer active:scale-95 transition-all flex items-center justify-center"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    >
                      {penColor === c.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Adjust thickness slider, visible for drawing/erasing */}
              {activeTool !== 'STAMP' && (
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <span className="font-mono text-[9px] text-pencil-gray font-bold uppercase">Thickness: {penWidth}px</span>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={penWidth}
                    onChange={(e) => setPenWidth(parseInt(e.target.value, 10))}
                    className="w-16 accent-ink-blue cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Stamp selector drawer, visible if stamp is selected */}
            {activeTool === 'STAMP' && (
              <div className="p-2.5 bg-amber-50/20 rounded-xl border border-dashed border-amber-300 flex flex-wrap gap-2 items-center animate-fadeIn">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-800">Choose Stamp sticker (sweet for children/your niece!):</span>
                <div className="flex gap-1.5 overflow-x-auto flex-nowrap scrollbar-none py-0.5">
                  {stampsList.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => {
                        setSelectedStamp(item.emoji);
                        triggerCustomSynthSound(523.25 + stampsList.findIndex(s=>s.emoji === item.emoji)*40, 'triangle', 0.1);
                        setBubbleText(`Selected [${item.emoji} ${item.label}] stamp. Now tap anywhere on the drawing pad to paste it!`);
                      }}
                      className={`text-xl p-1 px-2.5 rounded-lg border transition-all cursor-pointer ${
                        selectedStamp === item.emoji 
                          ? 'bg-amber-100 border-2 border-amber-600 scale-110 shadow-xs' 
                          : 'bg-white border-dashed border-gray-300 hover:scale-105'
                      }`}
                      title={item.label}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Drawing Pad Area */}
            <div 
              ref={containerRef}
              className="relative w-full rounded-2xl sketchy-border-red bg-white overflow-hidden shadow-xs cursor-crosshair min-h-[300px]"
              style={{
                backgroundImage: 'radial-gradient(#cad1dd 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Left double red line margin layout */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 border-l-2 border-red-300 pointer-events-none opacity-45"></div>

              {/* Vector Paper Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={startWriting}
                onMouseMove={drawProgress}
                onMouseUp={endWriting}
                onMouseLeave={endWriting}
                onTouchStart={startWriting}
                onTouchMove={drawProgress}
                onTouchEnd={endWriting}
                className="absolute inset-0 z-10 w-full h-full block"
              />

              {/* Renders placed interactive sticker stamps with custom coordinate matrices */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {stamps.map((item) => (
                  <div
                    key={item.id}
                    className="absolute text-3xl select-none select-none animate-fadeIn flex items-center justify-center pointer-events-auto"
                    style={{
                      left: item.x - 20,
                      top: item.y - 20,
                      transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
                      transition: 'transform 0.15s ease'
                    }}
                    title="Click/Tap to clear this pin"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Double clicking or tapping stamp lets them erase it
                      setStamps(stamps.filter((s) => s.id !== item.id));
                      triggerCustomSynthSound(150, 'sawtooth', 0.1);
                      setBubbleText("Stamped sticker cleared away!");
                    }}
                  >
                    <span className="cursor-pointer font-bold select-none text-4xl leading-none block drop-shadow-sm filter hover:scale-125 transition-transform">{item.emoji}</span>
                  </div>
                ))}
              </div>

              {/* Helper watermark instructions inside canvas container */}
              <div className="absolute bottom-3 right-3 z-0 pointer-events-none text-[9px] font-mono text-pencil-gray uppercase font-semibold">
                ✒️ Student drawing pad grid • 📌 Stamps click & dynamic pitches
              </div>
            </div>
          </div>

          {/* COLUMN 2: ICT HARDWARE SOUNDBOARD SYNTH CONSOLE (Lg: 4 cols) */}
          <div className="lg:col-span-4 bg-[#fcfcfa] p-5 rounded-2xl border-2 border-dashed border-pencil-gray space-y-4 col-span-1">
            
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#ca8a04] uppercase block">
                🔊 Audio Wave physics
              </span>
              <h4 className="font-hand text-lg text-ink-dark flex items-center gap-1">
                <span>ICT Synthesizer Console</span>
              </h4>
              <p className="text-[10px] text-pencil-gray leading-normal">
                Perfect for classroom training! Demonstrate oscillator waveforms, frequency, and custom retro-game sound-effects compiled from scratch.
              </p>
            </div>

            {/* Retro Synthesizer FX trigger buttons */}
            <div className="space-y-2">
              <span className="text-[8px] font-mono uppercase text-pencil-gray font-bold block">Preset Classroom Sounds:</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                
                <button
                  type="button"
                  onClick={() => playRetroSoundEffect('BELL')}
                  className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl font-sans font-bold flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 text-amber-950"
                >
                  <span className="text-lg">🔔</span>
                  <span>Electric School Bell</span>
                </button>

                <button
                  type="button"
                  onClick={() => playRetroSoundEffect('SCRIBBLE')}
                  className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-sans font-bold flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 text-slate-900"
                >
                  <span className="text-lg">✏️</span>
                  <span>Charcoal Scribbles</span>
                </button>

                <button
                  type="button"
                  onClick={() => playRetroSoundEffect('COIN')}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl font-sans font-bold flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 text-emerald-950"
                >
                  <span className="text-lg">🪙</span>
                  <span>+10 XP Retro Coin</span>
                </button>

                <button
                  type="button"
                  onClick={() => playRetroSoundEffect('JUMP')}
                  className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl font-sans font-bold flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 text-blue-950"
                >
                  <span className="text-lg">🚀</span>
                  <span>Logic Wave Sweep</span>
                </button>

              </div>

              <button
                type="button"
                onClick={() => playRetroSoundEffect('TRIUMPH')}
                className="w-full p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 text-indigo-950"
              >
                <span>🏆</span>
                <span>Play Academic Triumph Fanfare</span>
              </button>
            </div>

            {/* Custom Synthesizer Controller Wave selector */}
            <div className="space-y-3 pt-3 border-t border-dashed border-slate-200">
              <span className="text-[8px] font-mono uppercase text-pencil-gray font-bold block">Live Sound Oscillator Lab:</span>

              {/* Waveform Selector */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-gray-600 uppercase">1. Waveform Envelope Type:</label>
                <div className="grid grid-cols-4 gap-1 text-[9px] font-mono font-bold">
                  {(['sine', 'triangle', 'sawtooth', 'square'] as OscillatorType[]).map((wave) => (
                    <button
                      key={wave}
                      type="button"
                      onClick={() => {
                        setSynthWaveform(wave);
                        triggerCustomSynthSound(440, wave, 0.2);
                        setBubbleText(`Oscillator waveform changed to raw [${wave.toUpperCase()}] envelope wave!`);
                      }}
                      className={`py-1 rounded text-center border cursor-pointer uppercase transition-all ${
                        synthWaveform === wave 
                          ? 'bg-ink-dark text-white border-black scale-105 shadow-xs font-black' 
                          : 'bg-white text-pencil-gray border-dashed border-gray-300'
                      }`}
                    >
                      {wave}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pitch Frequency Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-600 uppercase">
                  <span>2. Audio Frequency (Pitch)</span>
                  <span className="font-mono text-ink-blue">{(synthFreq).toFixed(0)} Hz ({synthFreq >= 440 ? 'High' : 'Low'})</span>
                </div>
                <input
                  type="range"
                  min={110}
                  max={880}
                  step={5}
                  value={synthFreq}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSynthFreq(val);
                    // play live tone corresponding to the sliding!
                    triggerCustomSynthSound(val, synthWaveform, 0.08);
                  }}
                  className="w-full accent-ink-blue cursor-pointer"
                />
              </div>

              {/* Play live synthesiser button */}
              <button
                type="button"
                onClick={testInteractiveWave}
                className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-ink-dark rounded-xl border border-black text-xs font-extrabold cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Trigger Oscillator Impulse</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
