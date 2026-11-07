# Frontend security deployment

Deploy with the matching backend security branch. The frontend now sends browser API requests through same-origin Next.js route handlers; it requires a running Next.js server and cannot be exported as a static site.

Set `BACKEND_API_URL` to the backend origin reachable from the Next.js server, for example `http://127.0.0.1:8000` when colocated or the public HTTPS API origin when hosted on Vercel. The existing `NEXT_PUBLIC_API_BASE_URL` is accepted as a migration fallback. Never set either value to the frontend itself.

Set `APP_URL` to the exact frontend origin, including scheme and development port. It is checked against browser `Origin` headers for state-changing requests. If absent, the request origin is used. Preview deployments should set their own origin or omit this setting. Production must use HTTPS.

Google registration and session credentials are stored in HttpOnly, Secure (production), SameSite=Lax cookies. Local storage retains only the literal `session` UI marker and existing profile data. Logout clears both credential cookies on the server. Old local-storage credentials are removed by AuthGuard; users must sign in again after rollout.

`/api/fetch-jd` keeps its existing URL but proxies to authenticated backend extraction. Credit charging and failure refunds happen on the backend. The browser must not call the retired separate credit-deduction endpoint.

Run `npm ci`, `npm test`, `npm run build`, and `npm audit`. Next.js stays on the patched 15.x release line; PostCSS is overridden to a patched compatible 8.x version. The API proxy allows up to 300 seconds for resume operations; configure your hosting plan's function duration accordingly. Check login, onboarding, uploads, PDF/letter downloads, and Razorpay redirects after deployment.
