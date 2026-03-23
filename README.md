# 🛡️ CivicShield — Smart City Safety Platform

> **Anonymous · AI-Verified · Police-Connected**  
> Report incidents without fear. Claude AI verifies. Police respond.

---

## 🚨 Problem Statement

In India, thousands of crimes go unreported every day — not because people don't witness them, but because:

- **Fear of retaliation** — Revealing identity to police means criminals can track you down
- **Legal fatigue** — *"Court ke chakkar mein kaun padega?"* — endless hearings discourage witnesses  
- **No safe channel** — Existing systems require full identity, leaving bystanders exposed

**Result:** Criminals operate with confidence. Police lack evidence. Justice fails.

---

## ✅ Our Solution

CivicShield is a civic safety platform where:

- 🔒 **Witnesses report anonymously** — zero personal data stored, ever
- 🤖 **Claude AI scores each report** — 0–100 credibility check before forwarding to police
- 📍 **Live camera stamps GPS + time** on evidence automatically
- 🏛️ **Police dashboard** receives only verified, credible reports
- ⏱️ **Proximity & time checks** — reports filed late or from far away are auto-rejected

---

## ✨ Key Features

| Feature | Description |
|---|---|
| Anonymous Reporting | Witness identity never stored — token-based tracking only |
| AI Credibility Scoring | Claude Sonnet 4 scores reports across 6 signals |
| Live Camera Evidence | GPS + timestamp watermarked on photos/videos in-app |
| Category-Specific Scoring | Crime, Accident, Harassment each have different thresholds |
| Police Dashboard | Real-time case management, officer assignment, FIR recording |
| Demo Mode | Toggle to bypass AI threshold for testing |
| 500m Proximity Check | Reporter must be near incident — fake reports rejected |
| 2-Hour Time Window | Reports filed too late are automatically flagged |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (JSX), Inline CSS-in-JS |
| AI Engine | Anthropic Claude API (claude-sonnet-4) |
| Animations | GSAP 3 + ScrollTrigger |
| GPS | Browser `navigator.geolocation` + OpenStreetMap Nominatim |
| Camera | `mediaDevices.getUserMedia` + Canvas API (watermark) |
| Video | `MediaRecorder` API |
| Fonts | Bebas Neue, Syne, DM Sans (Google Fonts) |

> ⚡ Currently pure frontend — no backend, no database. State managed in React `useState`.

---

## 🚀 How to Run Locally

**Prerequisites:** Node.js 16+ and npm
```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/civicshield.git
cd civicshield

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

App will open at `http://localhost:3000`

---

## 🔑 API Key Setup

This project uses the **Anthropic Claude API** for AI credibility scoring.

- When running inside **claude.ai** — API key is automatically injected, no setup needed
- For local/standalone use — you will need to add your own Anthropic API key

> Get your API key at [console.anthropic.com](https://console.anthropic.com)

---

## 🧪 Demo Credentials

**Police Station Login** (for testing the dashboard):

| Station | Password |
|---|---|
| Vijay Nagar PS | `vjn@2026` |
| MG Road PS | `mgr@2026` |
| Palasia PS | `pal@2026` |

Enable **Demo Mode** from the nav toggle to bypass AI scoring threshold during testing.

---

## 📁 Project Structure
```
src/
├── civicshield.jsx    ← Main application (all components)
└── App.js             ← Entry point
```

---

## 👨‍💻 Built By

**Ayush Sahu** — Built for Indore Smart City Initiative · 2026