# MediKiosk-Patient 🏥

> Full-screen self-service patient kiosk for Indian hospitals — built with React, Vite & Tailwind CSS.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Screen | Description |
|--------|-------------|
| **Language Selection** | 6 Indian languages (Hindi, English, Tamil, Telugu, Kannada, Bengali) with native script labels |
| **Consent & ID** | ABHA ID input or Aadhaar biometric scan, consent checkboxes |
| **Medical History** | 7-step form — complaint, onset, symptoms, past history, medicines, allergies, family history |
| **AYUSH Mode** | Toggle reveals Ayurvedic fields: Prakriti sliders, diet type, bowel habits, sleep pattern |
| **Document Upload** | Take photo / upload file with thumbnail grid |
| **Confirmation** | Token number + QR code placeholder |

### Global Elements
- 🆘 **Emergency SOS** — fixed bottom-right button with full-screen alert overlay & 5s countdown
- 🔝 **Top Bar** — MediKiosk logo + selected language badge
- 🔊 **Audio Prompts** — speaker icon next to every question (placeholder for TTS)
- ⬅️ **Back Navigation** — on every screen except language selection
- 📦 **React Context** — all form data stored in a single context, logged as JSON on completion

---

## 🛠️ Tech Stack

- **React 19** — UI framework
- **Vite 6** — dev server & bundler
- **Tailwind CSS v4** — utility-first styling with custom `@theme` tokens
- **react-router-dom v7** — client-side routing
- **react-icons** — Feather & Material icon sets

---

## 📂 Project Structure

```
MediKiosk-Patient/
├── index.html                 # HTML entry point (Inter font CDN)
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite + React + Tailwind plugins
├── src/
│   ├── main.jsx               # React DOM root
│   ├── App.jsx                # Router + global layout
│   ├── index.css              # Tailwind + custom theme + animations
│   ├── context/
│   │   └── KioskContext.jsx   # Global form data store
│   ├── components/
│   │   ├── TopBar.jsx         # Fixed header bar
│   │   ├── SOSButton.jsx      # Emergency button + overlay
│   │   ├── BackButton.jsx     # Navigation back
│   │   └── AudioPrompt.jsx    # TTS icon placeholder
│   └── pages/
│       ├── LanguagePage.jsx   # /language
│       ├── ConsentPage.jsx    # /consent
│       ├── HistoryPage.jsx    # /history
│       ├── UploadPage.jsx     # /upload
│       └── ConfirmationPage.jsx # /confirmation
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ and npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/<your-username>/MediKiosk-Patient.git
cd MediKiosk-Patient

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
```

Outputs a static `dist/` folder ready for deployment.

### Preview Production Build

```bash
npm run preview
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#0F4C75` | Deep teal — buttons, links, accents |
| `--color-sos` | `#E63946` | Coral red — **SOS button only** |
| `--color-surface` | `#FFFFFF` | Page backgrounds |
| `--color-text` | `#1A1A2E` | Body text |
| Font | Inter | Google Fonts CDN |
| Tap targets | 60px min | Elderly-friendly |
| Target device | 1024×768 | Tablet landscape |

---

## 🗺️ Roadmap

- [ ] Voice input via Web Speech API
- [ ] Audio TTS for consent & questions
- [ ] Real Aadhaar/ABHA verification API
- [ ] Backend integration (REST / GraphQL)
- [ ] QR code generation (e.g. `qrcode.react`)
- [ ] Multi-language UI translations
- [ ] Offline PWA support

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built for **Smart India Hackathon (SIH)** 🇮🇳
