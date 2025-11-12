// Utility functions to generate content
export function choice(arr){ return arr[Math.floor(Math.random()*arr.length)] }

export function seedRandom(seed=1){
  let t = seed % 2147483647; if (t<=0) t+=2147483646;
  return ()=> (t = t*16807 % 2147483647)/2147483647;
}

export function tokenize(names){
  // split locations into tokens for remixing
  return names.map(n => n.split(/\s+|-/g)).flat().filter(Boolean);
}

export function remixLocations(base, count=100){
  const tokens = tokenize(base).filter(t=>t.length>2);
  const caps = s => s[0].toUpperCase()+s.slice(1);
  const forms = [
    (a,b,c)=>`${a} ${b}`,
    (a,b,c)=>`The ${a} ${b}`,
    (a,b,c)=>`${a}${b}`,
    (a,b,c)=>`${a} ${b} ${c}`,
    (a,b,c)=>`${a} of ${b}`,
    (a,b,c)=>`${a} ${b} ${['Forest','Jungle','River','Sea','Vale','Tower','Peaks','Spires'][Math.floor(Math.random()*8)]}`
  ];
  const out = new Set();
  let guard=0;
  while(out.size<count && guard<10000){
    guard++;
    const a = caps(choice(tokens).toLowerCase());
    const b = caps(choice(tokens).toLowerCase());
    const c = caps(choice(tokens).toLowerCase());
    const form = choice(forms);
    const v = form(a,b,c).replace(/\s+/g,' ').trim();
    if (v.length<40) out.add(v);
  }
  return Array.from(out);
}
