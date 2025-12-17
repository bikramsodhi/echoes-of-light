## EchoLight Design Guidelines

> **"A quiet place to leave words, memories, and light for the people you love."**

---

### 🎭 Emotional Tone

**Feels like:** A soft journal left on a windowsill — peaceful, private, gently illuminated.  
This is not about finality, but presence. A digital studio of memory, not a morgue of death.

---

### ✍️ Typography

| Type | Font | Size (px) | Weight | Notes |
|------|------|-----------|--------|-------|
| H1   | DM Serif Display | 36     | 500    | Emotionally rich, warm serif |
| H2   | Inter Rounded    | 28     | 600    | Gentle clarity for section headers |
| H3   | Inter Rounded    | 22     | 500    | Balanced and kind |
| Body | Inter            | 16–18  | 400    | Ultra-readable, 1.5× line height |
| Caption | Inter         | 14     | 400    | Soft gray, generous spacing |

- All text color contrast meets WCAG AA+
- Maintain vertical rhythm across components
- Use tone to guide: serif = memory, sans = clarity

---

### 🎨 Color System

| Purpose        | Color        | Hex      | Notes |
|----------------|--------------|----------|-------|
| Primary        | Lavender dusk | `#A98BBF` | Represents memory, calm |
| Accent         | Soft gold     | `#FAD6A5` | Warmth and presence |
| Background     | Ivory haze    | `#FAF9F6` | Neutral light base |
| Success        | Muted green   | `#81C784` | Life-affirming delivery |
| Danger/Trust   | Gentle red    | `#D18888` | Emotional urgency, not panic |

- Minimum 4.5:1 contrast across all UI states
- Color transitions use opacity fades (not hard shifts)

---

### 📐 Spacing & Layout

- 8pt baseline grid
- Mobile-first layout with gentle scaling up
- Section rhythm: 40–64px top margins; 24–32px internal padding
- Use whitespace to create *emotional breathing room*

Examples:
- Message composer = airy center panel with faded edge gradients
- Empty states = vertically centered, icon + microcopy + optional CTA

---

### 🎞 Motion & Interaction

- **Fade-in (pages):** 250ms, ease-in-out
- **Button hover:** Soft pulse or gentle glow (100ms)
- **Message sent:** Ripple or soft light beam animation
- **Modal:** Springs up gently from bottom, slight bounce

Tone reference: *Kindness in Design*  
→ Motion affirms presence, never dramatizes death  
→ Microinteractions acknowledge without demanding

---

### 🗣 Voice & Tone

**Keywords:** Gentle, affirming, poetic, private  
**Style:** Speak to one person, quietly. Avoid directives. Use soft metaphors.

Examples:
- **Onboarding welcome:** "This is your space to leave light behind."
- **Success state:** "Message safely held. We'll keep it close until it's time."
- **Error state:** "Something interrupted the moment. Let's gently try again."
- **Delete confirmation:** "Are you sure? This memory will be gently released."

**Avoid:**
- Technical or death-forward language
- Harsh warnings or alarms
- Transactional copy ("Successfully submitted!")

---

### 🧭 System Consistency

- Icons: Rounded or subtly hand-drawn style (avoid system default icons)
- Component style: Soft shadows, rounded edges, generous line spacing
- Use repeated metaphors: **vaults**, **light beams**, **time capsules**, **echoes**

Visual trust cues:
- Soft lock icons for encryption
- Calm confirmations (checkmarks with gentle animations)
- Privacy indicators without jargon

---

### ♿ Accessibility

- Semantic headings and landmarks
- Full keyboard navigation
- Focus ring visibility always on
- ARIA roles for dynamic content (modals, tabs, messages)
- Motion toggle disables all animations
- Captioning support for audio/video messages
- Minimum 44px tap targets on mobile

---

### ✅ Emotional Audit Checklist

Ask this for each design element:
- Does this feel peaceful, not transactional?
- Is the motion affirming or distracting?
- Would a grieving user feel comforted—not rushed or blamed?
- Does copy gently guide, not command?
- Do visual elements reinforce a soft memory space?

---

### 🧪 Technical QA Checklist

- ✅ Typographic scale aligns with rhythm grid
- ✅ Contrast ratios meet or exceed 4.5:1 (WCAG AA+)
- ✅ Every interactive state (hover, focus, pressed) is visible and distinct
- ✅ Motion durations stay within 150–300ms range
- ✅ Layouts scale smoothly from mobile to desktop
- ✅ Iconography remains consistent in metaphor and style

---
