React Version Warning — January 2026

React version 19.2.3 is currently used in this project.
It contains a known security issue: CVE-2025-43788.

We have NOT updated React yet because the fixed version (19.2.4+) has NOT been released.

✅ Our app is safe for now because:
- Users cannot upload SVGs
- We only use safe icons from the lucide-react library
- All user content is escaped so no scripts can run
- No server-side rendering (React Server Components)
- HTML emails are escaped properly

🔁 Action to take later:
When React version 19.2.4 or higher is released, we should:
1. Upgrade React
2. Re-test SVG/icon behavior
3. Delete this note if no longer needed

