import { Props, Key, Ref, ReactElementI } from 'shared/ReactTypes';
import { Flags, NoFlags } from './filberFlags';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Container } from 'hostConfig';

export class FiberNode {
	tag: WorkTag;
	type: any;
	pendingProps: Props;
	ref: Ref;
	key: Key;
	stateNode: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	alternate: FiberNode | null;
	updateQueue: unknown;
	memoizedState: any;

	subTreeFlags: Flags;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		// HostComponent div
		this.stateNode = null;
		// FunctionComponent () => {}
		this.type = null;

		// 构成树状结构
		// 指向父fiberNode
		this.return = null;
		// 下一个节点
		this.sibling = null;
		// 子节点
		this.child = null;
		this.index = 0;

		// 作为工作单元
		// 刚开始的props
		this.pendingProps = pendingProps;

		// 工作完了之后的props
		this.memoizedProps = null;
		// 调度之后的状态
		this.memoizedState = null;
		this.alternate = null;
		this.updateQueue = null;

		// 副作用
		this.flags = NoFlags;
		this.subTreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	// 当前指向
	current: FiberNode;
	//  执行完成之后的指向
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	// 首屏幕渲染
	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subTreeFlags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedState = current.memoizedState;
	wip.memoizedProps = current.pendingProps;

	return wip;
};

export function createFiberFromElement(element: ReactElementI): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义type类型', element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
