import vm from 'vm';
import crypto from 'crypto';

export interface RunnableFunctionDef {
  name: string;
  runtime: string; // 'js'
  code: string;
}

export class FunctionSandboxRunner {
  private forbiddenPatterns: RegExp[] = [
    /\bprocess\b/,
    /\brequire\b/,
    /\bglobalThis\b/,
    /\bglobal\b/,
    /\bFunction\b/,
    /\beval\b/,
    /while\s*\(\s*true\s*\)/i,
    /for\s*\(\s*;\s*;\s*\)/
  ];

  constructor(
    private timeoutMs = 100,
    private memoryLimitBytes = 1024 * 1024,
    private maxCodeLength = 4000
  ) {}

  private scan(code: string) {
    if (code.length > this.maxCodeLength) {
      throw new Error(`Function code too large (> ${this.maxCodeLength} chars)`);
    }
    for (const pattern of this.forbiddenPatterns) {
      if (pattern.test(code)) {
        throw new Error('Function code contains forbidden token/pattern');
      }
    }
  }

  run(fn: RunnableFunctionDef, input: any): any {
    if (fn.runtime !== 'js') throw new Error('Unsupported runtime');
    this.scan(fn.code);

    const logs: string[] = [];
    const safeConsole = {
      log: (...args: any[]) => logs.push(args.map(a => this.safeToString(a)).join(' ')),
      error: (...args: any[]) => logs.push('[err] ' + args.map(a => this.safeToString(a)).join(' '))
    };

    const context: any = {
      module: { exports: null },
      exports: {},
      console: safeConsole,
      Math,
      Date,
      // Provide a tiny crypto helper for hashing if needed (non-browser dev ergonomics)
      hash: (value: any) => {
        try {
          return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
        } catch {
          return null;
        }
      }
    };
    vm.createContext(context, {
      codeGeneration: { strings: true, wasm: false }
    });

    // Prepend 'use strict' to tighten execution environment.
    const wrappedCode = `'use strict';\n${fn.code}`;

    let exportedFn: any;
    try {
      const script = new vm.Script(wrappedCode, { filename: `${fn.name}.fn.js` });
      script.runInContext(context, { timeout: this.timeoutMs });
      exportedFn = context.module.exports ?? context.exports;
      if (typeof exportedFn !== 'function') throw new Error('FunctionDef did not export a function');
    } catch (e: any) {
      throw new Error(`Sandbox load error: ${e?.message || 'unknown'}`);
    }

    try {
      const result = exportedFn(input);
      // Attach collected logs in a symbol-like key to avoid collisions
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        (result as any).__logs = logs;
      }
      return result;
    } catch (e: any) {
      throw new Error(`Sandbox execution error: ${e?.message || 'unknown'}`);
    }
  }

  private safeToString(v: any): string {
    try {
      if (typeof v === 'string') return v;
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
}

export const defaultFunctionRunner = new FunctionSandboxRunner();
