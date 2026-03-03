"use client";

import React, { useEffect, useMemo, useState } from "react";

type Card = {
  id: number;
  emoji: string;
  isOpen: boolean;
  isMatched: boolean;
};

const EMOJIS = ["🍉", "🍓", "🍋", "🍇", "🍒", "🥝", "🍑", "🍌"]; // 8쌍 = 16장

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(): Card[] {
  const doubled = [...EMOJIS, ...EMOJIS];
  const shuffled = shuffle(doubled);
  return shuffled.map((emoji, idx) => ({
    id: idx + 1,
    emoji,
    isOpen: false,
    isMatched: false,
  }));
}

export default function Page(): React.JSX.Element {
  const [deck, setDeck] = useState<Card[]>(() => makeDeck());
  const [firstId, setFirstId] = useState<number | null>(null);
  const [secondId, setSecondId] = useState<number | null>(null);
  const [lock, setLock] = useState<boolean>(false);
  const [tries, setTries] = useState<number>(0);

  const matchedCount = useMemo(
    () => deck.filter((c) => c.isMatched).length,
    [deck]
  );

  const isClear = matchedCount === deck.length;

  function resetGame() {
    setDeck(makeDeck());
    setFirstId(null);
    setSecondId(null);
    setLock(false);
    setTries(0);
  }

  function openCard(id: number) {
    if (lock) return;

    const target = deck.find((c) => c.id === id);
    if (!target) return;
    if (target.isMatched) return;
    if (target.isOpen) return;

    // 같은 카드 연속 클릭 방지
    if (firstId === id) return;

    setDeck((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOpen: true } : c))
    );

    if (firstId === null) {
      setFirstId(id);
      return;
    }

    if (secondId === null) {
      setSecondId(id);
      setTries((t) => t + 1);
      return;
    }
  }

  // 두 장 선택되면 판정
  useEffect(() => {
    if (firstId === null || secondId === null) return;

    const a = deck.find((c) => c.id === firstId);
    const b = deck.find((c) => c.id === secondId);
    if (!a || !b) return;

    setLock(true);

    const same = a.emoji === b.emoji;

    if (same) {
      // 맞추면 고정
      const timer = setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true, isOpen: true }
              : c
          )
        );
        setFirstId(null);
        setSecondId(null);
        setLock(false);
      }, 250);

      return () => clearTimeout(timer);
    }

    // 틀리면 다시 닫기
    const timer = setTimeout(() => {
      setDeck((prev) =>
        prev.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, isOpen: false } : c
        )
      );
      setFirstId(null);
      setSecondId(null);
      setLock(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [firstId, secondId, deck]);

  return (
    <main style={S.wrap}>
      <header style={S.header}>
        <div>
          <h1 style={S.title}>메모리 카드 게임</h1>
          <p style={S.sub}>같은 이모지 2장을 찾으면 고정된다</p>
        </div>

        <div style={S.right}>
          <div style={S.badges}>
            <span style={S.badge}>시도: {tries}</span>
            <span style={S.badge}>
              진행: {matchedCount}/{deck.length}
            </span>
          </div>
          <button style={S.btn} onClick={resetGame} type="button">
            다시 시작
          </button>
        </div>
      </header>

      {isClear && (
        <section style={S.clearBox}>
          <div style={S.clearTitle}>클리어!</div>
          <div style={S.clearSub}>총 {tries}번 시도했다</div>
        </section>
      )}

      <section style={S.grid}>
        {deck.map((c) => (
          <button
            key={c.id}
            style={{
              ...S.card,
              ...(c.isMatched ? S.cardMatched : null),
            }}
            onClick={() => openCard(c.id)}
            type="button"
          >
            <span style={S.cardInner}>{c.isOpen || c.isMatched ? c.emoji : "❓"}</span>
          </button>
        ))}
      </section>

      <p style={S.hint}>
        규칙: 카드 2장을 뒤집는다 → 같으면 고정, 다르면 다시 닫힌다
      </p>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
    flexWrap: "wrap",
  },
  title: { margin: 0, fontSize: 38, fontWeight: 900 },
  sub: { marginTop: 10, color: "#666" },

  right: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  badges: { display: "flex", gap: 8, flexWrap: "wrap" },
  badge: {
    border: "1px solid #ddd",
    padding: "6px 10px",
    borderRadius: 999,
    color: "#333",
    fontSize: 13,
  },
  btn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
  },

  clearBox: {
    marginTop: 14,
    border: "1px solid #eee",
    borderRadius: 14,
    padding: 14,
    background: "#fafafa",
  },
  clearTitle: { fontSize: 22, fontWeight: 900 },
  clearSub: { marginTop: 6, color: "#666" },

  grid: {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },

  card: {
    height: 110,
    borderRadius: 14,
    border: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },
  cardMatched: {
    border: "1px solid #111",
    background: "#f6f6f6",
  },
  cardInner: { fontSize: 40, lineHeight: 1 },

  hint: { marginTop: 12, color: "#666", fontSize: 13 },
};
