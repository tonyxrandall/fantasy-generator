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

  // Load your massive names-extra file
  useEffect(() => {
    async function loadNames() {
      try {
        // This assumes you placed names-extra.txt in /public or /src/data
        const res = await fetch("/names-extra.txt");
        const text = await res.text();

        // Convert simple structured lists into usable JSON
        const sections = text.split(/\n\s*\n/); // separate blocks
        const parsed = {};

        let currentKey = "";
        for (const section of sections) {
          const lines = section.split("\n").filter((l) => l.trim());
          if (lines.length === 0) continue;
          const header = lines[0].replace(/[:.]/g, "").trim();
          const body = lines.slice(1).join(" ").split(/[,;]/).map((n) => n.trim());
          parsed[header] = body.filter((n) => n.length);
        }

        setNamesData(parsed);
      } catch (e) {
        console.error("Error loading names-extra.txt", e);
      }
    }

    loadNames();
  }, []);

  const generateName = () => {
    if (!namesData) {
      setGeneratedName("Loading names...");
      return;
    }

    let first = "";
    let last = "";

    // === RACE-SPECIFIC RULES ===
    switch (race) {
      case "Elf":
        first = randomItem(namesData["ELF NAMES MALE"].concat(namesData["ELF NAMES FEMALE"]));
        last = randomItem(namesData["ELF FAMILY NAMES"]);
        break;
      case "Dwarf":
        first = randomItem(namesData["DWARF NAMES MALE"].concat(namesData["DWARF NAMES FEMALE"]));
        last = randomItem(namesData["DWARF CLAN NAMES"]);
        break;
      case "Halfling":
        first = randomItem(namesData["HALFLING NAMES MALE"].concat(namesData["HALFLING NAMES FEMALE"]));
        last = randomItem(namesData["HALFLING SURNAMES"]);
        break;
      case "Gnome":
        first = randomItem(namesData["GNOME NAMES MALE"].concat(namesData["GNOME NAMES FEMALE"]));
        last = randomItem(namesData["GNOME CLAN NAMES"]);
        break;
      case "Dragonborn":
        first = randomItem(namesData["DRAGONBORN NAMES MALE"].concat(namesData["DRAGONBORN NAMES FEMALE"]));
        last = randomItem(namesData["DRAGONBORN CLAN NAMES"]);
        break;
      case "Half-Orc":
        first = randomItem(namesData["HALF-ORC NAMES MALE"].concat(namesData["HALF-ORC NAMES FEMALE"]));
        break;
      case "Tiefling":
        first = randomItem(namesData["TIEFLING NAMES MALE"].concat(namesData["TIEFLING NAMES FEMALE"]));
        last = randomItem(namesData["TIEFLING VIRTUE NAMES"]);
        break;
      case "Goliath":
        first = randomItem(namesData["GOLIATH NAMES BIRTH NAME"]);
        last = randomItem(namesData["GOLIATH CLAN NAMES"]);
        break;
      case "Triton":
        first = randomItem(namesData["TRITON NAMES MALE"].concat(namesData["TRITON NAMES FEMALE"]));
        last = randomItem(namesData["TRITON SURNAME"]);
        break;
      case "Tortle":
        first = randomItem(namesData["TORTLE NAMES NAME"]);
        break;
      default:
        // Humans use region + origin
        const regionKey = `${region}. ${gender}.`;
        const originKey = `${origin}.`;
        const firstList = namesData[regionKey] || [];
        const lastList = namesData[originKey] || [];
        first = randomItem(firstList);
        last = randomItem(lastList);
        break;
    }

    const full = [first, last].filter(Boolean).join(" ");
    setGeneratedName(full);
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
            {regions.map((reg) => (
              <option key={reg}>{reg}</option>
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
