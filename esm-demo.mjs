import fs from 'fs-extra';
import { create } from 'ts-node';

async function main() {
	console.log('Running');
	// TS Config Docs: https://www.typescriptlang.org/tsconfig
	const tsService = create({
		emit: true,
		transpileOnly: true,
		compilerOptions: {
			target: 'es2015',
			module: 'es2015',
			lib: ['dom'],
			sourceMap: false,
			inlineSourceMap: false,
		},
	});

	const dynamicTsFile = await fs.readFile(`./my-ts-module.ts`, 'utf-8');
	const jsOutput = tsService.compile(dynamicTsFile, './my-ts-module.ts');

	const jsFile = `./out/my-ts-module.mjs`;
	await fs.ensureDir('./out');
	await fs.writeFile(jsFile, jsOutput);

	console.log({ jsOutput });

	const module = await import(jsFile);

	console.log(module);
}

main();
