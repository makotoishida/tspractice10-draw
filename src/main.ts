import { html, render } from 'lit-html'
import 'normalize.css'
import './style.css'

function App(state: any) {
  return html`<div>DRAW</div>`
}

async function renderApp(state: any) {
  const appRoot = document.querySelector<HTMLDivElement>('#app')!
  render(App(state), appRoot)
}

renderApp({})
