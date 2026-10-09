<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the landing and trading assistant at `/` using local view state, with the mentor dashboard at `/dashboard` (behind sign-in under _authenticated); this preserves the public entry and separate mentor workflow.
- Mentor accounts, bots and licence keys are real (Lovable Cloud); the app activates keys via the activate_licence database function. Scanner results and MT5 connections stay labelled as simulated until real services are connected.
- Isolate the trading assistant in its own component and scoped theme; its visual settings must not change the public landing or mentor dashboard.
