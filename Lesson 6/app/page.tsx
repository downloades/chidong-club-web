"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };
type Stroke = {
  id: number;
  color: string;
  width: number;
  points: Point[];
};

export default function Page(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDownRef = useRef<boolean>(false);

  const [color, setColor] = useState<string>("#111111");
  const [width, setWidth] = useState<number>(6);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  // 현재 한 줄(그리고 있는 중)
  const [current, setCurrent] = useState<Stroke | null>(null);

  const effectiveColor = useMemo(() => {
    return mode === "eraser" ? "#ffffff" : color;
  }, [mode, color]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    isDownRef.current = true;
    const p = getPos(e);
    setCurrent({
      id: Date.now(),
      color: effectiveColor,
      width: mode === "eraser" ? 18 : width,
      points: [p],
    });
  }

  function moveDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDownRef.current) return;
    const p = getPos(e);
    setCurrent((prev) => {
      if (!prev) return prev;
      return { ...prev, points: [...prev.points, p] };
    });
  }

  function endDraw() {
    if (!isDownRef.current) return;
    isDownRef.current = false;

    setCurrent((prev) => {
      if (!prev) return prev;
      setStrokes((s) => [...s, prev]);
      return null;
    });
  }

  function clearAll() {
    setStrokes([]);
    setCurrent(null);
  }

  function undo() {
    setStrokes((prev) => prev.slice(0, -1));
  }

  // 캔버스에 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 고정(흰 배경)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const all = current ? [...strokes, current] : strokes;

    for (const s of all) {
      if (s.points.length < 2) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, current]);

  return (
    <main style={S.wrap}>
      <h1 style={S.title}>React 미니 그림판</h1>
      <p style={S.sub}>state가 바뀌면 캔버스가 다시 그려진다</p>

      <section style={S.card}>
        <div style={S.toolbar}>
          <div style={S.group}>
            <span style={S.label}>모드</span>
            <button
              style={mode === "pen" ? S.btnOn : S.btn}
              onClick={() => setMode("pen")}
              type="button"
            >
              펜
            </button>
            <button
              style={mode === "eraser" ? S.btnOn : S.btn}
              onClick={() => setMode("eraser")}
              type="button"
            >
              지우개
            </button>
          </div>

          <div style={S.group}>
            <span style={S.label}>색</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={mode === "eraser"}
              style={S.color}
            />
          </div>

          <div style={S.group}>
            <span style={S.label}>두께</span>
            <input
              type="range"
              min={2}
              max={20}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              disabled={mode === "eraser"}
            />
            <span style={S.small}>{width}</span>
          </div>

          <div style={S.group}>
            <button style={S.btn} onClick={undo} type="button">
              되돌리기
            </button>
            <button style={S.btnDanger} onClick={clearAll} type="button">
              전체 지우기
            </button>
          </div>
        </div>

        <div style={S.canvasWrap}>
          <canvas
            ref={canvasRef}
            width={860}
            height={420}
            style={S.canvas}
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
          />
        </div>

        <p style={S.hint}>
          팁: 마우스를 누른 채로 그리면 된다. 지우개는 흰색으로 굵게 덧그린다.
        </p>
      </section>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 940, margin: "0 auto", padding: 24, fontFamily: "system-ui" },
  title: { margin: 0, fontSize: 38, fontWeight: 900 },
  sub: { marginTop: 10, color: "#666" },

  card: { border: "1px solid #eee", borderRadius: 14, padding: 16, marginTop: 14 },
  toolbar: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" },
  group: { display: "flex", gap: 8, alignItems: "center" },

  label: { color: "#666", fontSize: 12, marginRight: 2 },
  small: { color: "#666", fontSize: 12, minWidth: 18, textAlign: "right" },

  btn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #bbb",
    background: "#fff",
    cursor: "pointer",
  },
  btnOn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
  },
  btnDanger: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid crimson",
    background: "crimson",
    color: "#fff",
    cursor: "pointer",
  },

  color: { width: 42, height: 34, padding: 0, border: "none", background: "transparent" },

  canvasWrap: { marginTop: 12, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" },
  canvas: { display: "block", width: "100%", background: "#fff", touchAction: "none" },

  hint: { marginTop: 10, color: "#666", fontSize: 13 },
};
