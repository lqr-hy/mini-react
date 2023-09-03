import { createFiberFromElement, FiberNode } from './fiber';
import { ReactElementI } from 'shared/ReactTypes';
import { REACT_ElEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './filberFlags';

function ChildrenReconciler(shouldTrackEffects: boolean) {
	// shouldTrackEffects 是否追踪副作用
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		nextChild: ReactElementI
	) {
		// 根据element 创建fiber
		const fiber = createFiberFromElement(nextChild);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcilerSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	// 插入单一的节点
	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}

		return fiber;
	}

	return function reconcilerChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		nextChild: ReactElementI | null
	) {
		// 判断的当前fiber类型
		if (typeof nextChild === 'object' && nextChild !== null) {
			switch (nextChild.$$typeof) {
				case REACT_ElEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, nextChild)
					);
				default:
					if (__DEV__) {
						console.warn('未实现reconciler');
					}
					break;
			}
		}

		if (typeof nextChild === 'string' || typeof nextChild === 'number') {
			return placeSingleChild(
				reconcilerSingleTextNode(returnFiber, currentFiber, nextChild)
			);
		}

		if (__DEV__) {
			console.warn('未实现reconciler');
		}
		return null;
	};
}

export const reconcilerChildFibers = ChildrenReconciler(true);
export const mountChildFibers = ChildrenReconciler(false);
