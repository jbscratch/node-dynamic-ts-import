const fs = require('fs-extra');
const { create } = require('ts-node');

async function main() {
	console.log('Running');
	// TS Config Docs: https://www.typescriptlang.org/tsconfig
	const tsService = create({
		compilerOptions: {
			target: 'es5',
			module: 'commonjs',
			lib: ['DOM'],
			sourceMap: false,
			inlineSourceMap: false,
		},
	});

	const dynamicTsFile = await fs.readFile(`./my-ts-module.ts`, 'utf-8');
	const jsOutput = tsService.compile(dynamicTsFile, './my-ts-module.ts');

	console.log({ jsOutput });

	const result = eval(jsOutput);

	console.log(result);
}

main();
