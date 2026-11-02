/**
 * Avis de la page d'accueil : accès base (clé service, côté serveur).
 */

import { getSupabase } from "./supabase";
import type { Testimonial, TestimonialInput } from "~/utils/testimonials";

const TABLE = "testimonials";

/** Tous les avis, dans l'ordre d'affichage (tableau de bord). */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

/** Avis publiés seulement, dans l'ordre d'affichage (site public). */
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

/** Nouvel avis, placé en dernier. */
export async function createTestimonial(
  input: TestimonialInput
): Promise<Testimonial> {
  const supabase = getSupabase();
  const { data: last } = await supabase
    .from(TABLE)
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...input, position: (last?.position ?? 0) + 1 })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Met à jour un avis ; null s'il n'existe pas. */
export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>
): Promise<Testimonial | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(input)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** Supprime un avis ; false s'il n'existait pas. */
export async function deleteTestimonial(id: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

/**
 * Enregistre un nouvel ordre : la liste complète des identifiants, du
 * premier au dernier. Les identifiants inconnus sont ignorés.
 */
export async function reorderTestimonials(ids: string[]): Promise<void> {
  const supabase = getSupabase();
  for (const [index, id] of ids.entries()) {
    const { error } = await supabase
      .from(TABLE)
      .update({ position: index + 1 })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
}
