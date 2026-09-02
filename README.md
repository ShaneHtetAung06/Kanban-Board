# Kanban Board
A modern, interactive Kanban board application built with React and Vite. Organize tasks across multiple columns (To Do, Doing, Done), track team productivity, and visualize project progress with an integrated dashboard.

## Members:
    Shane Htet Aung - 6740002
    Aung Myint Myat - 6746035
    Phone Nay Tun   - 6747002

## Features

- **Kanban Board View** - Drag-and-drop task management across three workflow stages
- **Task Management** - Create, edit, and delete tasks with rich details
- **Dashboard Analytics** - Visualize task distribution, team workload, and punctuality metrics
- **Team Assignment** - Assign tasks to team members and track individual progress
- **Categories** - Organize tasks by project categories (Design, Engineering, Research, Marketing, Operations)
- **Overdue Tracking** - Automatic detection and highlighting of overdue tasks
- **Local Storage** - All data persists locally in your browser
- **Responsive Design** - Works seamlessly on desktop and tablet devices

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Kan-Ban Board"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173` (or the next available port).

## Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Project Structure

```
Kan-Ban Board/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx           # Analytics and metrics dashboard
│   │   ├── KanbanBoard.jsx         # Main board with drag-and-drop
│   │   └── TaskModal.jsx           # Task creation/editing modal
│   ├── pages/                      # Page components (extensible)
│   ├── App.jsx                     # Main application component
│   ├── App.css                     # Application styles
│   ├── data.js                     # Data utilities and mock data
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── package.json                    # Project dependencies
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
└── README.md                       # This file
```

## Tech Stack

- **React 19** - UI framework with hooks
- **Vite 8** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Recharts 3** - Chart library for dashboard analytics
- **ESLint** - Code quality and consistency

## Features in Detail

### Kanban Board
- **Drag & Drop** - Easily move tasks between To Do, Doing, and Done columns
- **Task Cards** - View task titles, assigned team member, due dates, and category color coding
- **Overdue Indicators** - Tasks overdue their due date are highlighted for quick identification
- **Task Details** - Click any task to open the modal and view/edit full details

### Task Modal
Create or edit tasks with:
- Title and detailed description
- Category selection
- Start and due dates
- Team member assignment
- Status selection
- Completion tracking

### Dashboard
Visualize project metrics:
- **Status Distribution** - Pie chart showing tasks across workflow stages
- **Category Breakdown** - Bar chart of tasks by category
- **Team Workload** - Task distribution among team members
- **Punctuality Metrics** - Track on-time, early, and late task completions
- **Overdue Count** - Quick reference for tasks that need attention


## Data Storage

All tasks and categories are automatically saved to browser local storage:
- Tasks stored under key: `kanban.tasks.v1`
- Categories stored under key: `kanban.categories.v1`

Data persists across browser sessions. Clear browser data to reset the application.

