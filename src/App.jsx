import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Dice6, Wand2 } from 'lucide-react';

const DnDGenerator = () => {
  const [character, setCharacter] = useState(null);
  const [selectedRace, setSelectedRace] = useState('random');
  const [selectedClass, setSelectedClass] = useState('random');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingBackstory, setGeneratingBackstory] = useState(false);

  const races = [
    'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 
    'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling', 
    'Aarakocra', 'Tabaxi', 'Goliath', 'Firbolg',
    'Kenku', 'Lizardfolk', 'Triton', 'Aasimar'
  ];

  const classes = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter',
    'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer',
    'Warlock', 'Wizard', 'Artificer', 'Blood Hunter'
  ];

  const namesByRace = {
    Human: {
      first: ['Aldric', 'Brenna', 'Cedric', 'Diana', 'Ewan', 'Freya', 'Gareth', 'Helena', 'Ivan', 'Jade', 'Kael', 'Luna', 'Magnus', 'Nora', 'Owen'],
      last: ['Blackwood', 'Ironforge', 'Stormwind', 'Silverbrook', 'Thornheart', 'Ashmore', 'Brightblade', 'Darkwater', 'Goldmane', 'Highhill']
    },
    Elf: {
      first: ['Aelindor', 'Elara', 'Faelen', 'Ilyana', 'Theron', 'Lyra', 'Caelum', 'Sylvara', 'Arannis', 'Miriel', 'Elandor', 'Nessa', 'Varis', 'Elenwe'],
      last: ['Moonwhisper', 'Starweaver', 'Dawnblade', 'Nightbreeze', 'Silverleaf', 'Shadowsong', 'Lightbringer', 'Forestwalker', 'Sunfire', 'Mistdancer']
    },
    Dwarf: {
      first: ['Thorin', 'Brunhilde', 'Grimm', 'Helga', 'Balin', 'Dagmar', 'Thrain', 'Inga', 'Borin', 'Gerda', 'Rurik', 'Kathra', 'Brokk', 'Mara'],
      last: ['Stonehammer', 'Ironbeard', 'Goldseeker', 'Battleaxe', 'Deepdelver', 'Forgeborn', 'Rockfist', 'Steelshield', 'Gemcutter', 'Mountainheart']
    },
    Halfling: {
      first: ['Bilbo', 'Rosie', 'Merric', 'Lidda', 'Cade', 'Verna', 'Finnan', 'Portia', 'Reed', 'Bella', 'Pip', 'Willow', 'Roscoe', 'Marigold'],
      last: ['Goodbarrel', 'Tealeaf', 'Greenbottle', 'Thorngage', 'Underbough', 'Lightfoot', 'Nimblefingers', 'Burrows', 'Hillside', 'Sweetwater']
    },
    Dragonborn: {
      first: ['Arjhan', 'Biri', 'Donaar', 'Farideh', 'Ghesh', 'Heskan', 'Kriv', 'Medrash', 'Nadarr', 'Sora', 'Tarhun', 'Mishann', 'Patrin', 'Nala'],
      last: ['Myastan', 'Ophinshtalajiir', 'Fenkenkabradon', 'Kerrhylon', 'Turnuroth', 'Verthisathurgiesh', 'Bharaclaiev', 'Daardendrian', 'Delmirev', 'Yarjerit']
    },
    Gnome: {
      first: ['Alston', 'Breena', 'Dimble', 'Ellywick', 'Folkor', 'Nyx', 'Orryn', 'Zook', 'Warryn', 'Callybon', 'Sindri', 'Bimpnottin', 'Kellen', 'Delebean'],
      last: ['Tinkertop', 'Fizzlebang', 'Sparklegem', 'Nackle', 'Scheppen', 'Roondar', 'Timbers', 'Garrick', 'Raulnor', 'Beren']
    },
    'Half-Elf': {
      first: ['Talon', 'Seraphina', 'Kael', 'Aria', 'Rowan', 'Elara', 'Daren', 'Liora', 'Kylan', 'Nessa', 'Ash', 'Celeste', 'Finn', 'Iris'],
      last: ['Shadowend', 'Brightwater', 'Ashwood', 'Moonbrook', 'Starling', 'Ravencrest', 'Duskwalker', 'Thornwynd', 'Silverstream', 'Willowshade']
    },
    'Half-Orc': {
      first: ['Ghor', 'Ovak', 'Dench', 'Baggi', 'Thokk', 'Mhurren', 'Holg', 'Shump', 'Keth', 'Ront', 'Feng', 'Grat', 'Volen', 'Yevelda'],
      last: ['Skullcrusher', 'Bloodaxe', 'Warbringer', 'Ironhide', 'Bonecruncher', 'Goretusk', 'Grimjaw', 'Stonefist', 'Blackscar', 'Thunderstrike']
    },
    Tiefling: {
      first: ['Azazel', 'Nemeia', 'Damakos', 'Akta', 'Therai', 'Kallista', 'Morthos', 'Orianna', 'Zariel', 'Euphemia', 'Carnage', 'Delight', 'Torment', 'Sorrow'],
      last: ['Virtue: Hope', 'Virtue: Sorrow', 'Virtue: Reverence', 'Virtue: Despair', 'Virtue: Excellence', 'Virtue: Music', 'Virtue: Silence', 'Virtue: Quest', 'Virtue: Random', 'Virtue: Wit']
    },
    Aarakocra: {
      first: ['Aera', 'Quaf', 'Zeed', 'Kreeak', 'Kuura', 'Caaw', 'Reeak', 'Ssk', 'Zeek', 'Ikki', 'Heeak', 'Oorr', 'Aial', 'Quierk'],
      last: ['Cloudchaser', 'Skyscream', 'Windrider', 'Eagleclaw', 'Stormfeather', 'Highsoar', 'Talon', 'Windwhisper', 'Swiftflight', 'Sunwing']
    },
    Tabaxi: {
      first: ['Cloud', 'Rain', 'Mist', 'Shadow', 'Ember', 'Dawn', 'Moon', 'River', 'Storm', 'Frost', 'Whisper', 'Thunder', 'Breeze', 'Smoke'],
      last: ['on the Mountain', 'in the Night', 'over Water', 'through Trees', 'at Dawn', 'beneath Stars', 'of the Valley', 'at Twilight', 'in Morning', 'by Fire']
    },
    Goliath: {
      first: ['Aukan', 'Gae-Al', 'Ilikan', 'Keothi', 'Kuori', 'Lo-Kag', 'Maveith', 'Nalla', 'Vaunea', 'Thalai', 'Thuliaga', 'Uthal', 'Vimak', 'Pethani'],
      last: ['Anakalathai', 'Elanithino', 'Gathakanathi', 'Kalagiano', 'Kolae-Gileana', 'Ogolakanu', 'Thuliaga', 'Thunukalathi', 'Vaimei-Laga', 'Kalagiano']
    },
    Firbolg: {
      first: ['Adler', 'Autumn', 'Birch', 'Brook', 'Cedar', 'Daisy', 'Elm', 'Fern', 'Grove', 'Hazel', 'Iris', 'Maple', 'Oak', 'Pine'],
      last: ['Meadowkeeper', 'Forestfriend', 'Rootwalker', 'Leafwhisperer', 'Stonecarver', 'Berrybloom', 'Treestrider', 'Mossbeard', 'Earthsong', 'Wildgrowth']
    },
    Kenku: {
      first: ['Caw', 'Croak', 'Screech', 'Whistle', 'Chirp', 'Echo', 'Rattle', 'Chime', 'Click', 'Creak', 'Rustle', 'Snap', 'Trill', 'Hoot'],
      last: ['of Shadows', 'from Below', 'the Mimic', 'Echoing Voice', 'the Silent', 'Stolen Words', 'Dark Feather', 'Quick Talons', 'the Watcher', 'Memory Keeper']
    },
    Lizardfolk: {
      first: ['Achuak', 'Aryte', 'Baeshra', 'Darastrix', 'Garurt', 'Hsiska', 'Kriv', 'Mirik', 'Othokent', 'Shedinn', 'Sorassa', 'Throden', 'Usk', 'Vutha'],
      last: ['Blackscale', 'Ironclaw', 'Swiftswimmer', 'Stonehide', 'Coldfang', 'Mudwalker', 'Marshborn', 'Riverspear', 'Thicktail', 'Deepwater']
    },
    Triton: {
      first: ['Corus', 'Delnis', 'Jhimas', 'Keros', 'Molos', 'Nalos', 'Vodos', 'Zunis', 'Aryn', 'Belthyn', 'Duthyn', 'Feloren', 'Otanyn', 'Shalryn'],
      last: ['Ahlorsath', 'Pumanath', 'Vuuvaxath', 'Marirath', 'Corapath', 'Ilishath', 'Meridath', 'Urunath', 'Acelath', 'Deshalth']
    },
    Aasimar: {
      first: ['Arken', 'Ariel', 'Dara', 'Gideon', 'Lariel', 'Melech', 'Nirah', 'Oriel', 'Pheriel', 'Thariel', 'Zachariel', 'Auriel', 'Cassiel', 'Dariel'],
      last: ['Lightbringer', 'Dawnheart', 'Celestial', 'Holyfire', 'Goldwing', 'Starborn', 'Radiantheart', 'Divineshield', 'Faithkeeper', 'Gracewing']
    }
  };

  const traits = [
    'Has an unusual fear of ordinary objects',
    'Collects trophies from defeated enemies',
    'Speaks in an unusual accent or dialect',
    'Never backs down from a challenge',
    'Keeps a detailed journal of every adventure',
    'Has a lucky charm they refuse to be without',
    'Tells tall tales about past exploits',
    'Always helps those weaker than themselves',
    'Harbors a secret that could ruin them',
    'Dreams of a mysterious place they\'ve never been',
    'Obsessed with a particular food or drink',
    'Makes bad puns at inappropriate times',
    'Extremely superstitious about specific omens',
    'Can\'t resist a good mystery or puzzle',
    'Has a rivalry with another adventurer',
    'Prefers the company of animals to people',
    'Always tries to negotiate before fighting',
    'Has a distinctive laugh or mannerism',
    'Keeps count of creatures they\'ve defeated',
    'Seeks approval from a specific deity or mentor'
  ];

  const generateName = (race) => {
    const names = namesByRace[race];
    const firstName = names.first[Math.floor(Math.random() * names.first.length)];
    const lastName = names.last[Math.floor(Math.random() * names.last.length)];
    return `${firstName} ${lastName}`;
  };

  const generateAIBackstory = async (name, race, charClass, trait) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a creative D&D storyteller. Generate a unique and compelling backstory for this character:

