// Depoimentos em slides. Progressivo: sem script o trilho rola com o dedo.
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Depoimentos em slides. O trilho rola sozinho a cada 7 s ate a primeira
     interacao (seta, arraste, foco ou toque) e ai para de vez: quem esta
     lendo nao perde o texto. Sem script o trilho continua rolavel com o dedo. */
  function depoimentos() {
    var raiz = document.querySelector('[data-depo]');
    if (!raiz) { return; }
    var trilho = raiz.querySelector('[data-depo-trilho]');
    var prev = raiz.querySelector('[data-depo-prev]');
    var next = raiz.querySelector('[data-depo-next]');
    if (!trilho || !prev || !next) { return; }
    var parado = reduced;
    var modo = reduced ? 'auto' : 'smooth';
    var passo = function () {
      var item = trilho.children[0];
      return item.getBoundingClientRect().width + (parseFloat(getComputedStyle(trilho).columnGap) || 0);
    };
    var ir = function (dir) {
      var max = trilho.scrollWidth - trilho.clientWidth;
      if (dir > 0 && trilho.scrollLeft >= max - 4) { trilho.scrollTo({ left: 0, behavior: modo }); }
      else if (dir < 0 && trilho.scrollLeft <= 4) { trilho.scrollTo({ left: max, behavior: modo }); }
      else { trilho.scrollBy({ left: dir * passo(), behavior: modo }); }
    };
    var parar = function () { parado = true; };
    prev.addEventListener('click', function () { parar(); ir(-1); });
    next.addEventListener('click', function () { parar(); ir(1); });
    ['pointerdown', 'focusin', 'wheel', 'touchstart'].forEach(function (ev) {
      trilho.addEventListener(ev, parar, { passive: true });
    });
    var visivel = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; }, { threshold: 0.5 }).observe(trilho);
    }
    setInterval(function () { if (!parado && visivel && !document.hidden) { ir(1); } }, 7000);
  }

  depoimentos();
})();
