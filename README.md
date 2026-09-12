# Web Toy — Surprise Punching Game

A goofy single-page web toy: a fake "surprise" intro, a rick-roll, a 5-second punching mini-game, a club application form, and a couple of currency-conversion toys — all on one page.

## Files

- `main.html` — page structure
- `style.css` — all styling
- `script.js` — all interactivity

## How to run

Just open `main.html` in a browser. No build step, no dependencies. All three files need to sit in the same folder since `main.html` links to `style.css` and `script.js` by relative path.

## What happens when you open it

1. **Intro overlay** — a video plays fullscreen with a close (✕) button in the top-left corner.
2. **Rick Roll** — closing the intro swaps in "Never Gonna Give You Up" for 5 seconds (with a countdown banner), then auto-redirects into the main page.
3. **Main page** — three columns:
   - **Punching game** — click "PUNCH!" to start a hard 5-second window (shown via a live countdown). Clicks are counted and locked in once the timer hits 0, no matter how fast you click.
   - **Club application** — shows name/email/branch, a pleading cat GIF, and a YES/NO choice. NO runs away from the cursor before it can be clicked. Either button (if you somehow catch NO) glows YES and shows "GITHUB CLUB IS THE BEST YAY".
   - **Currency tools** — a Robux → currency converter (defaults to ARS, switchable) and a PPP calculator between any two of the supported currencies (defaults to Robux → ARS, switchable).

## Currency numbers — read this before trusting them

The exchange rates and PPP factors in `script.js` (`USD_TO` and `PPP_TO_USD`) are **hardcoded static snapshots**, not live data:

- Robux is valued at $0.0125 USD (roughly Roblox's typical purchase rate — Robux has no official market or PPP rate since it's a virtual currency).
- The other currency figures are rough approximations meant for a bit of fun, not financial accuracy.

If you want live numbers, you'd need to wire in a real exchange-rate API (e.g. a `fetch()` call to a free rate-lookup service) inside `updateCurrencyConverter()` and `updatePPPCalculator()`.

## Customizing

- **Intro/rickroll videos**: swap the `src` on the two `<iframe>` elements in `main.html`.
- **Punch window length**: change `PUNCH_WINDOW_SECONDS` in `script.js`.
- **NO button flee distance**: change `FLEE_DISTANCE` in `script.js`.
- **Personal details / plea text**: edit directly inside the `.club-box` section of `main.html`.
- **Supported currencies**: add entries to `USD_TO`, `PPP_TO_USD`, and `CURRENCY_SYMBOLS` in `script.js`, plus matching `<option>` tags in the selects in `main.html`.

## Disclaimer

This is a personal/for-fun project (prank intro + club sign-up + toy converters), not a production app or a financial tool — don't rely on the exchange or PPP numbers for anything real.
