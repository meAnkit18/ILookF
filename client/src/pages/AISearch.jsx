import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
const { ipcRenderer } = window.require("electron");

const genAI = new GoogleGenerativeAI("AIzaSyDMAr9SdtudsZBE_NO4kTnZKlwsHaojvgk");

function AISearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  // Max height for window in pixels
  const MAX_HEIGHT = 400; // Change as needed
  const INPUT_HEIGHT = 60; // Height of the input bar

  useEffect(() => {
    if (resultRef.current) {
      const contentHeight = resultRef.current.scrollHeight + INPUT_HEIGHT;
      const newHeight = Math.min(contentHeight, MAX_HEIGHT);

      // Tell Electron to resize
      ipcRenderer.send("resize-window", newHeight);
    }
  }, [result]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const res = await model.generateContent(query);
      const text = res.response.text();
      setResult(text);
    } catch (err) {
      console.error(err);
      setResult("❌ Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full max-w-xl  h-full rounded-full text-white"
  style={{
  background: "rgba(0, 0, 0, 0.6)",       // black at 60% opacity
  backdropFilter: "blur(12px) saturate(180%)",
  WebkitBackdropFilter: "blur(12px) saturate(180%)",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
}}

>
      <div
        className="flex items-center h-[60px] w-full text-sm text-white bg-black/60 border-b border-black rounded-b-lg"
        style={{ flexShrink: 0 }}
      >
        <button type="button" className="h-full px-3"></button>
        <input
          className="outline-none  font-semibold h-full w-full px-2"
          type="text"
          placeholder="Ask me anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          type="button"
          className="h-full px-4"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "..." : ""}
        </button>
      </div>

      {/* Scrollable AI Response */}
      <div
        ref={resultRef}
        className="flex-1 overflow-y-auto p-1"
        style={{
          maxHeight: MAX_HEIGHT - INPUT_HEIGHT,
        }}
      >
        {loading && <p>Thinking...</p>}
        {!loading && result && <p>{result}</p>}
      </div>
    </div>
  );
}

export default AISearch;
