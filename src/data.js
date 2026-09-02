
export const STATUSES = [
  { key: "todo", label: "To Do", color: "var(--color-todo)" },
  { key: "doing", label: "Doing", color: "var(--color-doing)" },
  { key: "done", label: "Done", color: "var(--color-done)" },
];

export const PEOPLE = [
  { id: "p1", name: "Amara Okafor" },
  { id: "p2", name: "Léo Marchetti" },
  { id: "p3", name: "Sana Rahman" },
  { id: "p4", name: "Theo Lindqvist" },
  { id: "p5", name: "Mei Tanaka" },
];

export const DEFAULT_CATEGORIES = [
  "Design",
  "Engineering",
  "Research",
  "Marketing",
  "Operations",
];

const TASKS_KEY = "kanban.tasks.v1";
const CATS_KEY = "kanban.categories.v1";

function seedTasks() {
  return [
    {
      id: "t1",
      title: "Audit onboarding funnel",
      description: "Map every step new users take from signup to first task created; flag friction points.",
      category: "Research",
      startDate: "2026-08-18",
      dueDate: "2026-09-02",
      completeDate: "",
      personId: "p3",
      status: "todo",
    },
    {
      id: "t2",
      title: "Redesign board card component",
      description: "Tighten spacing, add responsible-person avatar, and clarify due-date states.",
      category: "Design",
      startDate: "2026-08-20",
      dueDate: "2026-08-28",
      completeDate: "",
      personId: "p1",
      status: "todo",
    },
    {
      id: "t3",
      title: "Wire up local storage layer",
      description: "Persist tasks and categories; migrate seed data on first load.",
      category: "Engineering",
      startDate: "2026-08-22",
      dueDate: "2026-08-30",
      completeDate: "",
      personId: "p4",
      status: "doing",
    },
    {
      id: "t4",
      title: "Draft Q3 launch note",
      description: "Short announcement covering the new dashboard and category management.",
      category: "Marketing",
      startDate: "2026-08-24",
      dueDate: "2026-08-27",
      completeDate: "",
      personId: "p5",
      status: "doing",
    },
    {
      id: "t5",
      title: "Set up analytics palette",
      description: "Validate a colorblind-safe categorical palette for the dashboard charts.",
      category: "Engineering",
      startDate: "2026-08-10",
      dueDate: "2026-08-19",
      completeDate: "2026-08-17",
      personId: "p4",
      status: "done",
    },
    {
      id: "t6",
      title: "Interview 5 pilot customers",
      description: "Gather qualitative feedback on the board workflow before general release.",
      category: "Research",
      startDate: "2026-08-05",
      dueDate: "2026-08-15",
      completeDate: "2026-08-15",
      personId: "p3",
      status: "done",
    },
    {
      id: "t7",
      title: "Finalize brand type scale",
      description: "Lock display and body sizes across breakpoints.",
      category: "Design",
      startDate: "2026-08-01",
      dueDate: "2026-08-12",
      completeDate: "2026-08-14",
      personId: "p1",
      status: "done",
    },
    {
      id: "t8",
      title: "Vendor contract review",
      description: "Legal pass on the hosting renewal terms.",
      category: "Operations",
      startDate: "2026-08-08",
      dueDate: "2026-08-21",
      completeDate: "",
      personId: "p2",
      status: "doing",
    },
  ];
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw) ;
  } catch {
    /* ignore */
  }
  const seeded = seedTasks();
  saveTasks(seeded);
  return seeded;
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
  
  }
}

export function loadCategories(){
  try {
    const raw = localStorage.getItem(CATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
 
  }
  saveCategories(DEFAULT_CATEGORIES);
  return [...DEFAULT_CATEGORIES];
}

export function saveCategories(cats){
  try {
    localStorage.setItem(CATS_KEY, JSON.stringify(cats));
  } catch {

  }
}

export function personName(id){
  return PEOPLE.find((p) => p.id === id)?.name ?? "Unassigned";
}

export function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function isOverdue(task) {
  if (task.status === "done" || !task.dueDate) return false;
  return new Date(task.dueDate) < startOfToday();
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}


export function punctuality(task){
  if (task.status !== "done" || !task.completeDate || !task.dueDate) return null;
  const done = new Date(task.completeDate).getTime();
  const due = new Date(task.dueDate).getTime();
  if (done < due) return "early";
  if (done > due) return "late";
  return "ontime";
}

export function formatDate(iso){
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function uid(){
  return Math.random().toString(36).slice(2, 10);
}
