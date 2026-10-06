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

- Keep the landing and trading assistant at `/` using local view state, with the existing mentor dashboard at `/dashboard`; this preserves the public entry and separate mentor workflow.
- Keep licence activation, scanner results, and MT5 connections explicitly simulated in this frontend release; no real account verification or trade execution is available.
- Isolate the trading assistant in its own component and scoped theme; its visual settings must not change the public landing or mentor dashboard.
