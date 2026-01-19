import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        // Typography scale for high-trust design
        'xs': ['0.8125rem', { lineHeight: '1.5' }],     // 13px - captions
        'sm': ['0.875rem', { lineHeight: '1.5' }],      // 14px - legal/small
        'base': ['1.0625rem', { lineHeight: '1.6' }],   // 17px - body
        'lg': ['1.125rem', { lineHeight: '1.55' }],     // 18px - large body
        'xl': ['1.25rem', { lineHeight: '1.5' }],       // 20px - intro text
        '2xl': ['1.5rem', { lineHeight: '1.35' }],      // 24px - h4
        '3xl': ['1.875rem', { lineHeight: '1.25' }],    // 30px - h3
        '4xl': ['2rem', { lineHeight: '1.2' }],         // 32px - h2
        '5xl': ['2.625rem', { lineHeight: '1.15' }],    // 42px - h1
        '6xl': ['3rem', { lineHeight: '1.1' }],         // 48px - display
      },
      maxWidth: {
        'prose': '44rem', // 700px for body text
      },
      letterSpacing: {
        'tight': '-0.02em',
        'snug': '-0.015em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'button': '0.04em', // For uppercase buttons
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // EchoLight custom colors
        navy: "hsl(var(--navy))",
        gold: "hsl(var(--gold))",
        sand: "hsl(var(--sand))",
        charcoal: "hsl(var(--charcoal))",
        plum: "hsl(var(--plum))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;