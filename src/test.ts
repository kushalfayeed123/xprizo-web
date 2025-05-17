// src/test.ts

import "zone.js/testing";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

// Angular CLI's Webpack doesn't support `import.meta.glob` or `require.context` in v17.
// Instead, use this workaround to include all spec files explicitly.

// Add new test files here manually:
import "./app/app.component.spec";
import "./app/core/service/data/product/product-implementation.service.spec";
import "./app/state/products/products.state.spec";

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
