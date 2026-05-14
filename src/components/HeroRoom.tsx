"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Group, Vector3 } from "three";

useGLTF.preload("/hero.glb", false, true);

const ROOM_HALF = 4.5; // half-width of the room (8.4m wide total)
const CEILING_Y = 3.6;
const CAMERA_HEIGHT = 1.45;
const MIN_DIST = 1.45; // closest you can get before being "at" the PC
const MAX_DIST = 4.0; // farthest from the PC (room walls beyond this)
const INTERACT_DIST = 1.55; // shows ENTER prompt when ≤ this
const APPROACH_SPEED = 2.4; // m/s along radial axis
const ORBIT_SPEED = 1.3; // rad/s around PC

function PCModel({ target }: { target: Vector3 }) {
  const { scene } = useGLTF("/hero.glb", false, true);
  const ref = useRef<Group>(null);

  // Measure the model's natural bbox once on load, then offset our wrapper
  // so the model is X/Z-centered and its bottom rests at y=0. Also point
  // the shared camera target at the model's mid-height.
  useEffect(() => {
    if (!ref.current) return;
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    ref.current.position.set(-center.x, -box.min.y, -center.z);
    target.y = size.y * 0.5;
  }, [scene, target]);

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_HALF * 2, ROOM_HALF * 2]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEILING_Y, 0]}>
        <planeGeometry args={[ROOM_HALF * 2, ROOM_HALF * 2]} />
        <meshStandardMaterial color="#070708" roughness={1} />
      </mesh>
      {/* Walls — interior-facing */}
      {(
        [
          { pos: [0, CEILING_Y / 2, -ROOM_HALF], rot: [0, 0, 0] },
          { pos: [0, CEILING_Y / 2, ROOM_HALF], rot: [0, Math.PI, 0] },
          { pos: [-ROOM_HALF, CEILING_Y / 2, 0], rot: [0, Math.PI / 2, 0] },
          { pos: [ROOM_HALF, CEILING_Y / 2, 0], rot: [0, -Math.PI / 2, 0] },
        ] as Array<{ pos: [number, number, number]; rot: [number, number, number] }>
      ).map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot}>
          <planeGeometry args={[ROOM_HALF * 2, CEILING_Y]} />
          <meshStandardMaterial color="#0c0c0f" roughness={0.9} />
        </mesh>
      ))}
      {/* Floor highlight ring under the PC, like a spotlight pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0, 1.4, 64]} />
        <meshBasicMaterial color="#1a3a1a" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function CameraRig({
  target,
  onProximity,
}: {
  target: Vector3;
  onProximity: (close: boolean) => void;
}) {
  const { camera } = useThree();
  const angleRef = useRef(0);
  const distRef = useRef(3.6);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const wasClose = useRef(false);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          keys.current.w = true;
          break;
        case "a":
          keys.current.a = true;
          break;
        case "s":
          keys.current.s = true;
          break;
        case "d":
          keys.current.d = true;
          break;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          keys.current.w = false;
          break;
        case "a":
          keys.current.a = false;
          break;
        case "s":
          keys.current.s = false;
          break;
        case "d":
          keys.current.d = false;
          break;
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // Initial camera placement
  useEffect(() => {
    const a = angleRef.current;
    const d = distRef.current;
    camera.position.set(Math.sin(a) * d, CAMERA_HEIGHT, Math.cos(a) * d);
    camera.lookAt(target);
  }, [camera]);

  useFrame((_, delta) => {
    const k = keys.current;
    let dDelta = 0;
    let aDelta = 0;
    if (k.w) dDelta -= APPROACH_SPEED * delta;
    if (k.s) dDelta += APPROACH_SPEED * delta;
    if (k.a) aDelta -= ORBIT_SPEED * delta;
    if (k.d) aDelta += ORBIT_SPEED * delta;

    distRef.current = Math.max(
      MIN_DIST,
      Math.min(MAX_DIST, distRef.current + dDelta)
    );
    angleRef.current += aDelta;

    const a = angleRef.current;
    const d = distRef.current;
    camera.position.set(Math.sin(a) * d, CAMERA_HEIGHT, Math.cos(a) * d);
    camera.lookAt(target);

    const isClose = d <= INTERACT_DIST;
    if (isClose !== wasClose.current) {
      wasClose.current = isClose;
      onProximity(isClose);
    }
  });

  return null;
}

export function HeroRoom({ onEnter }: { onEnter: () => void }) {
  const [close, setClose] = useState(false);
  // Shared target Vector3 — PCModel mutates target.y once it has measured
  // the model's bbox; CameraRig reads it every frame for lookAt.
  const target = useMemo(() => new Vector3(0, 0.9, 0), []);

  const handleClick = () => {
    if (close) onEnter();
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-black"
      onClick={handleClick}
    >
      <Canvas
        camera={{ position: [0, CAMERA_HEIGHT, 3.6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#020203"]} />
        <fog attach="fog" args={["#020203", 3.5, 9]} />
        <ambientLight intensity={0.7} />
        {/* Warm key light overhead, focused on the PC */}
        <pointLight
          position={[0, 3.2, 0]}
          intensity={3.6}
          color="#ffd9a8"
          distance={8}
          decay={1.3}
        />
        {/* Cool fill from the front so detail isn't lost in shadow */}
        <pointLight
          position={[0, 1.6, 3]}
          intensity={1.8}
          color="#cfe6ff"
          distance={7}
          decay={1.5}
        />
        {/* Side accent on the right */}
        <pointLight
          position={[2.5, 1.4, 0.5]}
          intensity={1.3}
          color="#ffe2c4"
          distance={6}
          decay={1.6}
        />
        {/* Side accent on the left */}
        <pointLight
          position={[-2.5, 1.4, 0.5]}
          intensity={1.0}
          color="#ffe2c4"
          distance={6}
          decay={1.6}
        />
        {/* Phosphor-green rim from behind for the back-room aesthetic */}
        <pointLight
          position={[-1.5, 1.0, -2.5]}
          intensity={1.1}
          color="#00ff41"
          distance={5}
          decay={1.6}
        />
        <Suspense fallback={null}>
          <PCModel target={target} />
        </Suspense>
        <Room />
        <CameraRig target={target} onProximity={setClose} />
      </Canvas>

      <ControlsPanel />

      {/* "Enter" prompt — only when within interaction range */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 font-mono text-sm tracking-[0.4em] text-phosphor text-glow-green transition-opacity duration-300 ${
          close ? "opacity-100" : "opacity-0"
        }`}
      >
        ▸ CLICK TO ENTER ◂
      </div>

      {/* CRT scanlines over everything */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 z-10" />
    </section>
  );
}

function ControlsPanel() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-6 z-10 rounded-sm border border-phosphor-dim/60 bg-black/80 px-4 py-3 font-mono text-[11px] text-phosphor backdrop-blur">
      <div className="mb-2 text-[10px] tracking-[0.3em] text-phosphor/50">
        // CONTROLS
      </div>
      <div className="space-y-1.5">
        <KeyRow keys={["W", "S"]} desc="approach / retreat" />
        <KeyRow keys={["A", "D"]} desc="orbit" />
        <KeyRow keys={["CLICK"]} desc="enter terminal" />
      </div>
    </div>
  );
}

function KeyRow({ keys, desc }: { keys: string[]; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {keys.map((k) => (
          <span
            key={k}
            className="inline-block min-w-[28px] rounded-sm border border-phosphor-dim/50 bg-phosphor/5 px-1.5 py-0.5 text-center text-phosphor text-glow-green"
          >
            {k}
          </span>
        ))}
      </div>
      <span className="text-phosphor/70">{desc}</span>
    </div>
  );
}
