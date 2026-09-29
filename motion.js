/* Optional enhancement: content and controls work without this module or GSAP. */
(async () => {
  await (window.portfolioReady || Promise.resolve());
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const motion = Object.freeze({ fast: .22, standard: .65, cinematic: 1.05, ease: 'power3.out', stagger: .09 });
  const media = gsap.matchMedia();
  media.add({ desktop: '(min-width: 1001px)', mobile: '(max-width: 1000px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
    if (context.conditions.reduce) return;
    const desktop = context.conditions.desktop;
    // Split only visual text; preserve a single accessible heading and restore on cleanup.
    const originals = [];
    function split(element, characters = false) {
      originals.push([element, element.innerHTML, element.getAttribute('aria-label')]);
      const text = element.textContent;
      element.setAttribute('aria-label', text);
      element.replaceChildren();
      text.split(/(\s+)/).forEach(word => {
        if (!word.trim()) { element.append(document.createTextNode(word)); return; }
        const mask = document.createElement('span');
        mask.className = 'motion-word'; mask.setAttribute('aria-hidden', 'true');
        (characters ? [...word] : [word]).forEach(value => {
          const part = document.createElement('span'); part.className = 'motion-part'; part.textContent = value; mask.append(part);
        });
        element.append(mask);
      });
      return element.querySelectorAll('.motion-part');
    }
    const heroChars = [...document.querySelectorAll('.title-line > span')].flatMap(el => [...split(el, true)]);
    const entrance = gsap.timeline({ defaults: { ease: motion.ease, duration: motion.standard } });
    entrance.from(heroChars, { yPercent: 115, rotationX: -65, opacity: 0, duration: 1.25, stagger: .045, transformOrigin: '50% 100%' })
      .from('.hero .eyebrow', { opacity: 0, x: -25 }, 0)
      .from('.hero-role, .hero-copy > p, .hero-actions', { opacity: 0, y: 22, stagger: .12 }, .55)
      .from('.hero-visual', { clipPath: 'inset(100% 0 0 0)', duration: 1.4 }, .15)
      .from('.hero-stack li', { opacity: 0, scale: .55, y: 16, stagger: .065, ease: 'back.out(1.5)' }, .85);
    document.querySelectorAll('.section h2').forEach(heading => {
      const parts = split(heading);
      gsap.from(parts, { yPercent: 110, rotation: 3, duration: .85, stagger: .085, ease: motion.ease,
        scrollTrigger: { trigger: heading, start: 'top 91%', toggleActions: 'play none none reverse' } });
    });
    gsap.fromTo('.about-copy p', { opacity: .35 }, { opacity: 1, stagger: .3, ease: 'none',
      scrollTrigger: { trigger: '.about-copy', start: 'top 82%', end: 'center 50%', scrub: .45 } });
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
    if (!desktop) gsap.from('.featured-card', { clipPath: 'inset(0 0 100% 0)', y: 35, duration: 1, stagger: .12, ease: motion.ease,
      scrollTrigger: { trigger: '.projects-viewport', start: 'top 91%', toggleActions: 'play none none reverse' } });
    gsap.from('.contact-intro, .contact-panel', { x: i => i ? 35 : -35, opacity: 0, stagger: .15, duration: .85,
      scrollTrigger: { trigger: '.section-contact', start: 'top 96%', toggleActions: 'play none none reverse' } });
    // One ambient gesture, only while the hero is visible and the tab is active.
    const ring = document.querySelector('.engineering-orbit');
    const ambient = gsap.to('.orbit-node', { rotation: 360, svgOrigin: '300 300', duration: 22, repeat: -1, ease: 'none', paused: true });
    const light = gsap.timeline({ repeat: -1, paused: true, defaults: { duration: 4, ease: 'sine.inOut' } });
    light.to('.light-violet', { opacity: 0 }, 1)
      .to('.light-blue', { opacity: 1 }, 1)
      .to('.light-blue', { opacity: 0 }, 6)
      .to('.light-cyan', { opacity: 1 }, 6)
      .to('.light-cyan', { opacity: 0 }, 11)
      .to('.light-violet', { opacity: 1 }, 11);
    let heroVisible = false;
    const sync = () => {
      const active = heroVisible && !document.hidden;
      [ambient, light].forEach(animation => active ? animation.resume() : animation.pause());
    };
    const observer = new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; sync(); });
    observer.observe(ring);
    document.addEventListener('visibilitychange', sync);
    if (desktop) {
      gsap.to('.engineering-orbit', { rotation: 45, y: 65, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
      gsap.to('.hero-copy', { y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
      gsap.to('.portrait-halo', { y: 45, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
    }
    return () => {
      observer.disconnect(); document.removeEventListener('visibilitychange', sync);
      originals.forEach(([el, html, label]) => { el.innerHTML = html; label === null ? el.removeAttribute('aria-label') : el.setAttribute('aria-label', label); });
    };
  });
  media.add('(min-width: 1001px) and (min-height: 650px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const section = document.querySelector('.section-projects');
    const viewport = section.querySelector('.projects-viewport');
    const parent = document.querySelector('.final-sections');
    const images = [...section.querySelectorAll('.featured-image')];
    const controller = new AbortController();
    parent.classList.add('projects-scroll-enabled');
    const hint = document.createElement('p');
    hint.className = 'project-scroll-hint';
    hint.textContent = 'ROLE PARA EXPLORAR OS 6 PROJETOS →';
    section.querySelector('.section-heading').after(hint);
    const distance = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const sequence = gsap.timeline({ scrollTrigger: {
      trigger: section, start: 'top 80px', end: () => `+=${Math.max(1200, distance() * 1.25)}`,
      pin: true, scrub: .45, invalidateOnRefresh: true, anticipatePin: 1
    } });
    sequence.fromTo(viewport, { scrollLeft: 0 }, { scrollLeft: distance, duration: 3, ease: 'none' }, .5);
    images.forEach((image, index) => {
      const start = index < 3 ? index * .15 : .65 + (index - 3) * .85;
      sequence.fromTo(image, { clipPath: 'inset(0 0 88% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .85, ease: 'none' }, start);
    });
    const trigger = sequence.scrollTrigger;
    window.portfolioProjectScroll = left => {
      const ratio = Math.min(1, Math.max(0, left / (distance() || 1)));
      const progress = (.5 + ratio * 3) / sequence.duration();
      window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: 'smooth' });
    };
    // Keyboard focus must also bring an offscreen project into view in the scroll narrative.
    viewport.addEventListener('focusin', event => {
      const card = event.target.closest('.featured-card');
      if (card) window.portfolioProjectScroll(card.offsetLeft - viewport.querySelector('.featured-card').offsetLeft);
    }, { signal: controller.signal });
    return () => {
      controller.abort(); delete window.portfolioProjectScroll;
      parent.classList.remove('projects-scroll-enabled'); hint.remove();
    };
  });
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const controller = new AbortController();
    // One pointer light for the page; card coordinates update at most once per frame.
    const glow = document.createElement('div');
    glow.className = 'pointer-light'; glow.setAttribute('aria-hidden', 'true');
    document.body.append(glow);
    const glowX = gsap.quickTo(glow, 'x', { duration: .45, ease: 'power2.out' });
    const glowY = gsap.quickTo(glow, 'y', { duration: .45, ease: 'power2.out' });
    const cards = [...document.querySelectorAll('.featured-card, .about-copy, .experience-card, .contact-intro, .contact-panel, .skill-column')];
    cards.forEach(card => card.classList.add('pointer-card'));
    let lightFrame = 0, pointerX = 0, pointerY = 0, activeCard = null, tracking = false;
    function drawLight() {
      lightFrame = 0;
      if (!tracking) return;
      const card = document.elementFromPoint(pointerX, pointerY)?.closest('.pointer-card');
      if (activeCard !== card) {
        activeCard?.classList.remove('is-lit');
        activeCard = card;
        activeCard?.classList.add('is-lit');
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${pointerX - rect.left}px`);
        card.style.setProperty('--pointer-y', `${pointerY - rect.top}px`);
      }
    }
    function scheduleLight() { if (!lightFrame && tracking) lightFrame = requestAnimationFrame(drawLight); }
    function hideLight() {
      tracking = false; glow.classList.remove('is-active');
      activeCard?.classList.remove('is-lit'); activeCard = null;
      cancelAnimationFrame(lightFrame); lightFrame = 0;
    }
    document.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      pointerX = event.clientX; pointerY = event.clientY;
      if (!tracking) gsap.set(glow, { x: pointerX, y: pointerY });
      tracking = true; glow.classList.add('is-active');
      glowX(pointerX); glowY(pointerY); scheduleLight();
    }, { signal:controller.signal, passive:true });
    document.addEventListener('scroll', scheduleLight, { signal:controller.signal, passive:true, capture:true });
    document.documentElement.addEventListener('pointerleave', hideLight, { signal:controller.signal });
    window.addEventListener('blur', hideLight, { signal:controller.signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden) hideLight(); }, { signal:controller.signal });
    const hero = document.querySelector('.hero-visual');
    const xTo = gsap.quickTo('.engineering-orbit', 'x', { duration: .7, ease: motion.ease });
    const yTo = gsap.quickTo('.orbit-node', 'y', { duration: .7, ease: motion.ease });
    hero.addEventListener('pointermove', e => {
      const bounds = hero.getBoundingClientRect();
      xTo(((e.clientX - bounds.left) / bounds.width - .5) * 16);
      yTo(((e.clientY - bounds.top) / bounds.height - .5) * 12);
    }, { signal: controller.signal, passive: true });
    hero.addEventListener('pointerleave', () => { xTo(0); yTo(0); }, { signal: controller.signal });
    document.querySelectorAll('.featured-card').forEach(card => {
      const image = card.querySelector('.featured-image');
      const rotateX = gsap.quickTo(image, 'rotationX', { duration: .45, ease: motion.ease });
      const rotateY = gsap.quickTo(image, 'rotationY', { duration: .45, ease: motion.ease });
      gsap.set(image, { transformPerspective: 700 });
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        rotateX(-((e.clientY-r.top)/r.height-.5)*8);
        rotateY(((e.clientX-r.left)/r.width-.5)*10);
      }, { signal: controller.signal, passive: true });
      card.addEventListener('pointerleave', () => { rotateX(0); rotateY(0); }, { signal: controller.signal });
    });
    document.querySelectorAll('.button, .social-icon').forEach(button => {
      const x = gsap.quickTo(button, 'x', { duration: .4, ease: 'power2.out' });
      const y = gsap.quickTo(button, 'y', { duration: .4, ease: 'power2.out' });
      button.addEventListener('pointermove', e => {
        const r = button.getBoundingClientRect(); x((e.clientX-r.left-r.width/2)*.12); y((e.clientY-r.top-r.height/2)*.15);
      }, { signal: controller.signal, passive: true });
      button.addEventListener('pointerleave', () => { x(0); y(0); }, { signal: controller.signal });
    });
    document.querySelectorAll('.skill-item').forEach(item => {
      const icon = item.querySelector('img');
      const scale = gsap.quickTo(icon, 'scale', { duration: .35, ease: 'back.out(2)' });
      item.addEventListener('pointerenter', () => scale(1.25), { signal: controller.signal });
      item.addEventListener('pointerleave', () => scale(1), { signal: controller.signal });
    });
    return () => {
      controller.abort(); hideLight(); glow.remove();
      cards.forEach(card => {
        card.classList.remove('pointer-card', 'is-lit');
        card.style.removeProperty('--pointer-x'); card.style.removeProperty('--pointer-y');
      });
    };
  });
  // Revert transforms/listeners on real navigation; retain state for back-forward cache.
  window.addEventListener('pagehide', event => { if (!event.persisted) media.revert(); });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
