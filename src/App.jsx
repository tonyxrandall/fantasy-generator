import React, { useState } from "react";

export default function App() {
  const [race, setRace] = useState("Human");
  const [gender, setGender] = useState("Male");
  const [region, setRegion] = useState("Archaic");
  const [origin, setOrigin] = useState("Woodsfolk");
  const [generatedName, setGeneratedName] = useState("");

  // === SAMPLE DATA (You’ll replace this with your full lists later) ===
  const names = {
    Archaic: {
      Female: ["Aebria", "Arya", "Elyana", "Aurora", "Valeria"],
      Male: ["Aedrian", "Lucius", "Thomys", "Bryne", "Eryc"],
    },
    Westron: {
      Female: ["Aria", "Bella", "Layla", "Sophia", "Eva"],
      Male: ["Ethan", "Liam", "Caleb", "Logan", "Gavin"],
    },
    Northish: {
      Female: ["Anika", "Leya", "Maja", "Nikola", "Yvelyn"],
      Male: ["Aksel", "Erik", "Jakob", "Lukas", "Viktor"],
    },
    Southron: {
      Female: ["Adria", "Calia", "Elia", "Sofia", "Valentina"],
      Male: ["Adamo", "Alesso", "Giovannos", "Lucos", "Mateo"],
    },
  };

  const surnames = {
    Woodsfolk: [
      "Green",
      "Hunter",
      "Forrester",
      "Fox",
      "Oakstaff",
      "Walker",
      "Silvermoon",
    ],
    Desertfolk: [
      "Sands",
      "Stone",
      "Storms",
      "Redmoon",
      "Greyscale",
      "Palmer",
    ],
    Soldiers: ["Ryder", "Knight", "Shields", "Swords", "Marcher"],
    Priests: ["Bright", "Goodman", "Saint", "Holly", "Wise"],
  };

  const races = ["Human", "Elf", "Dwarf", "Halfling", "Dragonborn", "Tiefling"];
  const regions = ["Archaic", "Westron", "Northish", "Southron"];
  const origins = [
    "Woodsfolk",
    "Desertfolk",
    "Farmfolk",
    "Priests",
    "Soldiers",
  ];
  const genders = ["Male", "Female"];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateName = () => {
    const firstList =
      names[region]?.[gender] || names["Archaic"]["Male"];
    const lastList = surnames[origin] || surnames["Woodsfolk"];
    const first = randomItem(firstList);
    const last = randomItem(lastList);
    setGeneratedName(`${first} ${last}`);
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
        🧙‍♂️ D&D Name Generator
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
          <h2 className="text-3xl font-bold text-amber-300">
            {generatedName}
          </h2>
          <p className="text-sm mt-2 text-gray-400">
            {gender} {race} of the {region} {origin}
          </p>
        </div>
      )}

      <footer className="mt-12 text-xs text-slate-500">
        © {new Date().getFullYear()} D&D Name Generator — built with ⚡React
      </footer>
    </div>
  );
}
