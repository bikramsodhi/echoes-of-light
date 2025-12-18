-- Add delivery token columns to message_recipients
ALTER TABLE public.message_recipients 
ADD COLUMN IF NOT EXISTS delivery_token UUID DEFAULT gen_random_uuid() UNIQUE,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;

-- Create secure RPC function to fetch message by delivery token
CREATE OR REPLACE FUNCTION public.get_message_by_delivery_token(_token uuid)
RETURNS TABLE(
  id uuid,
  title text,
  content text,
  media_urls text[],
  sent_at timestamptz,
  sender_name text,
  message_recipient_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    m.id,
    m.title,
    m.content,
    m.media_urls,
    m.sent_at,
    p.full_name as sender_name,
    mr.id as message_recipient_id
  FROM public.message_recipients mr
  JOIN public.messages m ON m.id = mr.message_id
  LEFT JOIN public.profiles p ON p.id = m.user_id
  WHERE mr.delivery_token = _token
    AND m.status = 'sent'
    AND (mr.token_expires_at IS NULL OR mr.token_expires_at > NOW());
$$;

-- Create function to mark message as viewed
CREATE OR REPLACE FUNCTION public.mark_message_viewed(_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.message_recipients
  SET viewed_at = COALESCE(viewed_at, NOW())
  WHERE delivery_token = _token
    AND viewed_at IS NULL;
  
  RETURN FOUND;
END;
$$;