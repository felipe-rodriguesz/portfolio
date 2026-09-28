# Portfólio | Felipe Rodrigues

Portfólio pessoal de Felipe Rodrigues, estudante de Engenharia de Computação na UTFPR. A página destaca projetos de desenvolvimento full stack e apresenta também trabalhos em Java, automação, robótica e computação científica.

**Site:** https://felipe-rodriguesz.github.io/portfolio/

## Tecnologias

HTML, CSS e JavaScript. O site é estático e não exige instalação de dependências. O carrossel reúne seis projetos: os dois primeiros têm capturas dos próprios aplicativos; os demais usam capas gráficas criadas em CSS.

As transições de seção e os efeitos de profundidade são feitos em CSS e JavaScript nativos. A barra de progresso usa uma animação vinculada à rolagem quando há suporte no navegador, com alternativa em JavaScript. Os efeitos decorativos respeitam a preferência por movimento reduzido.

Os ícones SVG das tecnologias e das redes sociais vêm do [Devicon](https://github.com/devicons/devicon) e estão salvos em `assets/skills/` e `assets/social/`. O ícone de e-mail é um SVG próprio no HTML.

## Executar localmente

Abra `index.html` no navegador ou sirva esta pasta com um servidor HTTP local. Por exemplo:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.

## Publicação

O workflow em `.github/workflows/deploy.yml` publica a branch `main` no GitHub Pages.
