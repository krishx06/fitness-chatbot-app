# Fitness Chatbot Companion

A personalized, context-aware AI fitness chatbot built with **React Native (Expo)** and **Google Gemini AI**.

#### Demo Video: [Click here](https://drive.google.com/file/d/1fpMqMM4K1l7L_CqZBZ0sgpAAlT1sZgmC/view?usp=sharing)


## How to Run the App

This project consists of two parts: the **Frontend (App)** and the **Backend (Server)**. You must run both for the chatbot to function.

### 1. Setup (Run Once)
This single command installs dependencies for **both** the frontend and backend.

```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the `backend` folder with the following content:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=4000
DATABASE_URL="file:./dev.db"
```

### 3. Initialize Database
Since the database file is not tracked in git, you must generate it locally:

```bash
# Inside backend folder
npx prisma migrate dev
```
*This creates the `dev.db` file and sets up the schema.*

### 4. Start the Backend
The backend handles AI logic and database storage.

```bash
# Return to root if needed: cd ..
cd backend && npm run dev
```
*Server runs on `http://localhost:4000`*

### 3. Start the Frontend
Open a new terminal window to run the React Native app.

```bash
npx expo start
```
*Press `i` to run on iOS Simulator or scan the QR code with Expo Go.*

---

## AI Logic & Prompt Composition

### How Prompts are Composed
We use a **Dynamic System Prompt** strategy. Instead of a static instruction, the system prompt is rebuilt on every request in `prompt.service.ts` using three layers:

1.  **Personality Layer**: Defines the specific tone (Encourager, Creative, or Goal Finisher).
2.  **Behavior Layer**: Appends instructions based on the user's "Journey Day" (Empathetic for beginners, Coach-like for veterans).
3.  **Context Layer**: Injects real-time lifestyle data (steps, sleep, exercise) so the AI gets a full picture.

### AI Behavior & Inputs
The AI adapts in real-time based on:
1.  **Personality Selection**:
    *   *Encourager*: Supportive, gentle, uses emojis.
    *   *Creative*: Varied, metaphorical, fun.
    *   *Goal Finisher*: Direct, concise, results-oriented.
2.  **App Usage Duration (Journey Day)**:
    *   *Days 0-3*: Grounded & Empathetic. No instant remedies.
    *   *Days 4-8*: Friendly Listener. Remedies after conversation.
    *   *Days 9+*: Coach-like. Instant, actionable advice.

### Safety Refusal Handling
We implemented a dedicated **Safety Utility** (`safety.util.ts`) that scans user messages *before* they reach the LLM.
*   **Trigger**: Keywords related to "pain", "injury", "medication", "doctor", "broken", "severe".
*   **Action**: The backend intercepts the request and strictly refuses to answer, returning a pre-defined safe response: *"I am an AI, not a doctor. Please consult a professional."*
*   **Database**: Even refusals are logged in the database for safety auditing.

---

## Tech Stack
*   **Frontend**: React Native, Expo, TypeScript, React Context API.
*   **Backend**: Node.js, Express, TypeScript, Prisma, SQLite.
*   **AI**: Google Gemini API (`gemini-2.0-flash`).
*   **Database**: SQLite (via Prisma ORM).

## Repository Structure
*   `/app`: Frontend screens and navigation (Expo Router).
*   `/backend`: Node.js server and AI logic.
*   `/context`: Global state management (Personality, Coins, Theme).
*   `/components`: Reusable UI components.
