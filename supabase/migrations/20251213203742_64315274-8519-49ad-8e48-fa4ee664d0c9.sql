-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Public can view contacts by invite token" ON public.trusted_contacts;
DROP POLICY IF EXISTS "Public can update contacts by invite token" ON public.trusted_contacts;

-- Create a security definer function to verify invite token
CREATE OR REPLACE FUNCTION public.get_contact_by_invite_token(_token uuid)
RETURNS TABLE (
  id uuid,
  name text,
  status text,
  user_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tc.id, tc.name, tc.status::text, tc.user_id
  FROM public.trusted_contacts tc
  WHERE tc.invite_token = _token
$$;

-- Create a security definer function to respond to invite
CREATE OR REPLACE FUNCTION public.respond_to_invite(_token uuid, _accept boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contact_id uuid;
BEGIN
  -- Get the contact ID for this token
  SELECT id INTO contact_id
  FROM public.trusted_contacts
  WHERE invite_token = _token AND status = 'pending';
  
  IF contact_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Update the contact status
  UPDATE public.trusted_contacts
  SET 
    status = CASE WHEN _accept THEN 'accepted'::contact_status ELSE 'declined'::contact_status END,
    verified_at = CASE WHEN _accept THEN NOW() ELSE NULL END,
    verification_status = CASE WHEN _accept THEN 'verified'::verification_status ELSE 'unverified'::verification_status END
  WHERE id = contact_id;
  
  RETURN true;
END;
$$;