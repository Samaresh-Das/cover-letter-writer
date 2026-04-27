# ✨ Cover Letter Generator (Beta) 📨

Generate **tailored, impactful cover letters** in seconds using free AI models from [OpenRouter](https://openrouter.ai). Whether you're pasting a job description or linking to one (experimental), this tool helps you craft the perfect first impression.

---

## ⚙️ Features

✅ Paste any job description and generate a customized cover letter instantly  
🧠 Built with AI models via **OpenRouter** – no need to worry about tokens or keys  
📝 Add your own custom instructions – or use our smart default prompt  
🔗 JD Link Parsing _(Beta/unstable)_  
🎨 Clean, responsive UI with **TailwindCSS** and **Framer Motion**

---

## 🧭 Roadmap / To-Do

The project is actively evolving. Here's what's coming up:

### 🔗 JD Link Parsing

- [ ] Properly integrate **JD link** functionality (HTML parsing from external job portals)
- [ ] Handle CORS issues and fallback mechanisms

### 📱 UI/UX Enhancements

- [ ] Add **smooth animations** for mobile & desktop using Framer Motion
- [ ] Improve transitions and feedback on user actions

### 📄 Pages & Content

- [ ] Add **footer** with copyright info
- [ ] Add **social media icons**
- [ ] Create **About**, **Contact**, and **Legal** pages (including **Privacy Policy**)

### ☁️ Deployment & Backend

- [ ] **Deploy** the application on [Vercel](https://vercel.com)
- [ ] Add **payment functionality** via **PayPal** & **UPI**
- [ ] Implement **authentication** using Google, LinkedIn, or email/password
- [ ] Store user data securely using **Firebase** or **Supabase**
- [ ] **Encrypt** sensitive data before storing in the database
- [ ] Create a **dashboard** to view previously generated letters with linked JDs
- [ ] **Move logic to a backend**, possibly using Express (need free backend hosting)

### 📱 Mobile App

- [ ] Build a **React Native app**
- [ ] Setup an **Express backend** to support API calls from the app

### 🎟️ Credits System (Implemented)

The app now features a fully functional **Credit-based Pricing System**:
- **Free Plan**: 10 credits auto-renewing daily.
- **Pro Plan (₹299/mo)**: 200 credits monthly, priority generation, and access to premium models.
- **Credit Packs**: One-time purchases (e.g. 40, 100, 250 credits) that never expire.
- **Dynamic Extensibility**:
  - **Credit costs per feature** are decoupled. Standard generation is 1 credit, Premium is 2 credits. Future features (like resume analysis) can simply define their own credit cost.
  - **New Plans/Packs** can be added to the `pricing-controller.js` on the backend, and the frontend `PricingCard` UI will dynamically accommodate them without breaking layout.
  - **Model Tiers** can be easily expanded. Just add a new model ID to `PREMIUM_MODELS` to automatically change its pricing tier.
  - **Rate Limiting**: Built-in 2 requests/minute both on frontend (UI blocks) and backend (Express rate limit) to prevent spamming.

---

---

## 🧰 Tech Stack

Built using the modern frontend toolkit:

<!-- <div align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,firebase,vercel,framer,ts,html,css" alt="Tech Stack Icons" />
</div> -->
<div align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,vercel,framer,html,css" alt="Tech Stack Icons" />
</div>

- **Next.js** – App Router + Server Actions
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Seamless animations
- **React Toasts** – Notification system
- **Swiper.js** – Mobile-friendly sliders
- **Firebase / Supabase** – User data and auth (coming soon)
- **OpenRouter API** – For model inference
- **Vercel** – Deployment

---

## 💻 Preview

> _Coming Soon_ – Live demo on Vercel

---

## 💖 Support the Project

While this is a free and open tool, if you find it useful and wish to contribute:

- ☕ [Buy me a coffee](#) _(link coming soon)_
- 🧧 UPI donations (India) _(to be integrated)_
- 💬 Feedback or suggestions? Drop a message on [LinkedIn](#)

---

## 📜 License

This project is for **personal use only** in beta stage. A proper license will be added later.

---

## 🙌 Acknowledgements

- Special thanks to [OpenRouter](https://openrouter.ai) for providing open access to powerful AI models.
- Inspired by the desire to help job seekers save time and stand out ✨

---

> Built with ❤️ by Samaresh Das
