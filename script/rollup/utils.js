import path from 'path';
import fs from 'fs';
import cmj from '@rollup/plugin-commonjs';
import tyj from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}

	return `${pkgPath}/${pkgName}`;
}

function getPackageJson(pkgName) {
	// 包路径
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
}

function getBaseRollupPlugins({
	alias = {
		__DEV__: true
	},
	typescriptConfig = {}
} = {}) {
	return [replace(alias), cmj(), tyj(typescriptConfig)];
}

export { getPackageJson, resolvePkgPath, getBaseRollupPlugins };
