import { create } from 'ts-node';
import fs from 'fs-extra';

async function main() {
	console.log('Running');
	// TS Config Docs: https://www.typescriptlang.org/tsconfig
	const tsService = create({
		compilerOptions: {
			target: 'es2020',
			lib: ['DOM'],
			sourceMap: false,
			inlineSourceMap: false,
		},
	});

	const dynamicTsFile = await fs.readFile(`./my-ts-module.ts`, 'utf-8');
	const jsOutput = tsService.compile(dynamicTsFile, './my-ts-module.ts');

	console.log({ dynamicTsFile, jsOutput });
}

main();
