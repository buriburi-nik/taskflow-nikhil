# 🕹️ TaskFlow — 1980s Retro Task Management

Welcome to **TaskFlow**, where high-performance engineering meets the golden era of computing. This is a complete, production-ready React frontend for a SaaS task management application, styled with a nostalgic 1980s CRT/paper aesthetic.

> [!IMPORTANT]
> This project is a **Frontend-only** implementation built for the Engineering Take-Home Assignment. All data is persisted locally via `localStorage`.

## 🚀 Overview

TaskFlow is designed to look like a high-end workstation from 1988, featuring a distinctive "dot grid" paper background, neon accents, and CRT scanlines. Despite its vintage look, it is powered by a modern, high-performance tech stack.

### ⚡ Tech Stack
- **React (Vite)**: Lightning-fast development and build.
- **Zustand**: Lightweight, decoupled state management.
- **Framer Motion**: Smooth 60fps micro-animations and transitions.
- **Tailwind CSS**: Modern utility-first styling for a custom design system.
- **Lucide React**: Crisp, professional iconography.
- **React Router DOM**: Seamless client-side navigation.
- **dnd-kit**: Robust drag-and-drop orchestration.

---

## ✨ Features

- **🛡️ Authentication**: Fully functional Login and Registration flows using `localStorage` persistence.
- **📊 Interactive Dashboard**: Overview of all projects with real-time task statistics.
- **📋 Kanban Board**: Group tasks by status (To Do, In Progress, Done).
- **🖱️ Drag & Drop**: Intuitively move tasks between columns with visual feedback.
- **🌗 Dark Mode**: Persistent "Terminal Contrast" mode that survives page refreshes.
- **📱 Responsive**: Optimized for 375px (Mobile) and 1280px (Desktop) widths.
- **🖥️ CRT Aesthetic**: Optional scanline overlays and flickering cursor effects for that true retro feel.

---

## 🛠️ Installation & Running Locally

The project is designed to run with zero manual configuration.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/buriburi-nik/taskflow-nikhil
   cd taskflow-nikhil
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal).

---

## 🔑 Test Credentials

For quick evaluation, use the following credentials on the login screen (or click the **"DEMO CREDENTIALS"** button):

- **Email**: `test@example.com`
- **Password**: `password123`

---

## 🏗️ Architecture Decisions

### 1. **Client-Side Persistence**
To ensure the app works flawlessly without a backend, I implemented a `localDB.js` service that wraps `localStorage`. This provides a pseudo-API experience with proper `async/await` handling and error states.

### 2. **State Management**
I chose **Zustand** over Redux for its simplicity and reduced boilerplate. It handles Global Auth and Project state, while local component state is used for UI-only variables (modals, dropdowns).

### 3. **The 1980s Design System**
I avoided standard component libraries to create a truly unique aesthetic. All components (Windows, Menubars, Buttons, Cards) are custom-built using Tailwind CSS variables, allowing for the seamless "Dark Mode" switch.

---

## ⏳ What I'd Do With More Time

1. **Full API Integration**: Connect to a Go/PostgreSQL backend as per the Full-Stack requirements.
2. **WebSockets**: Implement real-time task movement updates between different users.
3. **Advanced Filtering**: Add search by task title and filtering by due-date ranges.
4. **Offline Mode**: Use Service Workers (PWA) to allow task management without an internet connection.

---

