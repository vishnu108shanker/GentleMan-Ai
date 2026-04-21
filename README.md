# 🎩 GentlemanAI

> *Sophisticated answers with a touch of class.*

A full-stack ChatGPT clone built with the MERN stack and powered by the **Google Gemini API**. GentlemanAI lets you have multi-turn AI conversations, automatically saves every chat thread to MongoDB, lets you browse your conversation history in a sleek sidebar, and delete threads you no longer need — all wrapped in a premium dark UI with a gentleman aesthetic.

---

## ✨ Key Features

- 💬 **Multi-turn AI Chat** — powered by Google Gemini (`gemini-2.5-flash`)
- 🧵 **Persistent Thread History** — every conversation saved to MongoDB Atlas
- 🗂️ **Thread Sidebar** — browse, switch between, and delete past chats
- ⌨️ **Typewriter Effect** — AI replies animate word by word
- 🎨 **Premium Dark UI** — blue + black theme with glassmorphism, Inter + Playfair Display fonts
- 📜 **Markdown Rendering** — AI replies render code blocks, lists, bold text etc.
- ♾️ **Auto-scroll** — chat window always scrolls to the latest message
- 🗑️ **Delete Threads** — delete individual conversations from sidebar

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite 8, React Markdown, UUID          |
| Backend    | Node.js, Express 5, ES Modules (`"type":"module"`) |
| Database   | MongoDB Atlas via Mongoose 9                    |
| AI         | Google Gemini API (`@google/genai` v1)          |
| Dev Tools  | Nodemon, Vite HMR, dotenv, CORS                 |
| Icons      | Font Awesome 6 (CDN)                            |
| Fonts      | Inter + Playfair Display (Google Fonts)         |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    A[🌐 Browser\nReact + Vite\nlocalhost:5173] -->|POST /chat\n threadId + message| B[🖥️ Express Server\nNode.js\nlocalhost:8000]
    A -->|GET /thread| B
    A -->|GET /thread/:id| B
    A -->|DELETE /thread/:id| B

    B -->|Find or Create Thread\nPush messages| C[(🍃 MongoDB Atlas\nThread Collection)]
    B -->|generateContent\ngemini-2.5-flash| D[🤖 Google Gemini API\nai.models.generateContent]

    D -->|AI reply text| B
    C -->|Thread + Messages| B
    B -->|JSON response\n reply text| A
```

---

## 📁 Folder Structure

```
GentlemanAi/
│
├── Backend/                        ← Express REST API
│   ├── .env                        ← Secret keys (DO NOT COMMIT)
│   ├── package.json                ← Backend dependencies + "type":"module"
│   ├── server.js                   ← Entry point: connects MongoDB, starts Express on :8000
│   │
│   ├── routes/
│   │   └── chat.js                 ← ALL API routes (thread CRUD + /chat endpoint)
│   │
│   ├── models/
│   │   └── Thread.js               ← Mongoose schema: Thread + embedded Message sub-docs
│   │
│   └── utils/
│       └── gemini.js               ← Wrapper for Gemini API call, returns reply string
│
├── Frontend/                       ← React app (Vite)
│   ├── index.html                  ← Root HTML, loads Google Fonts + Font Awesome CDN
│   ├── vite.config.js              ← Vite config with React plugin
│   ├── package.json                ← Frontend dependencies
│   │
│   └── src/
│       ├── main.jsx                ← React root, mounts <App /> into #root
│       ├── App.jsx                 ← Root component: holds ALL global state, wraps MyContext.Provider
│       ├── App.css                 ← 🎨 Design token system (CSS variables for colors, spacing, etc.)
│       │
│       ├── MyContext.jsx           ← createContext() — shared state across all components
│       │
│       ├── Sidebar.jsx             ← Thread list, New Chat button, Delete thread
│       ├── Sidebar.css             ← Sidebar styles
│       │
│       ├── ChatWindow.jsx          ← Navbar, input box, send button, loading state
│       ├── ChatWindow.css          ← ChatWindow styles (navbar, input, dropdown)
│       │
│       ├── Chat.jsx                ← Renders messages, welcome screen, typewriter effect, auto-scroll
│       ├── Chat.css                ← Message bubble styles, markdown styles
│       │
│       └── assets/                 ← Static assets (images, icons)
│
└── package.json                    ← Root-level (optional workspace, currently minimal)
```

---

## 🔐 Environment Variables

### Backend — `Backend/.env`

> ⚠️ This file **must never be committed to git**. Add `Backend/.env` to `.gitignore`.

| Variable          | Required | Description                                              | Example                        |
|-------------------|----------|----------------------------------------------------------|--------------------------------|
| `gemini_api_key`  | ✅ Yes   | Your Google Gemini API key                               | `AIzaSy...`                    |
| `MONGO_URI`       | ✅ Yes   | Full MongoDB Atlas connection string (includes user+pass)| `mongodb+srv://user:pass@...`  |
| `PORT`            | ❌ No    | Port to run the server on (defaults to 8000 in code)     | `8000`                         |

