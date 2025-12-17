# EchoLight — Implementation Tasks

> **Source of Truth** for development.  
> **Anchor:** "A quiet place to leave words, memories, and light for the people you love."

---

## 🎯 Project Configuration

- **Auth:** Email/password + Google OAuth
- **Vault Structure:** Folders per recipient
- **Delivery Triggers:** Admin panel, trusted contact flow, user self-test
- **Verification Model:** User configurable (1-3 contacts), minimum 2 required to confirm

---

## Phase 1 — MVP: Core Foundation ✅

### 1.1 Project Setup ✅
- [x] Initialize Vite + React + TypeScript + Tailwind CSS
- [x] Configure shadcn/ui component library
- [x] Set up design system (colors, typography, spacing)
- [x] Create landing page with hero, features, CTA
- [x] Connect to Lovable Cloud (Supabase backend)

### 1.2 Database Schema ✅
> All tables created with RLS policies

- [x] profiles table (extends auth.users)
- [x] user_roles table (admin access)
- [x] recipients table
- [x] messages table
- [x] message_recipients junction table
- [x] trusted_contacts table
- [x] user_settings table

### 1.3 Authentication System ✅
- [x] Create `/auth` page with login/signup tabs
- [x] Implement email/password authentication
- [x] Add Google OAuth provider (UI ready)
- [x] Create auth context/hook for session management
- [x] Add protected route wrapper component
- [x] Implement logout functionality
- [x] Add password reset flow

### 1.4 Onboarding Experience ✅
- [x] Create welcome screen with emotional framing
- [x] Design step-by-step onboarding flow (4 steps)
- [x] Add example message templates for inspiration
- [x] Implement "skip to dashboard" option
- [x] Store onboarding completion status

### 1.5 Dashboard (Home) ✅
- [x] Create main dashboard layout with sidebar navigation
- [x] Display message summary (drafts, scheduled, sent counts)
- [x] Add emotional nudge prompt
- [x] Show recent activity feed
- [x] Add quick action buttons (Create Message, Add Recipient)

### 1.6 Recipient Management ✅
- [x] Create recipients list page with grid/list view
- [x] Build add/edit recipient form (name, relationship, contact methods)
- [x] Implement delete confirmation with gentle messaging
- [x] Add search/filter functionality
- [ ] Add recipient avatar upload *(deferred)*

### 1.7 Message Vault (Text Only) ✅
- [x] Create vault page with folder-per-recipient structure
- [x] Build message list with status badges (draft/scheduled/sent)
- [x] Create message composer with rich text support
- [x] Implement auto-save drafts
- [x] Add recipient assignment to messages
- [x] Build message preview mode

### 1.8 Manual Delivery System ✅
- [x] Create admin panel for triggering delivery
- [x] Build user self-test preview ("See what they'll receive")
- [x] Add basic trusted contact verification flow
- [x] Implement delivery confirmation UI

**Files created:**
- `src/pages/Admin.tsx` — Admin delivery panel (protected by admin role)
- `src/components/delivery/TestDeliveryDialog.tsx`
- `src/components/delivery/DeliveryConfirmation.tsx`

---

## Phase 2 — Enhancement: Media, Settings & Trust

### 2.1 Media Uploads ✅
- [x] Set up Supabase Storage bucket for media (private)
- [x] Create media upload component (photos, videos, audio)
- [x] Add media preview in message composer
- [x] Implement file size/type validation
- [x] Add upload progress indicator
- [x] Implement signed URL access for security

**Files created:**
- `src/components/media/MediaUploader.tsx`
- `src/components/media/MediaPreview.tsx`
- `src/hooks/useMediaUpload.ts`
- `src/hooks/useSignedUrl.ts`

### 2.2 Scheduled Delivery ✅
- [x] Add calendar picker for delivery dates
- [x] Create delivery event selector ("On their birthday", "Anniversary")
- [x] Build delivery schedule management UI
- [x] Implement delivery date validation (prevents past dates)

**Files created:**
- `src/components/delivery/DeliveryScheduler.tsx`

### 2.3 Legacy Verification System
- [x] Create trusted contacts management page
- [x] Build invite flow with email notification
- [x] Implement verification link/portal for trusted contacts
- [x] Support invite verification routes (/verify-contact)
- [ ] Create "Is everything okay?" check-in system *(deferred)*
- [ ] Build verification consensus logic (2 of N required) *(deferred)*
- [ ] Add dispute resolution flow *(deferred)*

**Files created:**
- `src/pages/TrustedContacts.tsx`
- `src/components/trusted/TrustedContactCard.tsx`
- `src/components/trusted/InviteContactDialog.tsx`
- `src/pages/VerifyContact.tsx`
- `supabase/functions/send-email/index.ts`

