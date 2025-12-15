-- Fix CLIENT_SIDE_AUTH: Add admin-specific RLS policies for messages table
-- Admins should be able to view and update all messages for delivery purposes

CREATE POLICY "Admins can view all messages" 
ON public.messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all messages" 
ON public.messages 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can view all message_recipients
CREATE POLICY "Admins can view all message recipients" 
ON public.message_recipients 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix INPUT_VALIDATION: Add CHECK constraints for data validation

-- Add length constraints on recipients table
ALTER TABLE public.recipients
ADD CONSTRAINT recipients_name_length CHECK (char_length(name) <= 100),
ADD CONSTRAINT recipients_email_length CHECK (email IS NULL OR char_length(email) <= 255),
ADD CONSTRAINT recipients_phone_length CHECK (phone IS NULL OR char_length(phone) <= 20),
ADD CONSTRAINT recipients_notes_length CHECK (notes IS NULL OR char_length(notes) <= 500),
ADD CONSTRAINT recipients_relationship_length CHECK (relationship IS NULL OR char_length(relationship) <= 50);

-- Add length constraints on trusted_contacts table
ALTER TABLE public.trusted_contacts
ADD CONSTRAINT trusted_contacts_name_length CHECK (char_length(name) <= 100),
ADD CONSTRAINT trusted_contacts_email_length CHECK (char_length(email) <= 255),
ADD CONSTRAINT trusted_contacts_phone_length CHECK (phone IS NULL OR char_length(phone) <= 20);

-- Add length constraints on messages table
ALTER TABLE public.messages
ADD CONSTRAINT messages_title_length CHECK (title IS NULL OR char_length(title) <= 200),
ADD CONSTRAINT messages_content_length CHECK (content IS NULL OR char_length(content) <= 50000),
ADD CONSTRAINT messages_delivery_event_length CHECK (delivery_event IS NULL OR char_length(delivery_event) <= 200);

-- Add length constraints on profiles table
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_full_name_length CHECK (full_name IS NULL OR char_length(full_name) <= 100);

-- Add length constraints on user_settings table
ALTER TABLE public.user_settings
ADD CONSTRAINT user_settings_last_wishes_length CHECK (last_wishes_content IS NULL OR char_length(last_wishes_content) <= 50000);