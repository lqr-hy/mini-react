import { ReactElementI } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { mountChildFibers, reconcilerChildFibers } from './fiberChildren';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

// 递归中的递阶段
export const beginWork = (fiber: FiberNode) => {
	// 比较返回 fiberNode
	switch (fiber.tag) {
		case HostRoot:
			return updateHostRoot(fiber);
		case HostComponent:
			return updateHostComponent(fiber);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现类型');
			}
			break;
	}
	return null;
};

function updateHostRoot(fiber: FiberNode) {
	// 计算状态的最新值
	const baseState = fiber.memoizedState;
	const updateQueue = fiber.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	fiber.memoizedState = memoizedState;

	// 创建子fiberNode
	const nextChildren = fiber.memoizedState;
	reconcilerChildren(fiber, nextChildren);
	return fiber.child;
}

function updateHostComponent(fiber: FiberNode) {
	// 创建子children
	const nextProps = fiber.pendingProps;
	const nextChildren = nextProps.children;
	reconcilerChildren(fiber, nextChildren);
	return fiber.child;
}

function reconcilerChildren(fiber: FiberNode, children: ReactElementI | null) {
	const current = fiber.alternate;

	if (current !== null) {
		// update
		fiber.child = reconcilerChildFibers(fiber, current?.child, children);
	} else {
		// mount
		fiber.child = mountChildFibers(fiber, null, children);
	}
}
