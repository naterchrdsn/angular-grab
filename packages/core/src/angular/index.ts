// Resolvers
export { resolveComponent } from './resolvers/component-resolver';
export { resolveSource } from './resolvers/source-resolver';
export { buildContext } from './resolvers/context-builder';

// Angular integration
export {
  initAngularGrab,
  getAngularGrabApi,
  registerAngularGrabPlugin,
  disposeAngularGrab,
} from './angular-grab.service';
export { provideAngularGrab, ANGULAR_GRAB_API } from './provide-angular-grab';
