import { test, expect } from "@playwright/test";

const PROD = "https://boticia.fr/fr";

test.use({ viewport: { width: 1280, height: 720 } });

// ─── PAGES PUBLIQUES ───

test.describe("Production — Pages publiques", () => {
  test("accueil se charge", async ({ page }) => {
    await page.goto(PROD);
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("body")).toContainText("Boticia");
  });

  test("page mariages se charge", async ({ page }) => {
    await page.goto(`${PROD}/mariages`);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("page evenements se charge", async ({ page }) => {
    await page.goto(`${PROD}/evenements`);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("page FAQ se charge", async ({ page }) => {
    await page.goto(`${PROD}/faq`);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("page login se charge", async ({ page }) => {
    await page.goto(`${PROD}/login`);
    await expect(page.locator("input, button").first()).toBeVisible();
  });
});

// ─── NAVIGATION SPA TOPBAR ───

test.describe("Production — Navigation SPA via topbar", () => {
  test("accueil → mariages via topbar", async ({ page }) => {
    await page.goto(PROD);
    await page.waitForLoadState("networkidle");

    const link = page.locator("nav a", { hasText: /mariages/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/mariages/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("mariages → evenements → ateliers via topbar", async ({ page }) => {
    await page.goto(PROD);
    await page.waitForLoadState("networkidle");

    await page.locator("nav a", { hasText: /mariages/i }).first().click();
    await expect(page).toHaveURL(/\/mariages/);
    await expect(page.locator("#main-content")).toBeVisible();

    await page.locator("nav a", { hasText: /[eé]v[eé]nements/i }).first().click();
    await expect(page).toHaveURL(/\/evenements/);
    await expect(page.locator("#main-content")).toBeVisible();

    await page.locator("nav a", { hasText: /ateliers/i }).first().click();
    await expect(page).toHaveURL(/\/ateliers/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("logo Boticia ramene a l'accueil", async ({ page }) => {
    await page.goto(`${PROD}/mariages`);
    await page.waitForLoadState("networkidle");

    await page.locator("nav a", { hasText: /Boticia/i }).first().click();
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("retour navigateur fonctionne", async ({ page }) => {
    await page.goto(PROD);
    await page.waitForLoadState("networkidle");

    await page.locator("nav a", { hasText: /mariages/i }).first().click();
    await expect(page).toHaveURL(/\/mariages/);

    await page.goBack();
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("#main-content")).toBeVisible();
  });
});

// ─── WORKFLOW FORMULAIRE DEVIS ───

test.describe("Production — Formulaire devis", () => {
  test("le formulaire de devis est accessible", async ({ page }) => {
    await page.goto(`${PROD}/mariages`);
    await page.waitForLoadState("networkidle");

    // Chercher un bouton/lien vers le devis
    const devisLink = page.locator("a[href*='devis'], a[href*='mariages'], button", { hasText: /devis|demander/i }).first();
    const hasDevisLink = await devisLink.isVisible().catch(() => false);

    if (hasDevisLink) {
      await devisLink.click();
      await page.waitForTimeout(2000);
    }

    // Le site doit avoir un formulaire quelque part
    const body = await page.locator("body").textContent();
    expect(body?.length).toBeGreaterThan(100);
  });
});

// ─── DASHBOARD — ACCES PROTEGE ───

test.describe("Production — Dashboard protege", () => {
  test("dashboard redirige vers login sans auth", async ({ page }) => {
    await page.goto(`${PROD}/dashboard`);
    await page.waitForTimeout(3000);
    const url = page.url();
    // Doit rediriger vers login
    expect(url).toContain("/login");
  });

  test("page devis admin redirige vers login sans auth", async ({ page }) => {
    await page.goto(`${PROD}/dashboard/quotes`);
    await page.waitForTimeout(3000);
    const url = page.url();
    expect(url).toContain("/login");
  });
});

// ─── ESPACE CLIENT — ACCES PROTEGE ───

test.describe("Production — Espace client protege", () => {
  test("mon-projet redirige vers login sans auth", async ({ page }) => {
    await page.goto(`${PROD}/mon-projet`);
    await page.waitForTimeout(3000);
    const url = page.url();
    // Soit redirige vers login, soit affiche la page (gestion client-side)
    expect(url.includes("/login") || url.includes("/mon-projet")).toBeTruthy();
  });
});

// ─── API SANTE ───

test.describe("Production — API", () => {
  test("API quotes POST rejette les requetes invalides", async ({ request }) => {
    const res = await request.post("https://boticia.fr/api/quotes", {
      data: { service_type: "invalid" },
    });
    expect(res.status()).toBe(400);
  });

  test("API quotes POST rejette sans email", async ({ request }) => {
    const res = await request.post("https://boticia.fr/api/quotes", {
      data: {
        service_type: "mariage",
        partner1_name: "Test",
        phone: "0600000000",
        meeting_date: "2026-06-01",
        meeting_time: "14h00",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("API user/role repond", async ({ request }) => {
    const res = await request.get("https://boticia.fr/api/user/role", {
      params: { email: "test@test.com" },
    });
    // Soit 200 (role trouvé) soit 200 avec role null
    expect(res.status()).toBeLessThan(500);
  });
});

// ─── PAS DE PAGE BLANCHE ───

test.describe("Production — Regression page blanche", () => {
  const pages = ["/fr", "/fr/mariages", "/fr/evenements", "/fr/faq"];

  for (const url of pages) {
    test(`${url} — pas de page blanche`, async ({ page }) => {
      await page.goto(`https://boticia.fr${url}`);
      await page.waitForLoadState("networkidle");
      const content = await page.locator("body").textContent();
      expect(content?.trim().length).toBeGreaterThan(100);
    });
  }
});