### 2.4 Message Delivery UI ✅
- [x] Create recipient portal for viewing messages
- [x] Add "sent" state animations (ripple/glow effect)
- [x] Build delivery confirmation notifications
- [ ] Implement read receipts *(deferred)*

**Files created:**
- `src/pages/RecipientPortal.tsx`
- `src/components/delivery/DeliveryAnimation.tsx`
- `src/components/delivery/DeliveryConfirmation.tsx`
- `src/components/delivery/MessageViewer.tsx`

### 2.5 Settings & Privacy ✅
- [x] Create settings page with sections
- [x] Add encryption toggle per vault or message
- [x] Build "Last Wishes" document editor
- [x] Implement account deletion with confirmation
- [x] Add inactivity check-in configuration

**Files created:**
- `src/pages/Settings.tsx`
- `src/components/settings/PrivacySettings.tsx`
- `src/components/settings/LastWishesEditor.tsx`
- `src/components/settings/AccountSettings.tsx`

### 2.6 "Polish My Thoughts" AI ✅
> AI tone assistant that appears **only inside message composer**

- [x] Create inline AI button in message composer
- [x] Implement gentle prompt suggestions
- [x] Build tone refinement suggestions
- [x] Ensure AI never overwrites without explicit approval
- [x] Add writing prompts library

**Implementation notes:**
- Uses Lovable AI Gateway (no user API key needed)
- System prompt emphasizes gentle, poetic scaffolding
- Never finishes thoughts, only offers prompts
- Button labeled "Help me say this"

**Files created:**
- `src/components/composer/AIAssistButton.tsx`
- `src/components/composer/WritingPrompts.tsx`
- `supabase/functions/ai-writing-assistant/index.ts`

---

## 📋 Page Routes Summary

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Landing | No | Marketing/landing page |
| `/features` | Features | No | Feature details page |
| `/how-it-works` | How It Works | No | Process explanation |
| `/about` | About | No | About EchoLight |
| `/auth` | Auth | No | Login/signup |
| `/reset-password` | Reset Password | No | Password reset flow |
| `/onboarding` | Onboarding | Yes | New user walkthrough |
| `/dashboard` | Dashboard | Yes | Main home/overview |
| `/vault` | Message Vault | Yes | All messages by recipient |
| `/vault/new` | Composer | Yes | Create new message |
| `/vault/:id` | Composer | Yes | Edit existing message |
| `/recipients` | Recipients | Yes | Manage recipients |
| `/trusted-contacts` | Trusted Contacts | Yes | Manage trusted contacts |
| `/settings` | Settings | Yes | User preferences |
| `/admin` | Admin Panel | Yes (Admin) | Delivery management |
| `/verify-contact` | Verify Contact | No | Trusted contact verification |
| `/receive/:token` | Recipient Portal | No | Message viewing for recipients |

---

## 🔧 Shared Components

**Existing:**
- `src/components/ui/*` — shadcn/ui components

**To create:**
- `src/components/ui/EmptyState.tsx` — Emotional empty states
- `src/components/ui/ConfirmDialog.tsx` — Gentle confirmation dialogs
- `src/components/ui/StatusBadge.tsx` — Draft/scheduled/sent badges
- `src/components/ui/LoadingState.tsx` — Calm loading indicators

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

## 🚫 Excluded from MVP

- Public profiles or social feeds
- Social sharing
- Replying to messages
- Milestone-based automated triggers
- Seasonal theming
- Complex AI flows (AI is assist-only, inline)
- Push notifications
- Gamification mechanics

---

## 📦 Post-MVP / Future

> Items to revisit after core MVP is complete and validated.

### Seasonal Themes
- Theme system with CSS variables
- Theme picker in settings
- Per-message theme option
- Themes: Spring (Hope), Summer (Joy), Autumn (Legacy), Winter (Goodbye)

### Automated Milestone Triggers
- Milestone event definitions
- Recipient interaction flow for milestone confirmation
- Automated trigger logic
- Milestone notification system

### Advanced AI Writing Companion
- Expanded prompt library
- Emotion-aware response system
- Reflective Scribe page (if user demand exists)

### Additional Features
- Memory Capsule Mode (interactive timelines)
- Family Tree Integration
- Time-locked Archive Access
- Legacy Print Option

---

## 📝 Development Notes

- **Always reference design-guidelines.md** for voice, copy, and visual decisions
- **Security first:** Never expose user data; always use RLS
- **Emotional audit:** Before shipping, ask "Would a grieving user feel comforted?"
- **Mobile-first:** Design for mobile, enhance for desktop
- **Private storage:** All media uses signed URLs with 1-hour expiration
- **Email service:** Resend configured with echolight.live domain

---