Name: ${name}
Race: ${race}
Class: ${charClass}
Personality Trait: ${trait}

Requirements:
- Write 2-3 sentences that tell a complete story
- Include specific details (names of places, events, people, or organizations)
- Make it dramatic and emotionally engaging
- Incorporate the personality trait naturally
- Make it feel like this character has lived a real life with struggles and triumphs
- Avoid generic phrases like "seeks adventure" or "left home"
- Make every backstory completely unique and original

Write only the backstory, nothing else.`
            }
          ],
        })
      });

      const data = await response.json();
      const backstory = data.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");
      
      return backstory.trim();
    } catch (error) {
      console.error("Error generating backstory:", error);
      return "A mysterious figure whose past remains shrouded in shadow, seeking purpose in a world full of danger and opportunity.";
    }
  };

  const generateCharacter = async () => {
    setGenerating(true);
    
    const race = selectedRace === 'random' 
      ? races[Math.floor(Math.random() * races.length)]
      : selectedRace;
    
    const charClass = selectedClass === 'random'
      ? classes[Math.floor(Math.random() * classes.length)]
      : selectedClass;

    const name = generateName(race);
    const trait = traits[Math.floor(Math.random() * traits.length)];

    // Set character immediately with loading state
    setCharacter({
      name,
      race,
      class: charClass,
      backstory: "Conjuring your character's tale...",
      trait,
      loading: true
    });

    setGenerating(false);

    // Generate backstory in background
    const backstory = await generateAIBackstory(name, race, charClass, trait);
    
    setCharacter({
      name,
      race,
      class: charClass,
      backstory,
      trait,
      loading: false
    });
  };

  const copyToClipboard = () => {
    if (!character) return;
    
    const text = `${character.name}
