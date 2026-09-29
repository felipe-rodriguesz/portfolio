# Auditoria e direção — setembro de 2026

## Projeto existente
Site estático de uma página: HTML sem router, CSS e JavaScript, Google Fonts (Inter/DM Mono), SVGs locais e duas capturas reais de projetos. Não havia GSAP, Three.js, build ou componentes de framework. Navegação por âncoras, menu móvel, cópia de e-mail e carrossel nativo formam as funcionalidades centrais.

A primeira versão tinha hierarquia clara, contraste legível, foco visível e conteúdo específico, mas nome pouco destacado, cartão de código genérico, grandes áreas roxas e animações de fade-up repetidas. CSS de 1.276 linhas acumulava decisões de iterações anteriores. A grade de habilidades não explicava a relação entre tecnologias. Os seis projetos e seus links estavam bem definidos. Retrato transparente de 1,5 MB era o maior recurso inicial. As outras quatro capas são ilustrações, não capturas de aplicativos.

## Referência Thor: leitura do código fornecido
- Estrutura estática com convenção BEM parcial e containers globais. Sem routing.
- Tipografia condensada grande + monospace, contraste de escala e uso de preto, ciano e laranja sustentam a composição.
- Fundos de baixa opacidade com máscaras conectam seções. Vídeo substitui imagem após carregar. Cards têm números grandes e camadas de profundidade.
- GSAP coordena entrada, caracteres em stagger aleatório, reveals por breakpoint, desenho de SVG vinculado ao scroll e carrossel horizontal com pin/scrub. ScrollSmoother altera o comportamento global.
- Three.js carrega martelo GLB com Draco e mapa de ambiente, alinhado à identidade Thor. Não há shader GLSL próprio no código recebido.
- Há problemas que não devem ser reproduzidos: recarregar ao redimensionar; preloader bloqueante dependente de JS/CDN; progresso sintético; início antes do fim da transição do loader; Three @latest; DPR sem limite; loop contínuo fora de tela; rotação por frame; falta de descarte e tratamento de erro; reduced-motion apenas em CSS; FAQ sem estado ARIA; pin com distância fixa; duplicação de regras responsivas.
- A avaliação visual da referência deriva do código fornecido: os assets de vídeo/GLB/fontes não foram disponibilizados para executar a landing page completa.

## Direção implementada
Identidade editorial de engenharia: nome completo, Computer Engineering, full stack e retrato real. Tons grafite, lavanda e azul mineral. Linhas finas conectam capítulos; SVG orbital enquadra a pessoa e um diagrama Interface → Lógica → Dados apresenta o sistema técnico. Sem modificar fatos, percentuais existentes ou links.

Mantidos HTML/CSS/JS e todos os controles. CSS reorganizado em tokens, layout, capítulos, componentes e breakpoints. Três cards desktop, dois tablet, um mobile. Sobre + habilidades e projetos + contato mantêm agrupamento de altura mínima de viewport, crescendo quando o conteúdo exige.

GSAP 3.13.0 e ScrollTrigger fixados e servidos localmente. Timelines em motion.js, separadas das funcionalidades em script.js. Máscaras nos títulos, stagger de experiências, traçado SVG e barras coordenadas, profundidade ligada ao scroll apenas no desktop. Na primeira revisão não havia preloader; a introdução adicionada posteriormente está descrita abaixo. Conteúdo visível se GSAP falhar.

Não se adicionou Barba (não há troca de páginas), ScrollSmoother (rolagem nativa é suficiente), Three.js ou shaders (a função visual proposta é resolvida por SVG/CSS sem cena GPU contínua), nem plugins extras para máscaras/desenho simples. Cursor nativo preserva precisão e reconhecimento de links.

## Performance e acessibilidade
matchMedia reverte timelines e ScrollTriggers ao trocar breakpoints/preferência de movimento. Listeners de pointer removidos via AbortController. Sem RAF decorativo permanente, canvas ou GLB. SVG usa viewBox e imagem tem dimensões explícitas. Reduced motion mantém toda a informação sem reveals/parallax. Menu, carrossel por teclado, skip link, foco, status de cópia e semântica preservados. Dependências de motion ~117 KB sem compressão.

Referências técnicas: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ e https://gsap.com/docs/v3/Plugins/ScrollTrigger/.

## Revisão de motion após feedback
A primeira passagem ficou discreta demais. A segunda acrescenta caracteres com perspectiva no nome, títulos com máscaras por palavra e reversão ao sair da tela, contraste progressivo no texto, revelação escalonada dos projetos, parallax mais perceptível, órbita ativa somente no hero visível e aba ativa, inclinação das capas e botões magnéticos para mouse preciso. O split usa aria-label e é desfeito no cleanup; reduced-motion remove todos os ScrollTriggers e restaura o HTML original. Testado em navegador: matrizes dos caracteres mudam durante a entrada, 11 triggers desktop, zero após reduced-motion, sem duplicação de split e sem erros JS.

## Introdução de carregamento
A pedido do usuário, aplicado o conceito da referência: overlay fixo, monograma preenchido verticalmente e progresso suavizado dos recursos essenciais (retrato, fontes e DOM). Não representa bytes transferidos. Preloader independente de GSAP com saída de 450 ms; motion aguarda a liberação. Bootstrap inline libera a página em no máximo seis segundos mesmo se o script externo falhar. Sem JS o overlay permanece oculto. Durante a intro, o conteúdo fica inert; ao terminar, foco/rolagem são liberados. Reduced-motion elimina transições e tempo mínimo. Testes em desktop/mobile, reduced-motion, script bloqueado e JS desativado.

## Luz projetada no hero
A referência fornecida usa imagem, vídeo e fade no hero; o código não demonstra a origem exata da iluminação da captura. Recriado com três campos de gradiente estáticos (violeta, azul, ciano), linha luminosa na base e crossfade GSAP de 15 segundos. Apenas opacidade é animada; não há vídeo adicional, blur animado ou WebGL. Timeline pausa fora de tela e com aba oculta; reduced-motion preserva luz violeta estática.
