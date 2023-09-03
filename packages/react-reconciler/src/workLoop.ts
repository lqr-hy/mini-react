import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberRootNode) {
	workInProgress = createWorkInProgress(fiber.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	// 找到根fiber
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

//
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;

	// 找到根hostRootFiber
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}

	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
		} catch (error) {
			if (__DEV__) {
				console.error('workLoop异常', error);
			}
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// fiberNode 树
	commitRoot(root);
}

/* eslint-disable */
function commitRoot(root: FiberRootNode) {}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		// 存在兄弟节点
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 不存在返回父级
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
