"use client";

import React, { useEffect, useRef, useState } from "react";

const PIANO_KEYS = [
  { key: "a", note: "도", noteEng: "C4", freq: 261.63 },
  { key: "s", note: "레", noteEng: "D4", freq: 293.66 },
  { key: "d", note: "미", noteEng: "E4", freq: 329.63 },
  { key: "f", note: "파", noteEng: "F4", freq: 349.23 },
  { key: "g", note: "솔", noteEng: "G4", freq: 392.0 },
  { key: "h", note: "라", noteEng: "A4", freq: 440.0 },
  { key: "j", note: "시", noteEng: "B4", freq: 493.88 },
  { key: "k", note: "도", noteEng: "C5", freq: 523.25 },
];

export default function Page(): React.JSX.Element {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [lastPlayed, setLastPlayed] = useState<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);

  function getAudioContext() {
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtx) return null;
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  }

  function pressKey(lowerKey: string) {
    setActiveKeys((prev) => (prev.includes(lowerKey) ? prev : [...prev, lowerKey]));
  }

  function releaseKey(lowerKey: string) {
    setActiveKeys((prev) => prev.filter((key) => key !== lowerKey));
  }

  function playPiano(freq: number) {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "triangle";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(1, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.25);
    osc2.stop(now + 1.25);
  }

  function handlePlay(key: string) {
    const lowerKey = key.toLowerCase();
    const pianoKey = PIANO_KEYS.find((item) => item.key === lowerKey);
    if (!pianoKey) return;

    playPiano(pianoKey.freq);
    setLastPlayed(`${lowerKey.toUpperCase()} - ${pianoKey.note} (${pianoKey.noteEng})`);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const lowerKey = e.key.toLowerCase();
      const exists = PIANO_KEYS.some((item) => item.key === lowerKey);
      if (!exists) return;

      if (!e.repeat) {
        pressKey(lowerKey);
        handlePlay(lowerKey);
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const lowerKey = e.key.toLowerCase();
      const exists = PIANO_KEYS.some((item) => item.key === lowerKey);
      if (!exists) return;

      releaseKey(lowerKey);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <main style={S.wrap}>
      <div style={S.overlay}>
        <h1 style={S.title}>Next Piano Pad</h1>
        <p style={S.sub}>A S D F G H J K = 도 레 미 파 솔 라 시 도</p>

        <div style={S.nowBox}>
          <span style={S.nowLabel}>NOW PLAYING</span>
          <span style={S.nowText}>{lastPlayed || "아직 없음"}</span>
        </div>

        <section style={S.row}>
          {PIANO_KEYS.map((item) => {
            const active = activeKeys.includes(item.key);

            return (
              <button
                key={item.key}
                type="button"
                onMouseDown={() => {
                  pressKey(item.key);
                  handlePlay(item.key);
                }}
                onMouseUp={() => releaseKey(item.key)}
                onMouseLeave={() => releaseKey(item.key)}
                onTouchStart={() => {
                  pressKey(item.key);
                  handlePlay(item.key);
                }}
                onTouchEnd={() => releaseKey(item.key)}
                style={{
                  ...S.pad,
                  ...(active ? S.padActive : null),
                }}
              >
                <div style={S.note}>{item.note}</div>
                <div style={S.noteEng}>{item.noteEng}</div>
                <div style={S.key}>{item.key.toUpperCase()}</div>
              </button>
            );
          })}
        </section>

        <p style={S.tip}>클릭하거나 키보드를 누르면 각 음이 다르게 난다</p>
      </div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    fontFamily: "system-ui, sans-serif",
    backgroundImage:
      "linear-gradient(rgba(12,12,12,0.45), rgba(12,12,12,0.72)), url('https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
  },
  overlay: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "48px 24px 56px",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: "-0.02em",
  },
  sub: {
    marginTop: 12,
    color: "rgba(255,255,255,0.82)",
    fontSize: 18,
  },
  nowBox: {
    margin: "24px auto 0",
    padding: "14px 18px",
    maxWidth: 420,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  nowLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: "0.12em",
  },
  nowText: {
    fontSize: 20,
    fontWeight: 700,
  },
  row: {
    marginTop: 34,
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "center",
    gap: 10,
    overflowX: "auto",
    paddingBottom: 8,
  },
  pad: {
    flex: "0 0 110px",
    minHeight: 240,
    borderRadius: 0,
    border: "1px solid rgba(0,0,0,0.35)",
    background: "linear-gradient(to bottom, #ffffff 0%, #f4f4f4 68%, #dfdfdf 100%)",
    color: "#111",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 10px 20px",
    transition: "all 0.08s ease",
    boxShadow: "0 14px 30px rgba(0,0,0,0.28)",
    userSelect: "none",
  },
  padActive: {
    transform: "translateY(6px)",
    background: "linear-gradient(to bottom, #f1f1f1 0%, #dddddd 100%)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.22)",
  },
  note: {
    fontSize: 28,
    fontWeight: 900,
    color: "#111",
  },
  noteEng: {
    fontSize: 14,
    fontWeight: 700,
    color: "#666",
  },
  key: {
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1,
    color: "#222",
  },
  tip: {
    marginTop: 20,
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
  },
};
