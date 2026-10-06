(function(){
  const hero=document.querySelector('.hero');
  const cv=document.getElementById('forest');
  const ctx=cv.getContext('2d');
  const scene=document.createElement('canvas');
  const small=document.createElement('canvas');
  const readoutValue=document.querySelector('.readout .value');
  const blocks=[48,24,12,6,1];
  const labels=['25 km','12.5 km','6.25 km','3.13 km','1.56 km'];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let timers=[];

  function rng(seed){return function(){seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

  function palette(){
    const s=getComputedStyle(document.documentElement);
    const g=n=>s.getPropertyValue(n).trim();
    return{top:g('--sky-top'),bot:g('--sky-bot'),fog:g('--fog'),layers:[1,2,3,4,5].map(i=>g('--ridge-'+i))};
  }

  function conifer(c,x,yb,h,w){
    const tiers=4;
    c.beginPath();
    c.moveTo(x,yb-h);
    for(let i=1;i<=tiers;i++){
      const y=yb-h+h*0.92*i/tiers, wi=w*i/tiers;
      c.lineTo(x+wi,y);
      if(i<tiers)c.lineTo(x+wi*0.45,y);
    }
    c.lineTo(x+w*0.12,yb);c.lineTo(x-w*0.12,yb);
    for(let i=tiers;i>=1;i--){
      const y=yb-h+h*0.92*i/tiers, wi=w*i/tiers;
      if(i<tiers)c.lineTo(x-wi*0.45,y);
      c.lineTo(x-wi,y);
    }
    c.closePath();c.fill();
  }

  let topFrac=0.6;
  function renderScene(W,H){
    scene.width=W;scene.height=H;
    const c=scene.getContext('2d'), p=palette(), r=rng(11);
    const sky=c.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,p.top);sky.addColorStop(1,p.bot);
    c.fillStyle=sky;c.fillRect(0,0,W,H);
    const n=p.layers.length;
    for(let L=0;L<n;L++){
      const d=L/(n-1);
      const base=H*(topFrac+d*(0.87-topFrac)), amp=H*(0.07-d*0.035);
      const ph=[r()*6.28,r()*6.28,r()*6.28];
      const ridge=x=>base-amp*(Math.sin(x/W*3.1+ph[0])*0.6+Math.sin(x/W*7.3+ph[1])*0.3+Math.sin(x/W*17+ph[2])*0.1);
      c.fillStyle=p.layers[L];
      c.beginPath();c.moveTo(0,H);
      for(let x=0;x<=W;x+=4)c.lineTo(x,ridge(x));
      c.lineTo(W,H);c.closePath();c.fill();
      const th=H*(0.03+d*0.1), sp=th*0.3;
      for(let x=-sp;x<W+sp;x+=sp*(0.55+r()*0.8)){
        const h=th*(0.55+r()*0.7);
        conifer(c,x,ridge(x)+h*0.1,h,h*0.21);
      }
      if(L<n-1){
        const y0=base-H*0.03, y1=base+H*0.13;
        const f=c.createLinearGradient(0,y0,0,y1);
        f.addColorStop(0,'rgba('+p.fog+',0)');
        f.addColorStop(1,'rgba('+p.fog+',0.5)');
        c.fillStyle=f;c.fillRect(0,y0,W,y1-y0);
      }
    }
  }

  function show(i){
    const W=cv.width,H=cv.height,dpr=W/cv.clientWidth||1,b=blocks[i];
    readoutValue.textContent=labels[i];
    if(b===1){ctx.imageSmoothingEnabled=true;ctx.drawImage(scene,0,0);return;}
    small.width=Math.max(1,Math.ceil(W/(b*dpr)));
    small.height=Math.max(1,Math.ceil(H/(b*dpr)));
    const s=small.getContext('2d');
    s.imageSmoothingEnabled=true;s.imageSmoothingQuality='high';
    s.drawImage(scene,0,0,small.width,small.height);
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(small,0,0,small.width*b*dpr,small.height*b*dpr);
  }

  function size(){
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const tb=document.querySelector('.hero-text').getBoundingClientRect().bottom-hero.getBoundingClientRect().top;
    topFrac=Math.min(0.78,Math.max(0.6,tb/hero.clientHeight+0.1));
    cv.width=Math.round(hero.clientWidth*dpr);
    cv.height=Math.round(hero.clientHeight*dpr);
    renderScene(cv.width,cv.height);
  }

  function play(){
    timers.forEach(clearTimeout);timers=[];
    if(reduce.matches){show(blocks.length-1);return;}
    show(0);
    for(let i=1;i<blocks.length;i++)timers.push(setTimeout(()=>show(i),300+i*450));
  }

  size();play();
  document.querySelector('.readout').addEventListener('click',play);
  let rt;
  window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{timers.forEach(clearTimeout);size();show(blocks.length-1);},150);});
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{size();show(blocks.length-1);});
  new MutationObserver(()=>{size();show(blocks.length-1);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
