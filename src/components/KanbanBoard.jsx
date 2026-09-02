import { useState } from "react";
import {
  STATUSES,
  formatDate,
  initials,
  isOverdue,
  personName,
} from "../data";

function TaskCard({
  task,
  index,
  onOpen,
  onDragStart,
  dragging,
}) {
  const overdue = isOverdue(task);
  const status = STATUSES.find((s) => s.key === task.status);
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className={
        "group relative cursor-pointer border-t border-line-strong bg-paper py-4 pl-5 pr-1 transition-colors hover:bg-white " +
        (dragging ? "opacity-40" : "")
      }
    >
      {/* status spine */}
      <span
        className="absolute left-0 top-4 h-[calc(100%-2rem)] w-[3px]"
        style={{ background: status.color }}
      />

      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tabular-nums text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="flex-1 font-display text-[18px] font-medium leading-tight text-ink">
          {task.title}
        </h3>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 pl-7 text-[13px] leading-relaxed text-muted">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 pl-7 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        {task.category && (
          <span className="text-ink">{task.category}</span>
        )}
        {task.category && <span className="text-line-strong">/</span>}
        <span className="flex items-center gap-1.5">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-ink text-[9px] font-medium tracking-normal text-white">
            {task.personId ? initials(personName(task.personId)) : "—"}
          </span>
          {task.personId ? personName(task.personId) : "Unassigned"}
        </span>
        <span className="ml-auto pr-3">
          {task.status === "done" && task.completeDate ? (
            <span className="text-done">DONE {formatDate(task.completeDate)}</span>
          ) : overdue ? (
            <span className="text-danger">OVERDUE {formatDate(task.dueDate)}</span>
          ) : task.dueDate ? (
            <span>DUE {formatDate(task.dueDate)}</span>
          ) : null}
        </span>
      </div>
    </article>
  );
}

export default function KanbanBoard({ tasks, onOpen, onNew, onMove }) {
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);

  return (
    <div className="grid grid-cols-1 border-t-2 border-ink lg:grid-cols-3 lg:divide-x lg:divide-line-strong">
      {STATUSES.map((col, ci) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <section
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(col.key);
            }}
            onDragLeave={() => setOver((o) => (o === col.key ? null : o))}
            onDrop={() => {
              if (dragId) onMove(dragId, col.key);
              setDragId(null);
              setOver(null);
            }}
            className={
              "flex min-h-[60vh] flex-col px-4 pb-6 transition-colors " +
              (over === col.key ? "bg-accent/[0.04]" : "")
            }
          >
            <header className="flex items-end justify-between pb-3 pt-5">
              <div className="flex items-end gap-3">
                <span
                  className="font-display text-3xl leading-none"
                  style={{ color: col.color }}
                >
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <div className="pb-0.5">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                    {col.label}
                  </h2>
                  <p className="font-mono text-[11px] text-muted">
                    {colTasks.length} {colTasks.length === 1 ? "task" : "tasks"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNew(col.key)}
                className="mb-1 font-mono text-lg leading-none text-muted transition hover:text-ink"
                aria-label={"Add task to " + col.label}
              >
                +
              </button>
            </header>

            <div className="flex flex-1 flex-col">
              {colTasks.map((t, i) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  index={i}
                  dragging={dragId === t.id}
                  onOpen={() => onOpen(t)}
                  onDragStart={() => setDragId(t.id)}
                />
              ))}
              {colTasks.length === 0 && (
                <button
                  onClick={() => onNew(col.key)}
                  className="mt-2 border-t border-dashed border-line-strong py-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition hover:text-ink"
                >
                  + Add first task
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}