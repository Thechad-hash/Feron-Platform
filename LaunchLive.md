# FERON Platform - Full 3-Page UI Deployment Guide

This guide walks through deploying the full FERON platform with 3 frontends (Pages 1–3) and a shared backend. Each frontend is deployed via **Vercel**, and the backend is hosted on **Railway**. All components are integrated and ready for real-world testing and demos.

---

## 🚧 Project Structure (Monorepo)

```
/feron-platform
├── feron-live-client/         # Page 3 - FERON chat frontend
├── trial-license-ui/          # Page 1 - Trial License UI
├── smart-contracts-ui/        # Page 2 - Model Registration UI
├── feron-live-server/         # Backend - OpenAI + Express
├── feron-ethereum/            # Smart contracts (already deployed)
```

---

## ✅ Step 1: Final Local Prep (Already Complete)

Each frontend/backend folder should have:

* A standalone `package.json`
* `.env` file (locally only; use platform vars in prod)
* References to the correct VITE API or OpenAI key
* No localhost references remaining

---

## 🚀 Step 2: Deploy Frontends (Vercel)

Repeat the following for **each frontend**:

### A) Trial License UI (Page 1)

* Root directory: `trial-license-ui`
* Framework: Vite
* Build Command: `vite build`
* Output Directory: `dist`
* Env Vars: *(if any)*

### B) Smart Contract Registration UI (Page 2)

* Root directory: `smart-contracts-ui`
* Framework: Vite
* Build Command: `vite build`
* Output Directory: `dist`
* Env Vars: *(if any)*

### C) FERON Chat UI (Page 3)

* Root directory: `feron-live-client`
* Framework: Vite
* Build Command: `vite build`
* Output Directory: `dist`
* Env Vars:

  * `VITE_API_URL=https://feron-backend.up.railway.app`
  * `FERON_TIER=0`

Each deployed app will receive its own public Vercel URL.

---

## 🛠 Step 3: Deploy Backend (Railway)

### Railway Settings:

* Root Directory: `feron-live-server`
* Start Command (in `package.json`):

```json
"scripts": {
  "start": "node server.js"
}
```

### Environment Variables:

* `OPENAI_API_KEY=sk-...`
* Leave PORT empty (Railway will inject)

### In `server.js`:

```js
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FERON backend running on port ${PORT}`);
});
```

CORS config should allow:

```js
app.use(cors({
  origin: 'https://feron-chat-live.vercel.app'
}));
```

---

## 🔁 Step 4: Integrate and Connect

### Page 3 (Chat)

* Uses `VITE_API_URL` to call `fetch(`\${VITE\_API\_URL}/api/feron`)`

### Page 1/2

* Use MetaMask wallet connection to interact with deployed Ethereum contracts
* Contract addresses and ABIs are baked into logic (no backend needed)

---

## 🧪 Final Checks Before Testing

* [x] All frontend folders deployed to Vercel with correct root
* [x] Backend deployed to Railway
* [x] Frontend points to correct VITE\_API\_URL
* [x] Backend CORS allows frontend domain
* [x] No `localhost` in any frontend fetch() calls
* [x] All apps working with live URLs

---

## 📎 Optional Enhancements

* Tier access logic (gated file upload)
* Admin dashboard
* License validation from contract
* Uploads routed to IPFS or local handling

---

## 💬 Support

For issues with:

* Vercel: frontend deployment, env vars, Vite config
* Railway: backend errors, env var issues, port binding
* GitHub: repo integration

Start with the service where the issue occurs. For backend-level errors, **Railway** support is your go-to.

---

Once all three UIs and the backend are live, you can begin structured testing with shops and early adopters!


How to check .gitgnore is good

In project root run 
     git status



Github project creation

create a new repository on Github
echo "# Feron-Platform" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Thechad-hash/Feron-Platform.git
git push -u origin main

or push an existing repository from the command line
git remote add origin https://github.com/Thechad-hash/Feron-Platform.git
git branch -M main
git push -u origin main