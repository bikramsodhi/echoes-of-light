## EchoLight Masterplan

---

### 🚀 30-Second Elevator Pitch

EchoLight is a calm, private place to write messages for the people you love—and quietly hold them until it’s time.  
Not about death. Not about tech. Just presence.

---

### ❓ Problem & Mission

- **Problem:** There’s no emotionally safe space to quietly leave words for loved ones to receive after we’re gone.
- **Mission:** Create a reflection-first app that helps people write, assign, and securely hold personal messages—privately, without pressure.

---

### 🎯 Target Audience

- Anyone preparing a personal legacy  
- People navigating illness, life transitions, or quiet planning  
- Parents, partners, siblings—those with love they want to preserve  
- Especially optimized for solo, non-technical users

---

### 🧩 Core Features (MVP)

- **Onboarding (Skippable)**  
  Gentle intro, emotional framing, 1–2 inspirational examples  
  Must be completable in under 90 seconds

- **Message Vault (aka Dashboard)**  
  Unified view: drafts, held, scheduled, sent  
  Primary CTA: “Create Message”  
  Optional emotional nudge (non-directive)

- **Create / Edit Message**  
  Text-first, media optional  
  Assign recipients  
  Choose delivery type (manual / scheduled / held)  
  Calm confirmation on save

- **Recipients**  
  Add name, relationship, contact method  
  Fully private to the user

- **Trusted Contact**  
  One contact for MVP  
  Role: verify passing only (no message access)  
  Invited via secure link

- **Delivery Settings**  
  Manual or simulated trigger is acceptable  
  Copy emphasizes: “Held safely until the right time”

- **Settings & Privacy**  
  Account settings, encryption language (non-technical)  
  Visual trust cues (lock icons, color, wording)

- **Recipient Portal (Post-Delivery Only)**  
  Minimal message view with soft framing  
  No navigation, no edit options

- **Optional AI (if included)**  
  Feature name: “Polish My Thoughts”  
  Appears only inside message composer  
  Light, optional suggestions—never writes on its own

---

### 🛠️ High-Level Tech Stack

- **Frontend:** Vite + TypeScript + React + shadcn/ui + Tailwind CSS  
- **Backend & Storage:** Lovable Cloud — private, encrypted by design  
- **Auth:** Email/password (Google optional)  
- **AI (Optional):** Lovable AI wrapper, scoped only to one composer component

---

### 🧱 Conceptual Data Model (Simplified)

- **User** → has many Messages, Recipients, 1 TrustedContact
- **Recipient** → name, contact, relationship
- **Message** → content, deliveryType, assignedRecipients[]
- **TrustedContact** → email, inviteStatus, confirmsDelivery

---

### 🎨 UI Principles (Krug-aligned)

- Don’t make me think: flows are linear and emotional
- Calm first: whitespace > density, silence > notifications
- Never transactional: no read receipts, no “sent” logs
- Affirmative tone: “We’re holding this with care.”

---

### 🔐 Security & Compliance

- End-to-end encryption (softly explained)
- No social sharing, no third-party integrations
- No data ever public
- Visual confirmation of safety (“Message is encrypted and private”)

---

### 🗺️ Phased Roadmap

**MVP**
- Onboarding, Account, Message Vault  
- Create/Edit Message  
- Recipient and Trusted Contact flows  
- Manual or simulated delivery

**Post-MVP**
- Optional AI polish button  
- Media attachments  
- Verified delivery triggers

**Later Considerations**
- Delivery analytics (private)  
- Advanced triggers (e.g. age-based, recurring)  
- Thematic modes or memory timelines

---

### ⚠️ Risks & Mitigations

- **Emotional heaviness** → Soften with tone, reduce friction
- **Verification abuse** → Single trusted contact w/ secure verification
- **Privacy skepticism** → Visual trust cues, not technical language

---

### ✅ Success = Simplicity

If a user can:
- Write a message  
- Assign it to a recipient  
- Trust it’s being quietly held  

→ The product has succeeded.
