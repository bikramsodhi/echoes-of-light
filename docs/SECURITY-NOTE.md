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

## Supabase Linter Warning: Extension in Public Schema (pg_net)

Supabase flagged a warning about the `pg_net` extension being installed in the `public` schema.

We are currently NOT moving this extension because:

- It is considered an infrastructure-level decision
- Moving the extension could break critical database functions
- The risk of migration outweighs the current benefit
- The issue is tracked and will be revisited if Supabase tooling improves

Reference: https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public

✅ Status: Acknowledged and deferred by team due to potential breakage.

