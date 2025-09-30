/**
 * @description getCurrentTime 函数用于获取当前时间
 * @return {number} 返回值用于获取当前时间
 */
export function getCurrentTime(): number {
  return performance.now()
}

/**
 * @description isArray 函数用于判断是否为数组
 * @param {unknown} sth 参数用于判断是否为数组
 * @return {boolean} 返回值用于判断是否为数组
 */
export function isArray(sth: unknown): boolean {
  return Array.isArray(sth)
}

/**
 * @description isNum 函数用于判断是否为数字
 * @param {unknown} sth 参数用于判断是否为数字
 * @return {boolean} 返回值用于判断是否为数字
 */
export function isNum(sth: unknown): boolean {
  return typeof sth === 'number'
}

/**
 * @description isObject 函数用于判断是否为对象
 * @param {unknown} sth 参数用于判断是否为对象
 * @return {boolean} 返回值用于判断是否为对象
 */
export function isObject(sth: unknown): boolean {
  return typeof sth === 'object'
}

/**
 * @description isFn 函数用于判断是否为函数
 * @param {unknown} sth 参数用于判断是否为函数
 * @return 返回值改成类型守卫（type predicate），让 TS 在分支内把值收窄为函数类型
 */
export function isFn(sth: unknown): sth is (...args: unknown[]) => unknown {
  return typeof sth === 'function'
}

/**
 * @description isStr 函数用于判断是否为字符串
 * @param {unknown} sth 参数用于判断是否为字符串
 * @return {boolean} 返回值用于判断是否为字符串
 */
export function isStr(sth: unknown): boolean {
  return typeof sth === 'string'
}
