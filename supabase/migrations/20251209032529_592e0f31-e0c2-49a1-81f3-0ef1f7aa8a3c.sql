-- Drop existing permissive ALL policy and replace with explicit restrictive policies
DROP POLICY IF EXISTS "Users can CRUD own recipients" ON public.recipients;

-- Create explicit SELECT policy - only owner can view
CREATE POLICY "Users can select own recipients"
ON public.recipients
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create explicit INSERT policy - only owner can insert
CREATE POLICY "Users can insert own recipients"
ON public.recipients
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create explicit UPDATE policy - only owner can update
CREATE POLICY "Users can update own recipients"
ON public.recipients
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create explicit DELETE policy - only owner can delete
CREATE POLICY "Users can delete own recipients"
ON public.recipients
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add unique index on (user_id, email) to prevent duplicate entries and enumeration attacks
CREATE UNIQUE INDEX IF NOT EXISTS idx_recipients_user_email 
ON public.recipients (user_id, email) 
WHERE email IS NOT NULL;