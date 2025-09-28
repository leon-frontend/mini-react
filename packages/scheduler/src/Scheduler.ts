// ! 该文件要实现一个基于 JS 的单线程任务调度器
import { getCurrentTime, isFn } from 'shared/utils'
import { peek, pop } from './SchedulerMinHeap'
import {
  NoPriority,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  PriorityLevel,
} from './SchedulerPriorities'

// ============================= 定义任务调度器相关类型 =============================

/**
 * @description Callback 类型用于定义任务的回调函数。
 * @param args 参数用于判断是否需要继续执行任务。若需要继续执行任务，则返回 callback 函数；若不需要继续执行任务，则返回 null 或 undefined
 */
type Callback = (args: boolean) => Callback | null | undefined

// 任务类型
export type Task = {
  id: number
  callback: Callback | null
  priorityLevel: PriorityLevel // 优先级
  startTime: number // 任务开始时间
  expirationTime: number // 任务结束时间
  sortIndex: number // 小顶堆的排序依据。会综合考虑优先级、任务开始时间和任务结束时间。
}

// ============================= 定义任务调度器相关变量 =============================

// 任务池，是一个小顶堆的数据结构
const taskQueue: Array<Task> = []

// 记录当前任务和当前任务的优先级
let currentTask: Task | null = null
let currentTaskPriority: PriorityLevel = NoPriority

// 记录时间切片的起始值和时间切片的时长
let startTime: number = -1
let frameInterval: number = 5

// 锁，记录是否有 work 正在执行任务。防止重复执行任务
const isPerformingWork = false

// ============================= 定义任务调度器相关函数 =============================

/**
 * @description scheduleCallback 函数用于执行任务（执行函数），也是任务调度器的入口函数
 */
function scheduleCallback(priorityLevel: PriorityLevel, callback: Callback) {}

/**
 *  该函数用于取消某个任务
 *  @description 将 task.callback 执行函数的值设置为 null，当这个任务位于堆顶时，通过判断是否为 null 值（无效任务）进行删除
 */
function cancelCallback() {
  currentTask && (currentTask.callback = null)
}

/**
 * @description 该函数用于获取当前任务的优先级
 */
function getCurrentPriorityLevel(): PriorityLevel {
  return currentTaskPriority
}

/**
 * @description shouldYieldToHost 函数用于判断是否将控制权交还给主线程
 */
function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime
  // 判断时间切片是否消耗完毕
  if (timeElapsed < frameInterval) return false
  return true
}

/**
 * @description workLoop 函数用于循环执行多个 task 任务。一个 work 就是一个时间切片，一个时间切片内会执行多个 task 任务。
 * @param initialTime 时间切片的起始值
 * @returns 返回值用于判断是否需要继续执行任务。若需要继续执行任务，则返回 true；若不需要继续执行任务，则返回 false
 */
function workLoop(initialTime: number): boolean {
  // 记录时间切片的起始值
  const currentTime = initialTime

  // 从任务池中获取当前执行的任务。若任务池为空，则返回 null
  currentTask = peek(taskQueue)

  // 循环执行多个 task 任务
  while (currentTask !== null) {
    // 在执行 task 任务之前，先检查当前时间切片是否消耗完毕。若消耗完毕，且需要将控制权交还给主线程时，则不执行 task 任务
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) break

    // 执行当前任务，即执行 task.callback 函数
    const callback = currentTask.callback // 获取当前任务的 callback 函数

    // 判断当前 callback 的类型是否为函数。若是函数类型，则执行该函数；若为 null 类型，则从任务池中删除该任务
    if (isFn(callback)) {
      // ============== 处理有效的任务 ===============
      currentTask.callback = null // 先将当前任务的 callback 函数设置为 null，防止重复执行该任务
      currentTaskPriority = currentTask.priorityLevel // 更新当前任务的优先级

      // 检查当前任务是否超时，即是否还有执行时间
      const checkCallbackTimeout: boolean =
        currentTask.expirationTime <= currentTime

      // 执行当前任务，并获取 callback 函数的返回值。
      // 若返回值为函数类型，则说明该任务还未执行完；若返回值为 null 或 undefined，则说明该任务已执行完
      const continuationCallback = callback(checkCallbackTimeout)

      // 判断当前任务是否还有执行时间。若还有执行时间，则将当前任务重新插入任务池中
      if (isFn(continuationCallback)) {
        // 代码走到这里时，代表当前任务是一个“可中断”的长任务，它本次只执行了一部分。
        // callback 函数返回了一个新的函数（continuationCallback），这个新函数代表了“下一阶段要继续做的工作”。
        // 我们需要：
        // 1. 更新当前任务的 callback，让它指向下一阶段的工作。
        // 2. 退出 workLoop，将控制权交还给浏览器，等待下一次时间切片。
        // return true 告诉调度器：“工作还没完，请在未来继续调度我”。
        currentTask.callback = continuationCallback // 更新任务，准备在未来的时间切片中继续执行
        return true
      } else {
        // 代码走到这里时，代表 callback 函数执行后返回了 null 或 undefined，说明该任务已经“彻底完成”，没有后续工作了。
        // 因此，我们需要将这个已完成的任务从任务队列 taskQueue 中移除。
        // 【关键检查】：在移除前，必须检查 currentTask 是否还是堆顶任务。
        // 因为在执行 callback 的过程中，可能通过调度器插入了一个优先级更高的新任务，导致堆顶发生了变化。
        // 如果不检查就直接 pop，可能会错误地移除那个刚刚插入的、更紧急的新任务。        if (currentTask === peek(taskQueue)) {
        pop(taskQueue) // 若 currentTask 是堆顶任务，则从任务池中删除该任务
      }
    } else {
      // ============== 处理无效的任务 ===============
      pop(taskQueue) // 由于是堆顶的任务，所以可以从任务池中直接删除该任务
    }

    // 获取下一个任务
    currentTask = peek(taskQueue)
  }

  // 若当前任务不为空，则说明还有任务需要执行，则返回 true
  // 这通常发生在 while 循环因为时间切片耗尽（shouldYieldToHost() 为 true）而中断。
  if (currentTask !== null) return true
  return false
}

export {
  NoPriority,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  scheduleCallback, // 调度任务
  cancelCallback, // 取消任务
  getCurrentPriorityLevel, // 获取当前任务的优先级
  shouldYieldToHost as shouldYield, // 将控制权交还给主线程
}
