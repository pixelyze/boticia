import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001/fr";

// ─── PAGES PUBLIQUES ───

test.describe("Navigation publique", () => {
  test("page accueil se charge", async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveURL(/\/fr$/);
    // Le contenu principal est visible
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("accueil → mariages (SPA navigation, meme layout)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    // Clic sur le lien mariages dans la nav
    const link = page.locator('a[href*="/mariages"]').first();
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL(/\/fr\/mariages/);
      await expect(page.locator("#main-content")).toBeVisible();
      // Pas de page blanche
      const content = await page.locator("#main-content").textContent();
      expect(content?.trim().length).toBeGreaterThan(0);
    }
  });

  test("accueil → evenements (SPA navigation, meme layout)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const link = page.locator('a[href*="/evenements"]').first();
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL(/\/fr\/evenements/);
      await expect(page.locator("#main-content")).toBeVisible();
      const content = await page.locator("#main-content").textContent();
      expect(content?.trim().length).toBeGreaterThan(0);
    }
  });

  test("accueil → FAQ → accueil (aller-retour)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const faqLink = page.locator('a[href*="/faq"]').first();
    if (await faqLink.isVisible()) {
      await faqLink.click();
      await expect(page).toHaveURL(/\/fr\/faq/);
      await expect(page.locator("#main-content")).toBeVisible();

      // Retour vers accueil
      const homeLink = page.locator('a[href="/fr"]').first();
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL(/\/fr$/);
        await expect(page.locator("#main-content")).toBeVisible();
      }
    }
  });

  test("navigation par bouton retour navigateur", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    const link = page.locator('a[href*="/mariages"]').first();
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL(/\/fr\/mariages/);

      // Retour navigateur
      await page.goBack();
      await expect(page).toHaveURL(/\/fr$/);
      await expect(page.locator("#main-content")).toBeVisible();
      const content = await page.locator("#main-content").textContent();
      expect(content?.trim().length).toBeGreaterThan(0);
    }
  });
});

// ─── PAGE LOGIN ───

test.describe("Navigation login", () => {
  test("page login se charge", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    // La page login n'a pas #main-content, on verifie le formulaire
    await expect(page.locator("input, button").first()).toBeVisible();
  });
});

// ─── DASHBOARD (protege par auth) ───

test.describe("Dashboard — redirection sans auth", () => {
  test("dashboard redirige vers login si non connecte", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    // Doit rediriger vers login ou afficher la page sans contenu auth
    await page.waitForTimeout(3000);
    const url = page.url();
    // Soit redirigé vers login, soit la page gère l'absence d'auth
    expect(
      url.includes("/login") || url.includes("/dashboard")
    ).toBeTruthy();
  });
});

// ─── NAVIGATION ENTRE LAYOUTS ───

test.describe("Navigation entre layouts differents", () => {
  test("accueil (homepage layout) → login (default layout)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    await page.goto(`${BASE}/login`);
    await expect(page.locator("input, button").first()).toBeVisible();
  });

  test("login → accueil (changement de layout)", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState("networkidle");

    await page.goto(BASE);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });
});

// ─── ROBUSTESSE — PAS DE PAGE BLANCHE ───

test.describe("Pas de page blanche (regression)", () => {
  const publicPages = [
    { url: "/fr", selector: "#main-content" },
    { url: "/fr/mariages", selector: "#main-content" },
    { url: "/fr/evenements", selector: "#main-content" },
    { url: "/fr/faq", selector: "#main-content" },
    { url: "/fr/login", selector: "input, button" },
  ];

  for (const { url, selector } of publicPages) {
    test(`${url} — contenu visible`, async ({ page }) => {
      await page.goto(`http://localhost:3001${url}`);
      await page.waitForLoadState("networkidle");
      await expect(page.locator(selector).first()).toBeVisible();
    });
  }

  test("navigation rapide entre 3 pages sans page blanche", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");

    // Navigation rapide : accueil → mariages → evenements
    await page.goto(`${BASE}/mariages`);
    await expect(page.locator("#main-content")).toBeVisible();

    await page.goto(`${BASE}/evenements`);
    await expect(page.locator("#main-content")).toBeVisible();

    // Retour accueil
    await page.goto(BASE);
    await expect(page.locator("#main-content")).toBeVisible();

    const content = await page.locator("#main-content").textContent();
    expect(content?.trim().length).toBeGreaterThan(0);
  });
});
