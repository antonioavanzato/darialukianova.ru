/* Плавное появление при скролле. Изолировано в пределах .custom-vocal-homepage.
   Если JS отключён или IntersectionObserver недоступен — весь контент остаётся
   полностью видимым (см. fallback .no-js в styles.css). */
(function(){
  var root = document.querySelector('.custom-vocal-homepage');
  if(!root) return;
  var items = root.querySelectorAll('.cvh-reveal, .cvh-x');
  if(!('IntersectionObserver' in window) || !items.length){
    items.forEach(function(el){ el.classList.add('cvh-in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('cvh-in'); io.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  items.forEach(function(el){ io.observe(el); });
})();

/* Мобильное меню: бургер ↔ X, открытие/закрытие полноэкранного меню */
(function(){
  var root = document.querySelector('.custom-vocal-homepage');
  var burger = document.getElementById('cvhBurger');
  var menu = document.getElementById('cvhMenu');
  if(!root || !burger || !menu) return;

  function setOpen(open){
    burger.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    root.classList.toggle('cvh-menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  burger.addEventListener('click', function(){
    setOpen(!menu.classList.contains('is-open'));
  });

  // клик по пункту — закрываем меню
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });

  // Esc закрывает
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
  });
})();

/* Смена цвета шапки: белая поверх баннера → тёмная на белом фоне */
(function(){
  var nav = document.querySelector('.cvh-nav');
  var banner = document.querySelector('.cvh-banner');
  if(!nav) return;
  var ticking = false;

  function update(){
    // порог переключения — почти весь баннер прокручен (минус высота шапки)
    var threshold = banner ? (banner.offsetHeight - nav.offsetHeight - 8) : 80;
    nav.classList.toggle('cvh-nav-scrolled', window.scrollY > threshold);
    ticking = false;
  }
  function onScroll(){
    if(!ticking){ window.requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', update);
  update();
})();

/* Индикатор прогресса чтения */
(function(){
  var bar = document.getElementById('cvhProgress');
  if(!bar) return;
  var ticking = false;
  function update(){
    var h = document.documentElement;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.transform = 'scaleX(' + p + ')';
    ticking = false;
  }
  function onScroll(){ if(!ticking){ requestAnimationFrame(update); ticking = true; } }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', update);
  update();
})();

/* Анимация «набегающих» счётчиков */
(function(){
  var counters = document.querySelectorAll('.cvh-count');
  if(!counters.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function run(el){
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if(reduce){ el.textContent = target + suffix; return; }
    var dur = 1600, start = null;
    function step(ts){
      if(start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3); // плавное замедление к финалу
      el.textContent = Math.round(target * eased) + suffix;
      if(t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if(!('IntersectionObserver' in window)){
    counters.forEach(run);
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: .6 });
  counters.forEach(function(el){ io.observe(el); });
})();

/* Эффект «перебора букв» при наведении на пункты меню (десктоп) */
(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var links = document.querySelectorAll('.cvh-nav-links a');
  if(!links.length) return;
  var glyphs = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ';

  links.forEach(function(link){
    var finalText = link.textContent.trim();
    link.setAttribute('data-label', finalText);

    link.addEventListener('mouseenter', function(){
      var pos = 0;
      clearInterval(link._scrambleIv);
      link._scrambleIv = setInterval(function(){
        link.textContent = finalText.split('').map(function(ch, i){
          if (ch === ' ') return ' ';
          if (i < pos) return finalText[i];
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        }).join('');
        pos += 1 / 2;
        if (pos >= finalText.length){
          clearInterval(link._scrambleIv);
          link.textContent = finalText;
        }
      }, 38);
    });

    // если увели курсор раньше — гарантированно вернём исходный текст
    link.addEventListener('mouseleave', function(){
      clearInterval(link._scrambleIv);
      link.textContent = finalText;
    });
  });
})();
