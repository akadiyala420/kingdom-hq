import React,{useEffect,useMemo,useState} from "react";
import{createRoot}from"react-dom/client";
import"./style.css";

const phases=[
 ["0","First Day","Learn the game and survive your first night."],
 ["1","Foundation","Food, iron, tools and a safe home."],
 ["2","Founding","Scout and choose the capital site."],
 ["3","Settlement","Build storage, farms, homes and defenses."],
 ["4","Population","Bring villagers home and start breeding."],
 ["5","Town","Market, roads, professions and town square."],
 ["6","Royal","Castle, walls, gates and civic buildings."],
 ["7","Economy","Trading, enchanted gear and production."],
 ["8","Infrastructure","Roads, bridges, rail, boats and maps."],
 ["9","Expansion","Found and connect a second settlement."],
 ["10","Power","Nether, enchanting and advanced farms."],
 ["11","Kingdom","Landmarks, decoration, stories and celebration."]
];
const missions=[
["wood","Gather wood","Both players collect logs and make planks, sticks and a crafting table.",0,[]],
["stone","Upgrade to stone tools","Mine cobblestone and craft stone pickaxe, axe, sword and shovel.",0,["wood"]],
["food","Secure renewable food","Start wheat, carrot or potato production and keep a small animal pen.",1,["stone"]],
["night","Survive the first night","Build a shelter, light it, make beds and sleep.",1,["stone","food"]],
["scout","Scout three capital sites","Look for scenery, water, trees, food and room for expansion.",2,["night"]],
["capital","Choose the capital","Pick one site, turn on coordinates and record the location.",2,["scout"]],
["storage","Build the storage hall","Make labeled shared chests for blocks, food, ores and tools.",3,["capital"]],
["farms","Build starter farms","Crops + cows + sheep. Make food renewable.",3,["capital","food"]],
["villagers","Bring villagers home","Find a village and safely transport at least two villagers.",4,["storage","farms"]],
["breeder","Start population","Give villagers food and enough valid spare beds for breeding.",4,["villagers"]],
["square","Build the town square","Create a central road, lighting, well/fountain and gathering space.",5,["breeder"]],
["market","Open the market","Build stalls and assign useful villager professions.",5,["square"]],
["castle","Lay out the castle","Mark the footprint and build the keep/foundation.",6,["square","market"]],
["walls","Defend the capital","Build a gate, walls and at least two watchtowers.",6,["castle"]],
["trading","Start the trading hall","Prioritize librarians, farmers, armorers and toolsmiths.",7,["market"]],
["road","Connect the kingdom","Build a proper road or route to one useful location.",8,["walls","trading"]],
["map","Map the territory","Explore around the capital and record useful locations.",8,["road"]],
["outpost","Found settlement two","Choose a distinct biome and build a small outpost.",9,["map"]],
["connect","Connect both settlements","Use a road, bridge, boat route or rail.",9,["outpost","road"]],
["nether","Build the Nether gateway","Create a safe portal room and establish a return route.",10,["trading","connect"]],
["enchant","Build enchanting","Create an enchanting area and begin upgrading equipment.",10,["nether"]],
["feast","Hold the kingdom feast","Finish a landmark, decorate the square and celebrate.",11,["enchant","castle"]]
];
const resources=[
["🌲","Wood","Trees → logs → planks","Building, tools and fuel."],
["🪨","Stone","Mine exposed stone/cobblestone with a pickaxe","Tools, furnaces, roads and buildings."],
["⚫","Coal","Mine coal ore or make charcoal from logs","Torches and furnace fuel."],
["⚙️","Iron","Mine iron ore; later automate it","Buckets, shields, tools, armor and machines."],
["💎","Diamonds","Deep underground; around Y=-59 is a common modern target","High-tier gear."],
["🌾","Crops","Seeds from grass; carrots/potatoes can come from villages","Food and villager breeding."],
["🍬","Sugar Cane","Find beside water; replant beside water","Paper, books and enchanting."],
["🐄","Leather","Cows + wheat breeding","Books and food."],
["🧵","Wool","Sheep + shears; breed with wheat","Beds and decoration."],
["🟢","Emeralds","Villager trading","Kingdom currency."],
["📚","Enchanted Books","Librarian trades","Powerful equipment upgrades."]
];
const roles=[
["👑","Engineer / Explorer","Mining, mapping, exploration, transport, redstone."],
["🏗️","Architect / Steward","Farms, decoration, homes, villagers, district planning."]
];
const LS="kingdomHQ.v2";

