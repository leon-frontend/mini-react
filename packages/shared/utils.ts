export function getCurrentTime(): number {
  return performance.now()
}

export function isArray(sth: unknown) {
  return Array.isArray(sth)
}

export function isNum(sth: unknown) {
  return typeof sth === 'number'
}

export function isObject(sth: unknown) {
  return typeof sth === 'object'
}

export function isFn(sth: unknown) {
  return typeof sth === 'function'
}

export function isStr(sth: unknown) {
  return typeof sth === 'string'
}
