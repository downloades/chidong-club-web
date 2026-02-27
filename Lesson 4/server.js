import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "todos.json");

app.use(express.json());

async function readTodos() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeTodos(todos) {
  await fs.writeFile(DATA_PATH, JSON.stringify(todos, null, 2), "utf-8");
}


app.get("/api/todos", async (req, res) => {
  const todos = await readTodos();
  res.json({ ok: true, items: todos });
});


app.post("/api/todos", async (req, res) => {
  const title = String(req.body?.title || "").trim().slice(0, 40);
  if (!title) return res.status(400).json({ ok: false });

  const todos = await readTodos();
  const item = { id: Date.now(), title, done: false };
  todos.unshift(item);

  await writeTodos(todos);
  res.json({ ok: true, item });
});


app.patch("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const done = Boolean(req.body?.done);

  const todos = await readTodos();
  const next = todos.map((x) =>
    x.id === id ? { ...x, done } : x
  );

  await writeTodos(next);
  res.json({ ok: true });
});


app.delete("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);

  const todos = await readTodos();
  const next = todos.filter((x) => x.id !== id);

  await writeTodos(next);
  res.json({ ok: true });
});


app.delete("/api/todos-done", async (req, res) => {
  const todos = await readTodos();
  const next = todos.filter((x) => !x.done);

  await writeTodos(next);
  res.json({ ok: true });
});


app.delete("/api/todos", async (req, res) => {
  await writeTodos([]);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});