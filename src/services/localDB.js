
function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function seedIfEmpty() {
  if (localStorage.getItem('tf_seeded')) return

  const userId = 'user_demo_1'
  const p1 = 'proj_demo_1'
  const p2 = 'proj_demo_2'

  write('tf_users', [{
    id: userId, name: 'Test User', email: 'test@example.com',
    password: 'password123', created_at: new Date().toISOString(),
  }])

  write('tf_projects', [
    { id: p1, name: 'Website Redesign', description: 'Q2 marketing site overhaul', owner_id: userId, created_at: new Date().toISOString() },
    { id: p2, name: 'Mobile App', description: 'iOS and Android v2', owner_id: userId, created_at: new Date().toISOString() },
  ])

  write('tf_tasks', [
    { id: uid(), title: 'Set up design tokens', description: 'Colors, typography, spacing', status: 'done', priority: 'high', project_id: p1, assignee_id: userId, assignee_name: 'Test User', due_date: '2026-04-18', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uid(), title: 'Build header component', description: null, status: 'in_progress', priority: 'high', project_id: p1, assignee_id: userId, assignee_name: 'Test User', due_date: '2026-04-25', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uid(), title: 'Write landing page copy', description: 'Hero and features sections', status: 'todo', priority: 'medium', project_id: p1, assignee_id: null, assignee_name: null, due_date: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uid(), title: 'API design doc', description: 'Define all endpoints', status: 'todo', priority: 'high', project_id: p2, assignee_id: userId, assignee_name: 'Test User', due_date: '2026-05-01', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: uid(), title: 'Wireframes — onboarding', description: null, status: 'in_progress', priority: 'medium', project_id: p2, assignee_id: userId, assignee_name: 'Test User', due_date: '2026-04-28', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ])

  localStorage.setItem('tf_seeded', '1')
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function dbLogin(email, password) {
  seedIfEmpty()
  const users = read('tf_users')
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return { error: 'Incorrect email or password.' }
  const { password: _, ...safe } = user
  const token = btoa(JSON.stringify({ user_id: user.id, email: user.email, ts: Date.now() }))
  return { user: safe, token }
}

export function dbRegister(name, email, password) {
  seedIfEmpty()
  const users = read('tf_users')
  if (users.find(u => u.email === email)) return { error: 'That email is already registered.' }
  const user = { id: uid(), name, email, password, created_at: new Date().toISOString() }
  write('tf_users', [...users, user])
  const { password: _, ...safe } = user
  const token = btoa(JSON.stringify({ user_id: user.id, email: user.email, ts: Date.now() }))
  return { user: safe, token }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function dbGetProjects(userId) {
  seedIfEmpty()
  const projects = read('tf_projects')
  const tasks = read('tf_tasks')
  return projects
    .filter(p => p.owner_id === userId)
    .map(p => ({ ...p, tasks: tasks.filter(t => t.project_id === p.id) }))
}

export function dbGetProject(id) {
  seedIfEmpty()
  const projects = read('tf_projects')
  const tasks = read('tf_tasks')
  const project = projects.find(p => p.id === id)
  if (!project) return null
  return { ...project, tasks: tasks.filter(t => t.project_id === id) }
}

export function dbCreateProject(name, description, userId) {
  const projects = read('tf_projects')
  const project = { id: uid(), name, description: description || null, owner_id: userId, created_at: new Date().toISOString() }
  write('tf_projects', [...projects, project])
  return { ...project, tasks: [] }
}

export function dbUpdateProject(id, updates) {
  const projects = read('tf_projects')
  const idx = projects.findIndex(p => p.id === id)
  if (idx === -1) return null
  projects[idx] = { ...projects[idx], ...updates }
  write('tf_projects', projects)
  return projects[idx]
}

export function dbDeleteProject(id) {
  const projects = read('tf_projects')
  write('tf_projects', projects.filter(p => p.id !== id))
  const tasks = read('tf_tasks')
  write('tf_tasks', tasks.filter(t => t.project_id !== id))
  return true
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function dbCreateTask(projectId, data, userId, userName) {
  const tasks = read('tf_tasks')
  const task = {
    id: uid(),
    title: data.title,
    description: data.description || null,
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    project_id: projectId,
    assignee_id: data.assignee_id || userId || null,
    assignee_name: data.assignee_id ? null : (userName || null),
    due_date: data.due_date || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  write('tf_tasks', [...tasks, task])
  return task
}

export function dbUpdateTask(id, updates) {
  const tasks = read('tf_tasks')
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) return null
  tasks[idx] = { ...tasks[idx], ...updates, updated_at: new Date().toISOString() }
  write('tf_tasks', tasks)
  return tasks[idx]
}

export function dbDeleteTask(id) {
  const tasks = read('tf_tasks')
  write('tf_tasks', tasks.filter(t => t.id !== id))
  return true
}
