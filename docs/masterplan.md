## EchoLight Masterplan

> **"A quiet place to leave words, memories, and light for the people you love."**

---

### 🚀 30-Second Elevator Pitch

EchoLight is a digital legacy platform where users craft heartfelt letters, voice messages, and memories to be delivered to loved ones after they pass away. It's not about death—it's about *connection*, *closure*, and *continuing presence*. EchoLight makes it emotionally easy and technically secure to leave a meaningful impact.

---

### ❓ Problem & Mission

- **Problem:** Most people have no gentle, trusted space to prepare emotional goodbyes or preserve personal reflections for those they'll leave behind.
- **Mission:** Create a kind, private, and intuitive platform where anyone can preserve their voice, stories, and messages—so love lives on, even after they're gone.

**Messaging Framing:**
- **Primary:** "Create heartfelt messages, memories, and media for your loved ones — to be delivered gently, when the time is right."
- **Deeper purpose:** "What if you could say what mattered—when you're not around to say it? That's what EchoLight is for."
- **Essence:** "Messages that wait. Words that stay. Love that arrives, even when you can't."

---

### 🎯 Target Audience

- Aging individuals preparing their legacy
- Thoughtful planners of any age
- People facing serious or sudden life changes
- Parents, partners, or friends who want to leave memories for future moments

---

### 🧩 Core Features (MVP)

- **Onboarding:** Gentle walkthrough with emotional framing and ideas (skippable, under 90 seconds)
- **Recipient Management:** Create private recipient profiles (name, relationship, contact methods)
- **Message Vault:** Write and organize text messages assigned to recipients
- **Manual Delivery:** Held safely until triggered by admin or trusted contact confirmation
- **Trusted Contact Setup:** Invite contacts who can verify your passing (confirm-only role, no message access)
- **Settings & Privacy:** Visual trust cues, encryption toggles, account management

**Optional (MVP):**
- **"Polish My Thoughts":** AI tone assistant inside message composer (never overwrites without approval)

---

### ✅ Core Loop

**Write → Assign → Hold**

A user can:
1. Write a message
2. Assign it to a recipient
3. Trust that it is quietly held

If this works, the product works.

---

### 🛠️ High-Level Tech Stack

- **Frontend:** Vite + TypeScript + React + shadcn/ui + Tailwind CSS  
  → Fast dev, beautiful defaults, and emotion-capable components
- **Backend:** Lovable Cloud  
  → Handles privacy, encryption, and legacy triggers with built-in trust
- **Storage:** Secure media object storage via Lovable Cloud (private bucket with signed URLs)
- **Auth:** Email/password + Google OAuth  
  → Simple and respectful of varied user confidence levels

---

### 🧱 Conceptual Data Model

- **User**
  - id, name, email, password
  - hasMany → recipients, messages, trustedContacts
- **Recipient**
  - id, name, contactMethods[], relationship
  - belongsTo → user
- **Message**
  - id, content (text/media), type, status (draft/scheduled/sent)
  - belongsTo → user
  - hasMany → recipients
  - optional → deliveryDate, deliveryEvent
- **TrustedContact**
  - id, name, email, phone, status
  - verifies → user status (confirm-only role)

---

### 🎨 Design Principles

- **Don't Make Me Think:**  
  Every flow (onboarding, message writing, delivery setup) is calm, linear, and emotionally clear.
- **Emotional Framing Before Functionality:**  
  Onboarding leads with inspiration, not forms.
- **Whitespace is Tempo:**  
  Layouts prioritize calm pacing over density.
- **Kindness in Interaction:**  
  Feedback is gentle (e.g., "We'll hold this message safely" vs "Saved").

---

### 🔐 Security & Compliance Notes

- End-to-end encryption for all messages and media
- Clear consent flow for trusted contact and delivery logic
- Secure file storage (private bucket with signed URLs)
- RLS policies on all user data
- Compliant with major global privacy standards (GDPR, CCPA baseline)

---

### 🗺️ Phased Roadmap

**MVP (Current)**
- Onboarding → Recipient Management → Message Vault (text) → Manual delivery triggers
- Trusted contact verification flow
- Settings & Privacy page

**V1 (Post-MVP)**
- Media upload (photos, videos, audio)
- Delivery scheduling (birthdays, anniversaries)
- Read receipts
- "Polish My Thoughts" AI enhancement

**V2 (Future)**
- Reflective AI writing companion (expanded prompts)
- Automated event-based delivery (e.g., "when child turns 18")
- Seasonal memory themes

---

### ⚠️ Risks & Mitigations

- **Emotional Weight of Use:**  
  → Mitigation: Soothing UX, poetic copy, never rushed
- **Verification Abuse / False Triggering:**  
  → Mitigation: Redundant trusted contact model (minimum 2 confirmations)
- **User Drop-off Due to Sadness:**  
  → Mitigation: Prompt reflection as a gift, not a loss. Frame positively.
- **Privacy Concerns:**  
  → Mitigation: Transparent encryption, no third-party data sales, visual safety indicators

---

### 🚫 Excluded from MVP

- Public profiles or social feeds
- Social sharing
- Replying to messages
- Milestone-based automated triggers
- Seasonal theming
- Complex AI flows
- Push notifications
- Gamification mechanics

---

### 🌱 Future Expansion Ideas (Post-V2)

- **Memory Capsule Mode:** Interactive timelines or audio diaries for specific recipients
- **Family Tree Integration:** Link memories to a visual, branching map
- **Time-locked Archive Access:** Grant legacy access to vault after 10+ years
- **Legacy Print Option:** Physical keepsake of letters or messages (via third-party)

---
