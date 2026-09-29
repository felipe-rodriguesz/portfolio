/* Resource-based progress. Independent from GSAP; bootstrap always unlocks at 6s. */
(() => {
  const loader = document.getElementById('preloader');
  if (!loader || !document.documentElement.classList.contains('is-loading')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const started = performance.now();
  const percent = loader.querySelector('.loader-percent');
  let target = 0, progress = 0, frame = 0, done = false, exitTimer = 0;
  document.querySelectorAll('.skip-link, .site-header, main, .site-footer').forEach(el => {
    el.setAttribute('data-loading-inert', ''); el.inert = true;
  });
  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    clearTimeout(exitTimer);
    controller.abort();
    window.finishPortfolioLoading();
  }
  function exit() {
    loader.classList.add('is-leaving');
    loader.addEventListener('transitionend', e => { if (e.target === loader) finish(); }, { signal: controller.signal });
    exitTimer = setTimeout(finish, reduced.matches ? 0 : 500);
  }
  function render(now) {
    if (!document.documentElement.classList.contains('is-loading')) { finish(); return; }
    progress = reduced.matches ? target : Math.min(target, progress + Math.max(.8, (target-progress)*.12));
    loader.style.setProperty('--progress', `${progress}%`);
    percent.textContent = `${Math.floor(progress)}%`;
    if (progress >= 100 && now-started >= (reduced.matches ? 0 : 700)) { exit(); return; }
    frame = requestAnimationFrame(render);
  }
  function imageReady(image) {
    if (!image || image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once:true, signal:controller.signal });
      image.addEventListener('error', resolve, { once:true, signal:controller.signal });
    });
  }
  // Percent counts completed critical resources, not downloaded bytes.
  const resources = [imageReady(document.querySelector('.portrait-frame img')), imageReady(loader.querySelector('img')), document.fonts?.ready || Promise.resolve(), Promise.resolve()];
  let completed = 0;
  resources.forEach(resource => Promise.resolve(resource).catch(() => {}).then(() => { target = ++completed / resources.length * 100; }));
  frame = requestAnimationFrame(render);
  window.portfolioReady.then(() => { if (!done) finish(); });
})();
