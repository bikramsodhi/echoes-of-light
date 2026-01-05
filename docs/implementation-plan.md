## EchoLight Implementation Plan

> **"A quiet place to leave words, memories, and light for the people you love."**

---

### 🧱 Step-by-Step Build Sequence (MVP)

#### Phase 1 — Core Loop: Write → Assign → Hold

1. **Project Setup**
   - Initialize Vite + React + Tailwind + TypeScript
   - Configure shadcn/ui components
   - Connect Lovable Cloud backend + storage

2. **Onboarding Flow (Skippable)**
   - Emotional welcome (1–2 lines max)
   - 1–2 poetic examples of use
   - Account creation (email/password)
   - Full flow < 90 seconds

3. **Auth System**
   - Email/password login, password reset
   - Google OAuth (optional)

4. **Message Vault (Dashboard)**
   - Single-page list of all messages
     - Status filters: draft / held / scheduled / sent
   - Primary CTA: "Create Message"
   - Light emotional nudge above list (optional)

5. **Create/Edit Message Flow**
   - Text-first composer
   - Add/edit recipients
   - Choose delivery type: manual / scheduled / held
   - Save confirmation: "We're holding this message safely"

6. **Recipient Management**
   - Add/edit recipient profile:
     - Name, relationship, contact method (email/phone)
   - All data is private to the user

7. **Trusted Contact Setup**
   - Single trusted contact for MVP
   - Invite flow via secure link
   - Confirm-only role (no message access)

8. **Delivery Settings**
   - Manual delivery triggers (admin panel or self-test)
   - Emphasize: "Held safely until the right time"

9. **Delivery Cadence (Posthumous Multi-Message)**
   - Appears only when: "Send after I pass" + multiple messages to same recipient
   - Options: All at once (default), One per week, One per month
   - Gently confirms spacing preference before finalizing

10. **Recipient Portal (Post-Delivery Only)**
    - Minimal page showing emotional message intro + content
    - No reply, no nav, no editing

---

#### Phase 2 — Enhancement: Media, Settings & Optional AI

10. **Media Uploads**
    - Photo, video, audio attachments
    - Private storage bucket with signed URLs
    - File size/type validation

11. **Settings & Privacy**
    - Encryption toggles
    - Account management
    - Last wishes document (optional)
    - Inactivity check-in configuration

12. **"Polish My Thoughts" AI Button (Optional)**
    - Appears only inside message composer
    - Suggests tone edits or soft prompts
    - Never overwrites without explicit user approval
    - Never appears in navigation

---

### ⏱️ Timeline with Checkpoints

| Week | Milestone                               |
|------|------------------------------------------|
| 1    | Project setup, onboarding, auth          |
| 2    | Message vault UI + message composer      |
| 3    | Recipient and trusted contact flows      |
| 4    | Delivery simulation + recipient portal   |
| 5    | Settings & privacy page                  |
| 6    | (Optional) AI assistant polish button    |

---

### 👥 Roles

| Role             | Access Notes                                                  |
|------------------|---------------------------------------------------------------|
| **User (Creator)**      | Full control over writing, assigning, editing messages         |
| **Trusted Contact**     | Can verify user's passing (one-time action via secure link)    |
| **Recipient**           | Can view messages only after delivery is triggered             |

---

### 🎯 Success Criteria

A user can:
1. Write a message
2. Assign it to a recipient
3. Trust that it is quietly held

If this works, the product works.

---

### 🚫 Excluded from MVP

- Public profiles
- Social sharing
- Replying to messages
- Milestone-based triggers
- Seasonal theming
- Complex AI flows
- Push notifications
- Gamification mechanics

---