**Getting Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API key"**
3. Copy it into `.env` as `gemini_api_key=YOUR_KEY_HERE`

**Getting MongoDB URI:**
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your Cluster → **Connect** → **Drivers**
3. Copy the URI and replace `<password>` with your DB user password

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+ installed
- A MongoDB Atlas account (free tier works fine)
- A Google AI Studio account (free Gemini API key)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/vishnu108shanker/GentleMan-Ai-localhost-setup-.git
cd GentlemanAi
```

---

### Step 2 — Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create your .env file
# (copy the template below and fill in your real values)
```

Create `Backend/.env`:
```env
gemini_api_key=YOUR_GEMINI_API_KEY_HERE
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

Add a `scripts` section to `Backend/package.json` if it's missing:
```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": { ... }
}
```

Start the backend:
```bash
npm run dev
# → Server running on port 8000
# → MongoDB connected
```

---

### Step 3 — Frontend Setup

Open a **new terminal tab**:

```bash
cd Frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
# → Local: http://localhost:5173/
```

---

### Step 4 — Open the App

Visit [http://localhost:5173](http://localhost:5173) in your browser.
Make sure the backend is also running at port 8000 (the frontend fetches from `http://localhost:8000`).

---

## 📡 API Endpoints Reference

All routes are mounted at the root `/` in `server.js`.
Base URL: `http://localhost:8000`

> 🔓 **Auth Required** column is `No` for all routes — authentication is not yet implemented.

### Thread Routes

| Method   | Endpoint              | Description                                      | Auth | Request Body                    | Response                                |
|----------|-----------------------|--------------------------------------------------|------|---------------------------------|-----------------------------------------|
| `GET`    | `/thread`             | Get all threads sorted by latest update          | No   | —                               | `Array<Thread>`                         |
| `GET`    | `/thread/:threadId`   | Get all messages in a specific thread            | No   | —                               | `Array<Message>`                        |
| `DELETE` | `/thread/:threadId`   | Delete a thread and all its messages permanently | No   | —                               | `{ message: "Thread deleted successfully" }` |
| `POST`   | `/test`               | Dev-only: creates a hardcoded test thread        | No   | —                               | `{ message, thread }`                   |

### Chat Route

| Method | Endpoint | Description                                                         | Auth | Request Body                            | Response                   |
|--------|----------|---------------------------------------------------------------------|------|-----------------------------------------|----------------------------|
| `POST` | `/chat`  | Send a message → saves to DB → calls Gemini → returns AI reply     | No   | `{ threadId: string, message: string }` | `{ reply: string }`        |

#### How `/chat` Works Internally:
1. Receives `threadId` + `message` from frontend
2. Looks up thread in MongoDB by `threadId`
3. If **not found** → creates a new Thread doc (title = first 20 chars of message)
4. If **found** → pushes new user message into `thread.messages`
5. Calls `getGeminAiResponse(message)` → sends message to Gemini API
6. Pushes AI reply into `thread.messages`
7. Saves thread to MongoDB
8. Returns `{ reply: assistantreply }` to frontend

---

## 🗃️ Data Models (MongoDB Schemas)

### Thread Model — `Backend/models/Thread.js`

Each conversation is one `Thread` document containing an array of `Message` sub-documents.

```js
// Sub-document: a single chat message
const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],   // only these two values allowed
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now              // auto-set when message is created
    }
});

// Main document: a whole conversation thread
const threadSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: true,
        unique: true                   // UUID v1 generated on frontend (uuidv1())
    },
    title: {
        type: String,
        default: "New Chat"            // auto-set to first 20 chars of first message
    },
    messages: [MessageSchema],         // array of all messages in this thread
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now              // NOTE: manually updated in routes, not auto
    }
});
```

> ⚠️ **Known Bug**: `updatedAt` has a typo `dafault` instead of `default` in the raw file. It works because `updatedAt` is manually set in routes (`thread.updatedAt = Date.now()`), but the initial default never fires.

---

## 🧩 Frontend Component Tree

```mermaid
flowchart TD
    A[main.jsx\nReact root mount] --> B[App.jsx\nHolds ALL global state\nWraps MyContext.Provider]

    B --> C[MyContext.jsx\nContext: prompt, reply,\ncurrentthreadId, prevChats,\nallThreads, newChat, latestReply]

    B --> D[Sidebar.jsx\nThread list sidebar]
    B --> E[ChatWindow.jsx\nMain chat panel]

    D -->|reads/writes| C
    E -->|reads/writes| C

    E --> F[Chat.jsx\nRenders messages +\nwelcome screen]
    F -->|reads| C

    D -->|fetch GET /thread| G[Backend API]
    D -->|fetch DELETE /thread/:id| G
    E -->|fetch POST /chat| G
    E -->|fetch GET /thread/:id| G
```

### State Management (all in `App.jsx`, shared via Context)

