/* Optional enhancement: content and controls work without this module or GSAP. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const motion = Object.freeze({ fast: .22, standard: .65, cinematic: 1.05, ease: 'power3.out', stagger: .09 });
  const media = gsap.matchMedia();
  media.add({ desktop: '(min-width: 741px)', mobile: '(max-width: 740px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
    if (context.conditions.reduce) return;
    const desktop = context.conditions.desktop;
    const entrance = gsap.timeline({ defaults: { ease: motion.ease, duration: motion.standard } });
    entrance.from('.title-line > span', { yPercent: 110, rotation: 2, duration: motion.cinematic, stagger: motion.stagger })
      .from('.hero .eyebrow', { opacity: 0 }, 0)
      .from('.hero-role, .hero-copy > p, .hero-actions', { opacity: 0, y: 12, stagger: motion.stagger }, .3)
      .from('.hero-visual', { opacity: 0, duration: motion.cinematic }, .12)
      .from('.hero-stack li', { opacity: 0, y: 8, stagger: .035 }, .6);
    gsap.from('.about-copy h2', { clipPath: 'inset(0 100% 0 0)', duration: motion.cinematic, ease: motion.ease,
      scrollTrigger: { trigger: '.about-copy', start: 'top 88%', once: true } });
    gsap.from('.experience-card', { opacity: 0, x: desktop ? 16 : 0, stagger: motion.stagger, duration: motion.standard,
      scrollTrigger: { trigger: '.experience-grid', start: 'top 88%', once: true } });
    const system = gsap.timeline({ scrollTrigger: { trigger: '.system-map', start: 'top 88%', once: true }, defaults: { ease: motion.ease } });
    document.querySelectorAll('.system-map path').forEach(path => {
      const length = path.getTotalLength();
      system.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: motion.standard }, 0);
    });
    system.from('.system-map > span', { opacity: 0, stagger: .15, duration: motion.standard }, 0);
    gsap.from('.skill-meter span', { scaleX: 0, duration: .9, stagger: .045, ease: motion.ease,
      scrollTrigger: { trigger: '.skills-grid', start: 'top 88%', once: true } });
    gsap.from('.section-projects .section-heading h2', { clipPath: 'inset(0 0 100% 0)', duration: motion.cinematic, ease: motion.ease,
      scrollTrigger: { trigger: '.section-projects', start: 'top 85%', once: true } });
    // Animate the reel as a unit so horizontally offscreen cards never remain hidden.
    gsap.from('.projects-track', { opacity: 0, duration: motion.standard,
      scrollTrigger: { trigger: '.projects-viewport', start: 'top 90%', once: true } });
    gsap.from('.contact-intro, .contact-panel', { opacity: 0, stagger: .12, duration: motion.standard,
      scrollTrigger: { trigger: '.section-contact', start: 'top 94%', once: true } });
    if (desktop) {
      gsap.to('.engineering-orbit', { rotation: 16, y: 35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
      gsap.to('.portrait-halo', { y: 45, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
    }
  });
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const controller = new AbortController();
    const hero = document.querySelector('.hero-visual');
    const xTo = gsap.quickTo('.engineering-orbit', 'x', { duration: .7, ease: motion.ease });
    const yTo = gsap.quickTo('.orbit-node', 'y', { duration: .7, ease: motion.ease });
    hero.addEventListener('pointermove', e => {
      const bounds = hero.getBoundingClientRect();
      xTo(((e.clientX - bounds.left) / bounds.width - .5) * 16);
      yTo(((e.clientY - bounds.top) / bounds.height - .5) * 12);
    }, { signal: controller.signal, passive: true });
    hero.addEventListener('pointerleave', () => { xTo(0); yTo(0); }, { signal: controller.signal });
    return () => controller.abort();
  });
  // Revert transforms/listeners on real navigation; retain state for back-forward cache.
  window.addEventListener('pagehide', event => { if (!event.persisted) media.revert(); });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
