(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-slider]').forEach(slider=>{
    const track=slider.querySelector('.slides');
    const prev=slider.querySelector('.prev'), next=slider.querySelector('.next');
    const count=slider.querySelector('.count');
    const slides=()=>[...track.querySelectorAll('.slide')];
    const index=()=>Math.round(track.scrollLeft/Math.max(1,track.clientWidth));

    function update(){
      const s=slides();
      if(!s.length){slider.hidden=true;return;}
      const i=Math.min(index(),s.length-1);
      count.textContent=(i+1)+' / '+s.length;
      const one=s.length<2;
      prev.hidden=next.hidden=count.hidden=one;
    }
    function go(d){
      const n=slides().length;
      const i=(index()+d+n)%n;
      track.scrollTo({left:i*track.clientWidth,behavior:reduce.matches?'auto':'smooth'});
    }

    prev.addEventListener('click',()=>go(-1));
    next.addEventListener('click',()=>go(1));
    track.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft'){e.preventDefault();go(-1);}
      if(e.key==='ArrowRight'){e.preventDefault();go(1);}
    });
    let t;
    track.addEventListener('scroll',()=>{clearTimeout(t);t=setTimeout(update,60);});
    window.addEventListener('resize',update);

    // drop slides whose photo is missing, so placeholders never show as broken images
    track.querySelectorAll('img').forEach(img=>{
      const drop=()=>{img.closest('.slide').remove();update();};
      if(img.complete&&img.naturalWidth===0)drop();
      else img.addEventListener('error',drop);
    });
    update();
  });
})();