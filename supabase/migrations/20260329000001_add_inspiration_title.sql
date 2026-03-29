-- Add editable title to homepage inspiration categories
ALTER TABLE homepage_inspiration_categories ADD COLUMN IF NOT EXISTS title TEXT;
