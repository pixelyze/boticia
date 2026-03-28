import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001/fr";

// Viewport desktop pour voir la topbar (les liens sont hidden sur mobile)
test.use({ viewport: { width: 1280, height: 720 } });

test.describe("Navigation via topbar (clics reels SPA)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
  });

  test("clic Mariages dans la topbar", async ({ page }) => {
    const link = page.locator("nav a", { hasText: /mariages/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/fr\/mariages/);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test("clic Evenements dans la topbar", async ({ page }) => {
    const link = page.locator("nav a", { hasText: /[eé]v[eé]nements/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/fr\/evenements/);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test("clic Ateliers dans la topbar", async ({ page }) => {
    const link = page.locator("nav a", { hasText: /ateliers/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/fr\/ateliers/);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test("clic logo Boticia revient a l'accueil", async ({ page }) => {
    // D'abord naviguer vers une autre page
    await page.locator("nav a", { hasText: /mariages/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/mariages/);

    // Clic sur le logo
    const logo = page.locator("nav a", { hasText: /Boticia/i }).first();
    await logo.click();
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("clic Espace client / Connexion dans la topbar", async ({ page }) => {
    // Le bouton connexion/espace client dans la topbar droite
    const loginBtn = page.locator("nav a[href*='login'], nav a[href*='mon-projet'], nav a[href*='dashboard']").first();
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      // Doit naviguer vers login, mon-projet ou dashboard
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(
        url.includes("/login") ||
        url.includes("/mon-projet") ||
        url.includes("/dashboard")
      ).toBeTruthy();
    }
  });
});

test.describe("Navigation topbar — aller-retour sans page blanche", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test("accueil → mariages → accueil via topbar", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    // Aller sur mariages
    await page.locator("nav a", { hasText: /mariages/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/mariages/);
    await expect(page.locator("#main-content")).toBeVisible();

    // Retour accueil via logo
    await page.locator("nav a", { hasText: /Boticia/i }).first().click();
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test("mariages → evenements → ateliers (3 navigations topbar)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    // Mariages
    await page.locator("nav a", { hasText: /mariages/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/mariages/);
    await expect(page.locator("#main-content")).toBeVisible();

    // Evenements
    await page.locator("nav a", { hasText: /[eé]v[eé]nements/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/evenements/);
    await expect(page.locator("#main-content")).toBeVisible();

    // Ateliers
    await page.locator("nav a", { hasText: /ateliers/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/ateliers/);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });

  test("5 navigations rapides via topbar sans page blanche", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const pages = [
      { selector: /mariages/i, url: /\/fr\/mariages/ },
      { selector: /[eé]v[eé]nements/i, url: /\/fr\/evenements/ },
      { selector: /ateliers/i, url: /\/fr\/ateliers/ },
      { selector: /mariages/i, url: /\/fr\/mariages/ },
      { selector: /Boticia/i, url: /\/fr$/ },
    ];

    for (const p of pages) {
      await page.locator("nav a", { hasText: p.selector }).first().click();
      await expect(page).toHaveURL(p.url);
      await expect(page.locator("#main-content")).toBeVisible();
    }
  });

  test("navigation topbar + retour navigateur", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    // Clic topbar mariages
    await page.locator("nav a", { hasText: /mariages/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/mariages/);

    // Clic topbar ateliers
    await page.locator("nav a", { hasText: /ateliers/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/ateliers/);

    // Retour navigateur → mariages
    await page.goBack();
    await expect(page).toHaveURL(/\/fr\/mariages/);
    await expect(page.locator("#main-content")).toBeVisible();

    // Retour navigateur → accueil
    await page.goBack();
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });
});
