<img width="1020" height="633" alt="image" src="https://github.com/user-attachments/assets/fbecf11e-754b-4214-a069-af5955ab08d8" />

# Password Strength Checker — Case Study

## Overview
This project is a simple, web-based password strength checker built with Python (Flask) and a minimal Tailwind CSS UI. It provides instant feedback on password strength with friendly colors and emojis, supports a show/hide password toggle, and offers a light/dark theme switch.

The goal is to demonstrate a clean client–server flow: a lightweight frontend posts a password to a Flask API, the backend evaluates its strength using transparent rules, and the frontend renders the result without reloading.

## Core Features
- Password strength analysis using straightforward criteria:
  - Length: at least 8 characters
  - Presence of uppercase and lowercase letters
  - Numbers
  - Special characters
- Strength ratings: `Weak 😞`, `Moderate 😐`, `Strong 💪`
- Dynamic UI updates via JavaScript `fetch` (no page reload)
- Show/Hide password (eye icon toggle)
- Light/Dark theme toggle with preference persisted to `localStorage`
- Simple, centered UI with Tailwind CSS

## Architecture
- **Flask app** (`app.py`)
  - `GET /` serves `templates/index.html`
  - `POST /check` receives JSON `{ password }` and returns `{ rating, color }`
- **Templates** (`templates/index.html`)
  - Minimal Tailwind-based layout and controls
  - Theme toggle button positioned outside the card (top-right)
  - Footer link to the author’s site
- **Static assets** (`static/main.js`)
  - Handles password submission, displays result, toggles visibility, and manages theme

### Folder Structure
```
psrdstrntchecker/
├── app.py
├── static/
│   └── main.js
└── templates/
    └── index.html
```

## Backend: How It Works
The core logic is in `rate_password(pw)` within `app.py`:

1. Compute flags:
   - `length_ok`: `len(pw) >= 8`
   - `has_upper`: any uppercase
   - `has_lower`: any lowercase
   - `has_digit`: any digit
   - `has_special`: any non-alphanumeric
2. Count “categories” as follows:
   - +1 if both uppercase AND lowercase are present
   - +1 if a digit is present
   - +1 if a special character is present
3. Determine rating:
   - If not `length_ok` or categories == 0 → `Weak 😞`, color `red`
   - If categories in {1, 2} → `Moderate 😐`, color `orange`
   - If categories == 3 and `length_ok` → `Strong 💪`, color `green`

This produces clear, explainable results that users can understand. The server responds with JSON for easy consumption by the frontend.

### API Contract
- Endpoint: `POST /check`
- Request JSON:
  ```json
  { "password": "yourPasswordHere" }
  ```
- Response JSON:
  ```json
  { "rating": "Strong 💪", "color": "green" }
  ```

## Frontend: How It Works
- Input box captures the password.
- On “Check Strength” click or Enter key, `static/main.js` sends a `fetch('/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })`.
- The response JSON is parsed; `rating` is shown and `color` is mapped to Tailwind classes:
  - `red` → `text-red-600`
  - `orange` → `text-orange-500`
  - `green` → `text-green-600`
- The page does not reload; the result area updates dynamically.

### Show/Hide Password
- Button with eye icons toggles the input type (`password` ↔ `text`).
- The visible icon switches between open and closed eye, and `aria-label` updates for accessibility.

### Theme Toggle (Light/Dark)
- Button toggles the `dark` class on the `html` element.
- Preference is stored in `localStorage('theme')` and read on load.
- If no preference is stored, the initial mode follows the system preference via `window.matchMedia('(prefers-color-scheme: dark)')`.
- Tailwind’s `dark:` classes style the UI appropriately.

## UI/UX Details
- Centered card with clear primary button.
- Result text color reflects strength category (red/orange/green).
- Footer includes a link: “Developed by Fozan Ahmed” → `https://fozanahmed.com`.

## Setup and Running
1. Install dependencies:
   ```bash
   python -m pip install flask
   ```
2. Run the server:
   ```bash
   python app.py
   ```
3. Open the app:
   - `http://127.0.0.1:8000/`

## Example Requests
Using `curl`:
```bash
curl -X POST http://127.0.0.1:8000/check \
  -H "Content-Type: application/json" \
  -d '{"password":"Abcdef12!"}'
```
Response:
```json
{ "rating": "Strong 💪", "color": "green" }
```

## Security Considerations
- Passwords are not logged or stored; they are processed in-memory and discarded.
- Always use HTTPS (TLS) in production to protect in-transit data.
- Consider additional controls for a production system:
  - Rate limiting to prevent abuse
  - Content Security Policy (CSP)
  - CSRF protection for broader form handling
  - Stronger password analysis (e.g., dictionary checks, entropy evaluation)

## Limitations and Possible Improvements
- The checker uses simple rules and does not consider dictionary words, repeated patterns, or leaked passwords.
- Potential enhancements:
  - Integrate advanced scoring libraries (e.g., zxcvbn)
  - Add suggestions for improvement alongside the rating
  - Internationalization (i18n) for messages
  - Unit tests for backend logic and basic frontend behavior

## Troubleshooting
- If theme toggle seems stuck:
  - Clear the saved preference: open DevTools Console and run `localStorage.removeItem('theme')`, then reload.
  - Ensure the page has the `html` element toggling `class="dark"` when switching.
- If `POST /check` fails:
  - Verify the server is running on port `8000`.
  - Check browser console for network errors.

## Why This Design
- Clear, transparent rules help users understand strength outcomes.
- Minimal dependencies keep the app approachable and easy to deploy.
- Tailwind enables quick, consistent styling with accessible color choices.
