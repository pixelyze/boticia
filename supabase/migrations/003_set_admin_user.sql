-- Migration: Set admin role for admin@boticia.com

-- Update the admin user role in profiles table
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@boticia.com';

-- If the profile doesn't exist yet (user created but profile not synced),
-- this will be handled by the trigger when they first login
