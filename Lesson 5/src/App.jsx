import { useMemo, useState } from "react";
import DemoChild from "./DemoChild";

export default function App() {
  const [tab, setTab] = useState("state"); // state | map | props

  // useState demo
  const [count, setCount] = useState(0);

  // map demo
  const [raw, setRaw] = useState("");
  const items = useMemo(() => {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [raw]);

  // props demo
  const [ping, setPing] = useState(0);

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ margin: 0 }}>React 문법 데모 보드</h1>
      <p style={{ marginTop: 8, color: "#666" }}>
        useState / map / props를 한 번에 확인한다
      </p>

      {/* 탭 */}
      <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
        <button onClick={() => setTab("state")} disabled={tab === "state"}>
          useState
        </button>
        <button onClick={() => setTab("map")} disabled={tab === "map"}>
          map
        </button>
        <button onClick={() => setTab("props")} disabled={tab === "props"}>
          props
        </button>
      </div>

      {/* 화면 */}
      {tab === "state" && (
        <section style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>useState 데모: 카운터</h2>
          <p style={{ color: "#666" }}>
            버튼 클릭 → setCount 호출 → state 변경 → 화면 재렌더링
          </p>

          <div style={{ fontSize: 40, margin: "12px 0" }}>{count}</div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setCount((c) => c + 1)}>+1</button>
            <button onClick={() => setCount((c) => c - 1)}>-1</button>
            <button onClick={() => setCount(0)}>reset</button>
          </div>
        </section>
      )}

      {tab === "map" && (
        <section style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>map 데모: 배열을 화면에 출력</h2>
          <p style={{ color: "#666" }}>
            입력을 배열로 만들고 items.map(...)으로 리스트를 렌더링한다
          </p>

          <input
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="예: state, event, map, props"
            style={{ width: "100%", padding: 10, margin: "10px 0 12px" }}
          />

          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {items.map((x, i) => (
              <li key={`${x}-${i}`}>{x}</li>
            ))}
          </ul>
        </section>
      )}

      {tab === "props" && (
        <section style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>props 데모: 부모 → 자식 전달</h2>
          <p style={{ color: "#666" }}>
            부모가 자식에게 값(label)과 함수(onPing)를 props로 전달한다
          </p>

          <p style={{ marginTop: 10 }}>부모 state(ping): {ping}</p>

          <DemoChild
            label="부모가 준 값"
            onPing={() => setPing((p) => p + 1)}
          />
        </section>
      )}
    </main>
  );
}
