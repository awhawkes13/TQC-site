/* The Quiet Collective — shared script
   Three small jobs: set the room's atmosphere, switch on the letter sign-up,
   and keep a product cover looking right if its image is missing. */
(function () {
  'use strict';

  /* ── Turn on the letter sign-up ─────────────────────────────
     When the Substack exists, put its address between the quotes
     (for example "https://thequietcollective.substack.com").
     While this is empty, the sign-up blocks stay hidden. */
  var SUBSTACK = 'https://thequietcollectiveco.substack.com';

  function setupSubscribe() {
    var base = SUBSTACK.replace(/\/+$/, '');
    var blocks = document.querySelectorAll('[data-subscribe]');
    if (!base) return;
    blocks.forEach(function (block) {
      var form = block.querySelector('form');
      if (form) {
        form.action = base + '/api/v1/free?nojs=true';
        var first = form.querySelector('input[name="first_url"]');
        if (first) first.value = window.location.href;
      }
      block.hidden = false;
    });
    document.querySelectorAll('[data-substack-link]').forEach(function (a) {
      a.href = base;
      a.hidden = false;
    });
  }

  /* ── Atmosphere ─────────────────────────────────────────── */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function spawn(hero) {
    var kind = hero.getAttribute('data-fx');
    var layer = hero.querySelector('.fx');
    if (!kind || !layer || reduce) return;

    var plan = {
      motes: { n: 18, cls: 'mote' },
      steam: { n: 7, cls: 'wisp' },
      stars: { n: 46, cls: 'star' },
      mist:  { n: 3, cls: 'band' }
    }[kind];
    if (!plan) return;

    for (var i = 0; i < plan.n; i++) {
      var el = document.createElement('i');
      el.className = plan.cls;
      var st = el.style;
      if (kind === 'motes') {
        st.setProperty('--x', rnd(46, 96).toFixed(1) + '%');
        st.setProperty('--y', rnd(8, 78).toFixed(1) + '%');
        st.setProperty('--s', rnd(2, 5).toFixed(1) + 'px');
        st.setProperty('--dx', rnd(-40, 20).toFixed(0) + 'px');
        st.setProperty('--dy', rnd(20, 90).toFixed(0) + 'px');
        st.setProperty('--d', rnd(11, 22).toFixed(1) + 's');
        st.setProperty('--t', rnd(0, 14).toFixed(1) + 's');
      } else if (kind === 'steam') {
        st.setProperty('--x', rnd(4, 86).toFixed(1) + '%');
        st.setProperty('--s', rnd(110, 220).toFixed(0) + 'px');
        st.setProperty('--d', rnd(12, 20).toFixed(1) + 's');
        st.setProperty('--t', (-rnd(0, 16)).toFixed(1) + 's');
      } else if (kind === 'stars') {
        st.setProperty('--x', rnd(0, 100).toFixed(1) + '%');
        st.setProperty('--y', rnd(0, 78).toFixed(1) + '%');
        st.setProperty('--s', rnd(1, 2.6).toFixed(1) + 'px');
        st.setProperty('--d', rnd(3.5, 8).toFixed(1) + 's');
        st.setProperty('--t', (-rnd(0, 8)).toFixed(1) + 's');
      } else if (kind === 'mist') {
        st.setProperty('--y', (14 + i * 26 + rnd(-6, 6)).toFixed(0) + '%');
        st.setProperty('--s', rnd(70, 120).toFixed(0) + 'px');
        st.setProperty('--d', rnd(30, 46).toFixed(0) + 's');
        st.setProperty('--t', (-rnd(0, 20)).toFixed(0) + 's');
      }
      layer.appendChild(el);
    }
  }

  /* ── Cover fallback ─────────────────────────────────────── */
  function setupCovers() {
    document.querySelectorAll('.cover img').forEach(function (img) {
      function miss() { img.parentNode.classList.add('missing'); }
      if (img.complete && img.naturalWidth === 0) miss();
      img.addEventListener('error', miss);
    });
  }

  function init() {
    setupSubscribe();
    setupCovers();
    document.querySelectorAll('.hero[data-fx]').forEach(spawn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
