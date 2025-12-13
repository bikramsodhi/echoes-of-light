# EchoLight — Implementation Tasks

> **Source of Truth** for development. Reference `masterplan.md`, `implementation-plan.md`, `design-guidelines.md`, and `app-flow-pages-and-roles.md` for context.

---

## 🎯 Project Configuration

- **Auth:** Email/password + Google OAuth
- **Vault Structure:** Folders per recipient
- **Delivery Triggers:** Admin panel, trusted contact flow, user self-test
- **Verification Model:** User configurable (1-3 contacts), minimum 2 required to confirm

---

## Phase 1 — MVP: Core Foundation (Weeks 1-3)

### 1.1 Project Setup ✅
- [x] Initialize Vite + React + TypeScript + Tailwind CSS
- [x] Configure shadcn/ui component library
- [x] Set up design system (colors, typography, spacing)
- [x] Create landing page with hero, features, CTA
- [x] Connect to Lovable Cloud (Supabase backend)

### 1.2 Database Schema ✅
> All tables created with RLS policies

**1.2.1 Create profiles table**
```sql
-- User profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
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
```

**1.2.2 Create user_roles table (for admin access)**
```sql
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
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

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
```

**1.2.3 Create recipients table**
```sql
CREATE TABLE public.recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT, -- e.g., 'daughter', 'friend', 'brother'
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

-- Index for faster lookups
CREATE INDEX idx_recipients_user_id ON public.recipients(user_id);
```

**1.2.4 Create messages table**
```sql
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
  delivery_date TIMESTAMPTZ, -- For scheduled delivery
  delivery_event TEXT, -- e.g., "18th birthday", "graduation"
  media_urls TEXT[], -- Array of storage URLs
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
```

**1.2.5 Create message_recipients junction table**
```sql
CREATE TABLE public.message_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.recipients(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ, -- When recipient opened the message
  UNIQUE (message_id, recipient_id)
);

ALTER TABLE public.message_recipients ENABLE ROW LEVEL SECURITY;

-- Users can manage their own message-recipient links
CREATE POLICY "Users can manage own message recipients"
  ON public.message_recipients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.messages
      WHERE messages.id = message_recipients.message_id
      AND messages.user_id = auth.uid()
    )
  );
```

**1.2.6 Create trusted_contacts table**
```sql
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
```

**1.2.7 Create user_settings table**
```sql
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
```

---

### 1.3 Authentication System ✅
- [x] Create `/auth` page with login/signup tabs
- [x] Implement email/password authentication
- [x] Add Google OAuth provider (UI ready, needs Google Cloud config)
- [x] Create auth context/hook for session management
- [x] Add protected route wrapper component
- [x] Implement logout functionality
- [x] Add password reset flow

**Files created:**
- `src/pages/Auth.tsx` — Login/signup page
- `src/pages/ResetPassword.tsx` — Password reset flow
- `src/contexts/AuthContext.tsx` — Auth state management
- `src/components/ProtectedRoute.tsx` — Route guard
- `src/pages/Dashboard.tsx` — Protected dashboard

**Reference design-guidelines.md for:**
- Calm, gentle copy: "Welcome back — your space of memory awaits"
- Soft form styling with lavender accents
- Error states: "Something interrupted the moment. Let's gently try again."

---

### 1.4 Onboarding Experience ✅
- [x] Create welcome screen with emotional framing
- [x] Design step-by-step onboarding flow (3-4 steps)
- [x] Add example message templates for inspiration
- [x] Implement "skip to dashboard" option
- [x] Store onboarding completion status

**Onboarding steps:**
1. **Welcome** — "This is your space to leave light behind"
2. **Purpose** — Explain what EchoLight does with gentle metaphors
3. **Inspiration** — Show example messages ("A letter to your daughter on her wedding day")
4. **Get Started** — Create first recipient or skip to dashboard

**Files created:**
- `src/pages/Onboarding.tsx` — Onboarding container
- `src/components/onboarding/WelcomeStep.tsx`
- `src/components/onboarding/PurposeStep.tsx`
- `src/components/onboarding/InspirationStep.tsx`
- `src/components/onboarding/GetStartedStep.tsx`

---

### 1.5 Dashboard (Home) ✅
- [x] Create main dashboard layout with sidebar navigation
- [x] Display message summary (drafts, scheduled, sent counts)
- [x] Add emotional nudge prompt ("One memory you want to leave today?")
- [x] Show recent activity feed
- [x] Add quick action buttons (Create Message, Add Recipient)

