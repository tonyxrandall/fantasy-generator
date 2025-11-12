import React, { useEffect, useMemo, useRef, useState } from "react";
import Kit from "./Kit"; // NOTE: Kit.jsx is at project root (not ./components)
                         // Your previous import path was "./components/Kit". This fixes it.

//
// ---------- Utilities ----------
//
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal];
}

function choice(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}

// Mulberry32 PRNG for seedable randomness
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple syllable banks for builder mode
const SYL = {
  onset: ["", "b", "c", "d", "f", "g", "gr", "h", "j", "k", "kh", "kr", "l", "m", "n", "p", "q", "r", "s", "sh", "t", "th", "tr", "v", "w", "y", "z"],
  vowel: ["a", "e", "i", "o", "u", "ae", "ia", "ei", "ou", "aa", "ua", "io"],
  coda: ["", "l", "n", "r", "s", "th", "sh", "m", "nd", "rk", "n", "r", "x"],
};

// Light-touch stylistic transforms
function styleTransform(name, style) {
  const n = name.toLowerCase();
  switch (style) {
    case "Elven":
      return n
        .replace(/k/g, "c")
        .replace(/oo/g, "u")
        .replace(/th/g, "dh")
        .replace(/([aeiou])([lr])/g, "$1'$2")
        .replace(/^./, (c) => c.toUpperCase());
    case "Dwarven":
      return n
        .replace(/v/g, "f")
        .replace(/th/g, "d")
        .replace(/([aeiou])$/g, "$1r")
        .replace(/^./, (c) => c.toUpperCase());
    case "Orcish":
      return n
        .replace(/[aeiou]$/g, "ag")
        .replace(/s/g, "z")
        .replace(/r/g, "rg")
        .replace(/^./, (c) => c.toUpperCase());
    default:
      return n.replace(/^./, (c) => c.toUpperCase());
  }
}

// Build a simple first-order Markov model from tokens
function buildMarkov(tokens) {
  const map = new Map();
  const START = "^";
  const END = "$";

  for (const raw of tokens) {
    const s = `^${raw.toLowerCase()}$`;
    for (let i = 0; i < s.length - 1; i++) {
      const a = s[i],
        b = s[i + 1];
      if (!map.has(a)) map.set(a, {});
      map.get(a)[b] = (map.get(a)[b] || 0) + 1;
    }
  }
  // Normalize to arrays for sampling
  const model = {};
  for (const [k, obj] of map.entries()) {
    const letters = Object.keys(obj);
    const weights = letters.map((x) => obj[x]);
    const total = weights.reduce((a, b) => a + b, 0);
    const probs = weights.map((w) => w / total);
    model[k] = { letters, probs };
  }
  return { model, START, END };
}

function sampleMarkov(m, rand, minLen = 3, maxLen = 12) {
  const { model, START, END } = m;
  let cur = START;
  let out = "";
  for (let i = 0; i < maxLen + 2; i++) {
    const node = model[cur];
    if (!node) break;
    // weighted sample
    const r = rand();
    let acc = 0;
    let pick = node.letters[node.letters.length - 1];
    for (let j = 0; j < node.letters.length; j++) {
      acc += node.probs[j];
      if (r <= acc) {
        pick = node.letters[j];
        break;
      }
    }
    if (pick === END) break;
    out += pick;
    cur = pick;
  }
  if (out.length < minLen) return sampleMarkov(m, rand, minLen, maxLen);
  return out;
}

//
// ---------- Component ----------
//
const DEFAULT_STARTER_POOL = [
  "Aleksa","Alyss","Bela","Brynn","Elyana","Feryia","Hazel","Katya","Lyna","Miya","Natalya","Rubi","Sofi","Tylla","Valentina","Vyla","Yanna","Aksel","Andrey","Brahm","Danyel","Gabryel","Handus","Harold","Yakob","Yosef","Karlus","Lyam","Maks","Masyn","Miglus","Owyn","Ryn","Sebastyan","Teodus","Yesten"
];