function load(){try{return JSON.parse(localStorage.getItem(LS))||{}}catch{return {}}}
function App(){
 const [s,setS]=useState(()=>Object.assign({done:[],phase:0,projects:[],coords:[],builds:[],session:""},load()));
 const [tab,setTab]=useState("hq");
 const save=x=>{setS(x);localStorage.setItem(LS,JSON.stringify(x))};
 const completed=new Set(s.done);
 const unlocked=m=>m[4].every(id=>completed.has(id));
 const available=missions.filter(m=>!completed.has(m[0])&&unlocked(m));
 const current=available[0]||missions.find(m=>!completed.has(m[0]))||missions[missions.length-1];
 const phaseDone=missions.filter(m=>m[3]===s.phase&&completed.has(m[0])).length;
 const phaseTotal=missions.filter(m=>m[3]===s.phase).length;
 const pct=Math.round(completed.size/missions.length*100);
 function complete(id){save({...s,done:[...new Set([...s.done,id])]})}
 function toggleBuild(i){let a=s.builds.includes(i)?s.builds.filter(x=>x!==i):[...s.builds,i];save({...s,builds:a})}
 function addProject(){let v=document.getElementById("newProject")?.value.trim();if(v)save({...s,projects:[...s.projects,{text:v,done:false}]})}
 function addCoord(){let n=document.getElementById("coordN")?.value.trim(),v=document.getElementById("coordV")?.value.trim();if(n&&v)save({...s,coords:[...s.coords,{n,v}]})}
 const random=["Build a lookout on the nearest hill.","Make a tiny bridge somewhere useful.","Create a cozy two-person picnic spot.","Find a new biome and bring home a souvenir.","Build a public well in the town square.","Create a hidden royal treasure room.","Make a road sign pointing home.","Find a scenic place for the future palace.","Collect a stack of blocks for the next district.","Take a sunset screenshot of the kingdom."];
 return <div className="app">
  <header><div className="eyebrow">TWO PLAYERS • ONE WORLD</div><h1>🏰 Kingdom HQ</h1><p>Your Minecraft Bedrock campaign manager.</p>
   <div className="hero"><div><span className="label">PHASE {phases[s.phase][0]}</span><h2>{phases[s.phase][1]}</h2><p>{phases[s.phase][2]}</p></div><strong>{pct}%</strong><div className="progress"><i style={{width:pct+"%"}}/></div></div>
  </header>
  <nav>{[["hq","🏰","HQ"],["play","🎮","Play"],["learn","📖","Learn"],["build","🏙️","Build"],["more","📋","More"]].map(x=><button className={tab===x[0]?"active":""} onClick={()=>setTab(x[0])}><b>{x[1]}</b>{x[2]}</button>)}</nav>
  <main>
  {tab==="hq"&&<><Card title="🎯 Your next objective"><div className="mission">{current[1]}</div><p>{current[2]}</p><div className="chips">{unlocked(current)?<span className="chip ok">UNLOCKED</span>:<span className="chip">LOCKED — complete prerequisites</span>}<span className="chip">Phase {current[3]}</span></div><button className="primary" onClick={()=>complete(current[0])}>✓ Mark complete</button></Card>
   <Card title="🧭 Campaign"><div className="phaseScroll">{phases.map((p,i)=><button className={i===s.phase?"phase active":i<s.phase?"phase done":"phase"} onClick={()=>save({...s,phase:i})}><small>{p[0]}</small><b>{p[1]}</b></button>)}</div><p className="small">Phase progress: {phaseDone}/{phaseTotal}</p></Card>
   <div className="grid">{roles.map(r=><div className="tile"><b>{r[0]} {r[1]}</b><span>{r[2]}</span></div>)}</div>
   <Card title="📞 When your girlfriend asks “what do I do?”"><div className="notice"><b>Give one job, not a lecture.</b><br/>“Go get 32 logs.” “Build the sheep pen.” “Follow me; we're finding a village.”</div></Card>
  </>}
  {tab==="play"&&<><Card title="🎮 Tonight's 60–90 minute session"><select value={s.phase} onChange={e=>save({...s,phase:+e.target.value})}>{phases.map((p,i)=><option value={i}>Phase {p[0]} — {p[1]}</option>)}</select>{missions.filter(m=>m[3]===s.phase).map(m=><Check checked={completed.has(m[0])} text={m[1]} sub={m[2]} on={()=>completed.has(m[0])?save({...s,done:s.done.filter(x=>x!==m[0])}):complete(m[0])}/>)}</Card>
   <Card title="🎲 Side quest"><div className="mission">{random[Math.floor((Date.now()/1000)%random.length)]}</div><button onClick={()=>setS({...s,session:random[Math.floor(Math.random()*random.length)]})}>🎲 Generate another</button></Card></>}
  {tab==="learn"&&<><Card title="🎮 Minecraft 101"><Details t="The basic loop">Explore → collect → craft → build → upgrade → automate. There is no required story route in Survival.</Details><Details t="Inventory & chests">Your inventory is your backpack. Hotbar items are immediately usable. Chests are shared storage. Label them early.</Details><Details t="Tools">Pickaxe = stone/ores. Axe = wood. Shovel = dirt/sand. Hoe = crops. Sword = combat. Shears = wool. Bucket = utility.</Details><Details t="First night">Wood → stone tools → food → shelter → torches → beds. An ugly box is a successful first house.</Details><Details t="Coordinates">Enable coordinates in Bedrock. X/Z are horizontal position; Y is elevation. Record the capital, villages, mines and portals.</Details><Details t="Caves & danger">Bring food, torches, blocks, pickaxe and shield. Light as you go. Never dig straight down or straight up.</Details></Card>
   <Card title="🎒 Starter loadout"><div className="grid">{["🪓 Axe","⛏️ Pickaxe","🗡️ Sword","🪣 Bucket","🍖 Food","🔥 Torches","🧱 Blocks","🛏️ Bed"].map(x=><div className="tile">{x}</div>)}</div></Card></>}
  {tab==="build"&&<><Card title="🏙️ Capital blueprint"><div className="map"><Z t="🏰 Castle" x="42%" y="7%"/><Z t="🏛️ Square" x="39%" y="42%"/><Z t="🏠 Homes" x="5%" y="57%"/><Z t="🌾 Farms" x="5%" y="12%"/><Z t="⚒️ Industry" x="72%" y="52%"/><Z t="⚓ Harbor" x="72%" y="12%"/></div><p className="small">Grow outward from the square. Every district should have a purpose and a road connection.</p></Card>
   <Card title="🏗️ Build order">{["Central road + town square","Two houses","Storage hall","Crop fields + barn","Animal pens","Villager quarter","Market street","Defensive wall + gate","Castle foundation","Castle keep","Harbor + warehouse","Grand monument"].map((x,i)=><Check checked={s.builds.includes(i)} text={(i+1)+". "+x} on={()=>toggleBuild(i)}/>)}</Card>
   <Card title="🏘️ Districts"><div className="grid">{["🏰 Royal — castle + treasury","🏛️ Civic — square + town hall","🧺 Market — stalls + shops","🏠 Residential — homes + tavern","⚒️ Industrial — storage + machines","🌾 Agricultural — fields + barns","⚓ Harbor — docks + warehouse","🛡️ Defensive — walls + towers"].map(x=><div className="tile">{x}</div>)}</div></Card></>}
  {tab==="more"&&<><Card title="🧑‍🌾 Villager civilization"><div className="flow">🚣 Find → 🏠 Transport → 🛏️ Beds → 🥕 Food → 👶 Breed → 💼 Jobs → 💰 Trade</div><p className="small">Two adults need enough food and spare valid beds for a baby. Doors are not required.</p><table><tbody>{[["📚 Librarian","Lectern","Enchanted books"],["🌾 Farmer","Composter","Food + emeralds"],["🛡️ Armorer","Blast Furnace","Armor"],["⛏️ Toolsmith","Smithing Table","Tools"],["⚔️ Weaponsmith","Grindstone","Weapons"],["🏹 Fletcher","Fletching Table","Emeralds"],["🧱 Mason","Stonecutter","Building blocks"]].map(r=><tr><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></Card>
   <Card title="⛏️ Resource guide">{resources.map(r=><div className="resource"><span className="ico">{r[0]}</span><div><b>{r[1]}</b><br/><span>{r[2]}</span><small>{r[3]}</small></div></div>)}</Card>
   <Card title="📋 Your projects"><div className="add"><input id="newProject" placeholder="e.g. Build the western gate"/><button onClick={addProject}>Add</button></div>{s.projects.map((p,i)=><Check checked={p.done} text={p.text} on={()=>{let a=[...s.projects];a[i].done=!a[i].done;save({...s,projects:a})}}/>)}</Card>
   <Card title="📍 Royal coordinates"><div className="add"><input id="coordN" placeholder="Capital / village / mine"/><input id="coordV" placeholder="X / Y / Z"/><button onClick={addCoord}>Save</button></div>{s.coords.map((c,i)=><div className="coord"><b>{c.n}</b><span>{c.v}</span><button onClick={()=>save({...s,coords:s.coords.filter((_,j)=>j!==i)})}>×</button></div>)}</Card>
   <Card title="⚠️ Reset campaign"><p className="small">Deletes this device's saved Kingdom HQ progress.</p><button className="danger" onClick={()=>{if(confirm("Reset all Kingdom HQ progress?")){localStorage.removeItem(LS);location.reload()}}}>Reset</button></Card>
  </>}
  </main>
 </div>
}
function Card({title,children}){return <section className="card"><h2>{title}</h2>{children}</section>}
function Check({checked,text,sub,on}){return <label className={"check "+(checked?"done":"")}><input type="checkbox" checked={checked} onChange={on}/><span><b>{text}</b>{sub&&<small>{sub}</small>}</span></label>}
function Details({t,children}){return <details><summary>{t}</summary><p>{children}</p></details>}
function Z({t,x,y}){return <div className="zone" style={{left:x,top:y}}>{t}</div>}
createRoot(document.getElementById("root")).render(<App/>);
