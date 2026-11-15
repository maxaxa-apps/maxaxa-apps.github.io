(function () {
  var root = document.documentElement, btn = document.getElementById('theme');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paint() {
    // луна — включить тёмную тему, солнце — вернуть светлую
    btn.querySelector('.moon').toggleAttribute('hidden', isDark());
    btn.querySelector('.sun').toggleAttribute('hidden', !isDark());
    btn.setAttribute('aria-pressed', isDark());
  }
  paint();
  btn.addEventListener('click', function () {
    var n = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('mx-theme', n); } catch (e) {}
    paint();
  });
  // «Скопировать адрес»: почта не видна на странице; если буфер недоступен — показываем адрес текстом
  var copy = document.getElementById('copy-mail');
  if (copy) {
    var lbl = copy.querySelector('.lbl'), label = lbl.textContent, timer;
    var iCopy = copy.querySelector('.i-copy'), iDone = copy.querySelector('.i-done');
    function state(done) { iCopy.toggleAttribute('hidden', done); iDone.toggleAttribute('hidden', !done); copy.classList.toggle('done', done); }
    copy.addEventListener('click', function () {
      var addr = copy.getAttribute('data-addr');
      // ширина подписи не уменьшается, чтобы соседние ссылки подвала не прыгали
      if (!lbl.style.minWidth) lbl.style.minWidth = lbl.getBoundingClientRect().width + 'px';
      function show() { lbl.textContent = addr; lbl.style.userSelect = 'all'; }
      if (!navigator.clipboard) return show();
      navigator.clipboard.writeText(addr).then(function () {
        lbl.textContent = copy.getAttribute('data-done'); state(true);
        clearTimeout(timer);   // повторное нажатие продлевает «Скопировано», а не сбрасывает раньше
        timer = setTimeout(function () { lbl.textContent = label; state(false); }, 2000);
      }, show);
    });
  }
  // карточки игр появляются, как ходы: каждая — когда попала на экран
  var cards = document.querySelectorAll('.board .card');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); co.unobserve(e.target); } });
    }, { threshold: .2 });
    cards.forEach(function (c) { co.observe(c); });
  } else cards.forEach(function (c) { c.classList.add('in'); });
  var board = document.getElementById('board');
  if (!board) return;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es, o) {
      es.forEach(function (e) { if (e.isIntersecting) { board.classList.add('seen'); o.disconnect(); } });
    }, { threshold: .35 }).observe(board);
  } else board.classList.add('seen');
})();