| State Variable      | Type      | Purpose                                                       |
|---------------------|-----------|---------------------------------------------------------------|
| `prompt`            | `string`  | Current value of the chat input box                           |
| `reply`             | `string\|null` | Latest AI reply — triggers typewriter effect in Chat.jsx |
| `currentthreadId`   | `string`  | UUID of the currently active thread                           |
| `newChat`           | `boolean` | `true` = show welcome screen, `false` = show messages         |
| `prevChats`         | `array`   | All messages in the current thread (for rendering)            |
| `previousThreads`   | `array`   | (Reserved) list of past threads                               |
| `latestReply`       | `string\|null` | Typewriter-animated version of the latest reply          |
| `allThreads`        | `array`   | `[{ threadId, title }]` list shown in the sidebar             |

---

## 🤖 Gemini API Integration Notes

**File:** `Backend/utils/gemini.js`

```js
import { GoogleGenAI } from "@google/genai"
const ai = new GoogleGenAI(process.env.gemini_api_key)

// Called from routes/chat.js with just the latest message string
const getGeminAiResponse = async (message) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",         // ← the model being used
        contents: [{ text: message, role: "user" }]
    })
    return response.candidates[0].content.parts[0].text;
}
```

### Important Notes to Remember

| Topic | Detail |
|-------|--------|
| **Package** | `@google/genai` (NOT the older `@google-ai/generativelanguage`) |
| **Model** | `gemini-2.5-flash` — fast, free-tier friendly |
| **API Key env var** | `gemini_api_key` (lowercase, no quotes in .env) |
| **No conversation history sent** | Only the latest single message is sent — Gemini has no memory of previous turns. This is a known limitation to fix in future. |
| **Streaming** | NOT implemented — full response waits and returns at once |
| **Rate Limit handling** | `error.status === 429` is caught and rethrows `"Rate limit hit, please wait and try again"` |
| **Response parsing** | `response.candidates[0].content.parts[0].text` — manually extracted (no helper) |

---

## 📦 Scripts Reference

### Backend (`cd Backend`)

| Script | Command | What it does |
|--------|---------|--------------|
| `dev`  | `nodemon server.js` | Starts backend with auto-restart on file changes |
| `start`| `node server.js`    | Starts backend in production mode (no auto-restart) |

> ⚠️ The `Backend/package.json` may be missing a `"scripts"` field. Add it manually if needed (see Setup section above).

### Frontend (`cd Frontend`)

| Script    | Command         | What it does                                      |
|-----------|-----------------|---------------------------------------------------|
| `dev`     | `vite`          | Starts Vite dev server with HMR at localhost:5173 |
| `build`   | `vite build`    | Creates production bundle in `/dist`              |
| `preview` | `vite preview`  | Serves the production `/dist` locally             |
| `lint`    | `eslint .`      | Runs ESLint across all source files               |

---

## 🐛 Known Issues & Future TODOs

### Known Bugs (as of 22 March 2026)
- [ ] **Mongoose typo**: `dafault` in `Thread.js` → should be `default` for `updatedAt` field
- [ ] **No conversation history to Gemini**: AI starts fresh every message — no memory of the thread
- [ ] **Backend `package.json` malformed**: `name`/`version`/`type` were inside `dependencies` block — fix if reinstalling
- [ ] **Credentials in `.env` not gitignored**: Make sure to never push `.env` to GitHub

### Future TODOs
- [ ] Add user authentication (JWT or OAuth)
- [ ] Pass full conversation history to Gemini for multi-turn memory
- [ ] Add streaming responses (Gemini supports Server-Sent Events)
- [ ] Add a search/filter for the thread sidebar
- [ ] Add message timestamps in the UI
- [ ] Mobile responsive layout
- [ ] Add a "copy" button on code blocks
- [ ] Implement the "Settings" and "Upgrade Plan" dropdown items
- [ ] Rate limiting on the backend API
- [ ] Deploy: Frontend on Vercel, Backend on Render, DB on Atlas

---

## 📄 License

MIT License — do whatever you want with this. It's yours.

---

<details>
<summary>📸 Quick Reference — How a message flows end to end</summary>

```
1. User types in <input> in ChatWindow.jsx
2. Presses Enter or clicks send button
3. getReply() fires:
   - saves currentPrompt (before clearing input)
   - setPrompt("") to clear input
   - setLoading(true) to show dots
4. POST /chat with { threadId, message: currentPrompt }
5. Backend routes/chat.js:
   - Finds or creates Thread in MongoDB
   - Pushes user message into thread.messages
   - Calls getGeminAiResponse(message) → Gemini API
   - Pushes AI reply into thread.messages
   - Saves thread, returns { reply }
6. Frontend receives reply:
   - setReply(data.reply) → triggers useEffect in Chat.jsx
   - setPrevChats([...prev, userMsg, assistantMsg])
7. Chat.jsx useEffect detects new reply:
   - Splits reply into words
   - setInterval animates word by word (typewriter, 35ms/word)
8. bottomRef.scrollIntoView() fires → auto-scrolls down
```

</details>

---

*Built by [@the_evil_lord](https://github.com/vishnu108shanker) · Last documented: March 2026*
