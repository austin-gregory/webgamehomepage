"use client";

import { motion } from "framer-motion";
import { Mail, Github, Twitter, Rss, Terminal } from "lucide-react";

const POSTS = [
  {
    date: "2026.05.12",
    title: "BOOT SEQUENCE: WHY DARK GAME FACTORY",
    blurb:
      "Why one operator with an AI pair beats a 12-person studio at prototype velocity — and where it still breaks.",
  },
  {
    date: "2026.04.28",
    title: "NEST_RUN: THE CART MECHANIC",
    blurb:
      "How a single pushable object turned into the entire game loop. Notes on emergent objectives.",
  },
  {
    date: "2026.04.05",
    title: "SHIPPING TENZI MULTIPLAYER",
    blurb:
      "From a single-player dice toy to persistent avatars + leaderboards. Postmortem on socket auth.",
  },
];

export function DevlogContact() {
  return (
    <section
      id="signal"
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0805] px-4 py-24 sm:px-8"
    >
      {/* Back-room amber ambient — matches the games section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(255,176,0,0.1) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(150,80,20,0.12) 0%, transparent 50%)",
        }}
      />
      <div className="grain" />
      {/* Animated amber beam */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background:
            "linear-gradient(180deg, transparent, #ffb000, #cc8800, transparent)",
          filter: "blur(1px)",
        }}
        animate={{ x: ["0%", "100vw"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.4fr_1fr]">
        {/* Devlog */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <Rss className="h-4 w-4 text-amber-crt" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-amber-crt text-glow-amber">
              /dev/log
            </span>
          </div>
          <h2 className="mb-10 font-pixel text-4xl text-amber-crt text-glow-amber sm:text-5xl">
            TRANSMISSIONS
          </h2>

          <div className="space-y-4">
            {POSTS.map((p, i) => (
              <motion.a
                key={p.title}
                href="#"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group block rounded-md border border-amber-crt/20 bg-[#1a1410]/60 p-5 backdrop-blur transition-all hover:border-amber-crt/60 hover:bg-[#1a1410]/80 hover:shadow-[0_0_24px_rgba(255,176,0,0.18)]"
              >
                <div className="mb-1 font-mono text-[10px] tracking-[0.3em] text-amber-dim">
                  {p.date}
                </div>
                <div className="font-pixel text-xl text-zinc-100 transition-colors group-hover:text-amber-crt">
                  {p.title}
                </div>
                <div className="mt-2 font-mono text-xs leading-relaxed text-zinc-400">
                  {p.blurb}
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <Terminal className="h-4 w-4 text-amber-dim" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-amber-dim">
              /dev/ttyS0
            </span>
          </div>
          <h2 className="mb-6 font-pixel text-4xl text-amber-crt text-glow-amber sm:text-5xl">
            OPEN A CHANNEL
          </h2>
          <p className="mb-8 font-mono text-sm leading-relaxed text-zinc-400">
            Solo studio. No interns to filter the inbox. If you build games,
            tools for game devs, or you&apos;re looking for an AI-native
            collaborator — say hello.
          </p>

          <div className="space-y-3">
            <ContactRow
              icon={<Mail className="h-4 w-4" />}
              label="email"
              value="aag5194@outlook.com"
              href="mailto:aag5194@outlook.com"
            />
            <ContactRow
              icon={<Github className="h-4 w-4" />}
              label="github"
              value="@austin-gregory"
              href="https://github.com/austin-gregory"
            />
            <ContactRow
              icon={<Twitter className="h-4 w-4" />}
              label="x / twitter"
              value="@darkgamefactory"
              href="#"
            />
          </div>

          <div className="mt-12 rounded-md border border-amber-crt/30 bg-[#1a1410]/60 p-4 font-mono text-[11px] leading-relaxed text-amber-crt/80">
            <div className="mb-1 text-amber-dim">$ tail -f /var/log/studio</div>
            <div>[boot] one-operator mode: enabled</div>
            <div>[boot] LLM pair: attached</div>
            <div>[boot] coffee: critical</div>
            <div>[ready] accepting transmissions...</div>
          </div>
        </div>
      </div>

      <footer className="relative mx-auto mt-24 max-w-6xl border-t border-amber-crt/15 pt-6 font-mono text-[10px] tracking-[0.3em] text-amber-crt/40">
        © {new Date().getFullYear()} DARK GAME FACTORY · ALL SIGNALS RESERVED
      </footer>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-md border border-amber-crt/20 bg-[#1a1410]/40 px-4 py-3 transition-all hover:border-amber-crt/60 hover:bg-[#1a1410]/70"
    >
      <span className="text-amber-crt">{icon}</span>
      <span className="font-mono text-[10px] tracking-[0.3em] text-amber-crt/50">
        {label}
      </span>
      <span className="ml-auto font-mono text-sm text-amber-crt text-glow-amber">
        {value}
      </span>
    </a>
  );
}
