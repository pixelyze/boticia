-- Script SQL simplifié pour créer l'utilisateur admin

-- Créer l'utilisateur dans auth.users
INSERT INTO auth.users (
  id,
  instance_id,
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
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@boticia.com',
  '$2a$10$BZUvKx3qv8Vl6dJNL9Y.Ku3F/z0OZH5JY8X5aF6RdGxzQ6P8VYw8O',
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin Boticia","role":"admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Afficher le résultat
SELECT
  id,
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'role' as role,
  email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users
WHERE email = 'admin@boticia.com';
