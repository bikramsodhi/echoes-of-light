-- Create table to store per-recipient delivery cadence for posthumous messages
CREATE TABLE public.recipient_delivery_cadence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipient_id UUID NOT NULL REFERENCES public.recipients(id) ON DELETE CASCADE,
  cadence TEXT NOT NULL DEFAULT 'all_at_once' CHECK (cadence IN ('all_at_once', 'weekly', 'monthly')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipient_id)
);

-- Enable RLS
ALTER TABLE public.recipient_delivery_cadence ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own cadence settings
CREATE POLICY "Users can CRUD own cadence settings"
  ON public.recipient_delivery_cadence
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);