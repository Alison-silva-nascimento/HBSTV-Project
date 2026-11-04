# HBSTV.ORG — auditoria de interface e responsividade

Data: 02/11/2026.

## Cobertura

65 verificações no navegador integrado: 13 rotas em 320, 375, 768, 1024 e 1440 pixels. Nenhuma apresentou rolagem horizontal da página. Os resultados individuais estão em `responsive-browser-audit.json`.

Telas: início, campeonatos, Majors, Hall of Fame, Awards, diretório de equipes, perfil de equipe, equipes do ano, Site, novidades, Top 20 Players, GSE Awards e histórico de Majors.

## Correções aplicadas

- Menu mobile identificado, com botão de 44px, fundo de bloqueio, fechamento por Escape e controle de foco por teclado.
- Rankings laterais deixam de aparecer no final das páginas em telas de até 850px.
- Perfil mobile com avatar largo acima da biografia; marca HBSTV.ORG sem corte.
- Botão de fechar detalhes com 44×44px, persistente durante a rolagem. Conferido após 930px de rolagem interna.
- Awards em cartões no celular, com categorias e fontes identificadas.
- Campos mobile com tamanho de fonte de 16px e alvos de toque maiores.
- Filtros de temporadas empilhados em tablets; tabelas, eventos e títulos longos sem estourar os contêineres.
- Menos texto técnico no Hall of Fame: quantidade de jogadores e ordenação por títulos.
- Foco visível, respeito a movimento reduzido e botão para voltar ao topo.

## Busca e perfis históricos

- Sugestões de jogadores e times por nome ou tag; navegação por setas, Enter e Escape.
- Jogadores do Hall of Fame abrem o perfil existente; outros jogadores cadastrados abrem seu histórico de equipes e conquistas com escalação registrada.
- Diretório com 41 equipes, 80 títulos deduplicados e 285 vínculos históricos equipe/jogador.
- Escalações textuais de campeonatos e vencedores dos oito Majors conferidos nas artes originais. MVPs e EVPs não foram tratados como integrantes do time campeão.
- Filtros por temporada e jogador, linha do tempo e referência de origem por conquista.
- Tags equivalentes como IK/iK, FY/Infinity e Temp Stormy/Goblins Cheating foram reunidas. Tags não confirmadas permaneceram separadas.

## Interações verificadas

- Busca por Miracle: um resultado de equipe; perfil abre com quatro títulos únicos.
- Busca por tabsen via teclado: abre o Hall of Fame de tabsenn.
- Busca por GC: encontra Temp Stormy / Goblins Cheating.
- Perfil de Temp Stormy / GC em 2019: duas logos, dez títulos e um Major.
- Busca por YonK: exibe Raz3r, temporada 2018 e conquista do Major com escalação registrada.
- Busca interna de equipes e filtro de membros por tabsen.
- Avatar mobile: painel de 185px de altura e largura integral do perfil.

## Verificações de dados

Passaram os validadores de equipes, rankings de 2017, organizações dos títulos, Awards, premiações individuais e equipes do ano. As contagens são dos registros disponíveis, não uma afirmação de cobertura integral de contratos e carreiras.
