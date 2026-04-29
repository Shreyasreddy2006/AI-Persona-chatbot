# Persona-Based AI Chatbot

A full-stack, deployable chatbot built for Scaler Academy's Prompt Engineering assignment. The app lets users switch between three distinct Scaler/InterviewBit-inspired personas: **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**.

## What this project includes

- React frontend with a responsive chat interface
- Node.js + Express backend for OpenAI API calls
- Persona switcher that resets the conversation
- Suggestion chips customized for each persona
- Typing indicator while the model is responding
- Graceful API error handling
- `prompts.md` with annotated prompt design
- `reflection.md` with assignment learnings

## Tech stack

- React
- Vite
- Node.js
- Express
- OpenAI JavaScript SDK

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Add your OpenAI API key in `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
PORT=8787
```

4. Start the app in development:

```bash
npm run dev
```

5. Open the frontend at [http://localhost:5173](http://localhost:5173)

## Production build

```bash
npm run build
npm start
```

The Express server serves the built React app from `dist`, which makes this easy to deploy as a single service.

## Deploying

This repo is designed to deploy cleanly on platforms like **Render**, **Railway**, or **Northflank** as one Node service.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required environment variable: `OPENAI_API_KEY`
- Optional environment variables: `OPENAI_MODEL`, `PORT`

## Project structure

```text
.
├── server
│   ├── index.js
│   └── personas.js
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── personas.js
│   └── styles.css
├── .env.example
├── prompts.md
├── reflection.md
└── README.md
```

## Persona design notes

- **Anshuman Singh** is framed as direct, high-bar, and engineering-depth oriented.
- **Abhimanyu Saxena** is framed as strategic, learner-first, and focused on employability plus long-term relevance.
- **Kshitij Mishra** is framed as a concept-first mentor who explains clearly and practically.

The prompts intentionally avoid claiming private knowledge or fabricating personal details. They use publicly observable themes from interviews, company bios, and social posts to guide tone.

## Evaluation checklist coverage

- Public-repo friendly structure with `.env.example`
- Separate persona prompts on the backend
- Responsive UI
- Typing indicator
- Suggestion chips
- Error handling for missing API key and API failures
- `prompts.md` and `reflection.md` included

## Screenshot checklist

Add final screenshots after running or deploying:

- Home screen with Anshuman selected
- Persona switch to Abhimanyu
- Mobile responsive view

## Notes

- The app uses a **developer/system-style instruction prompt** for each persona and sends the full conversation history to the backend.
- For new projects, OpenAI recommends the newer Responses API, but this project uses Chat Completions because it maps cleanly to classic chat history handling in a simple assignment app. Source: [OpenAI Chat Completions reference](https://platform.openai.com/docs/api-reference/chat/create-chat-completion) and [OpenAI quickstart](https://platform.openai.com/docs/quickstart?lang=javascript).
