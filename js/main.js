(function () {
  'use strict';

  /* ---------- language (EN default, UA on request or by browser setting) ---------- */
  var STRINGS = {
    en: {
      'nav.work': 'Work', 'nav.about': 'About', 'nav.contact': 'Contact',
      'intro.title': 'Events. Advertising. BTS.',
      'intro.text': 'Photographer based in Kyiv. Club nights, festivals, brand campaigns and reportage.',
      'about.title': 'About',
      'about.lead': 'I photograph the people and the energy of a night out, and the brands that want to feel like it.',
      'about.p1': 'Ilya Kolotiy is a photographer based in Kyiv. He works in advertising, events, behind the scenes and reportage, from club floors and open-air festivals to commercial shoots for sportswear and drinks brands.',
      'about.projects': 'Selected projects',
      'contact.title': 'Contact',
      'contact.text': 'Bookings and collaborations: write to me on Instagram.',
      'footer.rights': 'All photographs © Ilya Kolotiy'
    },
    uk: {
      'nav.work': 'Роботи', 'nav.about': 'Про мене', 'nav.contact': 'Контакти',
      'intro.title': 'Івенти. Реклама. BTS.',
      'intro.text': 'Фотограф із Києва. Клубні вечірки, фестивалі, рекламні кампанії та репортаж.',
      'about.title': 'Про мене',
      'about.lead': 'Фотографую людей і енергію вечірок, а ще бренди, які хочуть так само звучати.',
      'about.p1': 'Ілля Колотій, фотограф із Києва. Працює з рекламою, івентами, бекстейджем і репортажем: від клубних танцполів і open-air фестивалів до комерційних зйомок для спортивних і напійних брендів.',
      'about.projects': 'Обрані проєкти',
      'contact.title': 'Контакти',
      'contact.text': 'Зйомки та співпраця: пишіть мені в Instagram.',
      'footer.rights': 'Усі фотографії © Ілля Колотій'
    }
  };

  function readLang() {
    try { var s = localStorage.getItem('lang'); if (s) return s; } catch (e) { /* storage blocked */ }
    return (navigator.language || '').toLowerCase().indexOf('uk') === 0 ? 'uk' : 'en';
  }

  function setLang(lang, remember) {
    var dict = STRINGS[lang] || STRINGS.en;
    document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v) el.textContent = v;
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    if (remember) { try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ } }
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  setLang(readLang(), false);

  /* ---------- lightbox ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.tile a'));
  var box = document.getElementById('lightbox');
  if (!links.length || !box) return;
  var img = box.querySelector('img');
  var cap = box.querySelector('figcaption');
  var idx = 0, opener = null;

  function show(i) {
    idx = (i + links.length) % links.length;
    var a = links[idx];
    img.src = a.getAttribute('href');
    img.alt = a.querySelector('img').alt;
    cap.textContent = a.getAttribute('data-caption') || '';
    var next = new Image(); next.src = links[(idx + 1) % links.length].getAttribute('href');
  }
  function open(i, from) {
    opener = from;
    show(i);
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    if (opener) opener.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(i, a); });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'Tab') {
      var f = box.querySelectorAll('button');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
