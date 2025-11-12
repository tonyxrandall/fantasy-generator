import React, { useEffect, useMemo, useState } from 'react'
import Kit from './components/Kit'
import jobsData from './data/jobs.json'
import baseLocations from './data/locations.base.json'
import { remixLocations, choice } from './utils/generate'

const TABS = ['Names','Jobs','Items','Locations','NPCs','Settings']

function useLocalStorage(key, initial){
  const [val, setVal] = useState(()=>{
    try{ const s = localStorage.getItem(key); return s? JSON.parse(s): initial } catch { return initial }
  })
  useEffect(()=>{ localStorage.setItem(key, JSON.stringify(val)) }, [key,val])
  return [val,setVal]
}

export default function App(){
  const [tab,setTab] = useLocalStorage('tab','Names')
  const [seed,setSeed] = useLocalStorage('seed', Date.now())
  const [history,setHistory] = useLocalStorage('history', [])
  const [favs,setFavs] = useLocalStorage('favs', [])
  const [extraNames,setExtraNames] = useLocalStorage('extraNamesLoaded', false)
  const [namePool,setNamePool] = useLocalStorage('namePool', [
    'Aleksa','Alyss','Bela','Brynn','Elyana','Feryia','Hazel','Katya','Lyna','Miya','Natalya','Rubi','Sofi','Tylla','Valentina','Vyla','Yanna','Aksel','Andrey','Brahm','Danyel','Gabryel','Handus','Harold','Yakob','Yosef','Karlus','Lyam','Maks','Masyn','Miglus','Owyn','Ryn','Sebastyan','Teodus','Yesten'
  ])

  // lazy-load huge names file once
  useEffect(()=>{
    if(!extraNames){
      fetch('/names_extra.txt').then(r=>r.text()).then(t=>{
        const more = t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
        setNamePool(p=>Array.from(new Set([...p, ...more])))
        setExtraNames(true)
      }).catch(()=>{})
    }
  }, [extraNames, setExtraNames, setNamePool])

  const [items,setItems] = useLocalStorage('items',[
    'Iron dagger','Healing draught','Rope of knotted silk','Lantern of embers','Traveler\'s cloak','Explorer\'s kit','Glittering gem','Runed ring','Lucky charm','Spellscroll fragment'
  ])

  const [locations,setLocations] = useLocalStorage('locations', ()=>{
    const remix = remixLocations(baseLocations, 250)
    return Array.from(new Set([...baseLocations, ...remix]))
  })

  const [count,setCount] = useLocalStorage('count',10)

  function addFav(x){
    setFavs(f=> Array.from(new Set([x, ...f])))
  }
  function addHistory(kind, payload){
    const row = { id: Date.now(), kind, payload }
    setHistory(h=> [row, ...h].slice(0,500))
  }
  function copy(x){
    navigator.clipboard.writeText(Array.isArray(x)? x.join(', '): String(x))
  }

  function generateNames(){
    const out = []
    for (let i=0;i<count;i++){
      out.push(choice(namePool))
    }
    addHistory('names', out)
    return out
  }
  function generateJobs(){
    const cats = Object.keys(jobsData)
    const out = []
    for(let i=0;i<count;i++){
      const c = choice(cats)
      const job = choice(jobsData[c])
      out.push(`${job} (${c})`)
    }
    addHistory('jobs', out)
    return out
  }
  function generateItems(){
    const out = []
    for(let i=0;i<count;i++){
      out.push(choice(items))
    }
    addHistory('items', out)
    return out
  }
  function generateLocations(){
    const out = []
    for(let i=0;i<count;i++){
      out.push(choice(locations))
    }
    addHistory('locations', out)
    return out
  }
  function generateNPCs(){
    const out = []
    for(let i=0;i<count;i++){
      out.push({
        name: choice(namePool),
        job: (()=>{ const c = choice(Object.keys(jobsData)); return `${choice(jobsData[c])} (${c})` })(),
        home: choice(locations),
        item: choice(items)
      })
    }
    addHistory('npcs', out)
    return out
  }

  const [current,setCurrent] = useState([])

  function run(){
    switch(tab){
      case 'Names': setCurrent(generateNames()); break;
      case 'Jobs': setCurrent(generateJobs()); break;
      case 'Items': setCurrent(generateItems()); break;
      case 'Locations': setCurrent(generateLocations()); break;
      case 'NPCs': setCurrent(generateNPCs()); break;
    }
  }

  useEffect(()=>{ run() },[]) // initial

  return (
    <>
      <header>
        <div className="container row" style={{justifyContent:'space-between'}}>
          <h2 style={{margin:0}}>🧰 Fantasy Toolkit — Generators</h2>
          <div className="tabbar">
            {TABS.map(t=>(
              <button key={t} className={"tab "+(tab===t?'active':'')} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="container grid">
        <aside className="card">
          <h3 className="title">Controls</h3>
          <div className="row">
            <label>How many?</label>
            <input className="input" type="number" min="1" max="100" value={count} onChange={e=>setCount(parseInt(e.target.value||'1'))}/>
          </div>
          <div className="toolbar">
            <button className="btn" onClick={run}>Generate</button>
            <button className="btn" onClick={()=>copy(current)}>Copy</button>
            <button className="btn" onClick={()=>setFavs(f=>Array.from(new Set([...(Array.isArray(current)? current: [current]), ...f])))}>⭐ Save to Favorites</button>
          </div>
          <hr/>
          <details>
            <summary>Items library</summary>
            <textarea className="input" value={items.join('\n')} onChange={e=>setItems(e.target.value.split(/\r?\n/).filter(Boolean))}></textarea>
            <div className="small">One per line</div>
          </details>
          <details>
            <summary>Locations library</summary>
            <textarea className="input" value={locations.join('\n')} onChange={e=>setLocations(e.target.value.split(/\r?\n/).filter(Boolean))}></textarea>
          </details>
          <details>
            <summary>Names library ({namePool.length.toLocaleString()} entries)</summary>
            <textarea className="input" value={namePool.slice(0,1000).join('\n')} onChange={e=>setNamePool(e.target.value.split(/\r?\n/).filter(Boolean))}></textarea>
            <div className="small">Viewing first 1,000 to keep the page snappy. All names are still in memory.</div>
          </details>
          <hr/>
          <div className="row small">
            <span>Tips: Press <span className="kbd">G</span> to generate; <span className="kbd">C</span> to copy.</span>
          </div>
        </aside>

        <main>
          {tab==='Names' && (
            <Kit title="Name Generator" actions={<button className="btn" onClick={run}>Generate</button>}>
              <div className="list">
                {current.map((n,i)=>(
                  <div key={i} className="item row">
                    <div style={{flex:1}}>{n}</div>
                    <button className="btn" onClick={()=>addFav(n)}>⭐</button>
                  </div>
                ))}
              </div>
            </Kit>
          )}

          {tab==='Jobs' && (
            <Kit title="Jobs Generator" actions={<button className="btn" onClick={run}>Generate</button>}>
              <div className="list">
                {current.map((n,i)=>(
                  <div key={i} className="item row">
                    <div style={{flex:1}}>{n}</div>
                    <button className="btn" onClick={()=>addFav(n)}>⭐</button>
                  </div>
                ))}
              </div>
            </Kit>
          )}

          {tab==='Items' && (
            <Kit title="Item Generator" actions={<button className="btn" onClick={run}>Generate</button>}>
              <div className="list">
                {current.map((n,i)=>(
                  <div key={i} className="item row">
                    <div style={{flex:1}}>{n}</div>
                    <button className="btn" onClick={()=>addFav(n)}>⭐</button>
                  </div>
                ))}
              </div>
            </Kit>
          )}

          {tab==='Locations' && (
            <Kit title="Location Generator" actions={<button className="btn" onClick={run}>Generate</button>}>
              <div className="list">
                {current.map((n,i)=>(
                  <div key={i} className="item row">
                    <div style={{flex:1}}>{n}</div>
                    <button className="btn" onClick={()=>addFav(n)}>⭐</button>
                  </div>
                ))}
              </div>
            </Kit>
          )}

          {tab==='NPCs' && (
            <Kit title="NPC Generator" actions={<button className="btn" onClick={run}>Generate</button>}>
              <div className="list">
                {current.map((o,i)=>(
                  <div key={i} className="item">
                    <div className="row" style={{justifyContent:'space-between'}}>
                      <strong>{o.name}</strong>
                      <button className="btn" onClick={()=>addFav(`${o.name} — ${o.job}, ${o.home}; carries ${o.item}`)}>⭐</button>
                    </div>
                    <div className="small">{o.job}</div>
                    <div className="small">{o.home}</div>
                    <div className="small">Item: {o.item}</div>
                  </div>
                ))}
              </div>
            </Kit>
          )}

          {tab==='Settings' && (
            <Kit title="Settings">
              <div className="row">
                <label>Seed (not required):</label>
                <input className="input" type="number" value={seed} onChange={e=>setSeed(parseInt(e.target.value||'0'))}/>
              </div>
              <div className="toolbar">
                <button className="btn" onClick={()=>{localStorage.clear(); location.reload()}}>Reset all data</button>
                <button className="btn" onClick={()=>{
                  const blob = new Blob([JSON.stringify({history,favs,items,locations,namePool},null,2)], {type:'application/json'})
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a'); a.href=url; a.download='fantasy-toolkit-export.json'; a.click(); URL.revokeObjectURL(url)
                }}>Export data</button>
              </div>
              <hr/>
              <h4>Favorites</h4>
              <div className="list">
                {favs.map((f,i)=>(<div key={i} className="item row"><div style={{flex:1}}>{typeof f==='string'?f:JSON.stringify(f)}</div><button className="btn" onClick={()=>copy(typeof f==='string'?f:JSON.stringify(f))}>Copy</button></div>))}
              </div>
              <hr/>
              <h4>History</h4>
              <div className="list">
                {history.slice(0,100).map(h=>(<div key={h.id} className="item small">{h.kind}: {typeof h.payload==='string'?h.payload: Array.isArray(h.payload)? h.payload.join(', '): JSON.stringify(h.payload)}</div>))}
              </div>
            </Kit>
          )}
        </main>
      </div>

      <footer className="container small">
        Built with React + Vite. Data lives locally in your browser (no server).
      </footer>
    </>
  )
}
