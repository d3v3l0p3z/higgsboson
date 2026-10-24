import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

/**
 * Visual regression: one screenshot per rendered case of every core component,
 * styled with the default theme through the real dev playground pages.
 *
 * The DOM inside #hggs-root is: h1 (page title), then h2 (case) + example, repeated.
 * Headers carry the `hggs-markup-header` marker class added by addMarkupHeaders.mjs.
 */

const coreDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(path.join(coreDir, "higgsboson.json"), "utf8"));
const componentsMenuItems = manifest.componentsMenuItems;

/** Slugify a case label into a stable file name fragment. */
function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Wait until the page is rendered and the theme stylesheet is applied. */
async function waitForPlayground(page, pagePath) {
  await page.goto(pagePath.replace(/^\.\//, "/"));

  await page.waitForSelector("#hggs-root > h1.hggs-markup-header");

  await page.waitForFunction(() =>
    [...document.styleSheets].some((sheet) => sheet.href && sheet.href.includes("higgsboson-core.css")),
  );

  // Let layout and any late stylesheet rules settle
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

for (const item of componentsMenuItems) {
  const componentSlug = slugify(item.name);

  test.describe(item.name, () => {
    test("every case matches its baseline", async ({ page }) => {
      const consoleErrors = [];

      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      await waitForPlayground(page, item.path);

      const caseHeadings = page.locator("#hggs-root > h2.hggs-markup-header");
      const examples = page.locator("#hggs-root > :not(.hggs-markup-header)");
      const caseCount = await caseHeadings.count();

      expect(caseCount, `${item.name} must render at least one case`).toBeGreaterThan(0);
      expect(await examples.count(), `${item.name} must render one example per case`).toBe(caseCount);

      for (let index = 0; index < caseCount; index++) {
        const label = (await caseHeadings.nth(index).textContent())?.trim() || `case-${index + 1}`;
        const example = examples.nth(index);

        // Some states are not visible until interaction (e.g. a closed <dialog>): skip them
        if (!(await example.isVisible())) {
          test.info().annotations.push({ type: "skipped-invisible", description: label });
          continue;
        }

        await expect(example).toHaveScreenshot(`${componentSlug}--${index + 1}-${slugify(label)}.png`);
      }

      expect(consoleErrors, `${item.name} page must not log console errors`).toEqual([]);
    });
  });
}
