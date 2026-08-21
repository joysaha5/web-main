# PixelCraftin Studio — website

A static, dependency-free recreation of the PixelCraftin Studio site: capsule nav header, dark/light theme toggle, animated starfield, and full mobile layout.

## Structure

```
index.html      Home — hero + featured apps & games
about.html      About Us — studio story, vision, core values
privacy.html    Privacy Policy — Google Play Store apps & games compliant
terms.html      Terms & Conditions — user license, in-app purchases, fair play
apps.html       Our Digital Creations — Calc+, PdfEditor+, Quik Note, etc.
contact.html    Say Hello — contact form + direct links
css/style.css   All styling, design tokens, dark/light themes, responsive rules, legal doc styling
js/script.js    Theme toggle (persisted via localStorage), mobile menu, starfield canvas, active link
```

No build step, no dependencies — just static files.

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository (files at the repo root, or in `/docs`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch".
4. Pick your branch (e.g. `main`) and the folder (`/ (root)` or `/docs`).
5. Save — your site will be live at `https://<username>.github.io/<repo>/` within a minute or two.

## Set up the contact form (Web3Forms)

The contact form on `contact.html` submits to [Web3Forms](https://web3forms.com) — a free API that emails you form submissions with no backend of your own required.

1. Go to [web3forms.com](https://web3forms.com) and enter your email to get a free **Access Key** (sent to your inbox instantly).
2. Open `contact.html` and find this line near the top of the `<form>`:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key you received.
4. Deploy. Submissions will now arrive at the email you registered with Web3Forms.

Notes:
- The field named `topic` ("What's this about?") is optional and is folded into the email subject automatically; it defaults to "New message from PixelCraftin Studio site" if left blank.
- There's a hidden `botcheck` checkbox used as a honeypot for spam bots — leave it in place.
- No server or API secret is exposed beyond the public access key, which is safe to ship in client-side code (it only allows submitting to your configured inbox, not reading anything back).
- Free tier limits and dashboard (submission history, spam filtering, notification email) are managed at web3forms.com.

## Customizing

- **Colors / fonts / spacing** — all defined as CSS custom properties at the top of `css/style.css` (`:root` for dark, `html[data-theme="light"]` for light).
- **Accent color** — brand accent is `#5c7cfa` (`--accent`).
- **App Screenshots** — In `apps.html`, drop any screenshot `<img>` inside `.phone` with `class="phone-screenshot"` (e.g. `<img class="phone-screenshot" src="img/calc.png" alt="Calc+">`) and it will automatically scale and fit into the phone bezel!
- **Nav links / footer links** — edit the `<nav>` and `<footer>` markup in each HTML file (identical across pages).
- **Google Play / social links** — update the `href` values in the header buttons, footer, and `contact.html`.
