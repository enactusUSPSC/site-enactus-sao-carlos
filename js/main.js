/* Enactus Campus São Carlos — interações do site
   1. Menu no celular
   2. Galeria: filtros por projeto
   3. Galeria: foto ampliada (lightbox)
   4. Números que contam de 0 até o valor ao aparecer na tela (como no enactus.org)
   5. Carrossel de fotos com troca automática a cada 5s (como no enactus.org) */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Menu no celular
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.site-nav');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false); }
  });
}

// 2. Galeria: filtros
const gallery = document.querySelector('[data-gallery]');
const filters = document.querySelectorAll('[data-filter]');
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.filter;
    filters.forEach((b) => b.setAttribute('aria-pressed', b === btn));
    gallery.querySelectorAll('figure').forEach((fig) => {
      fig.hidden = value !== 'Todos' && fig.dataset.project !== value;
    });
  });
});

// 3. Galeria: lightbox
const box = document.querySelector('[data-lightbox]');
if (gallery && box) {
  const img = box.querySelector('img');
  const caption = box.querySelector('.lightbox__caption');
  let items = [];
  let index = 0;
  let lastFocus = null;

  const show = (i) => {
    index = (i + items.length) % items.length;
    const fig = items[index];
    img.src = fig.querySelector('img').src;
    img.alt = fig.querySelector('img').alt;
    caption.textContent = `${fig.dataset.project} · ${index + 1} / ${items.length}`;
  };
  const open = (fig) => {
    items = [...gallery.querySelectorAll('figure:not([hidden])')];
    lastFocus = document.activeElement;
    show(items.indexOf(fig));
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lightbox__close').focus();
  };
  const close = () => {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  gallery.querySelectorAll('figure').forEach((fig) => {
    fig.tabIndex = 0;
    fig.addEventListener('click', () => open(fig));
    fig.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); } });
  });
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lightbox__next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

// 4. Contadores
// Funciona sozinho em qualquer .stat__num: lê o texto (ex.: "230+", "1.600+", "~13 mi")
// e conta de 0 até o número em 2s quando ele entra na tela. Anos (ex.: 2013) não contam.
const counters = [...document.querySelectorAll('.stat__num')].map((el) => {
  const m = el.textContent.trim().match(/^(\D*?)(\d+(?:\.\d{3})*)(?:,(\d+))?(.*)$/);
  if (!m) return null;
  const value = parseFloat(m[2].replace(/\./g, '') + (m[3] ? '.' + m[3] : ''));
  if (!m[1] && !m[4] && value >= 1900 && value <= 2100) return null; // é um ano
  return { el, prefix: m[1], suffix: m[4], value, decimals: m[3] ? m[3].length : 0, final: el.textContent };
}).filter(Boolean);

const formatNumber = (n, decimals) => n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
  const DURATION = 2000;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const run = (c) => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      c.el.textContent = c.prefix + formatNumber(c.value * easeOut(t), c.decimals) + c.suffix;
      if (t < 1) requestAnimationFrame(tick); else c.el.textContent = c.final;
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const c = counters.find((x) => x.el === entry.target);
      io.unobserve(entry.target);
      if (c) run(c);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => {
    c.el.style.fontVariantNumeric = 'tabular-nums'; // evita que o número "trema" enquanto conta
    c.el.textContent = c.prefix + formatNumber(0, c.decimals) + c.suffix;
    io.observe(c.el);
  });
}

// 5. Carrossel
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel__track');
  const originals = [...track.children];
  const INTERVAL = 5000;
  const perView = () => parseInt(getComputedStyle(carousel).getPropertyValue('--per'), 10) || 1;

  // Clona as primeiras fotos no fim para o loop ser contínuo
  originals.forEach((img) => { const c = img.cloneNode(true); c.alt = ''; c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });

  let index = 0;
  let timer = null;
  const step = () => originals[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
  const go = (i, animate = true) => {
    track.style.transition = animate ? '' : 'none';
    index = i;
    track.style.transform = `translateX(${-index * step()}px)`;
  };
  track.addEventListener('transitionend', () => {
    if (index >= originals.length) go(index - originals.length, false);
    if (index < 0) go(index + originals.length, false);
  });
  const next = () => go(index + 1);
  const prev = () => { if (index <= 0) go(originals.length, false), track.offsetWidth; go(index - 1); };

  const start = () => { if (!reduceMotion && !timer && originals.length > perView()) timer = setInterval(next, INTERVAL); };
  const stop = () => { clearInterval(timer); timer = null; };

  carousel.querySelector('.carousel__btn--next').addEventListener('click', () => { stop(); next(); start(); });
  carousel.querySelector('.carousel__btn--prev').addEventListener('click', () => { stop(); prev(); start(); });
  // Pausa quando o mouse ou o foco estão no carrossel, ou a aba está escondida
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  window.addEventListener('resize', () => go(index, false));

  // Arrastar com o dedo (celular): a foto acompanha o dedo e, ao soltar, vai para a próxima ou anterior
  const viewport = carousel.querySelector('.carousel__viewport');
  let startX = null;
  let dx = 0;
  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    startX = e.clientX; dx = 0; stop();
    track.style.transition = 'none';
  });
  viewport.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(${-index * step() + dx}px)`;
  });
  const release = () => {
    if (startX === null) return;
    startX = null;
    track.style.transition = '';
    if (dx < -40) next();
    else if (dx > 40) prev();
    else go(index);
    start();
  };
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  start();
});

// 6. Carrossel de logos: o giro é CSS e para com o mouse em cima.
//    No celular (toque) não existe "mouse em cima": um toque para e outro toque retoma.
document.querySelectorAll('[data-marquee]').forEach((m) => {
  m.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') return;
    m.classList.toggle('is-paused');
  });
});
