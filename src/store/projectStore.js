import { create } from 'zustand'
import {
  dbGetProjects, dbGetProject,
  dbCreateProject, dbUpdateProject, dbDeleteProject,
  dbCreateTask, dbUpdateTask, dbDeleteTask,
} from '../services/localDB.js'

const useProjectStore = create((set, get) => ({
  projects:          [],
  currentProject:    null,
  tasks:             [],
  isLoadingProjects: false,
  isLoadingProject:  false,

  fetchProjects: async (userId) => {
    set({ isLoadingProjects: true })
    await new Promise(r => setTimeout(r, 200))
    const projects = dbGetProjects(userId)
    set({ projects, isLoadingProjects: false })
  },

  fetchProject: async (id) => {
    set({ isLoadingProject: true })
    await new Promise(r => setTimeout(r, 150))
    const project = dbGetProject(id)
    if (project) set({ currentProject: project, tasks: project.tasks || [], isLoadingProject: false })
    else set({ isLoadingProject: false })
  },

  createProject: async (name, description, userId) => {
    const project = dbCreateProject(name, description, userId)
    set(s => ({ projects: [project, ...s.projects] }))
    return { success: true, project }
  },

  updateProject: async (id, updates) => {
    const updated = dbUpdateProject(id, updates)
    set(s => ({
      projects: s.projects.map(p => p.id === id ? { ...p, ...updated } : p),
      currentProject: s.currentProject?.id === id ? { ...s.currentProject, ...updated } : s.currentProject,
    }))
    return { success: true }
  },

  deleteProject: async (id) => {
    dbDeleteProject(id)
    set(s => ({ projects: s.projects.filter(p => p.id !== id) }))
    return { success: true }
  },

  createTask: async (projectId, data, userId, userName) => {
    const task = dbCreateTask(projectId, data, userId, userName)
    set(s => ({ tasks: [...s.tasks, task] }))
    return { success: true, task }
  },

  updateTask: async (taskId, updates) => {
    // Optimistic — update immediately, persist in the background
    const prevTasks = get().tasks
    set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) }))
    const updated = dbUpdateTask(taskId, updates)
    if (!updated) {
      set({ tasks: prevTasks })
      return { success: false, error: 'Task not found' }
    }
    return { success: true }
  },

  deleteTask: async (taskId) => {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) }))
    dbDeleteTask(taskId)
    return { success: true }
  },

  setTasks: (tasks) => set({ tasks }),
  clearProject: () => set({ currentProject: null, tasks: [] }),
}))

export default useProjectStore