**Files created:**
- `src/pages/Dashboard.tsx` — Main dashboard
- `src/components/layout/AppSidebar.tsx` — Navigation sidebar
- `src/components/layout/AppLayout.tsx` — Authenticated layout wrapper
- `src/components/dashboard/MessageSummary.tsx`
- `src/components/dashboard/EmotionalNudge.tsx`
- `src/components/dashboard/QuickActions.tsx`
- `src/components/dashboard/RecentActivity.tsx`
- `src/hooks/useDashboardData.ts`

---

### 1.6 Recipient Management ✅
- [x] Create recipients list page with grid/list view
- [x] Build add/edit recipient form (name, relationship, contact methods)
- [ ] Add recipient avatar upload
- [x] Implement delete confirmation with gentle messaging
- [x] Add search/filter functionality

**Files created:**
- `src/pages/Recipients.tsx` — Recipients list
- `src/components/recipients/RecipientCard.tsx`
- `src/components/recipients/RecipientDialog.tsx`

---

### 1.7 Message Vault (Text Only for MVP) ✅
- [x] Create vault page with folder-per-recipient structure
- [x] Build message list with status badges (draft/scheduled/sent)
- [x] Create message composer with rich text support
- [x] Implement auto-save drafts
- [x] Add recipient assignment to messages
- [x] Build message preview mode

**Files created:**
- `src/pages/Vault.tsx` — Message vault
- `src/components/vault/RecipientFolder.tsx`
- `src/components/vault/MessageList.tsx`
- `src/components/vault/MessageCard.tsx`
- `src/pages/MessageComposer.tsx` — Create/edit message
- `src/components/vault/MessagePreview.tsx`
- `src/hooks/useDebouncedCallback.ts`

---

### 1.8 Manual Delivery System (MVP)
- [ ] Create admin panel for triggering delivery
- [ ] Build user self-test preview ("See what they'll receive")
- [ ] Add basic trusted contact verification flow
- [ ] Implement delivery confirmation UI

**Files to create:**
- `src/pages/Admin.tsx` — Admin delivery panel (protected by admin role)
- `src/components/vault/DeliveryPreview.tsx`
- `src/components/delivery/TestDeliveryDialog.tsx`

---

## Phase 2 — V1: Trust & Media Delivery (Weeks 4-6)

### 2.1 Media Uploads
- [ ] Set up Supabase Storage bucket for media
- [ ] Create media upload component (photos, videos, audio)
- [ ] Add media preview in message composer
- [ ] Implement file size/type validation
- [ ] Add upload progress indicator

**Storage bucket RLS:**
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-media', 'message-media', false);

-- Storage policies
CREATE POLICY "Users can upload own media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'message-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'message-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'message-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Files to create:**
- `src/components/media/MediaUploader.tsx`
- `src/components/media/MediaPreview.tsx`
- `src/components/media/AudioRecorder.tsx`
- `src/hooks/useMediaUpload.ts`

---

### 2.2 Scheduled Delivery
- [ ] Add calendar picker for delivery dates
- [ ] Create delivery event selector ("On their birthday", "Anniversary")
- [ ] Build delivery schedule management UI
- [ ] Implement delivery date validation

**Files to create:**
- `src/components/delivery/DeliveryScheduler.tsx`
- `src/components/delivery/EventPicker.tsx`
- `src/components/delivery/DeliveryCalendar.tsx`

---

### 2.3 Legacy Verification System
- [x] Create trusted contacts management page
- [x] Build invite flow with email notification (UI only, mock sends)
- [x] Implement verification link/portal for trusted contacts
- [ ] Create "Is everything okay?" check-in system
- [ ] Build verification consensus logic (2 of N required)
- [ ] Add dispute resolution flow

**Edge function for sending invites (future):**
```typescript
// supabase/functions/send-trusted-contact-invite/index.ts
// Uses Resend to send invitation emails
// Includes secure invite token in URL
```

**Files created:**
- `src/pages/TrustedContacts.tsx` ✅
- `src/components/trusted/TrustedContactCard.tsx` ✅
- `src/components/trusted/InviteContactDialog.tsx` ✅
- `src/pages/VerifyContact.tsx` ✅ — Public page for verification
- `supabase/functions/send-trusted-contact-invite/index.ts` — Pending (mock for now)
- `supabase/functions/check-verification-status/index.ts` — Pending

---

### 2.4 Message Delivery UI
- [x] Create recipient portal for viewing messages
- [x] Add "sent" state animations (ripple/glow effect)
- [x] Build delivery confirmation notifications
- [ ] Implement read receipts

