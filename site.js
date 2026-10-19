(function(){
  // dropdown nav
  document.querySelectorAll('nav.primary ul.menu>li').forEach(function(li){
    var btn = li.querySelector('button');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var isOpen = li.classList.contains('open');
      document.querySelectorAll('nav.primary ul.menu>li.open').forEach(function(o){ o.classList.remove('open'); });
      if(!isOpen) li.classList.add('open');
    });
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('nav.primary ul.menu>li')){
      document.querySelectorAll('nav.primary ul.menu>li.open').forEach(function(o){ o.classList.remove('open'); });
    }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      document.querySelectorAll('nav.primary ul.menu>li.open').forEach(function(o){ o.classList.remove('open'); });
    }
  });

  // mobile hamburger menu (checkbox-driven): keep aria-expanded in sync,
  // close on Escape, and reset if the viewport returns to desktop width
  var navToggle = document.getElementById('navToggle');
  var navBtn = document.querySelector('.navBtn');
  if(navToggle && navBtn){
    var syncNavAria = function(){
      navBtn.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');
    };
    navToggle.addEventListener('change', syncNavAria);
    syncNavAria();
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && navToggle.checked){
        navToggle.checked = false;
        syncNavAria();
        navBtn.focus();
      }
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 900 && navToggle.checked){
        navToggle.checked = false;
        syncNavAria();
      }
    });
  }

  // symptom index (homepage only)
  var idx = document.getElementById('idx');
  if(!idx || !window.__SYMPTOM_INDEX__) return;
  var E = window.__SYMPTOM_INDEX__;
  var alpha = document.getElementById('alpha'), q = document.getElementById('q'),
      count = document.getElementById('count'), empty = document.getElementById('empty');

  var letters = [], current = '';
  E.forEach(function(e, i){
    var L = e.term[0].toUpperCase();
    if(L !== current){
      current = L; letters.push(L);
      var g = document.createElement('div');
      g.className = 'grp'; g.id = 'L' + L; g.textContent = L;
      idx.appendChild(g);
    }
    var d = document.createElement('div');
    d.className = 'ent';
    d.dataset.t = (e.term + ' ' + e.explain + ' ' + e.service).toLowerCase();
    d.dataset.l = L;
    var a = document.createElement('a');
    a.className = 'rowlink'; a.href = e.href;
    a.innerHTML = '<div><h3>' + (i+1) + '. ' + e.term + '</h3><p>' + e.explain + '</p></div><span class="svc">' + e.service + '</span>';
    d.appendChild(a);
    idx.appendChild(d);
  });

  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function(L){
    var el;
    if(letters.indexOf(L) > -1){ el = document.createElement('a'); el.href = '#L'+L; }
    else { el = document.createElement('span'); el.setAttribute('aria-hidden','true'); }
    el.textContent = L; alpha.appendChild(el);
  });

  var ents = [].slice.call(idx.querySelectorAll('.ent'));
  var grps = [].slice.call(idx.querySelectorAll('.grp'));

  q.addEventListener('input', function(){
    var t = q.value.trim().toLowerCase();
    var shown = 0, seen = {};
    ents.forEach(function(d){
      var hit = !t || d.dataset.t.indexOf(t) > -1;
      d.classList.toggle('off', !hit);
      if(hit){ shown++; seen[d.dataset.l] = 1; }
    });
    grps.forEach(function(g){ g.style.display = seen[g.textContent] ? '' : 'none'; });
    count.textContent = shown + (shown === 1 ? ' entry' : ' entries') + (t ? ' matching' : '');
    empty.classList.toggle('off', shown > 0);
  });
})();
