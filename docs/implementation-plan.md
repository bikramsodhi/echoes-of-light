## EchoLight Implementation Plan

---

### 🧱 Step-by-Step Build Sequence (MVP-Only)

#### Phase 1 — Quiet Core Loop: Write → Assign → Hold

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
   - Primary CTA: “Create Message”
   - Light emotional nudge above list (optional)

5. **Create/Edit Message Flow**
   - Text-first composer
   - Add/edit recipients
   - Choose delivery type: manual / scheduled / held
   - Save confirmation: “We’re holding this message safely”

6. **Recipient Management**
   - Add/edit recipient profile:
     - Name, relationship, contact method (email/phone)
   - All data is private to the user

7. **Trusted Contact Setup**
   - Single trusted contact for MVP
   - Invite flow via secure link
   - Confirm-only role (no message access)

8. **Delivery Settings**
   - Simulate delivery triggers (for demo/MVP)
   - Emphasize: “Held safely until the right time”

9. **Recipient Portal (Post-Delivery Only)**
   - Minimal page showing emotional message intro + content
   - No reply, no nav, no editing

---

#### Optional Phase — Light AI Support

10. **Add “Polish My Thoughts” AI Button**
   - Appears only inside message composer
   - Suggests tone edits or soft prompts
   - Never overwrites without explicit user approval

---

### ⏱️ Timeline with Checkpoints

| Week | Milestone                               |
|------|------------------------------------------|
| 1    | Project setup, onboarding, auth          |
| 2    | Message vault UI + message composer      |
| 3    | Recipient and trusted contact flows      |
| 4    | Delivery simulation + post-delivery view |
| 5    | Soft launch candidate (internal demo)    |
| 6    | (Optional) AI assistant polish button    |

---

### 👥 Team Roles & Rituals

- **Founder / Emotional Owner**  
  Oversees tone, language, and product integrity

- **Frontend Developer**  
  Focused on onboarding, composer, vault UI

- **Backend Developer (Optional)**  
  Handles delivery logic, recipient auth, data privacy

- **Design Partner**  
  Reviews every flow for emotional clarity, whitespace, tone

---

### 🔁 Recommended Rituals

- Weekly 20-min design review  
- Biweekly usability test (3 users, quiet tasks)  
- Monthly emotional audit (copy, animation, tone)

---

### 🎯 Stretch Goals (Strictly Post-MVP)

- Media attachments (audio, photos, video)
- Multiple trusted contacts
- Advanced delivery types (e.g., recurring, milestones)
- Print legacy bundle
- Recipient reply mechanism
