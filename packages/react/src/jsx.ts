import { REACT_ElEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Key,
	ReactElementI,
	Ref,
	Props,
	ElementType
} from 'shared/ReactTypes';

// ReactElement
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementI {
	const element = {
		$$typeof: REACT_ElEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mask: 'lqr'
	};
	return element;
};

export const jsx = (
	type: ElementType,
	config: any,
	...maybeChildren: any[]
) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			//处理传入的是不是key
			if (val !== undefined) {
				key = '' + val;
				continue;
			}
		}

		if (prop === 'ref') {
			// 处理传入的r ef
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}

		// 判断是自己的props 还是原型的props
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	const maybeChildrenLength = maybeChildren.length;

	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			// 只有一个child child
			props.children = maybeChildren[0];
		} else {
			// 多个child [child, child]
			props.children = maybeChildren;
		}
	}
	return ReactElement(type, key, ref, props);
};

export const jsxDev = (type: ElementType, config: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			//处理传入的是不是key
			if (val !== undefined) {
				key = '' + val;
				continue;
			}
		}

		if (prop === 'ref') {
			// 处理传入的r ef
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}

		// 判断是自己的props 还是原型的props
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	return ReactElement(type, key, ref, props);
};
