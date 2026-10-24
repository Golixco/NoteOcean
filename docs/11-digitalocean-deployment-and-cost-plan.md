# DigitalOcean Deployment, Cloud Architecture & Cost Plan (Simplified)

## 1. Credit Budget & Preferred Deployment Target

> [!IMPORTANT]
> **Preferred Deployment Target**: DigitalOcean App Platform ($5.00/mo Basic Web Service, single container) is our preferred deployment target, subject to actual memory requirements, credit eligibility verification, and explicit user cost approval.
> The project expects an allocation of **$25 in DigitalOcean credits** (to be confirmed in the user's cloud console on execution day).
> By utilizing browser `localStorage` and eliminating any external database, our single dynamic web service container has an estimated monthly run-rate of **$5.00 / month**.
> If the $25 credits are confirmed active tomorrow, this leaves a projected **$20.00 credit margin**.

---

## 2. Resource & Cost Ledger

| Resource / Service | Reason Required | Documented Price | Estimated 1-Month Cost | Covered by Expected Credit? | Usage Limits | Status & Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **App Platform (Basic Web Service)** | Hosts Next.js 15 application + `/api/bot/chat` endpoint. | **$5.00 / month** | **$5.00** | **Projected Yes** (pending console check) | 512 MB RAM, 1 vCPU; optimized via standalone Next.js build. | **Preferred Target** (provision tomorrow upon credit check) |
| **Managed Database (PostgreSQL)** | Persistent cloud storage. | $15.00 / month | **$0.00 (NOT USED)** | N/A | Excluded for MVP (notes stored in browser `localStorage`). | **DO NOT PROVISION** |
| **DigitalOcean Serverless Inference**| Serverless AI. | Pay-per-token | **$0.00 (NOT USED)** | N/A | Excluded; using pre-funded Backboard credits for Gemma 2. | **DO NOT PROVISION** |
| **TOTAL ESTIMATED MONTHLY COST** | — | — | **$5.00** | **Projected Covered** | Projected $20.00 credit buffer | **Planned Target** |

---

## 3. App Platform Deployment Configuration

### A. Repository & Build Settings
- **Source Repository**: `https://github.com/[username]/NoteOcean`
- **Branch**: `main`
- **Source Directory**: `/` (root)
- **Auto-Deploy on Push**: Enabled
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### B. Container Optimization (`next.config.js`)
To guarantee minimal memory usage inside the 512 MB container, configure standalone output:
```javascript
module.exports = {
  output: 'standalone',
};
```

### C. Environment Variables (App Platform Console)

| Variable Name | Type | Value / Purpose |
| :--- | :--- | :--- |
| `BACKBOARD_API_KEY` | Secret (Encrypted) | User's Backboard API key for Gemma 2 |
| `NODE_ENV` | Plaintext | `production` |
| `PORT` | Plaintext | `8080` (or App Platform default `3000`) |

### D. Health Check
- **HTTP Path**: `/` (or lightweight `/api/health`)
- **Initial Delay**: 15 seconds
- **Period**: 10 seconds
- **Timeout**: 5 seconds

---

## 4. Tomorrow's Pre-Flight Deployment Checklist

Before triggering deployment tomorrow evening:
1. [ ] **Verify Credits**: Open DigitalOcean Cloud Console -> *Billing*. Confirm active $25 credit balance and expiry date.
2. [ ] **Select Region**: Choose region closest to users (e.g., `blr1` Bangalore, `fra1` Frankfurt, or `nyc3` New York).
3. [ ] **Confirm Pricing**: Verify the App Platform creation screen displays **$5.00/month (Basic Web Service)** and zero add-ons.
4. [ ] **Add Secret**: Enter `BACKBOARD_API_KEY` under App Platform Environment Variables.
5. [ ] **Verify `.gitignore`**: Confirm `.env.local` has never been committed to Git.
6. [ ] **Smoke Test Build**: Run `npm run build` locally to confirm zero compilation errors before pushing to GitHub.

---

## 5. Post-Hackathon Teardown & Cleanup

To prevent recurring credit card billing after credits expire:
1. In DigitalOcean Console, go to **Apps** -> **NoteOcean**.
2. Go to **Settings** -> Scroll to bottom -> Click **Destroy App**.
3. Confirm deletion to immediately terminate all billable resources.
