import { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);

  const leftCount = useMemo(
    () => items.filter((x) => !x.done).length,
    [items]
  );

  function addItem(e) {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;

    const item = { id: Date.now(), title: v, done: false };
    setItems((prev) => [item, ...prev]);
    setText("");
  }

  function toggleDone(id) {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x))
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function clearDone() {
    setItems((prev) => prev.filter((x) => !x.done));
  }

  return (
    <main className="wrap">
      <h1 className="title">Todo</h1>

      <form className="row" onSubmit={addItem}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일 입력"
          maxLength={40}
        />
        <button type="submit">추가</button>
        <button
          type="button"
          onClick={clearDone}
          disabled={!items.some((x) => x.done)}
        >
          완료 삭제
        </button>
      </form>

      <p className="hint">남은 할 일: {leftCount}개</p>

      <ul className="list">
        {items.map((x) => (
          <li key={x.id} className="item">
            <label className="check">
              <input
                type="checkbox"
                checked={x.done}
                onChange={() => toggleDone(x.id)}
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