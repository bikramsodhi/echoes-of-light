-- ============================================
-- EchoLight Phase 1.2: Core Database Schema
-- ============================================

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. USER ROLES TABLE
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. RECIPIENTS TABLE
CREATE TABLE public.recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own recipients"
  ON public.recipients FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_recipients_user_id ON public.recipients(user_id);

-- 4. MESSAGES TABLE
CREATE TYPE public.message_status AS ENUM ('draft', 'scheduled', 'sent');
CREATE TYPE public.message_type AS ENUM ('text', 'audio', 'video', 'photo', 'document');
CREATE TYPE public.delivery_trigger AS ENUM ('manual', 'scheduled', 'posthumous');

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT,
  message_type message_type DEFAULT 'text',
  status message_status DEFAULT 'draft',
  delivery_trigger delivery_trigger DEFAULT 'posthumous',
  delivery_date TIMESTAMPTZ,
  delivery_event TEXT,
  media_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own messages"
  ON public.messages FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_status ON public.messages(status);

-- 5. MESSAGE_RECIPIENTS JUNCTION TABLE
CREATE TABLE public.message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.recipients(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ,
  UNIQUE (message_id, recipient_id)
);

ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own message recipients"
  ON public.message_recipients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.messages
      WHERE messages.id = message_recipients.message_id
      AND messages.user_id = auth.uid()
    )
  );

-- 6. TRUSTED_CONTACTS TABLE
CREATE TYPE public.contact_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE public.verification_status AS ENUM ('unverified', 'verified', 'disputed');

CREATE TABLE public.trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status contact_status DEFAULT 'pending',
  verification_status verification_status DEFAULT 'unverified',
  verified_at TIMESTAMPTZ,
  invite_token UUID DEFAULT gen_random_uuid(),
  invite_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own trusted contacts"
  ON public.trusted_contacts FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_trusted_contacts_user_id ON public.trusted_contacts(user_id);
CREATE INDEX idx_trusted_contacts_invite_token ON public.trusted_contacts(invite_token);

-- 7. USER_SETTINGS TABLE
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  min_verifications_required INTEGER DEFAULT 2 CHECK (min_verifications_required BETWEEN 1 AND 3),
  enable_encryption BOOLEAN DEFAULT true,
  last_wishes_enabled BOOLEAN DEFAULT false,
  last_wishes_content TEXT,
  inactivity_check_days INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own settings"
  ON public.user_settings FOR ALL
  USING (auth.uid() = user_id);