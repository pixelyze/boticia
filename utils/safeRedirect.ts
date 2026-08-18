/**
 * Valide une destination de redirection venant d'une URL.
 *
 * Le paramètre `?redirect=` est contrôlable par n'importe qui : sans
 * validation, il permettrait d'envoyer un utilisateur authentifié vers un
 * site externe (open redirect). Seuls les chemins internes sont acceptés.
 *
 * @returns le chemin nettoyé, ou null si la valeur n'est pas sûre
 */
export function safeRedirectPath(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Un chemin interne commence toujours par un seul "/".
  if (!trimmed.startsWith("/")) return null;

  // "//host" et "/\host" sont interprétés comme des URL externes.
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return null;
  if (trimmed.includes("\\")) return null;
  if (trimmed.includes("://")) return null;

  // Un encodage peut masquer l'un des cas ci-dessus.
  let decoded: string;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return null;
  }

  if (
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    decoded.includes("://")
  ) {
    return null;
  }

  return trimmed;
}
