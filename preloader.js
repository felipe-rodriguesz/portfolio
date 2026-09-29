/* Resource-based progress. Independent from GSAP; bootstrap always unlocks at 6s. */
(() => {
  const loader = document.getElementById('preloader');
  if (!loader || !document.documentElement.classList.contains('is-loading')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const started = performance.now();
  const percent = loader.querySelector('.loader-percent');
  let target = 0, progress = 0, frame = 0, done = false, exitTimer = 0;
  let transition = null, flyingLogo = null, headerLogo = null;
  document.querySelectorAll('.skip-link, .site-header, main, .site-footer').forEach(el => {
    el.setAttribute('data-loading-inert', ''); el.inert = true;
  });
  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    clearTimeout(exitTimer);
    controller.abort();
    transition?.kill(); flyingLogo?.remove();
    if (headerLogo) headerLogo.style.removeProperty('opacity');
    window.finishPortfolioLoading();
  }
  function exit() {
    const source = loader.querySelector('.loader-monogram');
    headerLogo = document.querySelector('.brand-logo');
    if (reduced.matches || !window.gsap || !source || !headerLogo) {
      window.dispatchEvent(new Event('portfolio:reveal'));
      loader.classList.add('is-leaving');
      exitTimer = setTimeout(finish, reduced.matches ? 0 : 500);
      return;
    }
    const from = source.getBoundingClientRect();
    const to = headerLogo.getBoundingClientRect();
    flyingLogo = source.cloneNode(true);
    flyingLogo.classList.add('loader-flying-logo');
    Object.assign(flyingLogo.style, {
      position:'fixed', left:`${from.left}px`, top:`${from.top}px`,
      width:`${from.width}px`, height:`${from.height}px`, margin:'0',
      zIndex:'1002', pointerEvents:'none', transformOrigin:'0 0'
    });
    flyingLogo.style.setProperty('--progress', '100%');
    document.body.append(flyingLogo);
    gsap.set([source, headerLogo], { opacity:0 });
    // Keep the traveling logo separate from the fading full-screen overlay.
    loader.style.transition = 'none';
    transition = gsap.timeline({ onComplete:finish });
    transition.to('.loader-identity, .loader-progress', { opacity:0, y:-8, duration:.22 }, 0)
      .to(loader, { opacity:0, duration:.55, ease:'power2.inOut' }, .08)
      .call(() => window.dispatchEvent(new Event('portfolio:reveal')), [], .12)
      .to(flyingLogo, { x:to.left-from.left, y:to.top-from.top,
        scaleX:to.width/from.width, scaleY:to.height/from.height,
        duration:1.05, ease:'power3.inOut' }, 0)
      .set(headerLogo, { opacity:1 }, 1.05);
    exitTimer = setTimeout(finish, 1500);
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
