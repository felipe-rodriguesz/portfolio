# Felipe Rodrigues — Computer Engineering

Portfólio pessoal com foco em desenvolvimento full stack, com projetos em Java, automação, compiladores e computação científica.

**Site:** https://felipe-rodriguesz.github.io/portfolio/

## Estrutura

- `index.html`: conteúdo e semântica, seis projetos, retrato e diagramas SVG próprios.
- `styles.css`: tokens, composição editorial, componentes e breakpoints.
- `script.js`: menu, cópia de e-mail, carrossel nativo e indicação de seção ativa.
- `preloader.js`: intro com progresso dos recursos essenciais, saída suave e limite de segurança de seis segundos.
- `motion.js`: timelines, máscaras, desenho SVG e profundidade com GSAP/ScrollTrigger 3.13.0.
- `assets/vendor/`: dependências fixadas, servidas localmente; avisos de licença preservados.
- `docs/design-audit.md`: auditoria e decisões de design/performance.

HTML/CSS/JavaScript, sem etapa de build. Conteúdo disponível mesmo sem o sistema de motion. Reduced motion desativa as timelines. Scroll nativo; nenhuma cena WebGL ou loop gráfico permanente. Ícones de tecnologias e redes do [Devicon](https://github.com/devicons/devicon). Duas capas são screenshots reais e quatro são diagramas ilustrativos.

## Executar

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. O workflow `.github/workflows/deploy.yml` publica `main` no GitHub Pages.
