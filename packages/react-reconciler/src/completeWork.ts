import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';

// 递归中的归阶段

export const completeWork = (fiber: FiberNode): FiberNode | null => {
	const newProps = fiber.pendingProps;
	const current = fiber.alternate;

	switch (fiber.tag) {
		case HostComponent:
			if (current !== null && fiber.stateNode) {
				// update
			} else {
				// 构建dom
				const instance = createInstance(fiber.type, newProps);
				// 讲dom插入dom树中
				appendAllChildren(instance, fiber);
				fiber.stateNode = instance;
			}
			bubbleProperties(fiber);
			return null;
		case HostRoot:
			bubbleProperties(fiber);
			return null;
		case HostText:
			if (current !== null && fiber.stateNode) {
				// update
			} else {
				// 构建dom
				const instance = createTextInstance(newProps.content);
				fiber.stateNode = instance;
			}
			bubbleProperties(fiber);
			return null;
		default:
			if (__DEV__) {
				console.log('未处理的completeWork');
			}
			break;
	}
};

function appendAllChildren(parent: FiberNode, fiber: FiberNode) {
	let node = fiber.child;

	while (node !== null) {
		if (node?.tag === HostComponent || node?.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node == fiber) {
			return;
		}

		// 找兄弟节点
		while (node.sibling === null) {
			if (node.return === null || node.return === fiber) {
				return;
			}
			node = node?.return;
		}

		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(fiber: FiberNode) {
	let subTreeFlags = fiber.subTreeFlags;
	let child = fiber.child;

	while (child !== null) {
		subTreeFlags |= child.subTreeFlags;
		subTreeFlags |= child.flags;

		child.return = fiber;
		child = child.sibling;
	}
	fiber.subTreeFlags |= subTreeFlags;
}
