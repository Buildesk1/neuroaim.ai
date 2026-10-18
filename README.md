# NeuroAim.AI — CODM Sensitivity & Aim Diagnostic Coach

NeuroAim.AI is a high-precision web application designed for competitive *Call of Duty: Mobile (CODM)* players. It provides an interactive sensitivity calculator based on FOV inverse-scaling, pro player preset benchmarks, and a conversational AI Aim Diagnostic Coach powered by Google Gemini.

---

## 🚀 Key Features

1. **Interactive 47 Anchor Sensitivity Calculator:**
   - Dynamically calculates camera, firing, and gyroscope sensitivities based on your chosen **Red Dot / Holographic Anchor** (default `47`) and **Speed Acceleration** (`273`).
   - Supports **Auto-Balance Toggle**: when enabled, adjusting the primary Red Dot anchor recalculates all dependent optical tiers automatically.

2. **AI Aim Diagnostic Chat Drawer:**
   - Diagnoses common gameplay symptoms:
     - **Micro-Jitter & Hand Tremors** (lowers Gyroscope ADS / Red Dot Camera).
     - **Over-Flicking** (lowers Acceleration value by 23 points).
     - **Vertical Recoil Control Slippage** (boosts Vertical Turning to 102% and adjusts Firing ratio).
     - **Long-Range Under-Tracking** (scales Standard ADS to 72% of Red Dot).
   - Generates immediate diagnostic prescriptions, mathematical explanations, and 2-minute shooting range drills.

3. **Pro Preset Benchmarks & Side-by-Side Delta:**
   - Compare your current sensitivity profile against competitive role benchmarks (*Standard 47 Anchor*, *Aggressive Speed Entry*, and *Precision Anchor Sniper*).
   - View parameter-by-parameter delta adjustments and apply presets with a single click.

4. **Gemini API Integration & Resilient Fallback Engine:**
   - Express backend proxy connects directly to Google Gemini (`gemini-2.5-flash` model).
   - Features an offline/local Diagnostic Decision Tree fallback whenever an API key is not present.

---

## 🧮 Core Mathematical Ratios (The 47 Anchor Model)

Sensitivities scale inversely with optical FOV magnification relative to the **Red Dot baseline of 47**:

| Parameter Category | Specific Setting | Target Ratio / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Rotation** | Speed Acceleration | **273** | Rapid 180° turn on quick swipe |
| **Camera** | Red Dot / Holo (Anchor) | **47** | Baseline optic anchor |
| **Camera** | Third Person (TPP) | **44** (`Red Dot * 0.94`) | Wide movement tracking |
| **Camera** | Standard Iron ADS | **32** (`Red Dot * 0.68`) | Tighter non-optic tracking |
| **Camera** | Sniper Scope | **42** (`Red Dot * 0.89`) | Micro-overshoot prevention |
| **Camera** | Vertical Turning | **100% (1:1)** | Equal horizontal-to-vertical drag translation |
| **Firing** | Red Dot Firing | **37** (`Red Dot * 0.78`) | Recoil pull-down stabilization |
| **Firing** | ADS Firing | **28** (`ADS Cam * 0.88`) | Sustained fire control |
| **Gyroscope** | Red Dot / ADS Gyro | **42** (`Red Dot * 0.89`) | Absorbs high-stress micro hand shakes |

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend Proxy:** Node.js, Express, Cors, Dotenv.
- **AI SDK:** `@google/genai` (Google Gemini API).

---

## 🏁 Getting Started

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and supply your Gemini API key (optional):
```bash
cp .env.example .env
```
Inside `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
*Note: If no API key is provided, NeuroAim.AI will seamlessly use the built-in mathematical rule engine.*

### 3. Running Development Server
In terminal 1 (Backend proxy):
```bash
npx tsx server.ts
```

In terminal 2 (Frontend dev server):
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
MIT License. Created for Call of Duty: Mobile competitive community & calibrators.
