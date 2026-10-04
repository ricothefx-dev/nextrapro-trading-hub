# Add the NEXTRAPRO mobile trading assistant

## What will change
- Keep the current public landing page and mentor dashboard, with all new mentor totals remaining at zero.
- Make both “Get iOS Now” actions open a dedicated NEXTRAPRO app start screen.
- Add the clickable app journey: Start, Activate License, Login/Register/Password Reset, Robot Home, AI Scanner, and Meta Connect.
- Use the three original robot portraits as the available NEXTRAPRO assistants.

## Clickable experience
- License activation accepts a demo key and continues through the app without creating real accounts.
- Robot selection, activation, removal, symbols, trade count, lot size, chart upload, scan modes, sample scan results, and chart annotations all work locally.
- Meta Connect simulates connecting, connected, and disconnected states without transmitting credentials.
- Mobile navigation uses a fixed tab bar; desktop uses a compact sidebar.

## Visual direction
- Premium black interface with neon-green status and action accents.
- Space Grotesk headings, clean body copy, monospaced market values, restrained glow, and compact trading controls.
- Responsive at mobile, tablet, and desktop widths.

## Technical details
- Add separate routes for each shareable screen and unique metadata for every route.
- Keep all data and interactions in local browser state for this first release.
- Do not add real authentication, licence storage, AI calls, or MT5 bridge requests yet.

## Verification
- Check the landing-to-app journey, navigation, chart upload flow, robot and symbol controls, and Meta connection simulation.
- Verify desktop and mobile layouts for overflow, overlap, and runtime errors.
