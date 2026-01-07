-- Add message_order column to store custom delivery order as an array of message IDs
ALTER TABLE public.recipient_delivery_cadence 
ADD COLUMN IF NOT EXISTS message_order text[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.recipient_delivery_cadence.message_order IS 'Array of message IDs in custom delivery order';