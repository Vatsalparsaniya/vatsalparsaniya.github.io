const LANDING = new Date('2026-04-05T23:20:00+05:30').getTime();
const DEPARTURE = new Date('2026-03-22T00:00:00+05:30').getTime();

// ── Stars ──
const cv = document.getElementById('stars-canvas');
const cx = cv.getContext('2d');
let st = [];
function initS(){
  cv.width=innerWidth;cv.height=innerHeight;
  const n = Math.min(Math.floor(innerWidth/10), 100);
  st=[];
  for(let i=0;i<n;i++) st.push({
    x:Math.random()*cv.width,y:Math.random()*cv.height,
    r:Math.random()*1.2+.3,a:Math.random(),
    s:Math.random()*.005+.002,d:Math.random()>.5?1:-1
  });
}
function drawS(){
  cx.clearRect(0,0,cv.width,cv.height);
  for(const s of st){
    s.a+=s.s*s.d;if(s.a>=1)s.d=-1;if(s.a<=.1)s.d=1;
    cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);
    cx.fillStyle=`rgba(248,187,208,${s.a*.45})`;cx.fill();
  }
  requestAnimationFrame(drawS);
}
initS();drawS();
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(initS,200)});

// ── Hearts ──
const hEl=document.getElementById('hearts');
const emo=['💕','💗','💖','✨','🌸'];
function spH(){
  if(hEl.childElementCount>=6)return;
  const h=document.createElement('span');h.classList.add('heart');
  h.textContent=emo[Math.floor(Math.random()*emo.length)];
  h.style.left=Math.random()*100+'%';
  h.style.fontSize=(Math.random()*.4+.5)+'rem';
  const d=Math.random()*8+8;h.style.animationDuration=d+'s';
  h.style.animationDelay=Math.random()*2+'s';
  hEl.appendChild(h);setTimeout(()=>h.remove(),(d+3)*1e3);
}
setInterval(spH,2500);
for(let i=0;i<3;i++)setTimeout(spH,i*500);

// ── Flight Progress ──
const flightFill = document.getElementById('flight-fill');
const flightPlane = document.getElementById('flight-plane');
function updateFP(){
  const pct = Math.max(0, Math.min(100, ((Date.now()-DEPARTURE)/(LANDING-DEPARTURE))*100));
  if(flightFill) flightFill.style.width = pct+'%';
  if(flightPlane) flightPlane.style.left = pct+'%';
}
updateFP(); setInterval(updateFP, 60000);

// ── Scroll Reveal (unified) ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

// ── Countdown ──
const dE=document.getElementById('days'), hE=document.getElementById('hours');
const mE=document.getElementById('minutes'), sE=document.getElementById('seconds');
function updCD(){
  const diff=LANDING-Date.now();
  if(diff<=0){dE.textContent=hE.textContent=mE.textContent=sE.textContent='00';return}
  dE.textContent=String(Math.floor(diff/864e5)).padStart(2,'0');
  hE.textContent=String(Math.floor(diff%864e5/36e5)).padStart(2,'0');
  mE.textContent=String(Math.floor(diff%36e5/6e4)).padStart(2,'0');
  sE.textContent=String(Math.floor(diff%6e4/1e3)).padStart(2,'0');
}
updCD(); setInterval(updCD,1000);

// ── Rotating Messages ──
const msgs = [
  "Getting closer... I can almost plan what to eat for dinner 🍕",
  "I bet the window seat view is nice right now ✨",
  "Kolkata food coma wearing off yet? 😄",
  "I may or may not have cleaned my room for this 🧹",
  "The playlist for the drive back is ready, just saying 🎵",
  "Bangalore missed you. Okay fine, I missed you too 🙄💕",
  "Hope you saved some mishti doi for me 🍮",
  "Fun fact: I've checked the flight status 11 times today 📱",
  "The auto drivers at BLR airport won't know what hit them 🛺",
  "Almost time to argue about where to eat first 😂",
];
let mi=0;
const mEl=document.getElementById('rotating-message');
function rotM(){
  mEl.style.opacity='0';
  setTimeout(()=>{mEl.textContent=msgs[mi];mEl.style.opacity='.7';mi=(mi+1)%msgs.length},400);
}
rotM(); setInterval(rotM,5000);
