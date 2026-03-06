import { createBuilder } from '@angular-devkit/architect';
import { executeDevServerBuilder } from '@angular/build';
import { angularGrabEsbuildPlugin } from '../../../esbuild-plugin';

export default createBuilder(async function* (options: any, context) {
  yield* executeDevServerBuilder(options, context, {
    buildPlugins: [angularGrabEsbuildPlugin({ rootDir: context.workspaceRoot })],
  });
});
