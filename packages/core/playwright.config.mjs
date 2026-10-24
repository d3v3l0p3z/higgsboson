import { defineConfig } from "@playwright/test";

/**
 * Visual regression tests for the core component playground.
 *
 * Serves the core package (lite-server on :8000, same as `npm run dev:core:default`),
 * visits every component page listed in higgsboson.json and screenshots each rendered
 * case with the default theme, comparing against the committed baselines.
 *
 * Run:              npm run test:visual
 * Update baselines: npm run test:visual:update
 */
export default defineConfig({
  testDir: "./visual-tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  // One folder per spec file, one png per case name: <testDir>/__screenshots__/<spec>/<name>.png
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFileName}/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: "http://localhost:8000",
    screenshot: "only-on-failure",
    // Fixed viewport + scale for deterministic baselines
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  },
  projects: [
    {
      name: "chromium",
    },
  ],
  webServer: {
    // Pages need the dev (non-minified) build at dist/higgsboson-core.css
    command: "npm run build:dev && npm run server:start",
    url: "http://localhost:8000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
