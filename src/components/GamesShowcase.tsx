"use client";

import { motion } from "framer-motion";
import { Gamepad2, Swords, Dices, Mountain } from "lucide-react";

type Game = {
  slug: string;
  title: string;
  tag: string;
  blurb: string;
  status: string;
  stack: string[];
  icon: React.ReactNode;
  accent: string;
  url?: string;
};

const GAMES: Game[] = [
  {
    slug: "nest_run",
    title: "NEST_RUN",
    tag: "realtime arena",
    blurb:
      "Push the cart. Spawn commanders. Spring the trap. A realtime arena prototype with RTS-flavored unit control.",
    status: "in active dev",
    stack: ["Colyseus", "Node", "Docker", "Canvas"],
    icon: <Swords className="h-5 w-5" />,
    accent: "from-amber-500/40 to-orange-700/10",
    url: "https://nestrun.darkgamefactory.com",
  },
  {
    slug: "beasthunter",
    title: "BEASTHUNTER",
    tag: "multiplayer hunt",
    blurb:
      "Tame wolves, tigers, spiders. Cash them in at the safe zone for points. Phaser 3 multiplayer with tile-mapped worlds.",
    status: "prototype",
    stack: ["Phaser 3", "Colyseus", "Tiled"],
    icon: <Gamepad2 className="h-5 w-5" />,
    accent: "from-emerald-500/40 to-zinc-800/10",
    url: "https://beasthunter-e3g4aahtdfbkg5a3.canadacentral-01.azurewebsites.net/",
  },
  {
    slug: "arcane_climbers",
    title: "ARCANE CLIMBERS",
    tag: "vertical platformer",
    blurb:
      "Scale the tower. Spell your way up. A magic-fueled climbing prototype where every reach is a small risk.",
    status: "prototype",
    stack: ["Phaser 3", "Node", "Azure"],
    icon: <Mountain className="h-5 w-5" />,
    accent: "from-violet-500/40 to-indigo-900/10",
    url: "https://arcaneclimbers-fhgge6c8cmarfaax.canadacentral-01.azurewebsites.net/",
  },
  {
    slug: "tenzi",
    title: "TENZI",
    tag: "dice / casual",
    blurb:
      "Roll ten dice to match. Beat your best time. Multiplayer dice with persistent avatars. Live on the web.",
    status: "shipped",
    stack: ["React", "Node", "localStorage"],
    icon: <Dices className="h-5 w-5" />,
    accent: "from-rose-500/40 to-purple-800/10",
    url: "https://tenzi.darkgamefactory.com",
  },
];

export function GamesShowcase() {
  return (
    <section
      id="games"
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0805] px-4 py-24 sm:px-8"
    >
      {/* Dirty back-room ambient texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(255,176,0,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(150,80,20,0.1) 0%, transparent 50%)",
        }}
      />
      <div className="grain" />
      <div className="dust-streaks pointer-events-none absolute inset-0" />

      {/* Section header — looks like a label-maker tape strip */}
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-amber-crt/30" />
          <div className="rounded-sm bg-amber-crt/10 px-3 py-1 font-mono text-[10px] tracking-[0.4em] text-amber-crt text-glow-amber">
            /var/games/active
          </div>
          <div className="h-px flex-1 bg-amber-crt/30" />
        </div>
        <h2 className="mb-2 font-pixel text-4xl text-amber-crt text-glow-amber sm:text-5xl">
          THE BACK ROOM
        </h2>
        <p className="mb-12 max-w-xl font-mono text-sm text-amber-crt/60">
          Three prototypes wired up to a surge protector that has seen things.
          Click in.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((g, i) => {
            const cardProps = {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-80px" },
              transition: { duration: 0.6, delay: i * 0.12 },
              className: "group relative block",
            };
            return g.url ? (
              <motion.a
                key={g.slug}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                {...cardProps}
              >
                <GameCard game={g} />
              </motion.a>
            ) : (
              <motion.div key={g.slug} {...cardProps}>
                <GameCard game={g} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <div className="relative h-full overflow-hidden rounded-md border border-amber-crt/20 bg-gradient-to-br from-[#1a1410] to-[#0a0805] p-5 transition-all hover:border-amber-crt/60 hover:shadow-[0_0_30px_rgba(255,176,0,0.15)]">
      {/* Top label */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-crt/80">
          {game.icon}
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
            {game.tag}
          </span>
        </div>
        <span className="rounded-sm border border-amber-crt/30 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-amber-crt/70">
          {game.status}
        </span>
      </div>


      {/* Placeholder "screenshot" box w/ scanlines */}
      <div
        className={`relative mb-4 aspect-video w-full overflow-hidden rounded-sm border border-amber-crt/20 bg-gradient-to-br ${game.accent}`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-pixel text-2xl text-amber-crt/80 text-glow-amber">
            {game.title}
          </span>
        </div>
        {game.url ? (
          <div className="absolute bottom-1 right-2 flex items-center gap-1 font-mono text-[9px] tracking-widest text-amber-crt/80 text-glow-amber transition-all group-hover:text-amber-crt">
            PLAY <span>↗</span>
          </div>
        ) : (
          <div className="absolute bottom-1 right-2 font-mono text-[9px] tracking-widest text-amber-crt/40">
            NO SIGNAL
          </div>
        )}
      </div>

      <h3 className="mb-2 font-pixel text-xl text-amber-crt text-glow-amber">
        {game.title}
      </h3>
      <p className="mb-4 font-mono text-xs leading-relaxed text-zinc-400">
        {game.blurb}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {game.stack.map((s) => (
          <span
            key={s}
            className="rounded-sm border border-zinc-700 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Hover frame glitch */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-px bg-amber-crt" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-amber-crt" />
      </div>
    </div>
  );
}
