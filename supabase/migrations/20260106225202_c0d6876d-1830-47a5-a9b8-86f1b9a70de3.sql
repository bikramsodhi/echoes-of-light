-- Remove the overly permissive public media access policy
-- The application already uses signed URLs for secure media access (src/hooks/useSignedUrl.ts)
DROP POLICY IF EXISTS "Anyone can view media from sent messages" ON storage.objects;