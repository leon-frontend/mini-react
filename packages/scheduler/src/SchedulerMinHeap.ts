// 定义节点
export type Node = {
  id: number // 节点 id，用于标识唯一性
  sortIndex: number // 节点的排序索引
}

// 定义最小堆，使用数组实现
export type Heap<T extends Node> = Array<T>

// compare 函数用于比较两个节点的排序索引，若排序索引相同，则比较节点 id
function compare(a: Node, b: Node) {
  const diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
}

// todo: peek 函数用于获取堆顶元素
export function peek<T extends Node>(heap: Heap<T>): T | null {
  return heap.length > 0 ? heap[0] : null
}

// siftUp 函数用于自下而上实现堆化
function siftUp<T extends Node>(heap: Heap<T>, newNode: T, newNodeIndex: number): void {
  while (newNodeIndex > 0) {
    const parentIndex = (newNodeIndex - 1) >>> 1
    const parentNode = heap[parentIndex] // 获取父节点
    if (compare(newNode, parentNode) >= 0) break
    heap[newNodeIndex] = parentNode // 父节点下移
    heap[parentIndex] = newNode // 子节点上移
    newNodeIndex = parentIndex // 更新新节点索引
  }
}

// todo: push 函数用于给最小堆插入元素
export function push<T extends Node>(heap: Heap<T>, newNode: T): void {
  // 1. 先将新节点插入堆的末尾
  heap.push(newNode)
  const newNodeIndex = heap.length - 1

  // 2. 调整最小堆，自下而上实现堆化
  siftUp(heap, newNode, newNodeIndex)
}

// 自上而下进行堆化
function siftDown<T extends Node>(heap: Heap<T>, node: T, nodeIndex: number) {
  const halfLen = heap.length >>> 1 // 堆化时，只需要遍历前面一半的元素

  while (nodeIndex < halfLen) {
    const leftIndex = (nodeIndex << 1) + 1 // 左子节点索引，肯定存在
    const rightIndex = leftIndex + 1 // 右子节点索引，可能不存在
    const [leftNode, rightNode] = [heap[leftIndex], heap[rightIndex]]
    if (compare(leftNode, rightNode) < 0) {
      if (rightIndex < heap.length && compare(rightNode, leftNode) < 0) {
        // 右子节点存在，并且右子节点比左子节点小
        heap[nodeIndex] = rightNode // 右子节点上移
        heap[rightIndex] = node // 堆化节点右下移
        nodeIndex = rightIndex // 更新节点索引
      } else {
        // 右子节点不存在，或者右子节点比左子节点小时，都是上移左子节点
        heap[nodeIndex] = leftNode // 左子节点上移
        heap[leftIndex] = node // 堆化节点左下移
        nodeIndex = leftIndex // 节点索引更新
      }
    } else if (rightIndex < heap.length && compare(rightNode, node) < 0) {
      // 此时左子节点比 node 大，右子节点比 node 小，因此右子节点小于左子节点，右子节点上移
      heap[nodeIndex] = rightNode // 右子节点上移
      heap[rightIndex] = node // 堆化节点右下移
      nodeIndex = rightIndex // 节点索引更新
    } else {
      // 根节点最小，不需要堆化
      return
    }
  }
}

// todo: pop 函数用于删除堆顶元素
export function pop<T extends Node>(heap: Heap<T>): T | null {
  if (heap.length === 0) return null

  const firstNode = heap[0]
  const lastNode = heap.pop()! // 感叹号 ! 表示非空断言运算符

  if (firstNode !== lastNode) {
    heap[0] = lastNode // 将最后一个节点放到堆顶
    siftDown(heap, lastNode, 0) // 自上而下堆化
  }

  return firstNode
}
