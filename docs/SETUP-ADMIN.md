# 🔐 Configuration de l'utilisateur Admin

## Méthode 1: Via le Dashboard Supabase (Recommandé)

1. **Ouvrez le dashboard Supabase local:**
   ```
   http://127.0.0.1:54323
   ```

2. **Allez dans Authentication > Users**

3. **Créez un nouvel utilisateur:**
   - Email: `admin@boticia.com`
   - Password: `admin123`
   - Auto Confirm User: ✅ (cochez cette case)

4. **Notez l'ID de l'utilisateur** (UUID)

5. **Allez dans Table Editor > profiles**

6. **Créez un nouveau profil:**
   - id: [L'UUID de l'utilisateur créé]
   - email: `admin@boticia.com`
   - role: `admin`

OU **Exécutez cette requête SQL** dans SQL Editor:

```sql
-- Mettre à jour le rôle de l'utilisateur
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@boticia.com';

-- Mettre à jour les user_metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@boticia.com';
```

## Méthode 2: Via SQL (Plus rapide)

1. **Ouvrez le dashboard Supabase:** `http://127.0.0.1:54323`

2. **Allez dans SQL Editor**

3. **Collez et exécutez ce script:**

```sql
-- Créer l'utilisateur admin (changez le mot de passe si vous voulez)
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
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@boticia.com',
  crypt('admin123', gen_salt('bf')),  -- Password: admin123
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"admin"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Créer/mettre à jour le profil admin
INSERT INTO profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@boticia.com'
ON CONFLICT (id)
DO UPDATE SET role = 'admin';
```

## Vérification

1. **Connectez-vous sur l'app:**
   ```
   http://localhost:3008/fr/login
   Email: admin@boticia.com
   Mot de passe: admin123
   ```

2. **Allez sur la homepage:**
   ```
   http://localhost:3008/fr
   ```

3. **Vérifiez que la barre d'outils admin s'affiche** en haut à droite avec le switch "Mode Édition"

## Troubleshooting

### La barre d'outils admin ne s'affiche pas?

1. Vérifiez que vous êtes connecté (rafraîchissez la page)
2. Ouvrez la console du navigateur et vérifiez qu'il n'y a pas d'erreur
3. Vérifiez que le rôle est bien "admin" dans la table profiles:
   ```sql
   SELECT * FROM profiles WHERE email = 'admin@boticia.com';
   ```

### La session ne persiste pas?

- Effacez les cookies du navigateur
- Redémarrez le serveur Nuxt: `npm run start:dev`
- Vérifiez que Supabase local tourne: `npx supabase status`

## Identifiants par défaut

```
Email: admin@boticia.com
Mot de passe: admin123
```

⚠️ **IMPORTANT:** Changez ces identifiants en production!
