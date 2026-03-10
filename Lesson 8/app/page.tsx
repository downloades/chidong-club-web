"use client";

import React, { useEffect, useState } from "react";

const PAD_LIST = [
  { key: "a", label: "Kick", sound: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
  { key: "s", label: "Snare", sound: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3" },
  { key: "d", label: "Hi-Hat", sound: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" },
  { key: "f", label: "Clap", sound: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
  { key: "g", label: "Open Hat", sound: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
  { key: "h", label: "Tom", sound: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3" },
  { key: "j", label: "Shaker", sound: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3" },
  { key: "k", label: "Perc", sound: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3" },
];

export default function Page(): React.JSX.Element {
  const [activeKey, setActiveKey] = useState<string>("");
  const [lastPlayed, setLastPlayed] = useState<string>("");

  function playPad(key: string) {
    const pad = PAD_LIST.find((p) => p.key === key.toLowerCase());
    if (!pad) return;

    const audio = new Audio(pad.sound);
    audio.currentTime = 0;
    audio.play();

    setActiveKey(pad.key);
    setLastPlayed(`${pad.key.toUpperCase()} - ${pad.label}`);

    window.setTimeout(() => {
      setActiveKey("");
    }, 120);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      playPad(e.key);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main style={S.wrap}>
      <div style={S.overlay}>
        <h1 style={S.title}>Next Drum Pad</h1>
        <p style={S.sub}>키보드 A S D F G H J K 를 눌러보자</p>

        <div style={S.nowBox}>
          <span style={S.nowLabel}>NOW PLAYING</span>
          <span style={S.nowText}>{lastPlayed || "아직 없음"}</span>
        </div>

        <section style={S.grid}>
          {PAD_LIST.map((pad) => {
            const active = activeKey === pad.key;
            return (
              <button
                key={pad.key}
                style={{
                  ...S.pad,
                  ...(active ? S.padActive : null),
                }}
                onClick={() => playPad(pad.key)}
                type="button"
              >
                <div style={S.key}>{pad.key.toUpperCase()}</div>
                <div style={S.label}>{pad.label}</div>
              </button>
            );
          })}
        </section>

        <p style={S.tip}>
          클릭해도 재생되고, 키보드를 눌러도 재생된다
        </p>
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
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.72)), url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
  },
  overlay: {
    maxWidth: 980,
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
  grid: {
    marginTop: 30,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
  },
  pad: {
    minHeight: 140,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    backdropFilter: "blur(8px)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.12s ease",
    boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
  },
  padActive: {
    transform: "scale(0.96)",
    background: "rgba(255,170,0,0.28)",
    border: "1px solid rgba(255,190,60,0.9)",
    boxShadow: "0 0 0 2px rgba(255,190,60,0.18), 0 12px 34px rgba(0,0,0,0.26)",
  },
  key: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1,
  },
  label: {
    fontSize: 15,
    color: "rgba(255,255,255,0.86)",
  },
  tip: {
    marginTop: 20,
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
  },
};
