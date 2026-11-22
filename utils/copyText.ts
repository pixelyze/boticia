/**
 * Copie un texte dans le presse-papiers.
 * 1. API moderne (navigator.clipboard), si le navigateur l'autorise.
 * 2. Sinon, ancienne méthode : un champ caché, sélectionné puis copié.
 * Renvoie true si la copie a réussi.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Accès refusé (réglage du navigateur, page dans un cadre…) : secours
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
  }
}
