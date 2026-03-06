import {
  InjectionToken,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import type { AngularGrabOptions, AngularGrabAPI } from '../core';
import { initAngularGrab } from './angular-grab.service';

export const ANGULAR_GRAB_API = new InjectionToken<AngularGrabAPI>('ANGULAR_GRAB_API');

export function provideAngularGrab(
  options?: Partial<AngularGrabOptions>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ANGULAR_GRAB_API,
      useFactory: () => initAngularGrab(options),
    },
    provideEnvironmentInitializer(() => initAngularGrab(options)),
  ]);
}
