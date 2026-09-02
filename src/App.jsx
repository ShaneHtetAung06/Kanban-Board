import { useEffect, useMemo, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import Dashboard from "./components/Dashboard";
import TaskModal from "./components/TaskModal";
import {
  isOverdue,
  loadCategories,
  loadTasks,
  saveCategories,
  saveTasks,
} from "./data";


export default function App() {
  const [page, setPage] = useState("board");
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editing, setEditing] = useState(undefined);
  const [newStatus, setNewStatus] = useState("todo");

  useEffect(() => {
    setTasks(loadTasks());
    setCategories(loadCategories());
  }, []);

  useEffect(() => {
    if (tasks.length > 0) saveTasks(tasks);
  }, [tasks]);
  useEffect(() => {
    if (categories.length > 0) saveCategories(categories);
  }, [categories]);

  const overdueCount = useMemo(() => tasks.filter(isOverdue).length, [tasks]);

  const upsert = (task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      return exists
        ? prev.map((t) => (t.id === task.id ? task : t))
        : [...prev, task];
    });
    setEditing(undefined);
  };

  const remove = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEditing(undefined);
  };

  const move = (id, status) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completeDate:
                status === "done"
                  ? t.completeDate || new Date().toISOString().slice(0, 10)
                  : "",
            }
          : t,
      ),
    );
  };

  const addCategory = (name) =>
    setCategories((prev) => (prev.includes(name) ? prev : [...prev, name]));

  const openNew = (status) => {
    setNewStatus(status);
    setEditing(null);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const tab = (p, label) => (
    <button
      onClick={() => setPage(p)}
      className={
        "font-mono text-[11px] uppercase tracking-[0.18em] transition " +
        (page === p ? "text-ink underline decoration-2 underline-offset-[6px]" : "text-muted hover:text-ink")
      }
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto min-h-full max-w-6xl px-5 pb-20 sm:px-8">
      <div className="h-2 bg-ink" />
      <div className="flex items-center justify-between border-b border-line py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        <span>{today}</span>
        <span>Local edition · autosaved</span>
      </div>
      <header className="flex flex-col gap-5 border-b-2 border-ink py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-5xl leading-[0.9] tracking-tight text-ink sm:text-6xl">
            Cadence
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            A working ledger of tasks — planned, in motion, and put to bed.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5">
            {tab("board", "Board")}
            {tab("dashboard", "Dashboard")}
          </nav>
          <button
            onClick={() => openNew("todo")}
            className="border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-paper hover:text-ink"
          >
            + New task
          </button>
        </div>
      </header>

      <main className="pt-6">
        {page === "board" ? (
          <>
            <div className="mb-1 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              <span>
                {tasks.length} entries
                {overdueCount > 0 && (
                  <>
                    {" · "}
                    <span className="text-danger">{overdueCount} overdue</span>
                  </>
                )}
              </span>
              <span>Drag between columns to refile</span>
            </div>
            <KanbanBoard
              tasks={tasks}
              onOpen={(t) => setEditing(t)}
              onNew={openNew}
              onMove={move}
            />
          </>
        ) : (
          <Dashboard tasks={tasks} />
        )}
      </main>

      {editing !== undefined && (
        <TaskModal
          task={editing === null ? null : editing}
          defaultStatus={newStatus}
          categories={categories}
          onClose={() => setEditing(undefined)}
          onSave={upsert}
          onDelete={remove}
          onAddCategory={addCategory}
        />
      )}
    </div>
  );
}