**Files created:**
- `src/pages/RecipientPortal.tsx` ✅ — Public page for recipients
- `src/components/delivery/DeliveryAnimation.tsx` ✅
- `src/components/delivery/DeliveryConfirmation.tsx` ✅
- `src/components/delivery/MessageViewer.tsx` ✅

---

### 2.5 Settings & Privacy
- [ ] Create settings page with sections
- [ ] Add encryption toggle per vault or message
- [ ] Build "Last Wishes" document editor
- [ ] Implement account deletion with confirmation
- [ ] Add inactivity check-in configuration

**Files to create:**
- `src/pages/Settings.tsx`
- `src/components/settings/PrivacySettings.tsx`
- `src/components/settings/LastWishesEditor.tsx`
- `src/components/settings/AccountSettings.tsx`
- `src/components/settings/NotificationSettings.tsx`

---

## Phase 3 — V2: Emotional Tools & Theming (Weeks 7-8)

### 3.1 Reflective AI Writing Assistant
- [ ] Create AI Guide page/panel
- [ ] Implement gentle prompt suggestions
- [ ] Build emotion-aware response system
- [ ] Add writing prompts library
- [ ] Ensure AI never auto-completes (only suggests)

**Lovable AI integration:**
```typescript
// Edge function using Lovable AI Gateway
// System prompt emphasizes gentle, poetic scaffolding
// Never finishes thoughts, only offers prompts
```

**Files to create:**
- `src/pages/AIGuide.tsx`
- `src/components/ai/ReflectiveScribe.tsx`
- `src/components/ai/WritingPrompts.tsx`
- `supabase/functions/ai-writing-assistant/index.ts`

---

### 3.2 Seasonal Themes
- [ ] Create theme system with CSS variables
- [ ] Build theme picker in settings
- [ ] Implement per-message theme option
- [ ] Add theme preview

**Themes:**
- Spring (Hope) — Fresh greens, soft yellows
- Summer (Joy) — Warm golds, coral accents
- Autumn (Legacy) — Amber, burgundy, warm browns
- Winter (Goodbye) — Cool blues, silver, soft whites

**Files to create:**
- `src/components/settings/ThemePicker.tsx`
- `src/styles/themes/spring.css`
- `src/styles/themes/summer.css`
- `src/styles/themes/autumn.css`
- `src/styles/themes/winter.css`

---

### 3.3 Automated Milestone Triggers
- [ ] Create milestone event definitions
- [ ] Build recipient interaction flow for milestone confirmation
- [ ] Implement automated trigger logic
- [ ] Add milestone notification system

---

## 📋 Page Routes Summary

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Landing | No | Marketing/landing page |
| `/auth` | Auth | No | Login/signup |
| `/onboarding` | Onboarding | Yes | New user walkthrough |
| `/dashboard` | Dashboard | Yes | Main home/overview |
| `/vault` | Message Vault | Yes | All messages organized by recipient |
| `/vault/new` | Composer | Yes | Create new message |
| `/vault/:id` | Composer | Yes | Edit existing message |
| `/recipients` | Recipients | Yes | Manage recipients |
| `/trusted-contacts` | Trusted Contacts | Yes | Manage trusted contacts |
| `/settings` | Settings | Yes | User preferences |
| `/ai-guide` | AI Guide | Yes | Reflective Scribe |
| `/admin` | Admin Panel | Yes (Admin) | Delivery management |
| `/verify/:token` | Verify Contact | No | Trusted contact verification |
| `/receive/:token` | Recipient Portal | No | Message viewing for recipients |

---

## 🔧 Shared Components to Create

- `src/components/ui/EmptyState.tsx` — Emotional empty states
- `src/components/ui/ConfirmDialog.tsx` — Gentle confirmation dialogs
- `src/components/ui/StatusBadge.tsx` — Draft/scheduled/sent badges
- `src/components/ui/LoadingState.tsx` — Calm loading indicators
- `src/components/ui/Avatar.tsx` — User/recipient avatars

---

## ✅ Testing Checklist

For each feature:
- [ ] Works on mobile (responsive)
- [ ] Keyboard navigable
- [ ] Screen reader friendly (ARIA labels)
- [ ] Motion respects reduced-motion preference
- [ ] Error states use gentle messaging
- [ ] Empty states are emotionally appropriate
- [ ] Colors meet 4.5:1 contrast ratio

---

## 📝 Notes

- **Always reference design-guidelines.md** for voice, copy, and visual decisions
- **Security first:** Never expose user data; always use RLS
- **Emotional audit:** Before shipping, ask "Would a grieving user feel comforted?"
- **Mobile-first:** Design for mobile, enhance for desktop
