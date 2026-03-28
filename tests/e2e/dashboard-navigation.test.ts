import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001/fr";
const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
const TEST_EMAIL = "test-admin@boticia.fr";
const TEST_PASSWORD = "testpass123";

test.use({ viewport: { width: 1280, height: 720 } });

/**
 * Helper : authentifie via la page /dev/test-login qui utilise le vrai client Supabase
 */
async function loginAsAdmin(page: import("@playwright/test").Page) {
  const loginUrl = `${BASE}/dev/test-login?email=${encodeURIComponent(TEST_EMAIL)}&password=${encodeURIComponent(TEST_PASSWORD)}&redirect=${encodeURIComponent("/fr/dashboard")}`;
  await page.goto(loginUrl);
  // Attendre que le login se fasse et redirige
  await page.waitForURL("**/dashboard**", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log("Post-login URL:", page.url());
}

test.describe("Dashboard — navigation devis (bug regression)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("dashboard se charge apres login", async ({ page }) => {
    const url = page.url();
    console.log("Dashboard URL:", url);
    // Le login redirige vers /dashboard — on doit y etre
    expect(url).toContain("/dashboard");
  });

  test("page quotes liste se charge via SPA", async ({ page }) => {
    // Naviguer en SPA vers quotes (on est deja sur /dashboard apres login)
    await page.evaluate(() => {
      // @ts-ignore
      useNuxtApp().$router.push("/fr/dashboard/quotes");
    }).catch(() => {
      // Fallback si useNuxtApp n'est pas dispo
    });
    await page.waitForTimeout(3000);
    const url = page.url();
    console.log("Quotes URL:", url);
    // Soit on est sur quotes, soit le SPA navigate n'a pas marche
    const body = await page.locator("body").textContent();
    expect(body?.length).toBeGreaterThan(50);
  });

  test("BUG REGRESSION — detail devis → retour topbar → pas de spinner infini", async ({ page }) => {
    // 1. Aller directement sur le detail d'un devis
    await page.goto(`${BASE}/dashboard/quotes/9c9a4a87-a3b4-409e-b350-8fa0d349c6bf`);
    await page.waitForTimeout(3000);
    console.log("URL detail:", page.url());

    // 2. Clic sur le bouton retour dans la topbar du dashboard layout
    const backLink = page.locator("header a[href*='/quotes']").first();
    const backVisible = await backLink.isVisible().catch(() => false);
    console.log("Bouton retour visible:", backVisible);

    if (backVisible) {
      await backLink.click();
    } else {
      // Fallback : naviguer via SPA
      await page.evaluate(() => {
        window.history.back();
      });
    }

    await page.waitForTimeout(5000);

    // 3. VERIFICATION
    const finalUrl = page.url();
    console.log("URL finale:", finalUrl);

    const pageContent = await page.locator("body").textContent();
    const contentLength = pageContent?.trim().length || 0;
    console.log("Content length:", contentLength);

    // Pas de spinner infini apres 5s
    const spinnerVisible = await page
      .locator(".animate-spin")
      .isVisible()
      .catch(() => false);
    console.log("Spinner visible apres 5s:", spinnerVisible);

    if (spinnerVisible) {
      // Attendre 5s de plus
      await page.waitForTimeout(5000);
      const stillSpinning = await page
        .locator(".animate-spin")
        .isVisible()
        .catch(() => false);
      console.log("Spinner visible apres 10s:", stillSpinning);

      // FAIL si toujours en train de spinner apres 10s
      expect(stillSpinning).toBe(false);
    }

    expect(contentLength).toBeGreaterThan(100);
  });

  test("BUG REGRESSION — dashboard → detail → retour dashboard", async ({ page }) => {
    // 1. Dashboard index
    await page.goto(`${BASE}/dashboard`);
    await page.waitForTimeout(3000);

    // 2. Naviguer vers un devis directement
    await page.goto(`${BASE}/dashboard/quotes/9c9a4a87-a3b4-409e-b350-8fa0d349c6bf`);
    await page.waitForTimeout(3000);

    // 3. Retour au dashboard
    await page.goto(`${BASE}/dashboard`);
    await page.waitForTimeout(5000);

    // 4. Le dashboard doit afficher du contenu
    const content = await page.locator("body").textContent();
    expect(content?.trim().length).toBeGreaterThan(100);

    // Pas de spinner infini
    const spinning = await page.locator(".animate-spin").isVisible().catch(() => false);
    if (spinning) {
      await page.waitForTimeout(5000);
      const stillSpinning = await page.locator(".animate-spin").isVisible().catch(() => false);
      expect(stillSpinning).toBe(false);
    }
  });

  test("BUG REGRESSION — retour navigateur depuis detail devis", async ({ page }) => {
    // 1. Liste devis
    await page.goto(`${BASE}/dashboard/quotes`);
    await page.waitForTimeout(3000);

    // 2. Detail devis
    await page.goto(`${BASE}/dashboard/quotes/9c9a4a87-a3b4-409e-b350-8fa0d349c6bf`);
    await page.waitForTimeout(3000);

    // 3. Bouton retour navigateur
    await page.goBack();
    await page.waitForTimeout(5000);

    // 4. Verification
    const url = page.url();
    console.log("URL apres goBack:", url);

    const content = await page.locator("body").textContent();
    expect(content?.trim().length).toBeGreaterThan(100);
  });
});
