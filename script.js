// ✏️ EDIT YOUR SQUAD HERE: change names, roles and bios.
// To add a photo, add  photo:"images/name.jpg"  to a player.
const teams=[
  {id:'bb',team:'BLACKBULL',game:'Mobile Legends: Bang Bang',short:'MLBB',color:'#f5b335',tag:'Rule the Land of Dawn.',icons:['⚔️','🛡️','👑'],emblem:`<svg viewBox="0 0 64 64"><path d="M32 5l21 8v17c0 14-9 24-21 29C20 54 11 44 11 30V13z" fill="none" stroke="var(--accent)" stroke-width="3"/><path d="M32 17l4.5 9.5 10.5 1.3-7.7 7.2 2 10.4L32 40l-9.3 5.4 2-10.4-7.7-7.2 10.5-1.3z" fill="var(--accent)"/></svg>`,members:[
    {name:"Chiko",role:"Mid",bio:"Front line and shot caller.",photo:"images/Chiko.jpg"},
    {name:"Aiko",role:"Jungle",bio:"Late game Vai all.",photo:"images/Aiko.jpg"},
    {name:"Poji",role:"Roam",bio:"Late game ke vai ktub.",photo:"images/Poji.jpg"},
    {name:"Mastero",role:"Goldland",bio:"Burst damage from the back.",photo:"images/Mastero.jpg"}]},
  {id:'nxv',team:'NEXORA',game:'Valorant',short:'Valorant',color:'#ff4655',tag:'Aim. Clutch. Repeat.',icons:['🎯','💥','🔺'],emblem:`<svg viewBox="0 0 64 64"><path d="M4 12h15l13 28 13-28h15L40 56H24z" fill="var(--accent)"/><path d="M26 12h12l-6 13z" fill="var(--bg)"/></svg>`,members:[
    {name:"Chiko",role:"Duelist",bio:"Entry fragger.",photo:"images/Chiko.jpg"},
    {name:"Aiko",role:"Controller",bio:"Owns the smokes and the map.",photo:"images/Aiko.jpg"},
    {name:"Mastero",role:"Sentinel",bio:"Locks down the site.",photo:"images/Mastero.jpg"}]},
  {id:'nxb',team:'NEXORA',game:'Bloodstrike',short:'Bloodstrike',color:'#ff7a1a',tag:'Drop in. Strike hard.',icons:['🔫','🔥','💀'],emblem:`<svg viewBox="0 0 64 64" fill="none" stroke="var(--accent)" stroke-width="3"><circle cx="32" cy="32" r="18"/><path d="M32 4v16M32 44v16M4 32h16M44 32h16"/><circle cx="32" cy="32" r="3" fill="var(--accent)"/></svg>`,members:[
    {name:"Chiko",role:"Banh1vs4",bio:"Pushes the pace.",photo:"images/Chiko.jpg"},
    {name:"Aiko",role:"Buff-RUN",bio:"Keeps the squad alive.",photo:"images/Aiko.jpg"},
    {name:"Mastero",role:"Banned-Account",bio:"Long range control.",photo:"images/Mastero.jpg"}]}
];

const grid=document.getElementById('grid'),chips=document.getElementById('chips'),q=document.getElementById('q'),empty=document.getElementById('empty'),file=document.getElementById('file');
let team=0,squad=teams[0].members,target=null,saved={};
try{saved=JSON.parse(localStorage.getItem('squad-photos')||'{}')}catch(e){}

const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const initials=n=>n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

function drawChips(){
  chips.innerHTML=teams.map((t,i)=>`<button class="chip ${i===team?'on':''}" data-i="${i}">${esc(t.team)} · ${esc(t.short)}</button>`).join('');
}

function deco(ic=teams[team].icons){
  document.getElementById('deco').innerHTML=Array.from({length:9},(_,i)=>`<span style="left:${i*11+2}%;animation-delay:${-i*2}s;animation-duration:${16+i%3*4}s">${ic[i%ic.length]}</span>`).join('');
}

function pick(i){
  team=i;squad=teams[i].members;
  document.getElementById('title').textContent=teams[i].team;
  document.getElementById('game').textContent='⚡ '+teams[i].game;
  document.getElementById('tagline').textContent=teams[i].tag;
  document.body.dataset.game=teams[i].id;
  deco();
  document.getElementById('emblem').innerHTML=teams[i].emblem;
  drawChips();render();show('squad');
}

function render(){
  const t=q.value.toLowerCase().trim();
  let list=squad.filter(m=>(m.name+m.role).toLowerCase().includes(t));
  if(list.length===3)list=[list[0],list[2],list[1]]; // 3rd player goes in the middle
  const midI=list.length===3?1:-1;
  grid.style.setProperty('--cols',Math.max(1,list.length));
  grid.innerHTML=list.map((m,i)=>{
    const k=teams[team].id+m.name,p=m.photo||saved[k];
    return `<article class="card${i===midI?' mid':''}" style="animation-delay:${i*70}ms">
      <div class="avatar" data-n="${esc(k)}" title="Click to add photo">${esc(initials(m.name))}${p?`<img src="${esc(p)}" alt="${esc(m.name)}">`:''}</div>
      <div class="name">${esc(m.name)}</div>
      <span class="role">${esc(m.role)}</span>
      <p class="bio">${esc(m.bio||'')}</p></article>`}).join('');
  empty.style.display=list.length?'none':'block';
}

chips.onclick=e=>{const b=e.target.closest('.chip');if(!b)return;pick(+b.dataset.i)};
q.oninput=render;

// click an avatar to add a photo (saved in this browser only)
grid.onclick=e=>{const a=e.target.closest('.avatar');if(!a)return;target=a.dataset.n;file.click()};
file.onchange=()=>{
  const f=file.files[0];if(!f||!target)return;
  const r=new FileReader();
  r.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas'),s=Math.min(1,400/Math.max(img.width,img.height));
      c.width=img.width*s;c.height=img.height*s;c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      saved[target]=c.toDataURL('image/jpeg',.85);
      try{localStorage.setItem('squad-photos',JSON.stringify(saved))}catch(e){}
      render();file.value='';
    };img.src=r.result;
  };r.readAsDataURL(f);
};

// ===== HOME SCREEN + VIEWS =====
const views={home:document.getElementById('home'),squad:document.getElementById('squad')};
function show(v){
  Object.entries(views).forEach(([k,el])=>el.classList.toggle('show',k===v));
  window.scrollTo({top:0,behavior:'smooth'});
}
function goHome(){
  document.body.dataset.game='home';
  deco(['🎮','⚡','🏆']);
  show('home');
}
const picks=document.getElementById('picks');
picks.innerHTML=teams.map((t,i)=>`<button class="pick" data-i="${i}" style="--c:${t.color}"><div class="pe">${t.emblem}</div><b>${esc(t.team)}</b><span>${esc(t.game)}</span><em>${t.members.length} players →</em></button>`).join('');
picks.onclick=e=>{const b=e.target.closest('.pick');if(b)pick(+b.dataset.i)};
document.getElementById('enter').onclick=()=>pick(0);
document.getElementById('back').onclick=goHome;

pick(0);
goHome();