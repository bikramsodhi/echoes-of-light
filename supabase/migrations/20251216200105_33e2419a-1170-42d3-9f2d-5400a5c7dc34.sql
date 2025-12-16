-- Drop the existing function and recreate with user_name column
DROP FUNCTION IF EXISTS public.get_contact_by_invite_token(uuid);

CREATE FUNCTION public.get_contact_by_invite_token(_token uuid)
RETURNS TABLE(id uuid, name text, status text, user_id uuid, user_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    tc.id, 
    tc.name, 
    tc.status::text, 
    tc.user_id,
    p.full_name as user_name
  FROM public.trusted_contacts tc
  LEFT JOIN public.profiles p ON p.id = tc.user_id
  WHERE tc.invite_token = _token
$$;