import { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  const leftCount = useMemo(
    () => items.filter((x) => !x.done).length,
    [items]
  );

  async function loadTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data.ok) setItems(data.items);
  }

  async function addItem(e) {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: v }),
    });

    const data = await res.json();
    if (!data.ok) return;

    setItems((prev) => [data.item, ...prev]);
    setText("");
  }

  async function toggleDone(x) {
    const nextDone = !x.done;

    setItems((prev) =>
      prev.map((t) => (t.id === x.id ? { ...t, done: nextDone } : t))
    );

    await fetch(`/api/todos/${x.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: nextDone }),
    });
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
  }

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <main className="wrap">
      <h1 className="title">Todo + API</h1>

      <form className="row" onSubmit={addItem}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일 입력"
          maxLength={40}
        />
        <button type="submit">추가</button>
      </form>

      <p className="hint">남은 할 일: {leftCount}개</p>

      <ul className="list">
        {items.map((x) => (
          <li key={x.id} className="item">
            <label className="check">
              <input
                type="checkbox"
                checked={x.done}
                onChange={() => toggleDone(x)}
              />
              <span className={x.done ? "done" : ""}>{x.title}</span>
            </label>
            <button className="del" onClick={() => removeItem(x.id)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}