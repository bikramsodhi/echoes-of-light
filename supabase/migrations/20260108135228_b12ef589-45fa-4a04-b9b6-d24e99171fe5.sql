-- Fix PUBLIC_DATA_EXPOSURE: Remove overly permissive public policies on trusted_contacts
-- The verification flow is already handled securely via SECURITY DEFINER functions:
-- - get_contact_by_invite_token() for reading contact info by token
-- - respond_to_invite() for updating contact status via token

-- Drop potentially dangerous public policies if they exist
DROP POLICY IF EXISTS "Public can view contacts by invite token" ON public.trusted_contacts;
DROP POLICY IF EXISTS "Public can update contacts by invite token" ON public.trusted_contacts;

-- Drop any other overly permissive policies that might exist
DROP POLICY IF EXISTS "Allow public read access" ON public.trusted_contacts;
DROP POLICY IF EXISTS "Allow public update access" ON public.trusted_contacts;
DROP POLICY IF EXISTS "Public access" ON public.trusted_contacts;

-- Ensure the secure owner-only policy exists (idempotent)
DO $$
BEGIN
  -- Check if the policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'trusted_contacts' 
    AND policyname = 'Users can CRUD own trusted contacts'
  ) THEN
    CREATE POLICY "Users can CRUD own trusted contacts"
    ON public.trusted_contacts
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;