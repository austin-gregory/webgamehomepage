"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CRTDive } from "@/components/CRTDive";

// Code-split the 3D scene so Three.js / drei / fiber don't ship in the
// initial page JS. Shows a brief BOOTING fallback while the chunk loads.
const HeroRoom = dynamic(
  () => import("@/components/HeroRoom").then((m) => m.HeroRoom),
  {
    ssr: false,
    loading: () => <BootingScreen />,
  }
);

function BootingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black font-mono text-[11px] tracking-[0.4em] text-phosphor text-glow-green">
      <span className="animate-pulse">▸ BOOTING SYSTEM ◂</span>
    </div>
  );
}

export default function Home() {
  const [diving, setDiving] = useState(false);
  const router = useRouter();

  const handleDiveComplete = () => {
    setDiving(false);
    router.push("/feed#games");
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <HeroRoom onEnter={() => setDiving(true)} />
      <CRTDive active={diving} onComplete={handleDiveComplete} />
    </main>
  );
}
