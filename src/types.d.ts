export type Stroke = {
  color: string
}

export type Fill = {
  color: string
}

export type BaseShape = {
  type: string
  x: number
  y: number
  stroke: Stroke
  fill: Fill
}

export type Pos = {
  x: number
  y: number
}

export type Rect = BaseShape & {
  type: 'rect'
  w: number
  h: number
}

export type Circle = BaseShape & {
  type: 'circle'
  r: number
}

export type NoShape = BaseShape & {
  type: 'none'
}

export type Line = BaseShape & {
  type: 'line'
  x2: number
  y2: number
}

export type Shapes = Rect | Circle | Line | NoShape
export type ShapeTypes = Shapes['type']

export type State = {
  appWidth: number
  appHeight: number
  mouseDown: boolean
  startPos: Pos
  shapes: Shapes[]
  stroke: Stroke
  fill: Fill
  drawing: Shapes
}
