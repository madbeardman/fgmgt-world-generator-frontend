import { useState, useRef } from "react";

const sectors = ["Spinward Marches", "Deneb", "Solomani", "Vland", "Foreven"];
const formats = ["module", "system"];

export default function SectorForm() {
  const [sector, setSector] = useState(sectors[0]);
  const [format, setFormat] = useState(formats[0]);
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);
  const eventSourceRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessages([]);
    setStatus("loading");

    // Close any previous stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Start SSE
    const es = new EventSource(
      `${
        window.location.origin
      }/api/generate-stream?sector=${encodeURIComponent(
        sector
      )}&format=${encodeURIComponent(format)}`
    );
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const msg = event.data;
      if (msg === "[DONE]") {
        setStatus("done");
        es.close();
      } else if (msg.startsWith("[ERROR]")) {
        setStatus("error");
        setMessages((prev) => [...prev, `❌ ${msg.slice(7)}`]);
        es.close();
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    };

    es.onerror = (err) => {
      setStatus("error");
      setMessages((prev) => [...prev, "❌ Connection error."]);
      es.close();
    };
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Sector</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
        >
          {sectors.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Format</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
        >
          {formats.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Generating..." : "Generate"}
      </button>

      <div className="mt-4 space-y-1 text-sm font-mono">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      {status === "done" && (
        <p className="text-green-400 mt-2">
          ✅ Complete! Check the output folder.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500 mt-2">❌ Something went wrong.</p>
      )}
    </form>
  );
}
