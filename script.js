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