${character.race} ${character.class}

${character.backstory}

Trait: ${character.trait}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateName = () => {
    if (!character) return;
    setCharacter({
      ...character,
      name: generateName(character.race)
    });
  };

  const regenerateBackstory = async () => {
    if (!character) return;
    
    setGeneratingBackstory(true);
    const newTrait = traits[Math.floor(Math.random() * traits.length)];
    
    setCharacter({
      ...character,
      backstory: "Conjuring a new tale...",
      trait: newTrait,
      loading: true
    });

    const backstory = await generateAIBackstory(
      character.name,
      character.race,
      character.class,
      newTrait
    );
    
    setCharacter({
      ...character,
      backstory,
      trait: newTrait,
      loading: false
    });
    setGeneratingBackstory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wand2 className="text-purple-400" size={32} />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-amber-400 bg-clip-text text-transparent">
              D&D Character Generator
            </h1>
          </div>
          <p className="text-purple-300 text-lg">Powered by AI • Infinite Possibilities</p>
          <p className="text-purple-400 text-sm mt-1">Every backstory is unique and original</p>
        </div>

        {/* Controls */}
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 mb-6 border border-purple-500/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-300">Race</label>
              <select 
                value={selectedRace}
                onChange={(e) => setSelectedRace(e.target.value)}
                className="w-full bg-slate-800 border border-purple-500/50 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="random">Random</option>
                {races.map(race => (
                  <option key={race} value={race}>{race}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-300">Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-800 border border-purple-500/50 rounded px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="random">Random</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateCharacter}
            disabled={generating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Dice6 size={20} />
                Generate Character
              </>
            )}
          </button>
        </div>

        {/* Character Card */}
        {character && (
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-amber-500/30 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-bold text-amber-400">{character.name}</h2>
                  <button
                    onClick={regenerateName}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Regenerate name"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
                <p className="text-xl text-purple-300">{character.race} {character.class}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
              </button>
            </div>

            <div className="border-t border-purple-500/30 pt-4">
              <div className="flex items-start gap-2 mb-3">
                <h3 className="text-lg font-semibold text-amber-300 flex-shrink-0">Backstory</h3>
                <button
                  onClick={regenerateBackstory}
                  disabled={generatingBackstory}
                  className="text-purple-400 hover:text-purple-300 transition-colors mt-1 disabled:opacity-50"
                  title="Regenerate backstory"
                >
                  <RefreshCw size={16} className={generatingBackstory ? "animate-spin" : ""} />
                </button>
              </div>
              <p className={`text-gray-300 mb-4 leading-relaxed ${character.loading ? 'italic opacity-70' : ''}`}>
                {character.backstory}
              </p>
              
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Personality Trait</h3>
              <p className="text-gray-300 italic">"{character.trait}"</p>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/30 flex items-center gap-2 text-sm text-purple-400">
              <Sparkles size={16} />
              <span>AI-Generated • Completely Unique</span>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!character && (
          <div className="text-center py-16 text-purple-300">
            <Dice6 size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">Roll the dice to create your character</p>
            <p className="text-sm text-purple-400">Each backstory is crafted by AI and never repeated</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DnDGenerator;
