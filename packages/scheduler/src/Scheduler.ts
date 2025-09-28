// ! 该文件要实现一个基于 JS 的单线程任务调度器
import { getCurrentTime } from 'shared/utils'
import type {
  NoPriority,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  PriorityLevel,
} from './SchedulerPriorities'

// 函数执行完就返回 null 或 undefined；但是若函数还没执行完就继续返回 callback 函数
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

// 任务池，是一个小顶堆的数据结构
const taskQueue: Array<Task> = []

// 记录当前任务和任务的优先级
let currentTask: Task | null = null
let currentTaskPriority: PriorityLevel = NoPriority

// todo: scheduleCallback 函数用于执行任务（执行函数），也是任务调度器的入口函数
function scheduleCallback(priorityLevel: PriorityLevel, callback: Callback) {}

/**
 *  cancelCallback 函数用于取消某个任务
 *  @description 将 task.callback 执行函数的值设置为 null，当这个任务位于堆顶时，通过判断是否为 null 值进行删除
 */
function cancelCallback() {
  currentTask && (currentTask.callback = null)
}

// todo: getCurrentPriorityLevel 函数用于获取当前任务的优先级
function getCurrentPriorityLevel(): PriorityLevel {
  return currentTaskPriority
}

// 记录时间切片的起始值和时间切片的时长
let startTime: number = -1
let frameInterval: number = 5

// todo: shouldYieldToHost 函数用于判断是否将控制权交还给主线程
function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime
  // 判断时间切片是否消耗完毕
  if (timeElapsed < frameInterval) return false
  return true
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
