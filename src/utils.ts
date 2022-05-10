export function twoDig(n: number): string {
  return `0${n}`.slice(-2)
}

export function formatDate(d?: Date): string {
  if (!d) return ''
  return `${d.getMonth() + 1}/${d.getDate()}/${twoDig(d.getFullYear())}`
}

export function formatDateForInput(d?: Date) {
  if (!d) return ''
  return `${d.getFullYear()}-${twoDig(d.getMonth() + 1)}-${twoDig(d.getDate())}`
}

export function formatDateForStorage(d?: Date) {
  if (!d) return ''
  return `${d.getFullYear()}-${twoDig(d.getMonth() + 1)}-${twoDig(
    d.getDate()
  )}T00:00:00`
}

export function parseDate(s: string) {
  if (!s) return undefined
  return new Date(s)
}

export function getRandomID(): string {
  return Date.now() + Math.random() + ''
}
