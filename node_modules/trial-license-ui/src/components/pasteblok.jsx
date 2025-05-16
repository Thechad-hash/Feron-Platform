import { useState, useRef } from "react";

console.log(">>>> VITE_BACKEND_URL is:", import.meta.env.VITE_BACKEND_URL);

export default function FeronChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const sendMessage = async () => {
 
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feron`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (data.reply) {
        const assistantMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "FERON encountered an issue or did not respond." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Error contacting FERON backend." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    setMessages((prev) => [
      ...prev,
      { role: "system", content: `Uploaded file: ${file.name}` },
    ]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
        FERON AI Assistant
      </h1>
      <p style={{ textAlign: "center", color: "#666" }}>What do you want to know about the AI tools platform?</p>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginTop: "20px",
          marginBottom: "20px",
          borderRadius: "6px",
          backgroundImage: "url('/feron-logo.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              backgroundColor:
                msg.role === "user"
                  ? "#d9ebff"
                  : msg.role === "assistant"
                  ? "#e6ffe6"
                  : "#eeeeee",
              marginBottom: "8px",
              padding: "8px",
              borderRadius: "4px",
              fontStyle: msg.role === "system" ? "italic" : "normal",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask FERON something..."
          style={{ flex: 1, padding: "8px", fontSize: "14px" }}          
        />
        <button onClick={sendMessage} disabled={isLoading} style={{ padding: "8px 16px" }}>
          {isLoading ? "..." : "Send"}
        </button>        
      </div>

      <div>

      </div>
    </div>
  );
}
