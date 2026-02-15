-- Script pour créer l'utilisateur admin
-- À exécuter dans le dashboard Supabase: http://127.0.0.1:54323
-- SQL Editor > New query > Copier-coller ce script > Run

-- 1. Désactiver temporairement le trigger
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- 2. Créer l'utilisateur admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@boticia.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"admin"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at;

-- 3. Créer le profil admin
INSERT INTO profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@boticia.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 4. Réactiver le trigger
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- 5. Vérifier que l'utilisateur a été créé
SELECT
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  u.raw_user_meta_data->>'role' as user_metadata_role,
  p.role as profile_role,
  'Utilisateur créé avec succès!' as status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@boticia.com';
