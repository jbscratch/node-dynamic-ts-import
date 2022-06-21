import fs from 'fs-extra';
import { create } from 'ts-node';

// can create a node execution context! <3
import vm from 'vm';

async function link(specifier, referencingModule) {
	// This would be the function to define how module resolution should happen for imports inside the config file.
	// we'll simply ignore it for now

	// Get the raw source code.
	const source = await fs.readFile(specifier);

	// Instantiate a new module and return it.
	return new vm.SourceTextModule(source, {
		identifier: specifier,
		context: referencingModule.context,
	});
}

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
	console.log({ jsOutput });

	// instructions: https://dev.to/mxfellner/dynamic-import-with-http-urls-in-node-js-7og
	const context = vm.createContext({
		console,
	});
	const mod = new vm.SourceTextModule(jsOutput, {
		identifier: 'dynamic-zwp-config',
		context,
	});

	await mod.link(link);
	await mod.evaluate();

	const result = mod.namespace;

	console.log(result);
}

main();
