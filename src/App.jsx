import React, { useState, useEffect } from "react";
import "./styles.css";

// Fallback Kit component (avoids missing import issues)
const Kit = ({ title, children }) => (
  <div className="kit-section p-4 m-4 bg-white/10 rounded-xl border border-white/20">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div>{children}</div>
  </div>
);

// Fallback job and location data
const fallbackJobs = [
  "Scholar",
  "Merchant",
  "Hunter",
  "Healer",
  "Blacksmith",
  "Sailor",
  "Soldier",
  "Thief",
  "Bard",
  "Alchemist",
];
const fallbackLocations = [
  "Caer Mona",
  "Bleakmoor River",
  "Brigands Forest",
  "The Bronze March",
  "The Celestial Vale",
];

// Utility helpers
function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function remixLocations(base, n = 50) {
  const words = base.flatMap(x => x.split(" "));
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(
      `${choice(words)} ${choice(words)}`
        .replace(/\b(The The|Of Of|Of The)\b/g, "")
        .trim()
    );
  }
  return out;
}

export default function App() {
  const [jobs, setJobs] = useState(fallbackJobs);
  const [locations, setLocations] = useState(fallbackLocations);
  const [generated, setGenerated] = useState([]);

  useEffect(() => {
    // Try loading jobs.json and locations.base.json if available
    const loadData = async () => {
      try {
        const j = await fetch("/data/jobs.json");
        if (j.ok) setJobs(await j.json());
      } catch (err) {
        console.warn("Using fallback jobs");
      }
      try {
        const l = await fetch("/data/locations.base.json");
        if (l.ok) setLocations(await l.json());
      } catch (err) {
        console.warn("Using fallback locations");
      }
    };
    loadData();
  }, []);

  const generateNames = () => {
    const out = [];
    for (let i = 0; i < 10; i++) {
      out.push(
        `${choice(["Aeron", "Lira", "Thane", "Seren", "Galen", "Kael", "Mira", "Ryn", "Thalia", "Orin"])} of ${choice(remixLocations(locations, 100))} the ${choice(jobs)}`
      );
    }
    setGenerated(out);
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mt-6">Fantasy Generator</h1>
      <p className="opacity-80 mb-4">Names, jobs, and locations for your world</p>

      <Kit title="Generate NPCs">
        <button
          onClick={generateNames}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
        >
          Generate
        </button>

        <ul className="mt-4 space-y-1">
          {generated.length > 0 ? (
            generated.map((g, i) => (
              <li key={i} className="bg-white/10 px-3 py-2 rounded-md">
                {g}
              </li>
            ))
          ) : (
            <li className="opacity-70 italic">Click “Generate” to create NPCs</li>
          )}
        </ul>
      </Kit>

      <footer className="mt-auto mb-4 opacity-60 text-sm">
        © {new Date().getFullYear()} Fantasy Generator by You
      </footer>
    </div>
  );
}

