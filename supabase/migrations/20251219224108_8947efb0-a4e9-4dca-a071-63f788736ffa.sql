-- Function to check if file belongs to a sent message
CREATE OR REPLACE FUNCTION public.is_file_in_sent_message(file_path text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.messages m
    WHERE m.status = 'sent'
      AND file_path = ANY(m.media_urls)
  );
$$;

-- Add policy for sent message media - allows anyone to view media from sent messages
CREATE POLICY "Anyone can view media from sent messages"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'message-media' AND
  public.is_file_in_sent_message(name)
);

-- Add GIN index for performance on media_urls array lookups
CREATE INDEX IF NOT EXISTS idx_messages_media_urls_gin ON public.messages USING GIN (media_urls);