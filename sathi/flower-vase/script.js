(function(){
'use strict';
var memories=[
{text:"you showed up and the noise went quiet"},
{text:"some people feel like home before you even arrive"},
{text:"I keep replaying the small things \u2014 they were never small"},
{text:"you laugh and the whole room rearranges itself around you"},
{text:"there\u2019s a version of me that only exists when you\u2019re around"},
{text:"not every silence needs filling \u2014 ours never did"},
{text:"you turned a regular Tuesday into something I\u2019ll remember forever"},
{text:"two cities, one thread pulling us closer"},
{text:"I think the universe was just waiting for us to meet"},
{text:"you\u2019re the 2am thought that stays till morning"},
{text:"some flowers only bloom when the right person walks by"},
{text:"I didn\u2019t plan any of this \u2014 and that\u2019s the best part"},
{text:"you\u2019re not a chapter, Sathi \u2014 you\u2019re the whole story"},
{text:"this one\u2019s just because... you exist"}
];
var allFlowers=[], flowerCount=0, memIdx=0, toastTimer=null, finalShown=false;
var el=function(id){return document.getElementById(id);};
var introOverlay=el('introOverlay'),startBtn=el('startBtn'),scene=el('scene');
var fCanvas=el('flowerCanvas'),aCanvas=el('ambientCanvas'),iCanvas=el('introStars');
var hint=el('hint'),ctr=el('flowerCounter'),cntEl=el('count'),cntLabel=el('counterLabel');
var toast=el('memoryToast'),toastTxt=el('memoryText'),vaseEl=el('vaseContainer'),finalEl=el('finalReveal');
var fCtx=fCanvas.getContext('2d'),aCtx=aCanvas.getContext('2d'),iCtx=iCanvas.getContext('2d');

function hrgb(h){return{r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
function rgba(h,a){var c=hrgb(h);return'rgba('+c.r+','+c.g+','+c.b+','+a+')';}
function rnd(a,b){return Math.random()*(b-a)+a;}
function easeO(t){return 1-Math.pow(1-t,3);}
function bzPt(p0,p1,p2,p3,t){var m=1-t;return m*m*m*p0+3*m*m*t*p1+3*m*t*t*p2+t*t*t*p3;}

function resize(){
  var d=devicePixelRatio||1;
  [fCanvas,aCanvas].forEach(function(c){c.width=innerWidth*d;c.height=innerHeight*d;c.getContext('2d').setTransform(d,0,0,d,0,0);});
  iCanvas.width=innerWidth*d;iCanvas.height=innerHeight*d;iCtx.setTransform(d,0,0,d,0,0);
}
addEventListener('resize',resize);resize();

// intro stars
var stars=[];for(var si=0;si<80;si++)stars.push({x:rnd(0,innerWidth),y:rnd(0,innerHeight),r:rnd(0.3,1.8),a:Math.random(),s:rnd(0.003,0.013)});
function drawStars(){iCtx.clearRect(0,0,innerWidth,innerHeight);for(var i=0;i<stars.length;i++){var s=stars[i];s.a+=s.s*(Math.random()>0.5?1:-1);s.a=Math.max(0.1,Math.min(0.9,s.a));iCtx.beginPath();iCtx.arc(s.x,s.y,s.r,0,Math.PI*2);iCtx.fillStyle='rgba(255,250,230,'+s.a+')';iCtx.fill();}}

function getVaseTop(){return vaseEl.getBoundingClientRect().top;}
function getVaseCX(){var r=vaseEl.getBoundingClientRect();return r.left+r.width/2;}

startBtn.addEventListener('click',function(){introOverlay.classList.add('hidden');scene.classList.add('active');});
startBtn.addEventListener('touchend',function(e){e.preventDefault();introOverlay.classList.add('hidden');scene.classList.add('active');});

// fireflies
var flies=[];for(var fi=0;fi<30;fi++)flies.push({x:rnd(0,innerWidth),y:rnd(0,innerHeight),r:rnd(0.5,2.5),sp:rnd(0.1,0.3),ang:rnd(0,Math.PI*2),dr:rnd(0.002,0.007),a:Math.random(),ad:(Math.random()>0.5?1:-1)*rnd(0.003,0.011)});
function drawFlies(){
  aCtx.clearRect(0,0,innerWidth,innerHeight);
  for(var i=0;i<flies.length;i++){var f=flies[i];f.ang+=f.dr;f.x+=Math.cos(f.ang)*f.sp;f.y+=Math.sin(f.ang)*f.sp*0.6;f.a+=f.ad;if(f.a>0.8||f.a<0.05)f.ad*=-1;f.a=Math.max(0,Math.min(1,f.a));if(f.x<-10)f.x=innerWidth+10;if(f.x>innerWidth+10)f.x=-10;if(f.y<-10)f.y=innerHeight+10;if(f.y>innerHeight+10)f.y=-10;aCtx.beginPath();aCtx.arc(f.x,f.y,f.r,0,Math.PI*2);aCtx.fillStyle='rgba(255,230,180,'+f.a*0.6+')';aCtx.fill();aCtx.beginPath();aCtx.arc(f.x,f.y,f.r*5,0,Math.PI*2);aCtx.fillStyle='rgba(255,230,180,'+f.a*0.06+')';aCtx.fill();}
}

var TYPES=[
{name:'rose',base:'#e05580',light:'#f4a0b8',dark:'#a03050',center:'#d04070'},
{name:'rose',base:'#c94070',light:'#e88ca5',dark:'#901840',center:'#b03060'},
{name:'sunflower',base:'#f5c040',light:'#ffe080',dark:'#d09820',center:'#6b4410'},
{name:'lily',base:'#f0f0f0',light:'#ffffff',dark:'#d0d0d0',center:'#90c040'},
{name:'lily',base:'#f4a7bb',light:'#fcd0dd',dark:'#d07090',center:'#80b040'},
{name:'tulip',base:'#e04060',light:'#f08090',dark:'#b02040',center:'#c8e040'},
{name:'tulip',base:'#9060c0',light:'#b890e0',dark:'#6030a0',center:'#c8e040'},
{name:'tulip',base:'#ff8a65',light:'#ffb89a',dark:'#d05030',center:'#c8e040'},
{name:'cherry',base:'#f8c0d0',light:'#ffe0ea',dark:'#e090a8',center:'#f0d060'},
{name:'cherry',base:'#ffffff',light:'#ffffff',dark:'#f0d0d8',center:'#f0d060'}
];

// All flowers grow FROM the vase. Spread angle determines direction.
function Flower(spreadAngle){
  var t=TYPES[Math.floor(rnd(0,TYPES.length))];
  this.typeName=t.name;this.base=t.base;this.light=t.light;this.dark=t.dark;this.center=t.center;
  // stem grows upward from vase, max 50% of space above vase
  var maxH=getVaseTop()*0.55;
  this.stemH=Math.min(rnd(70,120)+innerHeight*0.05,maxH);
  this.sz=rnd(12,18);
  this.spreadAngle=spreadAngle; // radians from vertical, negative=left positive=right
  this.swayOff=rnd(0,Math.PI*2);this.swayAmt=rnd(1.5,3.5);
  this.grow=0;this.bloom=0;
  this.leaves=[];
  var lc=Math.floor(rnd(1,3));
  for(var i=0;i<lc;i++)this.leaves.push({t:rnd(0.25,0.6),side:Math.random()>0.5?1:-1,size:rnd(8,14),angle:rnd(0.2,0.5)});
}
Flower.prototype.update=function(){if(this.grow<1)this.grow=Math.min(1,this.grow+0.012);else if(this.bloom<1)this.bloom=Math.min(1,this.bloom+0.009);};
Flower.prototype.draw=function(ctx,time){
  var vt=getVaseTop(),vcx=getVaseCX();
  var sway=Math.sin(time*0.0007+this.swayOff)*this.swayAmt;
  var h=this.stemH*easeO(this.grow);
  var sa=this.spreadAngle+sway*0.003;
  // stem tip position: grows upward with spread
  var tipX=vcx+Math.sin(sa)*h;
  var tipY=vt-Math.cos(sa)*h;
  // control points for a nice curve
  var cp1x=vcx+Math.sin(sa*0.3)*h*0.35;
  var cp1y=vt-h*0.35;
  var cp2x=vcx+Math.sin(sa*0.7)*h*0.7+sway*0.3;
  var cp2y=vt-h*0.7;

  // stem
  ctx.save();ctx.beginPath();ctx.moveTo(vcx,vt);
  ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,tipX,tipY);
  var sg=ctx.createLinearGradient(vcx,vt,tipX,tipY);
  sg.addColorStop(0,'rgba(55,95,45,'+0.85*this.grow+')');
  sg.addColorStop(1,'rgba(75,130,60,'+0.75*this.grow+')');
  ctx.strokeStyle=sg;ctx.lineWidth=2.2;ctx.lineCap='round';ctx.stroke();ctx.restore();

  // leaves
  if(this.grow>0.25){
    var la=Math.min(1,(this.grow-0.25)/0.35);
    for(var li=0;li<this.leaves.length;li++){
      var lf=this.leaves[li];
      var lx=bzPt(vcx,cp1x,cp2x,tipX,lf.t);
      var ly=bzPt(vt,cp1y,cp2y,tipY,lf.t);
      ctx.save();ctx.translate(lx,ly);ctx.rotate(lf.side*lf.angle+sway*0.008);
      var s=lf.size*la,d=lf.side;
      ctx.beginPath();ctx.moveTo(0,0);
      ctx.bezierCurveTo(d*s*0.3,-s*0.22,d*s*0.8,-s*0.12,d*s,0);
      ctx.bezierCurveTo(d*s*0.8,s*0.12,d*s*0.3,s*0.18,0,0);
      var lg=ctx.createLinearGradient(0,0,d*s,0);
      lg.addColorStop(0,'rgba(65,125,50,'+0.7*la+')');
      lg.addColorStop(0.5,'rgba(85,155,65,'+0.6*la+')');
      lg.addColorStop(1,'rgba(55,105,40,'+0.5*la+')');
      ctx.fillStyle=lg;ctx.fill();ctx.restore();
    }
  }

  // bloom
  if(this.bloom>0){
    var bp=Math.min(1,this.bloom*1.05);
    ctx.save();ctx.translate(tipX,tipY);ctx.rotate(sa*0.3+sway*0.004);
    var gr=this.sz*3*bp;
    var grd=ctx.createRadialGradient(0,0,0,0,0,gr);
    grd.addColorStop(0,rgba(this.base,0.1*bp));grd.addColorStop(1,rgba(this.base,0));
    ctx.fillStyle=grd;ctx.fillRect(-gr,-gr,gr*2,gr*2);
    switch(this.typeName){
      case'rose':this.drawRose(ctx,bp,time);break;
      case'sunflower':this.drawSunflower(ctx,bp,time);break;
      case'lily':this.drawLily(ctx,bp,time);break;
      case'tulip':this.drawTulip(ctx,bp,time);break;
      case'cherry':this.drawCherry(ctx,bp,time);break;
    }
    ctx.restore();
  }
};
Flower.prototype.drawRose=function(ctx,bp,time){var s=this.sz;for(var layer=3;layer>=1;layer--){var lbp=Math.max(0,Math.min(1,(bp-(3-layer)*0.15)/0.7));if(lbp<=0)continue;var count=layer===3?7:layer===2?5:4,radius=s*(0.3+layer*0.25)*lbp,pH=s*(0.5+layer*0.15)*lbp,pW=s*(0.35+layer*0.08)*lbp;for(var i=0;i<count;i++){var a=(i/count)*Math.PI*2+layer*0.3,w=Math.sin(time*0.0005+i+layer)*0.02;ctx.save();ctx.rotate(a+w);ctx.translate(0,-radius*0.4);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-pW*0.6,-pH*0.3,-pW*0.5,-pH*0.9,0,-pH);ctx.bezierCurveTo(pW*0.5,-pH*0.9,pW*0.6,-pH*0.3,0,0);var pg=ctx.createLinearGradient(0,0,0,-pH);pg.addColorStop(0,rgba(this.dark,0.7*lbp));pg.addColorStop(0.4,rgba(this.base,0.75*lbp));pg.addColorStop(1,rgba(this.light,0.65*lbp));ctx.fillStyle=pg;ctx.fill();ctx.strokeStyle=rgba(this.light,0.2*lbp);ctx.lineWidth=0.5;ctx.stroke();ctx.restore();}}ctx.beginPath();ctx.arc(0,0,s*0.15*bp,0,Math.PI*2);ctx.fillStyle=rgba(this.dark,0.5*bp);ctx.fill();};
Flower.prototype.drawSunflower=function(ctx,bp,time){var s=this.sz,pLen=s*1.2*bp,pW=s*0.22*bp;for(var layer=0;layer<2;layer++){var off=layer*(Math.PI/14),len=pLen*(layer===0?1:0.85),al=layer===0?0.8:0.65;for(var i=0;i<14;i++){var a=(i/14)*Math.PI*2+off,w=Math.sin(time*0.0006+i*0.5)*0.03;ctx.save();ctx.rotate(a+w);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-pW,-len*0.3,-pW*0.7,-len*0.8,0,-len);ctx.bezierCurveTo(pW*0.7,-len*0.8,pW,-len*0.3,0,0);var pg=ctx.createLinearGradient(0,0,0,-len);pg.addColorStop(0,rgba(this.dark,al*bp));pg.addColorStop(0.5,rgba(this.base,al*bp));pg.addColorStop(1,rgba(this.light,(al-0.1)*bp));ctx.fillStyle=pg;ctx.fill();ctx.restore();}}var cR=s*0.45*bp;ctx.beginPath();ctx.arc(0,0,cR,0,Math.PI*2);var cg=ctx.createRadialGradient(0,0,0,0,0,cR);cg.addColorStop(0,rgba('#3d2008',0.9*bp));cg.addColorStop(0.7,rgba(this.center,0.85*bp));cg.addColorStop(1,rgba(this.dark,0.7*bp));ctx.fillStyle=cg;ctx.fill();var golden=Math.PI*(3-Math.sqrt(5)),seeds=Math.floor(40*bp);for(var i=0;i<seeds;i++){var r=cR*0.85*Math.sqrt(i/seeds),th=i*golden;ctx.beginPath();ctx.arc(Math.cos(th)*r,Math.sin(th)*r,1.2,0,Math.PI*2);ctx.fillStyle='rgba(80,50,10,'+0.5*bp+')';ctx.fill();}};
Flower.prototype.drawLily=function(ctx,bp,time){var s=this.sz,count=6,pLen=s*1.3*bp,pW=s*0.35*bp;for(var i=0;i<count;i++){var a=(i/count)*Math.PI*2,w=Math.sin(time*0.0005+i*1.2)*0.025;ctx.save();ctx.rotate(a+w);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-pW*0.4,-pLen*0.25,-pW*0.8,-pLen*0.6,-pW*0.2,-pLen);ctx.bezierCurveTo(0,-pLen*1.08,0,-pLen*1.08,pW*0.2,-pLen);ctx.bezierCurveTo(pW*0.8,-pLen*0.6,pW*0.4,-pLen*0.25,0,0);var pg=ctx.createLinearGradient(0,0,0,-pLen);pg.addColorStop(0,rgba(this.center,0.4*bp));pg.addColorStop(0.3,rgba(this.base,0.7*bp));pg.addColorStop(1,rgba(this.light,0.6*bp));ctx.fillStyle=pg;ctx.fill();ctx.restore();}for(var i=0;i<5;i++){var a=(i/5)*Math.PI*2+0.3,len=s*0.6*bp,sx=Math.cos(a)*len*0.8,sy=Math.sin(a)*len*0.8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(sx,sy);ctx.strokeStyle=rgba(this.center,0.5*bp);ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(sx,sy,2*bp,0,Math.PI*2);ctx.fillStyle=rgba('#c08020',0.8*bp);ctx.fill();}};
Flower.prototype.drawTulip=function(ctx,bp,time){var s=this.sz,pH=s*1.4*bp,pW=s*0.55*bp;for(var i=0;i<3;i++){var a=(i/3)*Math.PI*2+Math.PI/3,w=Math.sin(time*0.0004+i)*0.02;ctx.save();ctx.rotate(a+w);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-pW*0.7,-pH*0.15,-pW*0.9,-pH*0.6,-pW*0.15,-pH);ctx.quadraticCurveTo(0,-pH*1.05,pW*0.15,-pH);ctx.bezierCurveTo(pW*0.9,-pH*0.6,pW*0.7,-pH*0.15,0,0);ctx.fillStyle=rgba(this.dark,0.5*bp);ctx.fill();ctx.restore();}for(var i=0;i<3;i++){var a=(i/3)*Math.PI*2,w=Math.sin(time*0.0004+i*2)*0.02;ctx.save();ctx.rotate(a+w);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-pW*0.65,-pH*0.15,-pW*0.85,-pH*0.55,-pW*0.12,-pH);ctx.quadraticCurveTo(0,-pH*1.06,pW*0.12,-pH);ctx.bezierCurveTo(pW*0.85,-pH*0.55,pW*0.65,-pH*0.15,0,0);var pg=ctx.createLinearGradient(0,0,0,-pH);pg.addColorStop(0,rgba(this.dark,0.75*bp));pg.addColorStop(0.4,rgba(this.base,0.8*bp));pg.addColorStop(0.8,rgba(this.light,0.7*bp));pg.addColorStop(1,rgba(this.light,0.5*bp));ctx.fillStyle=pg;ctx.fill();ctx.restore();}ctx.beginPath();ctx.arc(0,-s*0.15*bp,s*0.08*bp,0,Math.PI*2);ctx.fillStyle=rgba(this.center,0.6*bp);ctx.fill();};
Flower.prototype.drawCherry=function(ctx,bp,time){var s=this.sz,count=5,pLen=s*0.95*bp,pW=s*0.45*bp;for(var i=0;i<count;i++){var a=(i/count)*Math.PI*2,w=Math.sin(time*0.0006+i*1.5)*0.03;ctx.save();ctx.rotate(a+w);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-pW*0.6,-pLen*0.2,-pW*0.9,-pLen*0.7,-pW*0.25,-pLen*0.92);ctx.quadraticCurveTo(0,-pLen*0.78,pW*0.25,-pLen*0.92);ctx.bezierCurveTo(pW*0.9,-pLen*0.7,pW*0.6,-pLen*0.2,0,0);var pg=ctx.createRadialGradient(0,-pLen*0.3,0,0,-pLen*0.3,pLen);pg.addColorStop(0,rgba(this.base,0.75*bp));pg.addColorStop(0.5,rgba(this.light,0.6*bp));pg.addColorStop(1,rgba(this.light,0.35*bp));ctx.fillStyle=pg;ctx.fill();ctx.restore();}for(var i=0;i<8;i++){var a=(i/8)*Math.PI*2,r=s*0.2*bp,ex=Math.cos(a)*r,ey=Math.sin(a)*r;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(ex,ey);ctx.strokeStyle=rgba(this.center,0.4*bp);ctx.lineWidth=0.7;ctx.stroke();ctx.beginPath();ctx.arc(ex,ey,1.5*bp,0,Math.PI*2);ctx.fillStyle=rgba(this.center,0.7*bp);ctx.fill();}};

