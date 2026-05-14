"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
} from "framer-motion";

/**
 * Cinematic CRT-dive transition — full-screen overlay played on demand
 * (e.g. when the user clicks the PC in the HeroRoom). Was previously a
 * scroll-pinned section; now it's a one-shot animation driven by an
 * internal MotionValue.
 *
 * Animation timeline (progress 0 → 1, ~3.5s):
 *   0.00–0.15  CRT image collapses vertically to a line (TV power-off)
 *   0.15–0.25  Holds as a bright horizontal scanline + "SIGNAL HOLD" tag
 *   0.25–0.85  Circuit board flythrough + burst — the "good part"
 *   0.85–1.00  Burst fades through to amber, blends into next section
 */
export function CRTDive({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete: () => void;
}) {
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!active) {
      progress.set(0);
      return;
    }
    const controls = animate(progress, 1, {
      duration: 3.5,
      ease: [0.65, 0, 0.35, 1],
      onComplete,
    });
    return () => controls.stop();
  }, [active, progress, onComplete]);

  // Pre-image (the green CRT view collapsing)
  const preScaleY = useTransform(progress, [0.02, 0.15], [1, 0.002]);
  const preOpacity = useTransform(progress, [0.13, 0.18], [1, 0]);
  const preBlur = useTransform(progress, [0.02, 0.15], [0, 6]);
  const preFilter = useTransform(preBlur, (b) => `blur(${b}px)`);

  // Hold-line stage
  const lineOpacity = useTransform(
    progress,
    [0.12, 0.16, 0.25, 0.3],
    [0, 1, 1, 0]
  );
  const lineScaleX = useTransform(progress, [0.15, 0.25, 0.32], [1, 1, 1.5]);
  const holdTagOpacity = useTransform(
    progress,
    [0.16, 0.2, 0.25, 0.28],
    [0, 1, 1, 0]
  );

  // Circuit travel stage
  const circuitOpacity = useTransform(
    progress,
    [0.25, 0.32, 0.82, 0.95],
    [0, 1, 1, 0]
  );
  const circuitScale = useTransform(progress, [0.25, 0.85], [0.4, 6]);
  const circuitRotate = useTransform(progress, [0.25, 0.95], [-8, 14]);
  const burstOpacity = useTransform(progress, [0.3, 0.4, 0.55], [0, 1, 0]);

  // Final fade to amber to blend into next section's back-room aesthetic
  const exitOverlayOpacity = useTransform(progress, [0.85, 1.0], [0, 1]);

  // RGB split intensity
  const rgbShift = useTransform(progress, [0, 0.18, 0.4, 0.7, 1], [0, 8, 12, 4, 0]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <BackgroundShift progress={progress} />

      {/* Stage 1: collapsing CRT image — full-bleed, no black bands */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          scaleY: preScaleY,
          opacity: preOpacity,
          filter: preFilter,
          transformOrigin: "center",
          background:
            "radial-gradient(ellipse at center, rgba(0,80,30,0.6) 0%, rgba(0,8,4,1) 80%)",
          boxShadow: "inset 0 0 120px rgba(0,255,65,0.3)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center font-pixel text-4xl text-phosphor text-glow-green tracking-[0.2em]">
          DARK GAME FACTORY
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </motion.div>

      {/* Stage 2: bright horizontal line (TV power-off) */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[2px] w-[60vw] -translate-x-1/2 -translate-y-1/2"
        style={{
          opacity: lineOpacity,
          scaleX: lineScaleX,
          background:
            "linear-gradient(90deg, transparent 0%, #00ff41 15%, #fff 50%, #00f0ff 85%, transparent 100%)",
          boxShadow:
            "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(0,240,255,0.6)",
        }}
      />
      <motion.div
        className="absolute left-1/2 top-[calc(50%+24px)] -translate-x-1/2 font-mono text-[10px] tracking-[0.5em] text-neon-cyan text-glow-cyan"
        style={{ opacity: holdTagOpacity }}
      >
        // SIGNAL HOLD — RE-ROUTING
      </motion.div>

      {/* Stage 3: circuit board flythrough */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: circuitOpacity }}
      >
        <motion.div
          style={{
            scale: circuitScale,
            rotate: circuitRotate,
            width: "100%",
            height: "100%",
          }}
        >
          <CircuitSVG />
        </motion.div>
      </motion.div>

      {/* Burst flash */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: burstOpacity,
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.85) 0%, rgba(0,240,255,0.4) 20%, rgba(255,46,196,0.2) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      <ChromaticOverlay shift={rgbShift} />

      {/* Exit overlay — fades to amber so it blends into the games section */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-25"
        style={{
          opacity: exitOverlayOpacity,
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(255,176,0,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(150,80,20,0.1) 0%, transparent 50%), #0a0805",
        }}
      />

      {/* Scanlines through the whole thing */}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)",
        }}
      />
    </div>
  );
}

