import { State, Shapes, Stroke, Fill } from './types'
import { getRandomID } from './utils'

const STORAGE_KEY = 'draw'

export type SavedState = {
  shapes?: Shapes[]
  stroke?: Stroke
  fill?: Fill
  drawing?: Shapes
}

export async function save(state: State) {
  const savedState: SavedState = {
    shapes: state.shapes,
    stroke: state.stroke,
    fill: state.fill,
    drawing: state.drawing,
  }

  const s = JSON.stringify(savedState)
  window.localStorage.setItem(STORAGE_KEY, s)
}

export async function load(): Promise<State> {
  const s = window.localStorage.getItem(STORAGE_KEY) ?? '{}'
  const tempState = JSON.parse(s) as SavedState

  const state: State = {
    appWidth: 0,
    appHeight: 0,
    mouseDown: false,
    startPos: { x: 0, y: 0 },

    shapes: tempState.shapes ?? [],
    stroke: tempState.stroke ?? { color: 'blue' },
    fill: tempState.fill ?? { color: 'aqua' },
    drawing: tempState.drawing ?? {
      type: 'rect',
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      stroke: tempState.stroke ?? { color: 'blue' },
      fill: tempState.fill ?? { color: 'aqua' },
    },
  }

  return state
}
