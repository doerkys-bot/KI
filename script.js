// ---------------- Canvas Sterne & Kel-Mah ----------------
const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = [];
function initStars(n = 200){
  stars.length = 0;
  for(let i=0;i<n;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.6+0.3,
      alpha: Math.random()*0.5+0.3
    });
  }
}
initStars();

let shootingStar = null;
function spawnShootingStar(){
  shootingStar = {
    x: 0,
    y: Math.random()*canvas.height*0.5,
    vx: 6 + Math.random()*3,
    vy: 1 + Math.random()*1
  };
  setTimeout(()=>shootingStar=null, 1500);
}
setInterval(()=>{ if(!shootingStar && Math.random()<0.05) spawnShootingStar(); }, 12000);

const kel = document.getElementById('kelmah');
let kelPulse = 0, kelPulseDir = 0.005;

function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const s of stars){
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fill();
  }
  if(shootingStar){
    ctx.beginPath();
    ctx.arc(shootingStar.x,shootingStar.y,3,0,Math.PI*2);
    ctx.fillStyle='white';
    ctx.fill();
    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
  }
}

function animate(){
  drawStars();
  kelPulse += kelPulseDir;
  if(kelPulse>0.12 || kelPulse<0) kelPulseDir*=-1;
  kel.style.boxShadow = `0 0 ${28+kelPulse*200}px rgba(0,243,255,0.65),0 0 6px rgba(255,255,255,0.04) inset`;
  kel.style.transform = `translate(-50%,-50%) scale(${1+kelPulse*0.2})`;
  requestAnimationFrame(animate);
}
animate();

// ---------------- Links Drag & Marquee ----------------
const links = Array.from(document.querySelectorAll('.link'));

links.forEach(link=>{
  link.style.left = Math.random()*(window.innerWidth-160)+'px';
  link.style.top = Math.random()*(window.innerHeight-80)+'px';
  link._x = parseFloat(link.style.left);
  link._y = parseFloat(link.style.top);
  link._vx = (Math.random()-0.5)*0.03;
  link._vy = (Math.random()-0.5)*0.03;
  link._dragging = false;

  const marquee = document.createElement('div');
  marquee.className='marquee';
  marquee.innerText = link.dataset.desc;
  document.body.appendChild(marquee);
  link._marquee = marquee;

  link.addEventListener('mousedown', e=>{
    link._dragging = true;
    link._offsetX = e.clientX - link._x;
    link._offsetY = e.clientY - link._y;
  });
  window.addEventListener('mousemove', e=>{
    if(link._dragging){
      link._x = e.clientX - link._offsetX;
      link._y = e.clientY - link._offsetY;
      link.style.left = link._x+'px';
      link.style.top = link._y+'px';
    }
  });
  window.addEventListener('mouseup', ()=>link._dragging=false);

  link.addEventListener('mouseover', ()=>{ showMarquee(link); });
  link.addEventListener('dblclick', ()=>{ window.location.href = link.href; });
});

function showMarquee(link){
  links.forEach(l=>l._marquee.style.display='none');
  const m = link._marquee;
  m.style.display='block';
  m.style.top = link._y + link.offsetHeight + 10 + 'px';

  // Laufrichtung abhängig von Link-Position
  const screenMid = window.innerWidth/2;
  if(link._x < screenMid){
    // Link links → Marquee von rechts nach links
    m._offset = window.innerWidth;
    m._direction = -0.2;
  } else {
    // Link rechts → Marquee von links nach rechts
    m._offset = -m.offsetWidth;
    m._direction = 0.2;
  }
  m.style.left = m._offset + 'px';
}

// Animate Marquee
function animateMarquee(){
  links.forEach(link=>{
    const m = link._marquee;
    if(m.style.display==='block'){
      m._offset += m._direction;
      m.style.left = m._offset + 'px';
      if(m._direction < 0 && m._offset + m.offsetWidth < 0) m.style.display='none';
      if(m._direction > 0 && m._offset > window.innerWidth) m.style.display='none';
    }
  });
  requestAnimationFrame(animateMarquee);
}
animateMarquee();

// ---------------- Lichtobjekt ----------------
const light = document.getElementById('lightObject');
function moveLight(){
  const startX = Math.random()*(window.innerWidth-48);
  const startY = Math.random()*(window.innerHeight-48);
  const endX = Math.random()*(window.innerWidth-48);
  const endY = Math.random()*(window.innerHeight-48);
  const duration = 25000;
  let start = performance.now();
  light.style.left = startX+'px';
  light.style.top = startY+'px';

  function animateLight(time){
    const t = (time-start)/duration;
    if(t>=1){ setTimeout(moveLight,0); return; }
    const x = startX + (endX-startX)*t;
    const y = startY + (endY-startY)*t;
    const scale = 1 + 0.1*Math.sin(t*Math.PI*2);
    light.style.left = x+'px';
    light.style.top = y+'px';
    light.style.transform = `scale(${scale})`;
    requestAnimationFrame(animateLight);
  }
  requestAnimationFrame(animateLight);
}
moveLight();
