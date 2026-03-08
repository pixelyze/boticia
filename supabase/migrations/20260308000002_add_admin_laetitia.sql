-- Migration: Set admin role for laetitia@boticia.fr

-- Update existing profile if it exists
UPDATE profiles
SET role = 'admin'
WHERE email = 'laetitia@boticia.fr';

-- If the profile doesn't exist yet, insert it when the user signs up
-- via the handle_new_user trigger, then this update will need to be re-run.
-- To handle this automatically, update the handle_new_user function
-- to auto-assign admin role for known admin emails.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT := 'user';
BEGIN
  IF NEW.email IN ('admin@boticia.com', 'laetitia@boticia.fr') THEN
    user_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', user_role)
  ON CONFLICT (id) DO UPDATE SET role = user_role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
