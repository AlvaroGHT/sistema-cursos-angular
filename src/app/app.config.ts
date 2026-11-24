
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { BaseDatos } from './services/base-datos';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideAppInitializer(() => {
      return inject(BaseDatos).inicializar();
    })
  ]
};
