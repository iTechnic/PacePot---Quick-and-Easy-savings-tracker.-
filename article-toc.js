/* ============================================================
   Article contents sidebar.
   Long guides were a narrow column of prose stranded in a very wide card
   once the page adopted the app's width ladder. Rather than padding the
   card out with empty space, the space becomes navigation: a sticky list
   of the article's own headings, with the current one marked.
   Progressive enhancement — the article reads fine without this file.
   ============================================================ */
(function () {
  var body = document.querySelector('.article-body');
  var article = document.querySelector('.article');
  if (!body || !article) return;

  var heads = [].slice.call(body.querySelectorAll('h2'));
  // Two headings is a list, not a contents page. Not worth the column.
  if (heads.length < 3) return;

  function slug(text) {
    return text.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);
  }

  var used = {};
  heads.forEach(function (h) {
    if (!h.id) {
      var base = slug(h.textContent) || 'section';
      var id = base;
      var n = 2;
      while (used[id] || document.getElementById(id)) { id = base + '-' + n++; }
      used[id] = true;
      h.id = id;
    }
    // Offset so a sticky topbar never covers the heading you jumped to.
    h.style.scrollMarginTop = 'calc(var(--header-h, 58px) + 18px)';
  });

  var aside = document.createElement('aside');
  aside.className = 'article-toc';
  aside.setAttribute('aria-label', 'On this page');

  var title = document.createElement('div');
  title.className = 'toc-title';
  title.textContent = 'On this page';
  aside.appendChild(title);

  var nav = document.createElement('nav');
  var list = document.createElement('ol');
  list.className = 'toc-list';

  var links = heads.map(function (h) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  nav.appendChild(list);
  aside.appendChild(nav);

  /* Wrap the prose and the sidebar in their own two-column container rather
     than making .article a grid. The article's header parts (kicker, h1,
     post-meta) are direct children with no wrapper, so a grid on .article
     auto-placed them into whichever column came next and tore the layout
     apart. This depends on nothing but .article-body existing. */
  var cols = document.createElement('div');
  cols.className = 'article-cols';
  body.parentNode.insertBefore(cols, body);
  cols.appendChild(body);
  cols.appendChild(aside);
  article.classList.add('has-toc');

  /* Mark the section being read. Deliberately NOT "whichever heading is
     currently intersecting a band" — between two headings no heading is in
     the band, so the marker would blink off for most of the scroll. What is
     wanted is the last heading scrolled past, which stays marked until the
     next one arrives. */
  function mark(id) {
    links.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
    });
  }

  function updateCurrent() {
    var line = window.innerHeight * 0.3;
    var current = null;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].getBoundingClientRect().top <= line) current = heads[i].id;
      else break;
    }
    mark(current);
  }

  // Clicking should feel immediate rather than waiting for the scroll to land.
  links.forEach(function (a) {
    a.addEventListener('click', function () { mark(a.getAttribute('href').slice(1)); });
  });

  if ('IntersectionObserver' in window) {
    // The observer is only a cheap trigger: it fires whenever any heading
    // enters or leaves the viewport, in either direction, and the position
    // check above decides what is actually current.
    var observer = new IntersectionObserver(updateCurrent, { threshold: 0 });
    heads.forEach(function (h) { observer.observe(h); });
  }
  window.addEventListener('scroll', updateCurrent, { passive: true });
  updateCurrent();
})();
