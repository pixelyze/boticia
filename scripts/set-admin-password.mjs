#!/usr/bin/env node
/**
 * Donne un mot de passe à un compte ADMIN existant, pour la page
 * /fr/connexion-admin (connexion sans code par email).
 *
 * Le mot de passe est saisi en masqué dans le terminal. Il part
 * directement chez Supabase : il n'est écrit nulle part.
 *
 * Usage (prod) :
 *   vercel env pull .env.prod --environment=production
 *   node --env-file=.env.prod scripts/set-admin-password.mjs
 *   rm .env.prod
 *
 * Variables lues : SUPABASE_URL, SUPABASE_SERVICE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import readline from "node:readline";

const MIN_LENGTH = 12;

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL et SUPABASE_SERVICE_KEY sont requis.");
  process.exit(1);
}

// Question simple, ou masquée (rien ne s'affiche pendant la frappe)
function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    if (hidden) {
      rl._writeToOutput = (text) => {
        if (text.startsWith(question)) rl.output.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log(`Base : ${new URL(url).host}\n`);

const email = (await ask("Email du compte admin : ")).trim().toLowerCase();

// 1. Le compte doit déjà être admin
const { data: profile } = await supabase
  .from("profiles")
  .select("id, role")
  .eq("email", email)
  .maybeSingle();

if (profile?.role !== "admin") {
  console.error("Ce compte n'est pas admin. Rien n'a été modifié.");
  process.exit(1);
}

// 2. Retrouver le compte de connexion (même email)
let user = null;
for (let page = 1; !user; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: 200,
  });
  if (error) {
    console.error("Lecture des comptes impossible :", error.message);
    process.exit(1);
  }
  user = data.users.find((u) => u.email?.toLowerCase() === email) ?? null;
  if (data.users.length < 200) break;
}
if (!user) {
  console.error("Aucun compte de connexion avec cet email.");
  process.exit(1);
}

// 3. Mot de passe, saisi 2 fois
const password = await ask(`Mot de passe (${MIN_LENGTH} caractères ou plus) : `, true);
if (password.length < MIN_LENGTH) {
  console.error(`Trop court : ${MIN_LENGTH} caractères au minimum.`);
  process.exit(1);
}
const again = await ask("Le même, encore une fois : ", true);
if (again !== password) {
  console.error("Les 2 saisies sont différentes. Rien n'a été modifié.");
  process.exit(1);
}

const { error } = await supabase.auth.admin.updateUserById(user.id, {
  password,
});
if (error) {
  console.error("Échec :", error.message);
  process.exit(1);
}

console.log("C'est fait. Connectez-vous sur /fr/connexion-admin.");
