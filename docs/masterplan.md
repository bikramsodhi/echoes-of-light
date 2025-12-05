## EchoLight Masterplan

---

### 🚀 30-Second Elevator Pitch

EchoLight is a digital legacy platform where users craft heartfelt letters, voice messages, and memories to be delivered to loved ones after they pass away. It’s not about death—it’s about *connection*, *closure*, and *continuing presence*. EchoLight makes it emotionally easy and technically secure to leave a meaningful impact.

---

### ❓ Problem & Mission

- **Problem:** Most people have no gentle, trusted space to prepare emotional goodbyes or preserve personal reflections for those they’ll leave behind.
- **Mission:** Create a kind, private, and intuitive platform where anyone can preserve their voice, stories, and messages—so love lives on, even after they’re gone.

---

### 🎯 Target Audience

- Aging individuals preparing their legacy
- Thoughtful planners of any age
- People facing serious or sudden life changes
- Parents, partners, or friends who want to leave memories for future moments

---

### 🧩 Core Features

- **Onboarding:** Gentle walkthrough with emotional framing and ideas (e.g., “A letter to your child on their graduation”)
- **Recipient Management:** Create private recipient profiles (email, phone, social links)
- **Message Vault:** Upload text, video, audio, images, documents; assign to recipients
- **Future Delivery:** Schedule by date (e.g., birthday), event, or upon death verification
- **Legacy Verification Flow:** Trusted contact confirms passing, triggering message delivery
- **Reflective AI Guide:** Optional writing companion that suggests prompts without overstepping
- **Settings & Privacy:** End-to-end encryption, visual safety cues, goodbye document option

---

### 🛠️ High-Level Tech Stack

- **Frontend:** Vite + TypeScript + React + shadcn/ui + Tailwind CSS  
  → Fast dev, beautiful defaults, and emotion-capable components
- **Backend:** Lovable Cloud  
  → Handles privacy, encryption, and legacy triggers with built-in trust
- **Storage:** Secure media object storage via Lovable Cloud
- **Auth:** Email/password by default; Google OAuth optional  
  → Simple and respectful of varied user confidence levels

---

### 🧱 Conceptual Data Model (ERD in words)

- **User**
  - id, name, email, password
  - hasMany → recipients, messages, trustedContacts
- **Recipient**
  - id, name, contactMethods[], relationship
  - belongsTo → user
- **Message**
  - id, content (text/audio/video/photo), type, status (draft/scheduled/sent)
  - belongsTo → user
  - hasMany → recipients
  - optional → deliveryDate, deliveryEvent
- **TrustedContact**
  - id, name, email, phone
  - verifies → user status (alive/deceased)

---

### 🎨 UI Design Principles (Krug-aligned)

- **Don’t Make Me Think:**  
  Every flow (onboarding, message writing, delivery setup) is calm, linear, and emotionally clear.
- **Emotional Framing Before Functionality:**  
  Onboarding leads with inspiration, not forms.
- **Whitespace is Tempo:**  
  Layouts prioritize calm pacing over density.
- **Kindness in Interaction:**  
  Feedback is gentle (e.g., “We’ll hold this message safely” vs “Saved”).

---

### 🔐 Security & Compliance Notes

- End-to-end encryption for all messages and media
- Clear consent flow for trusted contact and delivery logic
- Optional two-factor authentication
- Secure file storage (Lovable Cloud’s vault)
- Compliant with major global privacy standards (GDPR, CCPA baseline)

---

### 🗺️ Phased Roadmap

**MVP**
- Onboarding → Recipient Management → Message Vault (text only) → Manual delivery triggers

**V1**
- Media upload (photos, videos, audio)
- Delivery scheduling (birthdays, anniversaries)
- Trusted contact verification
- Privacy-first settings

**V2**
- Reflective AI writing companion
- Automatic event-based delivery (e.g., “when child turns 18”)
- “Season of Memory” themes (visual theming by life chapters)

---

### ⚠️ Risks & Mitigations

- **Emotional Weight of Use:**  
  → Mitigation: Soothing UX, poetic copy, never rushed
- **Verification Abuse / False Triggering:**  
  → Mitigation: Redundant trusted contact model, optional legal doc check
- **User Drop-off Due to Sadness:**  
  → Mitigation: Prompt reflection as a gift, not a loss. Use AI gently.
- **Privacy Concerns:**  
  → Mitigation: Transparent encryption, no third-party data sales, visual safety indicators

---

### 🌱 Future Expansion Ideas

- **Memory Capsule Mode:**  
  Interactive timelines or audio diaries for specific recipients
- **Family Tree Integration:**  
  Link memories to a visual, branching map
- **Time-locked Archive Access:**  
  Grant legacy access to vault after 10+ years
- **Seasonal UI Themes:**  
  “Spring of beginnings,” “Autumn of reflection,” etc.
- **Legacy Print Option:**  
  Physical keepsake of letters or messages (via third-party)

---
