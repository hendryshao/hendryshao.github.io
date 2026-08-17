(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveal ---------- */
  var rv = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rv.forEach(function(el){ io.observe(el); });
  }

  /* ---------- pointer spotlight on cards ---------- */
  document.querySelectorAll('.card').forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- hero constellation ---------- */
  var cv = document.getElementById('net');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var nodes = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var pointer = { x: -9999, y: -9999 };

  function size(){
    var r = cv.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var target = Math.min(70, Math.max(26, Math.round(w * h / 17000)));
    nodes = [];
    for (var i = 0; i < target; i++){
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.4 + .7
      });
    }
  }

  function frame(){
    ctx.clearRect(0, 0, w, h);
    var LINK = 138;
    for (var i = 0; i < nodes.length; i++){
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      for (var j = i + 1; j < nodes.length; j++){
        var m = nodes[j], dx = n.x - m.x, dy = n.y - m.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK){
          var t = 1 - Math.sqrt(d2) / LINK;
          ctx.strokeStyle = 'rgba(124,140,255,' + (t * 0.20).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }

      var pdx = n.x - pointer.x, pdy = n.y - pointer.y;
      var near = pdx * pdx + pdy * pdy < 150 * 150;
      ctx.fillStyle = near ? 'rgba(55,229,208,.85)' : 'rgba(160,175,255,.42)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  var raf = null;
  function start(){ if (!raf) raf = requestAnimationFrame(frame); }
  function stop(){ if (raf){ cancelAnimationFrame(raf); raf = null; } }

  size();
  window.addEventListener('resize', function(){ size(); if (reduce) drawStatic(); });
  window.addEventListener('pointermove', function(e){
    var r = cv.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  });

  function drawStatic(){
    // one still frame: the composition without the motion
    var v = nodes.map(function(n){ return n; });
    ctx.clearRect(0,0,w,h);
    for (var i=0;i<v.length;i++){
      for (var j=i+1;j<v.length;j++){
        var dx=v[i].x-v[j].x, dy=v[i].y-v[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<138){ ctx.strokeStyle='rgba(124,140,255,'+((1-d/138)*0.20).toFixed(3)+')';
          ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(v[i].x,v[i].y); ctx.lineTo(v[j].x,v[j].y); ctx.stroke(); }
      }
      ctx.fillStyle='rgba(160,175,255,.42)';
      ctx.beginPath(); ctx.arc(v[i].x,v[i].y,v[i].r,0,Math.PI*2); ctx.fill();
    }
  }

  if (reduce){ drawStatic(); }
  else {
    start();
    // don't burn cycles when the hero is off-screen or the tab is hidden
    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){ e.isIntersecting ? start() : stop(); });
      }, { threshold: 0 }).observe(cv);
    }
    document.addEventListener('visibilitychange', function(){
      document.hidden ? stop() : start();
    });
  }
})();
