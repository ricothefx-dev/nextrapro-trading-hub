# Prepare NEXTRAPRO copy-trading data foundation

## What will change
- Keep the existing landing page and mentor dashboard intact.
- Add secure Lovable Cloud tables for user profiles, roles, provider accounts, client MT5 connections, trade signals, and executions.
- Keep role assignments separate from editable profile details to prevent users from granting themselves privileges.
- Restrict client access to their own connection and execution records; limit signal submission and execution writes to trusted server-side access.
- Do not store MT5 passwords or implement trade execution.
- Repair the current JSX syntax error that prevents the preview from rendering.

## Verification
- Apply the additive schema through the database migration workflow.
- Inspect the resulting tables, grants, RLS policies, and foreign keys.
- Confirm the preview compiles after the minimal syntax repair.
