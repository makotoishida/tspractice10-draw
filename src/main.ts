import { html, svg, render } from 'lit-html'
import 'normalize.css'
import './style.css'
import { State, Shapes, Rect, Circle, Line, ShapeTypes } from './types'
import { load, save } from './storage'

let state: State = {
  appWidth: 0,
  appHeight: 0,
  mouseDown: false,
  startPos: { x: 0, y: 0 },
  shapes: [] as Shapes[],
  stroke: {
    color: 'blue',
  },
  fill: {
    color: 'aqua',
  },
  drawing: {
    type: 'rect',
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    stroke: { color: 'blue' },
    fill: { color: 'aqua' },
  },
}

async function addShape(state: State, shape: Shapes) {
  state.shapes.push(shape)
  await save(state)
}

function DrawRectangle(rect: Rect) {
  return svg`<rect x=${rect.x} y=${rect.y} width=${rect.w} height=${rect.h} stroke=${rect.stroke.color} fill=${rect.fill.color} />`
}

function DrawCircle(circle: Circle) {
  return svg`<circle cx=${circle.x} cy=${circle.y} r=${circle.r} stroke=${circle.stroke.color} fill=${circle.fill.color} />`
}

function DrawLine(line: Line) {
  return svg`<line x1=${line.x} y1=${line.y} x2=${line.x2} y2=${line.y2} stroke=${line.stroke.color} />`
}

function DrawShapes(s: Shapes) {
  switch (s.type) {
    case 'rect':
      return DrawRectangle(s)
    case 'circle':
      return DrawCircle(s)
    case 'line':
      return DrawLine(s)
    default:
      return ''
  }
}

function changeShape(ev: MouseEvent) {
  ev.preventDefault()
  const type = (ev.currentTarget as HTMLButtonElement).dataset.type!
  state.drawing.type = type as ShapeTypes

  renderApp(state)
}

function Buttons(type: ShapeTypes) {
  const buttons = [
    { name: 'Rect', type: 'rect' },
    { name: 'Circle', type: 'circle' },
    { name: 'Line', type: 'line' },
    { name: 'None', type: 'none' },
  ]
  return html`<div class="buttons">
    ${buttons.map(
      (i) => html`
        <button
          type="button"
          class="btn ${i.type} ${type === i.type ? 'active' : ''}"
          data-type=${i.type}
          @click=${changeShape}
        >
          ${i.name}
        </button>
      `
    )}
  </div>`
}

function handleMouseDown(ev: MouseEvent) {
  // console.log('Mouse Down:', ev)
  state.mouseDown = true
  state.startPos = { x: ev.offsetX, y: ev.offsetY }
  // renderApp(state)
}

function handleMouseMove(ev: MouseEvent) {
  if (!state.mouseDown) return
  // console.log('Mouse Move:', ev)

  const x = state.startPos.x
  const y = state.startPos.y
  const x2 = ev.offsetX
  const y2 = ev.offsetY

  const w = Math.abs(x2 - x)
  const h = Math.abs(y2 - y)
  const r = Math.sqrt(w * w + h * h)

  switch (state.drawing.type) {
    case 'rect': {
      state.drawing = {
        type: 'rect',
        x: Math.min(x, x2),
        y: Math.min(y, y2),
        w,
        h,
        stroke: { ...state.stroke },
        fill: { ...state.fill },
      }
      break
    }
    case 'circle': {
      state.drawing = {
        type: 'circle',
        x,
        y,
        r,
        stroke: { ...state.stroke },
        fill: { ...state.fill },
      }
      break
    }
    case 'line': {
      state.drawing = {
        type: 'line',
        x,
        y,
        x2,
        y2,
        stroke: { ...state.stroke },
        fill: { ...state.fill },
      }
      break
    }
    default: {
      // None
    }
  }

  renderApp(state)
}

