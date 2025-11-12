import React, { useState, useEffect } from "react";

export default function App() {
  const [allNames, setAllNames] = useState([]);
  const [generatedName, setGeneratedName] = useState("");
  const [race, setRace] = useState("Human");
  const [gender, setGender] = useState("Any");
  const [origin, setOrigin] = useState("Any");

  const races = [
    "Human",
    "Elf",
    "Dwarf",
    "Halfling",
    "Tiefling",
    "Dragonborn",
    "Gnome",
    "Half-Orc",
    "Goliath",
    "Triton",
    "Tortle",
  ];
  const genders = ["Male", "Female", "Any"];
  const origins = [
    "Woodsfolk",
    "Desertfolk",
    "Farmfolk",
    "Townfolk",
    "Riverfolk",
    "Soldiers",
    "Priests",
    "Wanderers",
  ];

  useEffect(() => {
    // Load and parse all names (ignoring headers)
    fetch("/names_extra.txt")
      .then((res) => res.text())
      .then((data) => {
        const names = data
          .split(/[\n,]+/)
          .map((n) => n.trim())
          .filter(
            (n) =>
              n &&
              !n.match(/^[A-Z\s\-']+\.$/) && // ignore headers like "ELF NAMES MALE."
              !n.startsWith("*") &&
              n.length > 1
          );
        setAllNames(names);
      });
  }, []);

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateName = () => {
    if (!allNames.length) return;
    const first = randomItem(allNames);
    let last = randomItem(allNames);

    // Avoid identical first/last
    while (last === first) last = randomItem(allNames);

    const name = `${first} ${last}`;
    setGeneratedName(name);
  };

  const surpriseMe = () => {
    setRace(randomItem(races));
    setGender(randomItem(genders));
    setOrigin(randomItem(origins));
    generateName();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-indigo-300">
        ⚔️ Ultimate D&D Name Generator
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 w-full max-w-4xl">
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
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-center shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-bold text-amber-300">{generatedName}</h2>
          <p className="text-sm mt-2 text-gray-400">
            {gender} {race} of the {origin}
          </p>
        </div>
      )}

      {!allNames.length && (
        <p className="mt-10 text-gray-400 italic">Loading names...</p>
      )}

      <footer className="mt-12 text-xs text-slate-500">
        © {new Date().getFullYear()} D&D Name Generator — built with ⚡ React
      </footer>
    </div>
  );
}
