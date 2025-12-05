## EchoLight Implementation Plan

---

### 🧱 Step-by-Step Build Sequence

#### Phase 1 — MVP: Core Foundation
1. **Set up repo & environments**
   - Initialize Vite + React + Tailwind CSS
   - Configure shadcn/ui + TypeScript setup
   - Connect to Lovable Cloud backend & storage

2. **Build onboarding experience**
   - Flow: intro → emotional context → examples → create account
   - Add microcopy + light animation for emotional tone

3. **Implement auth system**
   - Email/password login with password reset
   - Optional: Google OAuth integration

4. **Design Message Vault UI**
   - Create message creation UI (text only)
   - Attach messages to recipient(s)
   - Status: draft, scheduled, sent

5. **Create recipient management**
   - Add/manage recipient profiles
   - Store name, relationship, contact methods
   - Basic validation + duplicate checks

6. **Enable manual delivery**
   - Admin panel or backend tool to simulate posthumous delivery
   - UI cue: “This message will be delivered when verified”

---

#### Phase 2 — V1: Trust & Media Delivery

7. **Enable media uploads**
   - Allow photo, audio, and video messages
   - Use Lovable Cloud secure object storage

8. **Schedule-based delivery**
   - Users pick delivery events: birthdays, anniversaries
   - Add calendar UI with friendly phrasing (“On their 21st birthday”)

9. **Legacy verification system**
   - Trusted contacts stored with permissions
   - Flow: contact receives “Is everything okay?” email with secure link
   - Manual confirmation triggers message release

10. **Design message delivery UI**
    - Add sent-state UI + animation (e.g., ripple or glow)
    - Notify user gently: “This message will be held until the right time.”

11. **Settings & encryption controls**
    - Add toggle for E2EE per message or vault-wide
    - Optional: “Last wishes” toggle or document upload

---

#### Phase 3 — V2: Emotional Tools & Theming

12. **Add Reflective AI writing assistant**
    - Suggest prompts based on emotional tone
    - Respectful UX: never autocompletes, only nudges gently

13. **Implement themes by season/memory**
    - UI themes: Spring (hope), Autumn (legacy), Winter (goodbye)
    - Optional user setting per message or account-wide

14. **Automated milestone triggers**
    - Logic: “Deliver this on their wedding day” → confirmed via recipient interaction
    - Requires opt-in for recipient account creation

---

### ⏱️ Timeline with Checkpoints

| Week | Milestone                                 |
|------|--------------------------------------------|
| 1    | Project scaffolding, design system setup   |
| 2    | Onboarding, Auth, Recipient Management     |
| 3    | Message Vault (text), Manual delivery      |
| 4    | Media upload, Scheduling logic             |
| 5    | Trusted contact flow, Encryption settings  |
| 6    | Delivery UI polish, MVP launch candidate   |
| 7    | AI writing assistant prototype             |
| 8    | Theming system, automated milestone logic  |

---

### 👥 Team Roles & Rituals

- **Product Owner (You?)**
  - Own vision, emotional quality control, roadmap calls

- **Frontend Dev (1–2)**
  - Build onboarding, message vault, responsive UI

- **Backend Dev (1)**
  - Set up user auth, delivery logic, encryption handling

- **AI Engineer (Optional for V2)**
  - Fine-tune emotional prompt assistant

- **Design Partner**
  - Lead emotional flow audits, usability tests, component library

- **Rituals**
  - Weekly design–dev sync
  - Bi-weekly usability tests (3 users, 30 minutes each)
  - Monthly “Emotion Audit” session (review tone, copy, flow)

---

### 🎯 Optional Integrations & Stretch Goals

- Notion API → Import life journals into message vault  
- Calendly-style birthday selector UI  
- Legacy print service integration (PDF book of memories)  
- Backup delivery channel: physical mail confirmation with delivery key  
- AI-powered voice enhancer for poor-quality recordings  
