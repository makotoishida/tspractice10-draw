import { html, svg, render, TemplateResult } from 'lit-html'
import 'normalize.css'
import './style.css'

type Rect = {
  x: number
  y: number
  w: number
  h: number
  stroke: { color: string }
  fill: { color: string }
}

let state = {
  appWidth: 0,
  appHeight: 0,
  mouseDown: false,
  startPos: { x: 0, y: 0 },
  shapes: [] as Rect[],
  stroke: {
    color: 'blue',
  },
  fill: {
    color: 'aqua',
  },
  drawing: {
    type: 'rect',
    props: { x: 0, y: 0, w: 0, h: 0 },
  },
}

function handleMouseDown(ev: MouseEvent) {
  console.log('Mouse Down:', ev)
  state.mouseDown = true
  state.startPos = { x: ev.offsetX, y: ev.offsetY }
  renderApp(state)
}

function handleMouseMove(ev: MouseEvent) {
  if (!state.mouseDown) return
  // console.log('Mouse Move:', ev)

  const curX = ev.offsetX
  const curY = ev.offsetY
  const x = Math.min(state.startPos.x, curX)
  const y = Math.min(state.startPos.y, curY)
  const x2 = Math.max(state.startPos.x, curX)
  const y2 = Math.max(state.startPos.y, curY)

  const w = x2 - x
  const h = y2 - y

  state.drawing = {
    type: 'rect',
    props: { ...state.startPos, x, y, w, h },
  }

  renderApp(state)
}

function handleMouseLeave(ev: MouseEvent) {
  console.log('Mouse Leave:', ev)
  state.mouseDown = false
  state.drawing.type = ''
  renderApp(state)
}

function handleMouseUp(ev: MouseEvent) {
  console.log('mouse UP:', ev)
  end(ev.offsetX, ev.offsetY)
}

function end(curX: number, curY: number) {
  state.mouseDown = false
  state.drawing.type = ''

  const x = Math.min(state.startPos.x, curX)
  const y = Math.min(state.startPos.y, curY)
  const x2 = Math.max(state.startPos.x, curX)
  const y2 = Math.max(state.startPos.y, curY)

  const w = x2 - x
  const h = y2 - y
  const shape: Rect = {
    x,
    y,
    w,
    h,
    stroke: { color: state.stroke.color },
    fill: { color: state.fill.color },
  }
  state.shapes.push(shape)
  renderApp(state)
}

function handleTouchStart(ev: TouchEvent) {
  console.log('TouchStart:', ev)
  state.mouseDown = true

  const el: HTMLElement = (ev.target as HTMLElement).closest<HTMLElement>(
    '.canvas'
  )!
  const rect = el.getBoundingClientRect()
  console.log('Target=', rect, el)

  state.startPos = {
    x: ev.touches[0].clientX - rect.left,
    y: ev.touches[0].clientY - rect.top,
  }
  renderApp(state)
}

function handleTouchMove(ev: TouchEvent) {
  console.log('TouchMove:', ev)
  renderApp(state)
}

function handleTouchEnd(ev: TouchEvent) {
  console.log('TouchEnd:', ev)
  const el: HTMLElement = (ev.target as HTMLElement).closest<HTMLElement>(
    '.canvas'
  )!
  const rect = el.getBoundingClientRect()
  console.log('Target=', rect, el)
  end(
    ev.changedTouches[0].clientX - rect.left,
    ev.changedTouches[0].clientY - rect.top
  )
}

function handleTouchCancel(ev: TouchEvent) {
  console.log('TouchCancel:', ev)
  handleTouchEnd(ev)
}

function App(state: any) {
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
      <circle cx="150" cy="100" r="80" fill="green" />
      ${state.shapes.map(
        (i: Rect) =>
          svg`<rect x=${i.x} y=${i.y} width=${i.w} height=${i.h} stroke=${i.stroke.color} fill=${i.fill.color} />`
      )}
      ${state.drawing.type === 'rect'
        ? svg`<rect x=${state.drawing.props.x} y=${state.drawing.props.y} width=${state.drawing.props.w} height=${state.drawing.props.h} stroke=${state.stroke.color} fill=${state.fill.color} />`
        : ''}
    </svg>
  </div>`
}

async function renderApp(state: any) {
  const appRoot = document.querySelector<HTMLDivElement>('#app')!
  const r = appRoot.getBoundingClientRect()
  state.appWidth = r.width
  state.appHeight = r.height
  render(App(state), appRoot)
}

renderApp(state)
