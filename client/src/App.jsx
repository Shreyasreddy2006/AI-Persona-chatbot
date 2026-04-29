import { useMemo, useState } from "react";
import { personas } from "./personas";

const introMessages = {
  anshuman:
    "I’ll respond like Anshuman Singh: crisp, analytical, and focused on real engineering depth. Ask me about interviews, systems thinking, product judgment, or building durable skills.",
  abhimanyu:
    "I’ll respond like Abhimanyu Saxena: strategic, learner-first, and grounded in long-term career outcomes. Ask me about upskilling, career leverage, or navigating the changing tech market.",
  kshitij:
    "I’ll respond like Kshitij Mishra: concept-first, practical, and mentor-style. Ask me about DSA, OOP, software design, debugging, or how to truly understand a topic."
};

function App() {
  const [activePersonaId, setActivePersonaId] = useState(personas[0].id);
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: introMessages[personas[0].id]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const activePersona = useMemo(
    () => personas.find((persona) => persona.id === activePersonaId),
    [activePersonaId]
  );

  const switchPersona = (personaId) => {
    setActivePersonaId(personaId);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: introMessages[personaId]
      }
    ]);
    setInput("");
    setError("");
  };

  const sendMessage = async (text) => {
    const value = text.trim();
    if (!value || isLoading) {
      return;
    }

    const nextMessages = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: value }
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personaId: activePersonaId,
          messages: nextMessages.map(({ role, content }) => ({ role, content }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong while contacting the AI.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply
        }
      ]);
    } catch (err) {
      setError(err.message || "Unable to get a response right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <div className="app-shell">
      <div className="backdrop backdrop-one" />
      <div className="backdrop backdrop-two" />

      <main className="app-card">
        <section className="hero">
          <p className="eyebrow">Assignment 01 • Persona-Based AI Chatbot</p>
          <h1>Talk to Scaler personalities that actually feel distinct.</h1>
          <p className="hero-copy">
            Switch between three personas, start with tailored prompts, and chat
            through a deployable React + Node application.
          </p>
        </section>

        <section className="persona-panel">
          <div className="persona-panel-header">
            <div>
              <p className="section-label">Active persona</p>
              <h2>{activePersona.name}</h2>
            </div>
            <span
              className="persona-pill"
              style={{ backgroundColor: activePersona.color }}
            >
              {activePersona.badge}
            </span>
          </div>

          <div className="persona-switcher">
            {personas.map((persona) => (
              <button
                key={persona.id}
                type="button"
                className={`persona-tab ${
                  persona.id === activePersonaId ? "active" : ""
                }`}
                onClick={() => switchPersona(persona.id)}
                style={
                  persona.id === activePersonaId
                    ? { borderColor: persona.color, backgroundColor: `${persona.color}18` }
                    : undefined
                }
              >
                <span>{persona.name}</span>
                <small>{persona.role}</small>
              </button>
            ))}
          </div>

          <div className="chips-row">
            {activePersona.chips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="chip"
                onClick={() => sendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        <section className="chat-panel">
          <div className="chat-header">
            <div>
              <p className="section-label">Chat</p>
              <h3>{activePersona.accent}</h3>
            </div>
            <p className="chat-reset-note">Switching persona clears the conversation.</p>
          </div>

          <div className="messages">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`message message-${message.role}`}
              >
                <span className="message-role">
                  {message.role === "assistant" ? activePersona.name : "You"}
                </span>
                <p>{message.content}</p>
              </article>
            ))}

            {isLoading ? (
              <article className="message message-assistant typing">
                <span className="message-role">{activePersona.name}</span>
                <div className="typing-dots" aria-label="Typing indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            ) : null}
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={`Ask ${activePersona.name} something thoughtful...`}
              rows={3}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
