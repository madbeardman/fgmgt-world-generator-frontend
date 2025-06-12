import { useState, useRef, useEffect } from "react";
import { RefreshCcw } from "lucide-react";

const formats = ["module", "system"];
const CACHE_KEY = "cachedSectors";
const CACHE_EXPIRY_KEY = "cachedSectorsExpiry";
const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export default function SectorForm() {
  const [sectors, setSectors] = useState([]);
  const [sector, setSector] = useState("");
  const [format, setFormat] = useState(formats[0]);
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    loadSectors();
  }, []);

  function loadSectors(forceRefresh = false) {
    const cached = localStorage.getItem(CACHE_KEY);
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    const isExpired = expiry && Date.now() > Number(expiry);

    if (!forceRefresh && cached && !isExpired) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSectors(parsed);
          setSector(parsed[0]);
          return;
        }
      } catch {
        console.warn("❌ Invalid cached data, ignoring.");
      }
    }

    fetchSectors(); // fallback or refresh
  }

  async function fetchSectors() {
    try {
      const res = await fetch(
        "https://travellermap.com/api/universe?milieu=M1105&tag=Official&requireData=1"
      );
      const data = await res.json();

      if (!Array.isArray(data.Sectors)) {
        throw new Error("Expected a 'Sectors' array in API response");
      }

      const sortedNames = data.Sectors.map((s) => s.Names[0].Text).sort();
      setSectors(sortedNames);
      setSector(sortedNames[0]);

      localStorage.setItem(CACHE_KEY, JSON.stringify(sortedNames));
      localStorage.setItem(
        CACHE_EXPIRY_KEY,
        (Date.now() + CACHE_MAX_AGE_MS).toString()
      );
    } catch (err) {
      console.error("❌ Failed to fetch sector list", err);
      const fallback = ["Spinward Marches"];
      setSectors(fallback);
      setSector(fallback[0]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessages([]);
    setStatus("loading");

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    console.log("Creating EventSource");

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

    es.onerror = (e) => {
      if (status !== "done") {
        setStatus("error");
        console.error("EventSource error:", e);
        setMessages((prev) => [...prev, "❌ Connection error."]);
      }
      es.close();
    };
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Sector</label>
        <div className="flex items-center gap-2">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
          >
            {sectors.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => loadSectors(true)}
            title="Refresh Sector List"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-3 rounded flex items-center justify-center"
          >
            <RefreshCcw size={18} className="text-white" />
          </button>
        </div>
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

      {messages.length > 0 && (
        <div className="mt-4 text-sm font-mono overflow-y-auto w-full sm:max-w-3xl px-4 py-2 bg-gray-900/60 border border-gray-700 rounded">
          {messages.map((msg, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {msg}
            </div>
          ))}
        </div>
      )}

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
