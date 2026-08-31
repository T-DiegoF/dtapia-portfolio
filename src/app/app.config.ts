import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // The site is a single page; `httpResource` needs HttpClient, and the
    // fetch backend keeps the bundle free of the XHR shim.
    provideHttpClient(withFetch()),
    provideClientHydration(),
  ],
};
