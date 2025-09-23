import vm from 'node:vm';

export interface RunnableFunctionDef {
  name: string;
  runtime: string; // 'js'
  code: string;
}

export class FunctionSandboxRunner {
  constructor(private timeoutMs = 100, private memoryLimitBytes = 1024 * 1024) {}

  run(fn: RunnableFunctionDef, input: any): any {
    if (fn.runtime !== 'js') throw new Error('Unsupported runtime');
    const context: any = { module: { exports: null }, exports: {} };
    vm.createContext(context);
    const script = new vm.Script(fn.code, { filename: `${fn.name}.fn.js` });
    script.runInContext(context, { timeout: this.timeoutMs });
    const exported = context.module.exports ?? context.exports;
    if (typeof exported !== 'function') throw new Error('FunctionDef did not export a function');
    return exported(input);
  }
}

export const defaultFunctionRunner = new FunctionSandboxRunner();