export default function App() {
  // Controls
  const [count, setCount] = useLocalStorage("count", 10);
  const [unique, setUnique] = useLocalStorage("unique", true);
  const [joinFirstLast, setJoinFirstLast] = useLocalStorage("joinFirstLast", false);
  const [seed, setSeed] = useLocalStorage("seed", Date.now());
  const [style, setStyle] = useLocalStorage("style", "Human");
  const [mode, setMode] = useLocalStorage("mode", "Library"); // "Library" | "Markov" | "Syllable"

  // Data
  const [namePool, setNamePool] = useLocalStorage("namePool", DEFAULT_STARTER_POOL);
  const [extraLoaded, setExtraLoaded] = useLocalStorage("extraLoaded", false);

  // UI state
  const [current, setCurrent] = useState([]);
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useLocalStorage("favs", []);
  const [history, setHistory] = useLocalStorage("history", []);

  // Try to load extra names (one-time)
  useEffect(() => {
    if (extraLoaded) return;

    // Primary (matches README): /names_extra.txt
    fetch("/names_extra.txt")
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => {
        const more = t.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
        setNamePool((p) => Array.from(new Set([...p, ...more])));
        setExtraLoaded(true);
      })
      .catch(() => {
        // Fallback: /names-extra.txt (if user prefers hyphen)
        fetch("/names-extra.txt")
          .then((r) => (r.ok ? r.text() : Promise.reject()))
          .then((t) => {
            const more = t.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
            setNamePool((p) => Array.from(new Set([...p, ...more])));
            setExtraLoaded(true);
          })
          .catch(() => {
            // ignore if not present
          });
      });
  }, [extraLoaded, setExtraLoaded, setNamePool]);

  // Seeded RNG
  const rng = useMemo(() => mulberry32(Number(seed) || 0), [seed]);

  // Derived: filtered pool for Library/Markov
  const filteredPool = useMemo(() => {
    if (!query) return namePool;
    const q = query.toLowerCase();
    return namePool.filter((n) => n.toLowerCase().includes(q));
  }, [namePool, query]);

  // Markov model
  const markov = useMemo(() => {
    if (filteredPool.length < 20) return null;
    return buildMarkov(filteredPool);
  }, [filteredPool]);

  // Generation
  function genOneFromPool() {
    const raw = choice(filteredPool, rng) || choice(namePool, rng);
    return styleTransform(raw, style);
    }

  function genOneMarkov() {
    if (!markov) return genOneFromPool();
    const raw = sampleMarkov(markov, rng, 3, 12);
    return styleTransform(raw, style);
  }

  function genOneSyllable() {
    const parts = [
      choice(SYL.onset, rng),
      choice(SYL.vowel, rng),
      choice(SYL.coda, rng),
    ];
    // maybe add another syllable 50% of the time
    if (rng() < 0.5) {
      parts.push(choice(SYL.onset, rng), choice(SYL.vowel, rng), choice(SYL.coda, rng));
    }
    const raw = parts.join("").replace(/''+/g, "'");
    return styleTransform(raw, style);
  }

  function makeLastName() {
    // Last names: either from pool or constructed
    if (rng() < 0.6 && filteredPool.length > 0) {
      return styleTransform(choice(filteredPool, rng), style);
    }
    return styleTransform(
      choice(SYL.onset, rng) + choice(SYL.vowel, rng) + choice(SYL.coda, rng) + (rng() < 0.5 ? "son" : "var"),
      style
    );
  }

  function generate() {
    const seen = new Set();
    const out = [];
    for (let i = 0; i < count; i++) {
      let first;
      if (mode === "Library") first = genOneFromPool();
      else if (mode === "Markov") first = genOneMarkov();
      else first = genOneSyllable();

      let full = first;
      if (joinFirstLast) {
        const last = makeLastName();
        full = `${first} ${last}`;
      }

      if (unique) {
        if (seen.has(full)) {
          i--; // try again
          continue;
        }
        seen.add(full);
      }

      out.push(full);
    }
    setCurrent(out);
    setHistory((h) => [{ id: Date.now(), payload: out }, ...h].slice(0, 400));
  }

  // Actions
  function addFav(x) {
    setFavs((f) => Array.from(new Set([x, ...f])));
  }
  function copyCurrent() {
    const text = current.join(", ");
    navigator.clipboard.writeText(text);
  }
  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ namePool, favs, history }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "name-generator-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.key.toLowerCase() === "g") generate();
      if (e.key.toLowerCase() === "c") copyCurrent();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, mode, style, count, unique, joinFirstLast, query, seed]);

  // Initial autogenerate
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header>
        <div className="container row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>🧰 Fantasy Toolkit — Name Generator</h2>
          <div className="row">
            <button className="btn" onClick={generate}>Generate</button>
            <button className="btn" onClick={copyCurrent}>Copy</button>
            <button className="btn" onClick={exportData}>Export</button>
            <button className="btn" onClick={() => { localStorage.clear(); location.reload(); }}>
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="container grid">
        <aside className="card">
          <h3 className="title">Controls</h3>

          <div className="row">
            <label>How many?</label>
            <input
              className="input"
              type="number"
              min="1"
              max="200"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value || "1"))}
            />
          </div>

          <div className="row">
            <label>Mode</label>
            <select className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option>Library</option>
              <option>Markov</option>
              <option>Syllable</option>
            </select>
          </div>

          <div className="row">
            <label>Style</label>
            <select className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option>Human</option>
              <option>Elven</option>
              <option>Dwarven</option>
              <option>Orcish</option>
            </select>
          </div>

          <div className="row">
            <label>Seed</label>
            <input
              className="input"
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value || "0"))}
            />
          </div>

          <div className="row">
            <label><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> Unique</label>
            <label><input type="checkbox" checked={joinFirstLast} onChange={(e) => setJoinFirstLast(e.target.checked)} /> First + Last</label>
          </div>

          <hr />

          <details>
            <summary>Names library ({namePool.length.toLocaleString()} entries)</summary>
            <div className="small">Showing first 1,000 for performance. All names remain loaded.</div>
            <textarea
              className="input"
              value={namePool.slice(0, 1000).join("\n")}
              onChange={(e) =>
                setNamePool(e.target.value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean))
              }
            ></textarea>
            <div className="small">
              Add a big file at <code>public/names_extra.txt</code> (one per line) and hard refresh.
            </div>
          </details>

          <hr />
          <div className="row small">
            <span>Tips: Press <span className="kbd">G</span> to generate; <span className="kbd">C</span> to copy.</span>
          </div>
        </aside>

        <main>
          <Kit
            title="Name Generator"
            actions={<button className="btn" onClick={generate}>Generate</button>}
          >
            <div className="row" style={{ marginBottom: 8 }}>
              <input
                className="input"
                placeholder="Search in library..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="badge">{filteredPool.length.toLocaleString()} in library</span>
              <span className="badge">{mode}</span>
              <span className="badge">{style}</span>
            </div>

            <div className="list">
              {current.map((n, i) => (
                <div key={i} className="item row">
                  <div style={{ flex: 1 }}>{n}</div>
                  <button className="btn" onClick={() => addFav(n)}>⭐</button>
                </div>
              ))}
            </div>
          </Kit>

          <Kit title="Favorites">
            <div className="list">
              {favs.map((f, i) => (
                <div key={i} className="item row">
                  <div style={{ flex: 1 }}>{f}</div>
                  <button className="btn" onClick={() => navigator.clipboard.writeText(f)}>Copy</button>
                </div>
              ))}
            </div>
          </Kit>

          <Kit title="History (latest)">
            <div className="list">
              {history.slice(0, 100).map((h) => (
                <div key={h.id} className="item small">
                  {Array.isArray(h.payload) ? h.payload.join(", ") : String(h.payload)}
                </div>
              ))}
            </div>
          </Kit>
        </main>
      </div>

      <footer className="container small">
        Built with React + Vite. Data lives locally in your browser (no server).
      </footer>
    </>
  );
}
