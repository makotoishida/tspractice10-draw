import { TaskboardState, Project } from './types'
import { getRandomID, parseDate } from './utils'

const STORAGE_KEY = 'taskboard'

type SavedState = {
  currentProjectId?: string
  projects?: Project[]
}

export async function save(state: TaskboardState) {
  const savedState: SavedState = {
    currentProjectId: state.currentProjectId,
    projects: state.projects,
  }
  const s = JSON.stringify(savedState)
  window.localStorage.setItem(STORAGE_KEY, s)
}

export async function load(): Promise<TaskboardState> {
  const s = window.localStorage.getItem(STORAGE_KEY) ?? '{}'
  const tempState = JSON.parse(s) as SavedState
  let currentProjectId = tempState.currentProjectId

  // Create default initial project as an examle.
  if (!tempState.projects) {
    tempState.projects = []
  }

  if (!tempState.projects?.length) {
    tempState.projects.push({
      id: getRandomID(),
      title: 'First Project',
      lanes: [
        {
          id: getRandomID(),
          title: 'To Do',
          tasks: [
            { id: '1', title: 'test', description: '', dueDate: new Date() },
          ],
        },
        { id: getRandomID(), title: 'Doing', tasks: [] },
        { id: getRandomID(), title: 'Done', tasks: [] },
      ],
    })
    currentProjectId = tempState.projects[0].id
  }

  // Restore Date type from string.
  tempState.projects = restoreDate(tempState.projects)

  const state: TaskboardState = {
    currentProjectId: currentProjectId ?? tempState.projects[0].id,
    projects: tempState.projects,
    editing: {},
    dragdrop: {},
  }

  return state
}

function restoreDate(projects: Project[]) {
  return projects.map((p) => ({
    ...p,
    lanes: p.lanes.map((ln) => ({
      ...ln,
      tasks: ln.tasks.map((t) => ({
        ...t,
        dueDate: parseDate(t.dueDate as unknown as string),
      })),
    })),
  }))
}
