const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');

menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Fechar' : 'Menu';
});

document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = 'Menu';
    });
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedFilter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
        projectCards.forEach((card) => {
            const shouldShow = selectedFilter === 'todos' || card.dataset.category === selectedFilter;
            card.hidden = !shouldShow;
        });
    });
});
