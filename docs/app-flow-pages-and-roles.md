## EchoLight — App Flow, Pages & Roles

> **"A quiet place to leave words, memories, and light for the people you love."**

---

### 🗺️ Site Map (MVP Pages Only)

1. **Onboarding (Skippable)**
2. **Message Vault (Dashboard)**
3. **Create/Edit Message**
4. **Recipients**
5. **Trusted Contact**
6. **Delivery Settings** *(Admin only)*
7. **Settings & Privacy**
8. **Recipient Portal (Post-Delivery Only)**

**Optional (inline only):**
- **"Polish My Thoughts"** — AI tone assistant inside message composer (not a separate page)

---

### 📃 Purpose of Each Page

- **Onboarding (Skippable)**  
  Soft welcome with emotional intent, 1–2 examples, and quick account setup (≤90 seconds)

- **Message Vault (Dashboard)**  
  Unified list of all messages — draft, held, scheduled, sent  
  Primary CTA: "Create Message"  
  Optional quiet nudge: "Is there something you want to say today?"

- **Create/Edit Message**  
  Text-first composer  
  Add recipient(s)  
  Choose delivery type (manual, scheduled, or held)  
  Optional: "Polish My Thoughts" AI button (inline, never in nav)

- **Recipients**  
  Create/edit recipient profiles (name, relationship, contact method)  
  Private and viewable only by the user

- **Trusted Contact**  
  Invite 1+ person via secure link to verify passing  
  No access to content — confirm-only role

- **Delivery Settings** *(Admin Panel)*  
  Admin-only interface for triggering delivery  
  User self-test preview option

- **Settings & Privacy**  
  Account management and soft encryption trust cues  
  Visual emphasis on privacy and user control  
  Last wishes document (optional)

- **Recipient Portal (Post-Delivery)**  
  Single-purpose view  
  Emotional intro before message  
  No nav, editing, or replies

---

### 👥 User Roles & Access Levels

| Role             | Access Notes                                                  |
|------------------|---------------------------------------------------------------|
| **User (Creator)**      | Full control over writing, assigning, editing messages         |
| **Trusted Contact**     | Can verify user's passing (one-time action via secure link)    |
| **Recipient**           | Can view messages only after delivery is triggered             |

---

### 🧭 Primary User Journeys (Max 3 Steps Each)

#### ✍️ Write and Save a Message
1. Tap "Create Message"  
2. Type message → assign recipient  
3. Choose delivery → save

#### 🧾 Add a Trusted Contact
1. Navigate to "Trusted Contact"  
2. Add contact info  
3. Send invite

#### 💌 Message Delivery (Recipient Experience)
1. Recipient gets secure link  
2. Opens minimal view with emotional intro  
3. Reads message in quiet space

---

### 🔒 What's Not in MVP

- No public profiles or social feeds  
- No AI-led flows (AI is assist-only, inline)
- No seasonal themes or visuals  
- No reply features  
- No automated delivery milestones  
- No push notifications or gamification

---

### 📋 Route Reference

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
| `/vault` | Message Vault | Yes | All messages organized by recipient |
| `/vault/new` | Composer | Yes | Create new message |
| `/vault/:id` | Composer | Yes | Edit existing message |
| `/recipients` | Recipients | Yes | Manage recipients |
| `/trusted-contacts` | Trusted Contacts | Yes | Manage trusted contacts |
| `/settings` | Settings | Yes | User preferences |
| `/admin` | Admin Panel | Yes (Admin) | Delivery management |
| `/verify-contact` | Verify Contact | No | Trusted contact verification |
| `/receive/:token` | Recipient Portal | No | Message viewing for recipients |

---
