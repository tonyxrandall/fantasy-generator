import React, { useState, useEffect } from "react";
import "./styles.css";

/* -----------------------------
   🧠 Data Sets
----------------------------- */

// Fantasy races
const RACES = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Gnome",
  "Orc",
  "Half-Orc",
  "Dragonborn",
  "Tiefling",
  "Tabaxi",
  "Half-Elf",
];

// Genders
const GENDERS = ["Masculine", "Feminine", "Neutral"];

// Professions / jobs
const JOBS = [
  "Scholar",
  "Cartographer",
  "Blacksmith",
  "Tavern Keeper",
  "Merchant",
  "Soldier",
  "Wizard",
  "Priest",
  "Hunter",
  "Sailor",
  "Bard",
  "Rogue",
  "Paladin",
  "Farmer",
  "Alchemist",
  "Smith",
  "Adventurer",
  "Beggar",
  "Healer",
  "Ranger",
  "Guard",
  "King",
  "Queen",
  "Knight",
  "Assassin",
  "Druid",
  "Monk",
  "Seer",
  "Craftsman",
];

// Locations (base + generated remix)
const BASE_LOCATIONS = [
  "Caer Mona",
  "Bleakmoor River",
  "The Celestial Vale",
  "Brigands Forest",
  "The Bronze March",
  "Brinevriand",
  "The Glass Sea",
  "The Ironwood Forest",
  "The Vale of Song",
  "The Tower of Vacal the Bloody",
  "The Barrier Peaks",
  "The Shadow Village",
];

// First name fragments
const FIRST_PARTS = [
  "Aer",
  "Ael",
  "Bel",
  "Cal",
  "Dra",
  "El",
  "Fen",
  "Gal",
  "Hal",
  "Ith",
  "Jor",
  "Kael",
  "Lor",
  "Mal",
  "Nor",
  "Or",
  "Pyra",
  "Qua",
  "Ryn",
  "Syl",
  "Tor",
  "Vael",
  "Xan",
  "Yor",
  "Zan",
];
const LAST_PARTS = [
  "dor",
  "thas",
  "wyn",
  "ric",
  "dil",
  "mir",
  "on",
  "ar",
  "iel",
  "or",
  "drin",
  "var",
  "aen",
  "is",
  "en",
  "oth",
  "el",
  "ros",
  "vin",
  "ra",
  "ia",
  "ias",
];

// Epithets
const EPITHETS = [
  "the Bold",
  "the Silent",
  "the Wanderer",
  "the Flameborn",
  "of the North",
  "of the Vale",
  "the Shadowed",
  "the Wise",
  "the Red",
  "the Trickster",
  "the Stormborn",
  "of the Coast",
];

/* -----------------------------
   🎲 Helper Functions
----------------------------- */

const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

function remixLocations(base, n = 80) {
  const words = base.flatMap((x) => x.split(" "));
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(
      `${choice(words)} ${choice(words)}`
        .replace(/\b(The The|Of Of|Of The)\b/g, "")
        .trim()
    );
  }
  return Array.from(new Set(out));
}

function generateName() {
  return (
    choice(FIRST_PARTS) +
    choice(LAST_PARTS) +
    (Math.random() > 0.75 ? " " + choice(EPITHETS) : "")
  );
}

/* -----------------------------
   🧩 Components
----------------------------- */

const Card = ({ name, race, gender, job, location }) => (
  <div className="p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition">
    <div className="text-xl font-semibold">{name}</div>
    <div className="text-sm opacity-80">
      {race} • {gender} • {job}
    </div>
    <div className="text-xs opacity-60 mt-1 italic">{location}</div>
  </div>
);

/* -----------------------------
   🌍 Main App Component
----------------------------- */

export default function App() {
  const [npcs, setNpcs] = useState([]);
  const [count, setCount] = useState(10);
  const [locations, setLocations] = useState(remixLocations(BASE_LOCATIONS));
  const [query, setQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const generateNPCs = () => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        name: generateName(),
        race: choice(RACES),
        gender: choice(GENDERS),
        job: choice(JOBS),
        location: choice(locations),
      });
    }
    setNpcs(arr);
  };

  useEffect(() => {
    generateNPCs(); // Auto-generate on load
  }, []);

  const filtered = npcs.filter((n) =>
    Object.values(n).some((v) =>
      String(v).toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col items-center">
      <header className="w-full border-b border-white/10 py-4 px-6 flex flex-col sm:flex-row gap-3 sm:items-center max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight">🧙 Fantasy Generator</h1>
        <div className="ml-auto flex gap-2">
          <button
            onClick={generateNPCs}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm"
          >
            Generate
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            {showSettings ? "Hide Settings" : "Settings"}
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="w-full max-w-6xl bg-white/10 border border-white/20 rounded-xl mt-4 p-4 text-sm">
          <label className="block mb-2">
            <span>NPC Count:</span>
            <input
              type="number"
              value={count}
              min="1"
              max="100"
              onChange={(e) => setCount(parseInt(e.target.value || "1", 10))}
              className="ml-2 bg-slate-800 border border-slate-700 rounded px-2 py-1 w-20 text-white"
            />
          </label>
          <button
            onClick={() => setLocations(remixLocations(BASE_LOCATIONS))}
            className="px-3 py-1 bg-slate-700 rounded-lg hover:bg-slate-600"
          >
            Refresh Locations
          </button>
        </div>
      )}

      <main className="w-full max-w-6xl px-6 py-8 flex-1">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            placeholder="Search (e.g. Elf, Bard, River)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={() => setQuery("")}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
          >
            Clear
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((npc, i) => (
              <Card key={i} {...npc} />
            ))}
          </div>
        ) : (
          <div className="opacity-70 italic text-center mt-10">
            No results found. Try different filters.
          </div>
        )}
      </main>

      <footer className="text-xs opacity-60 py-4">
        Built with ❤️ for worldbuilders and DMs.
      </footer>
    </div>
  );
}
