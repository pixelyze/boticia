/**
 * GET /api/cms/logos
 * List all logos in storage
 */

import { getSupabase } from "~/server/utils/supabase";
import { listLogoFiles } from "~/server/utils/site-photos";

export default defineEventHandler(async () => {
  const supabase = getSupabase();

  const logos = (await listLogoFiles()).map((f) => {
    const { data: urlData } = supabase.storage
      .from("logos")
      .getPublicUrl(f.name);

    return {
      path: f.name,
      url: toProxyUrl(urlData.publicUrl),
      created_at: f.created_at,
    };
  });

  return {
    success: true,
    data: logos,
  };
});
