/**
 * Endpoint temporaire pour créer l'utilisateur admin
 * À supprimer une fois l'admin créé
 */

import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_KEY manquant");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const email = "admin@boticia.com";
  const password = "admin123";

  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUsers } = await supabase.auth.admin.listUsers();

    const userExists = existingUsers?.users.some((u) => u.email === email);

    if (userExists) {
      return {
        success: false,
        message: "L'utilisateur admin existe déjà",
        email,
      };
    }

    // Créer l'utilisateur admin
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: "Admin Boticia",
        role: "admin",
      },
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Utilisateur admin créé avec succès",
      email,
      userId: data.user.id,
      credentials: {
        email,
        password,
      },
    };
  } catch (error: any) {
    console.error("Erreur création admin:", error);

    return {
      success: false,
      message: error.message || "Erreur lors de la création de l'utilisateur",
      error: error.toString(),
    };
  }
});
