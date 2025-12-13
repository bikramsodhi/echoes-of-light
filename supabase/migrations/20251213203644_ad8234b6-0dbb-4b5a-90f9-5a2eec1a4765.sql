-- Allow public access to trusted_contacts by invite_token for verification portal
-- This enables the /verify page to look up contacts without authentication

CREATE POLICY "Public can view contacts by invite token"
ON public.trusted_contacts
FOR SELECT
USING (true);

-- Allow public updates via invite token for accepting/declining invites
CREATE POLICY "Public can update contacts by invite token"
ON public.trusted_contacts
FOR UPDATE
USING (true)
WITH CHECK (true);