// particles
var particles=[];
function spawnBurst(x,y,color){for(var i=0;i<12;i++){var a=(i/12)*Math.PI*2+rnd(-0.3,0.3),sp=rnd(1,2.2);particles.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.5,life:1,decay:rnd(0.01,0.02),size:rnd(2,4),color:color});}}
function tickParts(){for(var i=particles.length-1;i>=0;i--){var p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.03;p.vx*=0.99;p.life-=p.decay;if(p.life<=0)particles.splice(i,1);}}
function drawParts(ctx){for(var i=0;i<particles.length;i++){var p=particles[i];ctx.globalAlpha=p.life*0.6;ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();}ctx.globalAlpha=1;}

function showMemory(mem){
  if(toastTimer)clearTimeout(toastTimer);
  toast.classList.remove('show');
  void toast.offsetWidth;
  toastTxt.textContent=mem.text;
  toast.classList.add('show');
  toastTimer=setTimeout(function(){toast.classList.remove('show');},3500);
}

// Each flower gets a spread angle so they fan out from vase
function plant(){
  var mem=memories[memIdx%memories.length];memIdx++;
  // spread: alternate left/right, increasing angle
  var idx=flowerCount;
  var side=(idx%2===0)?1:-1;
  var step=Math.floor(idx/2);
  var angle=side*step*0.22+rnd(-0.08,0.08); // radians from vertical
  angle=Math.max(-1.1,Math.min(1.1,angle)); // clamp spread

  allFlowers.push(new Flower(angle));
  flowerCount++;
  cntEl.textContent=flowerCount;
  ctr.classList.add('visible');
  cntLabel.textContent=flowerCount===1?'thought bloomed':'thoughts bloomed';
  showMemory(mem);
  spawnBurst(getVaseCX(),getVaseTop()-5,TYPES[Math.floor(rnd(0,TYPES.length))].base);
  if(flowerCount===1){hint.style.transition='opacity 1s ease';hint.style.opacity='0';}
  if(flowerCount===memories.length&&!finalShown){finalShown=true;setTimeout(function(){finalEl.classList.add('visible');},4000);}
}

