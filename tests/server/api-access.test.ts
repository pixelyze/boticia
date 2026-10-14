/**
 * Every API route must declare who may call it (see CLAUDE.md,
 * "API Security") : an access check, or an explicit PUBLIC / DEV-ONLY
 * marker. A route that forgets is a route open to the whole internet.
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { describe, expect, it } from "vitest";

const API_DIR = join(process.cwd(), "server/api");

const ACCESS_CHECK =
  /await (requireAdmin|requireAdminSession|requireClient|requireAuth)\(event\)/;
const PUBLIC_MARKER = /\/\/ PUBLIC: \S+/;
const DEV_ONLY = /\/\/ DEV-ONLY[\s\S]*if \(!import\.meta\.dev\)/;
const DISABLED_CHECK = /\/\/\s*(const \w+ = )?await require\w*\(|TODO:? .*auth/i;

function listRoutes(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listRoutes(path);
    return path.endsWith(".ts") ? [path] : [];
  });
}

const routes = listRoutes(API_DIR).map((path) => ({
  name: relative(API_DIR, path),
  source: readFileSync(path, "utf-8"),
}));

describe("API access", () => {
  it.each(routes)("$name declares its access level", ({ source }) => {
    const declared =
      ACCESS_CHECK.test(source) ||
      PUBLIC_MARKER.test(source) ||
      DEV_ONLY.test(source);
    expect(declared).toBe(true);
  });

  it.each(routes)("$name has no disabled access check", ({ source }) => {
    expect(source).not.toMatch(DISABLED_CHECK);
  });
});
