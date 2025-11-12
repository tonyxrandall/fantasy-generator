import React, { useEffect, useState } from "react";

export default function App() {
  const [race, setRace] = useState("Human");
  const [gender, setGender] = useState("Male");
  const [region, setRegion] = useState("Archaic");
  const [origin, setOrigin] = useState("Woodsfolk");
  const [generatedName, setGeneratedName] = useState("");
  const [namesData, setNamesData] = useState(null);

  const races = [
    "Human",
    "Elf",
    "Dwarf",
    "Halfling",
    "Dragonborn",
    "Gnome",
    "Half-Orc",
    "Tiefling",
    "Triton",
    "Tortle",
    "Goliath",
  ];
  const regions = ["Archaic", "Westron", "Northish", "Southron"];
  const origins = [
    "Woodsfolk",
    "Desertfolk",
    "Farmfolk",
    "Priests",
    "Soldiers",
    "Swampfolk",
    "Townfolk",
    "Riverfolk",
    "Seafolk",
  ];
  const genders = ["Male", "Female"];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Load file dynamically
  useEffect(() => {
    async function loadNames() {
      try {
        const res = await fetch("/names-extra.txt");
        const text = await res.text();
        const lines = text.split(/\r?\n/).map((l) => l.trim());
        const parsed = {};
        let currentKey = "";

        for (const line of lines) {
          if (!line) continue;

          // Detect headers (lines with uppercase + punctuation)
          if (/^[A-Z][A-Z\s\-`']+/.test(line)) {
            currentKey = line.replace(/[:.]/g, "").trim();
            parsed[currentKey] = [];
          } else if (currentKey) {
            // Split comma-separated lists
            const names = line.split(/[,;]/).map((n) => n.trim());
            parsed[currentKey].push(...names.filter(Boolean));
          }
        }

        console.log("✅ Loaded name categories:", Object.keys(parsed));
        setNamesData(parsed);
      } catch (e) {
        console.error("Error loading names-extra.txt", e);
      }
    }

    loadNames();
  }, []);

  const generateName = () => {
    if (!namesData) {
      setGeneratedName("Loading name data...");
      return;
    }

    let first = "";
    let last = "";

    // === Race-specific logic ===
    const getList = (key) =>
      Object.keys(namesData).find(
        (k) => k.toLowerCase().includes(key.toLowerCase())
      );

    switch (race) {
      case "Elf": {
        const male = getList("ELF NAMES MALE");
        const female = getList("ELF NAMES FEMALE");
        const family = getList("ELF FAMILY NAMES");
        first = randomItem(
          gender === "Male"
            ? namesData[male] || []
            : namesData[female] || []
        );
        last = randomItem(namesData[family] || []);
        break;
      }
      case "Dwarf": {
        const male = getList("DWARF NAMES MALE");
        const female = getList("DWARF NAMES FEMALE");
        const clan = getList("DWARF CLAN NAMES");
        first = randomItem(
          gender === "Male"
            ? namesData[male] || []
            : namesData[female] || []
        );
        last = randomItem(namesData[clan] || []);
        break;
      }
      case "Halfling": {
        const male = getList("HALFLING NAMES MALE");
        const female = getList("HALFLING NAMES FEMALE");
        const sur = getList("HALFLING SURNAMES");
        first = randomItem(
          gender === "Male"
            ? namesData[male] || []
            : namesData[female] || []
        );
        last = randomItem(namesData[sur] || []);
        break;
      }
      case "Human": {
        const regionKey = getList(`${region}. ${gender}`);
        const originKey = getList(`${origin}`);
        first = randomItem(namesData[regionKey] || []);
        last = randomItem(namesData[originKey] || []);
        break;
      }
      default: {
        // fallback random across everything
        const all = Object.values(namesData).flat();
        first = randomItem(all);
        last = randomItem(all);
      }
    }

    if (!first) first = "Unknown";
    setGeneratedName([first, last].filter(Boolean).join(" "));
  };

  const surpriseMe = () => {
    setRace(randomItem(races));
    setGender(randomItem(genders));
    setRegion(randomItem(regions));
    setOrigin(randomItem(origins));
    generateName();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-indigo-300">
        🧙‍♂️ Ultimate D&D Name Generator
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-4xl">
        <div>
          <label className="block mb-1 text-sm text-gray-300">Race</label>
          <select
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={race}
            onChange={(e) => setRace(e.target.value)}
          >
            {races.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Gender</label>
          <select
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            {genders.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Region</label>
          <select
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Origin</label>
          <select
            className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          >
            {origins.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={generateName}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded text-lg font-semibold shadow"
        >
          Generate Name
        </button>
        <button
          onClick={surpriseMe}
          className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded text-lg font-semibold shadow"
        >
          🎲 Surprise Me
        </button>
      </div>

      {generatedName && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-amber-300">{generatedName}</h2>
          <p className="text-sm mt-2 text-gray-400">
            {gender} {race} — {region} / {origin}
          </p>
        </div>
      )}

      <footer className="mt-12 text-xs text-slate-500">
        © {new Date().getFullYear()} D&D Name Generator — built with ⚡React
      </footer>
    </div>
  );
}
