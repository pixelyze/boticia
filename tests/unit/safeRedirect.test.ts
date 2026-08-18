import { describe, it, expect } from "vitest";
import { safeRedirectPath } from "~/utils/safeRedirect";

describe("safeRedirectPath", () => {
  it("accepte un chemin interne simple", () => {
    expect(safeRedirectPath("/fr/dashboard/quotes/abc")).toBe(
      "/fr/dashboard/quotes/abc"
    );
  });

  it("accepte un chemin avec query string", () => {
    expect(safeRedirectPath("/fr/dashboard?tab=new")).toBe(
      "/fr/dashboard?tab=new"
    );
  });

  it("rejette une URL absolue", () => {
    expect(safeRedirectPath("https://evil.com/phish")).toBeNull();
  });

  it("rejette une URL protocol-relative", () => {
    expect(safeRedirectPath("//evil.com/phish")).toBeNull();
  });

  it("rejette un backslash utilise pour contourner le filtre", () => {
    expect(safeRedirectPath("/\\evil.com")).toBeNull();
    expect(safeRedirectPath("\\\\evil.com")).toBeNull();
  });

  it("rejette un schema javascript", () => {
    expect(safeRedirectPath("javascript:alert(1)")).toBeNull();
  });

  it("rejette un chemin ne commencant pas par /", () => {
    expect(safeRedirectPath("fr/dashboard")).toBeNull();
  });

  it("rejette les valeurs vides ou absentes", () => {
    expect(safeRedirectPath("")).toBeNull();
    expect(safeRedirectPath(undefined)).toBeNull();
    expect(safeRedirectPath(null)).toBeNull();
  });

  it("rejette une valeur non-string", () => {
    expect(safeRedirectPath(["/fr/dashboard"] as never)).toBeNull();
  });

  it("ignore les espaces autour de la valeur", () => {
    expect(safeRedirectPath("  /fr/dashboard  ")).toBe("/fr/dashboard");
  });

  it("rejette une tentative encodee de protocol-relative", () => {
    expect(safeRedirectPath("/%2F%2Fevil.com")).toBeNull();
  });
});
