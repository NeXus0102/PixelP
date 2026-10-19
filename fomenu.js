// PixelP – főoldal (fomenu) működés
// Az oldal JavaScript nélkül is használható, ez csak kiegészítés.

(function () {
  'use strict';

  /* ---------- Slider automatikus léptetése ---------- */
  var radios = Array.prototype.slice.call(document.querySelectorAll('.slider input[type="radio"]'));
  var slider = document.querySelector('.slider');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;

  function next() {
    var i = radios.findIndex(function (r) { return r.checked; });
    radios[(i + 1) % radios.length].checked = true;
  }
  function start() {
    if (reduce || radios.length < 2) return;
    stop();
    timer = setInterval(next, 5500);
  }
  function stop() { clearInterval(timer); }

  if (slider && radios.length) {
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    radios.forEach(function (r) { r.addEventListener('change', start); });
    start();
  }

  /* ---------- Mobil menü: link kattintásra záródik ---------- */
  var navToggle = document.getElementById('nav-toggle');
  document.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () { if (navToggle) navToggle.checked = false; });
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760 && navToggle) navToggle.checked = false;
  });

  /* ---------- Kosárba gomb: számláló növelése, értesítés ---------- */
  var badge = document.querySelector('.badge');
  var toastEl = null, toastTimer = null;

  function toast(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 1800);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('.card .add:not(.off), .slide .btn');
    if (!link || !badge) return;
    e.preventDefault();
    var holder = link.closest('.card, .slide');
    var nameEl = holder.querySelector('.name, h3');
    badge.textContent = (parseInt(badge.textContent, 10) || 0) + 1;
    toast((nameEl ? nameEl.textContent : 'A termék') + ' a kosárban');
  });

  /* ---------- AI Chatbot ---------- */
  var chatForm = document.querySelector('.chat form');
  var chatInput = chatForm && chatForm.querySelector('input');
  var msgs = document.querySelector('.msgs');

  function say(text, who) {
    var d = document.createElement('div');
    d.className = 'm ' + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function reply(t) {
    t = t.toLowerCase();
    if (/szállít|kiszáll|házhoz/.test(t)) return 'A szállítás 30 000 Ft felett ingyenes, alatta 1 490 Ft. Általában 1–2 munkanap.';
    if (/akci|kedvezm|kupon|olcs/.test(t)) return 'Az első rendelésre -10% jár a PIXEL10 kóddal, a bal oldalon pedig az aktuális promóciókat találod.';
    if (/laptop|gép|notebook/.test(t)) return 'Laptopjaink 219 900 Ft-tól indulnak. A PixelBook 14 a legnépszerűbb.';
    if (/fejhall|zene|hangsz/.test(t)) return 'A Pulse ANC zajszűrős, a Bit Mini pedig kedvező árú belépő modell.';
    if (/telefon|mobil/.test(t)) return 'A PixelPhone 5G 159 900 Ft, a PixelTab 10 pedig 99 900 Ft.';
    if (/fizet|kártya|utánvét/.test(t)) return 'Fizethetsz bankkártyával, átutalással vagy utánvéttel.';
    if (/szia|hello|helló|üdv/.test(t)) return 'Szia! Miben segíthetek?';
    return 'Ezt még nem tudom pontosan. Kérdezhetsz szállításról, akciókról, laptopokról, telefonokról vagy fejhallgatókról.';
  }

  if (chatForm && chatInput && msgs) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = chatInput.value.trim();
      if (!v) return;
      say(v, 'me');
      chatInput.value = '';
      setTimeout(function () { say(reply(v), 'bot'); }, 500);
    });
  }
  var chatToggle = document.getElementById('chat-toggle');
  if (chatToggle && chatInput) {
    chatToggle.addEventListener('change', function () { if (chatToggle.checked) chatInput.focus(); });
  }
})();