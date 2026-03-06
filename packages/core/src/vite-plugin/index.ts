import type { Plugin } from 'vite';
import { transformAngularComponent } from '../esbuild-plugin';

export function angularGrabVitePlugin(options?: { rootDir?: string }): Plugin {
  return {
    name: 'angular-grab-source-injector',
    enforce: 'pre',
    apply: 'serve',
    transform(code: string, id: string) {
      if (!id.endsWith('.component.ts') || !code.includes('@Component')) {
        return null;
      }
      const rootDir = options?.rootDir || process.cwd();
      return transformAngularComponent(code, id, rootDir);
    },
  };
}

export default angularGrabVitePlugin;