function handleMouseLeave(/* ev: MouseEvent */) {
  // console.log('Mouse Leave:', ev)
  state.mouseDown = false
  renderApp(state)
}

function handleMouseUp(ev: MouseEvent) {
  // console.log('mouse UP:', ev)
  end(ev.offsetX, ev.offsetY)
}

async function end(x2: number, y2: number) {
  state.mouseDown = false
  const type = state.drawing.type
  const x = state.startPos.x
  const y = state.startPos.y

  const w = Math.abs(x2 - x)
  const h = Math.abs(y2 - y)
  const r = Math.sqrt(w * w + h * h)

  let shape: Shapes = {
    type: 'none',
    x,
    y,
    stroke: { ...state.stroke },
    fill: { ...state.fill },
  }

  switch (type) {
    case 'rect': {
      shape = {
        type: 'rect',
        x: Math.min(x, x2),
        y: Math.min(y, y2),
        w,
        h,
        stroke: { ...state.stroke },
        fill: { ...state.fill },
      }
      break
    }
    case 'circle': {
      shape = {
        type: 'circle',
        x,
        y,
        r,
        stroke: { ...state.stroke },
        fill: { ...state.fill },
      }
      break
    }
    case 'line': {
      shape = {
        type: 'line',
        x,
        y,
        x2,
        y2,
        stroke: { ...state.stroke },
        fill: { ...state.fill },
      }
      break
    }
    default: {
      // None
    }
  }

  if (shape.type !== 'none') {
    await addShape(state, shape)
  }
  renderApp(state)
}

function handleTouchStart(ev: TouchEvent) {
  // console.log('TouchStart:', ev)
  state.mouseDown = true

  const el: HTMLElement = (ev.target as HTMLElement).closest<HTMLElement>(
    '.canvas'
  )!
  const rect = el.getBoundingClientRect()
  // console.log('Target=', rect, el)

  state.startPos = {
    x: ev.touches[0].clientX - rect.left,
    y: ev.touches[0].clientY - rect.top,
  }
  renderApp(state)
}

function handleTouchMove(/* ev: TouchEvent */) {
  // console.log('TouchMove:', ev)
  renderApp(state)
}

function handleTouchEnd(ev: TouchEvent) {
  // console.log('TouchEnd:', ev)
  const el: HTMLElement = (ev.target as HTMLElement).closest<HTMLElement>(
    '.canvas'
  )!
  const rect = el.getBoundingClientRect()
  // console.log('Target=', rect, el)
  end(
    ev.changedTouches[0].clientX - rect.left,
    ev.changedTouches[0].clientY - rect.top
  )
}

function handleTouchCancel(ev: TouchEvent) {
  // console.log('TouchCancel:', ev)
  handleTouchEnd(ev)
}

function App(state: State) {
  return html`<div
    class="canvas"
    @mousedown=${handleMouseDown}
    @mousemove=${handleMouseMove}
    @mouseleave=${handleMouseLeave}
    @mouseup=${handleMouseUp}
    @touchstart=${handleTouchStart}
    @touchmove=${handleTouchMove}
    @touchend=${handleTouchEnd}
    @touchcancel=${handleTouchCancel}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      baseProfile="full"
      width=${state.appWidth}
      height=${state.appHeight}
      viewBox="0 0 ${state.appWidth} ${state.appHeight}"
    >
      ${state.shapes.map((i: Shapes) => DrawShapes(i))}
      ${state.mouseDown ? DrawShapes(state.drawing) : ''}
    </svg>
    ${Buttons(state.drawing.type)}
  </div>`
}

async function renderApp(state: State) {
  const appRoot = document.querySelector<HTMLDivElement>('#app')!
  const r = appRoot.getBoundingClientRect()
  state.appWidth = r.width
  state.appHeight = r.height
  render(App(state), appRoot)
}

load().then((loadedState) => {
  console.log(loadedState)
  state = loadedState
  renderApp(state)
})

