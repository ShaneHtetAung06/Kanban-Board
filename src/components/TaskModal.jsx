import { useEffect, useState } from "react";
import {
  PEOPLE,
  STATUSES,
  uid,
} from "../data";

const emptyTask = (status = "todo") => ({
  id: uid(),
  title: "",
  description: "",
  category: "",
  startDate: "",
  dueDate: "",
  completeDate: "",
  personId: "",
  status,
});

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-ink/40 focus:ring-2 focus:ring-accent/15";
const labelClass =
  "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted";

export default function TaskModal({
  task,
  defaultStatus,
  categories,
  onClose,
  onSave,
  onDelete,
  onAddCategory,
}) {
  const isNew = task === null;
  const [draft, setDraft] = useState(task ?? emptyTask(defaultStatus));
  const [newCat, setNewCat] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(task ?? emptyTask(defaultStatus));
  }, [task, defaultStatus]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k, v) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleStatus = (s) => {
    setDraft((d) => ({
      ...d,
      status: s,
      // Auto-stamp a completion date when moving to done, clear it otherwise.
      completeDate:
        s === "done"
          ? d.completeDate || new Date().toISOString().slice(0, 10)
          : "",
    }));
  };

  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    if (!categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      onAddCategory(name);
    }
    set("category", name);
    setNewCat("");
  };

  const submit = () => {
    if (!draft.title.trim()) {
      setError("A title is required.");
      return;
    }
    onSave({ ...draft, title: draft.title.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/25 p-4 backdrop-blur-[2px] sm:p-8"
      onMouseDown={onClose}
    >
      <div
        className="my-auto w-full max-w-xl border-x border-b border-line bg-paper shadow-[0_30px_80px_-30px_rgba(26,26,23,0.45)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="h-2 bg-ink" />
        <header className="flex items-baseline justify-between border-b-2 border-ink px-6 py-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-muted">{isNew ? "＋" : "✎"}</span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {isNew ? "New entry" : "Editing entry"}
              </p>
              <h2 className="mt-1 font-display text-2xl leading-none text-ink">
                {isNew ? "Add a task" : "Details"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted transition hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label className={labelClass}>Title</label>
            <input
              autoFocus
              className={fieldClass}
              value={draft.title}
              onChange={(e) => {
                set("title", e.target.value);
                setError("");
              }}
              placeholder="What needs doing?"
            />
            {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={fieldClass + " min-h-[84px] resize-y"}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Add context, links, or acceptance criteria."
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Responsible person</label>
              <select
                className={fieldClass}
                value={draft.personId}
                onChange={(e) => set("personId", e.target.value)}
              >
                <option value="">Unassigned</option>
                {PEOPLE.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <div className="flex overflow-hidden rounded-md border border-line">
                {STATUSES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleStatus(s.key)}
                    className={
                      "flex-1 border-r border-line px-2 py-2 text-xs font-medium transition last:border-r-0 " +
                      (draft.status === s.key
                        ? "text-white"
                        : "bg-white text-muted hover:text-ink")
                    }
                    style={
                      draft.status === s.key ? { background: s.color } : undefined
                    }
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => set("category", c)}
                  className={
                    "rounded-full border px-3 py-1 text-xs transition " +
                    (draft.category === c
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-muted hover:border-line-strong hover:text-ink")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className={fieldClass}
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                placeholder="Add a new category…"
              />
              <button
                onClick={addCategory}
                className="shrink-0 rounded-md border border-line bg-white px-4 text-sm text-ink transition hover:border-line-strong"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Start date</label>
              <input
                type="date"
                className={fieldClass}
                value={draft.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Due date</label>
              <input
                type="date"
                className={fieldClass}
                value={draft.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Complete date</label>
              <input
                type="date"
                className={fieldClass + (draft.status !== "done" ? " opacity-50" : "")}
                value={draft.completeDate}
                disabled={draft.status !== "done"}
                onChange={(e) => set("completeDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-line px-6 py-4">
          <div>
            {!isNew && (
              <button
                onClick={() => onDelete(draft.id)}
                className="text-sm text-danger transition hover:underline"
              >
                Delete task
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-line bg-white px-4 py-2 text-sm text-ink transition hover:border-line-strong"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="rounded-md bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-ink/85"
            >
              {isNew ? "Create task" : "Save changes"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