// tap anywhere on canvas = plant a flower from vase
fCanvas.addEventListener('click',function(){plant();});
fCanvas.addEventListener('touchstart',function(e){e.preventDefault();plant();},{passive:false});
finalEl.addEventListener('click',function(){finalEl.classList.remove('visible');});

// main loop
var introActive=true;
function animate(t){
  if(introActive){drawStars();if(introOverlay.classList.contains('hidden'))setTimeout(function(){introActive=false;},1200);}
  fCtx.clearRect(0,0,innerWidth,innerHeight);
  var vt=getVaseTop();
  // ground glow
  var gg=fCtx.createLinearGradient(0,vt-20,0,innerHeight);
  gg.addColorStop(0,'rgba(30,50,30,0)');gg.addColorStop(0.5,'rgba(30,50,30,0.08)');gg.addColorStop(1,'rgba(20,40,20,0.15)');
  fCtx.fillStyle=gg;fCtx.fillRect(0,0,innerWidth,innerHeight);
  // vase glow
  var vg=fCtx.createRadialGradient(innerWidth/2,vt+30,5,innerWidth/2,vt+30,150);
  vg.addColorStop(0,'rgba(212,165,116,0.06)');vg.addColorStop(1,'rgba(212,165,116,0)');
  fCtx.fillStyle=vg;fCtx.fillRect(0,0,innerWidth,innerHeight);
  for(var i=0;i<allFlowers.length;i++){allFlowers[i].update();allFlowers[i].draw(fCtx,t);}
  tickParts();drawParts(fCtx);drawFlies();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
})();
