import { createBuilder } from '@angular-devkit/architect';
import { buildApplication } from '@angular/build';
import { angularGrabEsbuildPlugin } from '../../../esbuild-plugin';

export default createBuilder(async function* (options: any, context) {
  const isProduction = !!options.optimization;
  yield* buildApplication(options, context, {
    codePlugins: [angularGrabEsbuildPlugin({
      rootDir: context.workspaceRoot,
      enabled: !isProduction,
    })],
  });
});
