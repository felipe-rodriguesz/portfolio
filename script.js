const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

function setMenuOpen(isOpen) {
    siteNav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Fechar' : 'Menu';
}

menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
});

document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', async () => {
        const feedback = document.querySelector(button.id === 'copy-email' ? '#copy-feedback' : '#social-feedback');

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(button.dataset.email);
            } else {
                const input = document.createElement('textarea');
                input.value = button.dataset.email;
                input.style.position = 'fixed';
                input.style.opacity = '0';
                document.body.append(input);
                input.select();
                const copied = document.execCommand('copy');
                input.remove();
                if (!copied) throw new Error('Falha ao copiar');
            }
            feedback.textContent = 'E-mail copiado. Cole no serviço que você usa.';
        } catch {
            feedback.textContent = 'Copie o endereço exibido ou fale comigo pelo LinkedIn.';
        }
    });
});

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
    const viewport = carousel.querySelector('.projects-viewport');
    const cards = [...carousel.querySelectorAll('.featured-card')];
    const dotsContainer = carousel.querySelector('[data-carousel-dots]');
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentIndex = 0;
    let maxIndex = 0;

    function stepWidth() {
        return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function updateControls() {
        previous.disabled = currentIndex === 0;
        next.disabled = currentIndex === maxIndex;
        [...dotsContainer.children].forEach((dot, index) => {
            if (index === currentIndex) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
    }

    function goTo(index, smooth = true) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        viewport.scrollTo({
            left: currentIndex * stepWidth(),
            behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant'
        });
        updateControls();
    }

    function buildControls() {
        const visibleCount = Math.max(1, Math.round(viewport.clientWidth / stepWidth()));
        maxIndex = cards.length - visibleCount;
        dotsContainer.replaceChildren();
        for (let index = 0; index <= maxIndex; index++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Mostrar projetos a partir do ${index + 1}`);
            dot.addEventListener('click', () => goTo(index));
            dotsContainer.append(dot);
        }
        goTo(currentIndex, false);
    }

    previous.addEventListener('click', () => goTo(currentIndex - 1));
    next.addEventListener('click', () => goTo(currentIndex + 1));
    viewport.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    viewport.addEventListener('scroll', () => {
        currentIndex = Math.max(0, Math.min(Math.round(viewport.scrollLeft / stepWidth()), maxIndex));
        updateControls();
    }, { passive: true });
    window.addEventListener('resize', buildControls);
    buildControls();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const progressBar = document.querySelector('.scroll-progress');
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...siteNav.querySelectorAll('a[href^="#"]')];
const nativeScrollTimeline = window.CSS?.supports?.('animation-timeline: scroll()') ?? false;
let pageFrame = 0;

function updatePageIndicators() {
    pageFrame = 0;
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const activationLine = headerHeight + window.innerHeight * .3;
    const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    const current = atPageEnd ? sections[sections.length - 1] : ([...sections].reverse().find((section) => section.getBoundingClientRect().top <= activationLine) ?? sections[0]);

    navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${current.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });

    if (!nativeScrollTimeline || prefersReducedMotion.matches) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
        progressBar.style.transform = `scaleX(${progress})`;
    }
}

function schedulePageIndicators() {
    if (!pageFrame) pageFrame = requestAnimationFrame(updatePageIndicators);
}

window.addEventListener('scroll', schedulePageIndicators, { passive: true });
window.addEventListener('resize', schedulePageIndicators);
schedulePageIndicators();