function BackgroundShift({ progress }: { progress: MotionValue<number> }) {
  const bg = useTransform(progress, (p) => {
    if (p < 0.3)
      return "radial-gradient(ellipse at center, rgba(0,40,15,0.85) 0%, #02100a 100%)";
    if (p < 0.5)
      return "radial-gradient(ellipse at center, rgba(0,40,60,0.9) 0%, #01080c 100%)";
    if (p < 0.75)
      return "radial-gradient(ellipse at center, rgba(40,0,40,0.9) 0%, #100410 100%)";
    return "radial-gradient(ellipse at center, rgba(40,20,0,0.9) 0%, #0a0805 100%)";
  });
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ background: bg as unknown as string }}
    />
  );
}

function ChromaticOverlay({ shift }: { shift: MotionValue<number> }) {
  const r = useTransform(shift, (s) => `translateX(${s}px)`);
  const b = useTransform(shift, (s) => `translateX(${-s}px)`);
  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
        style={{
          transform: r,
          background:
            "linear-gradient(90deg, rgba(255,0,80,0.0) 0%, rgba(255,0,80,0.06) 50%, rgba(255,0,80,0.0) 100%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
        style={{
          transform: b,
          background:
            "linear-gradient(90deg, rgba(0,160,255,0.0) 0%, rgba(0,160,255,0.06) 50%, rgba(0,160,255,0.0) 100%)",
        }}
      />
    </>
  );
}

function CircuitSVG() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#ff2ec4" />
          <stop offset="100%" stopColor="#ffb000" />
        </linearGradient>
        <filter id="traceGlow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        stroke="url(#traceGrad)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.85"
        filter="url(#traceGlow)"
      >
        <path d="M0 100 L300 100 L320 120 L500 120 L520 140 L800 140" />
        <path d="M0 200 L150 200 L170 220 L400 220 L420 200 L800 200" />
        <path d="M0 300 L250 300 L270 320 L450 320 L470 300 L800 300" />
        <path d="M0 400 L180 400 L200 380 L500 380 L520 400 L800 400" />
        <path d="M0 500 L350 500 L370 480 L600 480 L620 500 L800 500" />
        <path d="M100 0 L100 200 L120 220 L120 600" />
        <path d="M280 0 L280 150 L300 170 L300 600" />
        <path d="M500 0 L500 250 L520 270 L520 600" />
        <path d="M680 0 L680 350 L700 370 L700 600" />
      </g>

      <g fill="#00f0ff" filter="url(#traceGlow)">
        {[
          [100, 200],
          [280, 150],
          [500, 250],
          [680, 350],
          [320, 120],
          [170, 220],
          [270, 320],
          [200, 380],
          [370, 480],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" />
        ))}
      </g>

      {[
        { path: "M0 100 L300 100 L320 120 L500 120 L520 140 L800 140", dur: 1.6, fill: "#00f0ff" },
        { path: "M0 300 L250 300 L270 320 L450 320 L470 300 L800 300", dur: 2.0, fill: "#ff2ec4" },
        { path: "M100 0 L100 200 L120 220 L120 600", dur: 1.8, fill: "#ffb000" },
        { path: "M500 0 L500 250 L520 270 L520 600", dur: 2.2, fill: "#00ff41" },
      ].map((p, i) => (
        <circle key={i} r="3.5" fill={p.fill} filter="url(#traceGlow)">
          <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" path={p.path} />
        </circle>
      ))}
    </svg>
  );
}
