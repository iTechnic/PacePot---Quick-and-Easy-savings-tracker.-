/* ============================================================
   PacePot, cursor-lit grid (shared by the SEO, calculator and
   blog pages). The app (index.html) carries its own copy inline,
   because that file's later <script> blocks have historically been
   skipped by Opera GX and its version is verified working.

   Draws the same 88px ground grid in the accent colour and reveals
   it only through a soft radial mask that eases toward the pointer.
   One element, one mask, no per-line DOM. The rAF loop runs only
   while the light is catching up, so an idle cursor costs nothing.
   ============================================================ */
(function initGridGlow() {
  if (!window.matchMedia) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;

  function start() {
    if (document.querySelector('.grid-glow')) return;
    var el = document.createElement('div');
    el.className = 'grid-glow';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);

    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, lit = false;
    var EASE = 0.14;

    function put(x, y) {
      root.style.setProperty('--gx', x.toFixed(1) + 'px');
      root.style.setProperty('--gy', y.toFixed(1) + 'px');
    }

    function loop() {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      put(cx, cy);
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      if (!lit) {
        // Light up where the cursor already is, rather than flying in
        // from wherever it was last seen.
        lit = true; cx = tx; cy = ty;
        put(cx, cy);
        root.classList.add('grid-lit');
      }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    function douse() {
      lit = false;
      root.classList.remove('grid-lit');
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }
    document.addEventListener('mouseleave', douse);
    window.addEventListener('blur', douse);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
