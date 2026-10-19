(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Highlight the current section in the nav
  var links = document.querySelectorAll('.nav a[href^="#"]:not(.btn)');
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  function onScroll() {
    var y = window.scrollY + 120;
    var current = -1;
    sections.forEach(function (s, i) {
      if (s && s.offsetTop <= y) current = i;
    });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Booking form: opens the visitor's email app with the request filled in
  var form = document.getElementById('booking');
  var note = document.getElementById('form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['name', 'phone'].forEach(function (n) {
      var field = form.elements[n];
      var bad = !field.value.trim();
      field.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = 'Please add your name and phone number.';
      return;
    }
    var body = [
      'Name: ' + form.elements.name.value.trim(),
      'Phone: ' + form.elements.phone.value.trim(),
      'Booking: ' + form.elements.what.value,
      'Preferred time: ' + (form.elements.when.value.trim() || 'Flexible')
    ].join('\n');
    var href = 'mailto:hello@pixelpalace.pk?subject=' +
      encodeURIComponent('Booking request: ' + form.elements.what.value) +
      '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app to send the request...';
    window.location.href = href;
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
})();
