#!/usr/bin/env tsx

/**
 * Script pour créer l'utilisateur admin
 * Usage: npx tsx scripts/create-admin.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdmin() {
  console.log("🔧 Creating admin user...");

  // Créer l'utilisateur avec l'admin API
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: "admin@boticia.com",
    password: "admin123",
    email_confirm: true,
    user_metadata: {
      role: "admin",
    },
  });

  if (createError) {
    if (createError.message.includes("already registered")) {
      console.log("ℹ️  User already exists, updating profile...");

      // Récupérer l'utilisateur existant
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users.find(
        (u) => u.email === "admin@boticia.com"
      );

      if (existingUser) {
        // Mettre à jour les métadonnées
        await supabase.auth.admin.updateUserById(existingUser.id, {
          user_metadata: { role: "admin" },
        });

        // Mettre à jour le rôle dans la table profiles
        await supabase.from("profiles").upsert({
          id: existingUser.id,
          email: "admin@boticia.com",
          role: "admin",
        });

        console.log("✅ Admin user updated successfully!");
      }
    } else {
      console.error("❌ Error creating user:", createError);
      process.exit(1);
    }
  } else {
    console.log("✅ Admin user created:", user.user.email);

    // Créer le profil dans la table profiles
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.user.id,
      email: user.user.email,
      role: "admin",
    });

    if (profileError) {
      console.error("❌ Error creating profile:", profileError);
    } else {
      console.log("✅ Admin profile created!");
    }
  }

  console.log("\n📋 Admin credentials:");
  console.log("Email: admin@boticia.com");
  console.log("Password: admin123");
}

createAdmin().catch(console.error);
