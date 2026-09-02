
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  STATUSES,
  isOverdue,
  punctuality,
} from "../data";

const COLORS = {
  todo: "#2f6fb0",
  doing: "#c17a1a",
  done: "#2a9d6f",
  early: "#2a9d6f",
  ontime: "#2f6fb0",
  late: "#c17a1a",
  category: "#9b4dca",
};

const CHART_INK = "#78766e";

function StatTile({
  label,
  value,
  accent,
  hint,
}) {
  return (
    <div className="flex flex-col justify-between px-5 py-5">
      <div className="flex items-center gap-2">
        {accent && (
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        )}
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {label}
        </p>
      </div>
      <p className="mt-6 font-display text-5xl leading-none text-ink tabular-nums">
        {String(value).padStart(2, "0")}
      </p>
      {hint && <p className="mt-1.5 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

function Panel({
  index,
  title,
  caption,
  children,
}) {
  return (
    <section className="border-t-2 border-ink bg-paper p-6">
      <header className="mb-5 flex items-baseline gap-3">
        <span className="font-mono text-[11px] tabular-nums text-muted">{index}</span>
        <div>
          <h3 className="font-display text-2xl leading-none text-ink">{title}</h3>
          <p className="mt-1.5 text-[13px] text-muted">{caption}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e7e5df",
  background: "#fcfcfb",
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  color: "#1a1a17",
  boxShadow: "0 10px 30px -18px rgba(26,26,23,0.4)",
};

export default function Dashboard({ tasks }) {
  const count = (s) => tasks.filter((t) => t.status === s).length;
  const overdue = tasks.filter(isOverdue).length;

  const statusData = STATUSES.map((s) => ({
    key: s.key,
    name: s.label,
    value: count(s.key),
  })).filter((d) => d.value > 0);

  const catMap = new Map();
  tasks.forEach((t) => {
    const c = t.category || "Uncategorized";
    catMap.set(c, (catMap.get(c) ?? 0) + 1);
  });
  const catData = [...catMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const perf = { early: 0, ontime: 0, late: 0 };
  tasks.forEach((t) => {
    const p = punctuality(t);
    if (p) perf[p]++;
  });
  const perfData = [
    { key: "early", name: "Early", value: perf.early },
    { key: "ontime", name: "On Time", value: perf.ontime },
    { key: "late", name: "Late", value: perf.late },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 border-y-2 border-ink divide-x divide-line-strong sm:grid-cols-3 lg:grid-cols-5 [&>*]:border-t [&>*]:border-line-strong sm:[&>*]:border-t-0">
        <StatTile label="Total tasks" value={tasks.length} />
        <StatTile label="To Do" value={count("todo")} accent={COLORS.todo} />
        <StatTile label="Doing" value={count("doing")} accent={COLORS.doing} />
        <StatTile label="Done" value={count("done")} accent={COLORS.done} />
        <StatTile
          label="Overdue"
          value={overdue}
          accent="#cf3a4e"
          hint={overdue ? "Past due, not done" : "All on track"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Panel index="01" title="Tasks by status" caption="Where work sits right now.">
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={190}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="#fcfcfb"
                    strokeWidth={2}
                  >
                    {statusData.map((d) => (
                      <Cell key={d.key} fill={COLORS[d.key]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-1 space-y-2.5">
                {STATUSES.map((s) => (
                  <li
                    key={s.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-ink">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: COLORS[s.key] }}
                      />
                      {s.label}
                    </span>
                    <span className="font-mono tabular-nums text-muted">
                      {count(s.key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-3">
          <Panel
            index="02"
            title="Tasks by category"
            caption="Distribution of work across categories."
          >
            <ResponsiveContainer width="100%" height={190}>
              <BarChart
                data={catData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: CHART_INK }}
                  tickLine={false}
                  axisLine={{ stroke: "#e7e5df" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: CHART_INK }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgba(26,26,23,0.04)" }}
                />
                <Bar
                  dataKey="value"
                  fill={COLORS.category}
                  radius={[4, 4, 0, 0]}
                  barSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>

      <Panel
        index="03"
        title="Completion performance"
        caption="Of completed tasks, how many finished before, on, or after the due date."
      >
        <ResponsiveContainer width="100%" height={210}>
          <BarChart
            data={perfData}
            layout="vertical"
            margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
          >
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 11, fill: CHART_INK }}
              tickLine={false}
              axisLine={{ stroke: "#e7e5df" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#1a1a17" }}
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(26,26,23,0.04)" }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
              {perfData.map((d) => (
                <Cell key={d.key} fill={COLORS[d.key]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
