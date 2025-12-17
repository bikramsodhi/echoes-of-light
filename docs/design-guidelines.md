## EchoLight Design Guidelines

---

### 🪞 Emotional Tone

**Anchor:**  
“A quiet place to leave words, memories, and light for the people you love.”

**Feels like:**  
A handwritten letter sealed in a wooden box. Peaceful, present, private.

---

### ✍️ Typography

| Element | Font             | Size | Weight | Notes                          |
|---------|------------------|------|--------|--------------------------------|
| H1      | DM Serif Display | 36px | 500    | Warm, grounded, poetic         |
| H2      | Inter Rounded    | 28px | 600    | Soft hierarchy, modern balance |
| Body    | Inter            | 16–18px | 400 | Ultra-readable, 1.5× line height |
| Caption | Inter            | 14px | 400    | Light gray, wide spacing       |

- Serif = memory and meaning  
- Sans = clarity and calm  
- Avoid all-caps or harsh bolding  
- Line spacing and breathing room are emotional scaffolding

---

### 🎨 Color System

| Role        | Color        | Hex      | Notes                         |
|-------------|--------------|----------|-------------------------------|
| Primary     | Lavender dusk | `#A98BBF` | Memory, stillness            |
| Accent      | Soft gold     | `#FAD6A5` | Warmth, reassurance          |
| Background  | Ivory haze    | `#FAF9F6` | Clean, calm, non-demanding   |
| Success     | Muted green   | `#81C784` | Life-affirming, never loud   |
| Alert       | Gentle red    | `#D18888` | Emotional signal, not fear   |

- Never use pure black or red  
- Minimum contrast: 4.5:1  
- Color transitions should fade, not shift abruptly

---

### 📐 Spacing & Layout

- Use an 8pt grid system  
- Layouts are vertical, mobile-first, center-weighted  
- Section padding: 24–40px (no cramped containers)  
- Whitespace guides emotion—more space = more safety

**Design principles:**
- Vault = clean scroll, not dashboard tiles  
- Composer = focused center, faded background  
- Recipient portal = quiet, full-width message, no nav

---

### 🎞 Motion & Interaction

- **Fade-in (pages):** 250ms ease-in-out  
- **Save button:** Gentle glow, no spinner  
- **Delivery animation:** Optional ripple or soft light beam (post-MVP)  
- **Error messages:** Slide in with soft shake and gentle tone

**Kindness in motion:**
- Motion affirms presence, not urgency  
- Avoid bounce, slide-outs, loud transitions  
- Focus states must be visible but not glaring

---

### 🗣 Voice & Tone

**Style:** Calm, poetic, non-directive  
**Avoid:** Any clinical, death-forward, or tech-heavy language

**Examples:**
- Save confirmation: “We’re holding this message safely.”  
- Empty state: “You haven’t written anything yet. That’s okay.”  
- Onboarding: “Some words stay with us. This is where you can leave yours.”

---

### 🧭 System Consistency

- Icons: Hand-drawn or rounded (no hard-edged system icons)  
- Buttons: Soft corners, ghost or filled depending on importance  
- Voice: Singular — always speak to “you,” not “users”  
- Use recurring metaphors: Light, vaults, echoes, stillness

**Anchors for style:**  
- shadcn/ui for structure  
- Linear for whitespace  
- Apple Notes for humility

---

### ♿ Accessibility

- Semantic heading structure  
- Keyboard navigation throughout  
- Focus rings on interactive elements  
- Toggle for reduced motion  
- ARIA labels for all modal and dynamic components

---

### ✅ Emotional Audit Checklist

Ask of each UI moment:

- Does this feel private and respectful?
- Could someone grieving still move through this calmly?
- Would the interface feel comforting, not distracting?
- Are we inviting reflection, not performance?

---

### 🧪 Technical QA Checklist

- Typography follows rhythm grid  
- Color contrast passes AA+  
- No flashing or harsh animations  
- Modals trap focus and are escapable  
- No element assumes urgency or rush

---

### 📸 Visual Summary

#### 🎨 Color Palette
#A98BBF – Lavender dusk
#FAD6A5 – Soft gold
#FAF9F6 – Ivory haze
#81C784 – Muted green
#D18888 – Gentle red


#### 🔠 Typographic Scale

| Element | Size | Font             | Weight |
|---------|------|------------------|--------|
| H1      | 36px | DM Serif Display | 500    |
| H2      | 28px | Inter Rounded    | 600    |
| Body    | 16–18px | Inter         | 400    |
| Caption | 14px | Inter            | 400    |

#### 📏 Spacing & Layout System

- 8pt grid  
- Vertical rhythm: 24–40px  
- Max width: 640px on large screens  
- No multi-column layouts in MVP

#### 🪞Emotional Thesis

> “A quiet place to leave words, memories, and light for the people you love.”

---

### 🧭 Design Integrity Review

The design holds the product’s emotional weight with grace. It avoids digital coldness, delivers soft metaphors visually, and reinforces trust through quiet elegance. Typography, motion, and tone act as emotional containment, not distraction.

**1 suggestion:** Consider ambient motion in the message vault (e.g. slow light gradient) to g
