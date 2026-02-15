-- Create logos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow all operations on logos bucket
CREATE POLICY "Allow all on logos"
ON storage.objects FOR ALL
USING (bucket_id = 'logos')
WITH CHECK (bucket_id = 'logos');
