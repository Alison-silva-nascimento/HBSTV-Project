# HBSTV.ORG

Histórico competitivo de Block Strike em HTML, CSS e JavaScript. Código, dados e imagens ficam neste repositório. A aplicação é estática e não precisa de dependências externas para funcionar.

## Executar e verificar

Use Node.js 22 ou superior:

```sh
node server.cjs
node scripts/verify.cjs
```

Abra http://127.0.0.1:4173. Os comandos npm start, npm test e npm run build são atalhos opcionais. O build verifica o site preparado em dist; não reconstrói dados históricos automaticamente.

## Publicar no Cloudflare Pages

Conecte o repositório no painel Workers & Pages → Pages → Import an existing Git repository.

| Configuração | Valor |
|---|---|
| Branch de produção | main |
| Framework | None |
| Comando de build | node scripts/verify.cjs |
| Diretório publicado | dist |
| Diretório raiz | raiz do repositório |
| Node.js | 22 |

O arquivo wrangler.toml também declara dist como saída do Pages. Após conectar o Git, novos pushes em main geram deploys automaticamente. O projeto usa navegação por hash, sem necessidade de regras especiais de redirecionamento.

Alternativa via Wrangler, em uma máquina autenticada na conta Cloudflare:

```sh
npx wrangler pages deploy dist --project-name hbstv --branch main
```

Prefira a integração Git desde a criação se desejar deploy automático. Consulte a [documentação de HTML estático](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) e a [integração Git](https://developers.cloudflare.com/pages/get-started/git-integration/).

## Dados e manutenção

- dist/: arquivos publicados, incluindo imagens e índices gerados.
- research/: fontes preservadas, correções confirmadas e construtores dos índices.
- research/player-aliases.json: grafias alternativas confirmadas.
- research/team-record-corrections.json: títulos e elencos confirmados.
- research/MAINTENANCE.md: incorporação de correções exportadas pelo painel.
- validate-*.cjs: verificações dos dados históricos.

O painel #manutencao salva rascunhos no navegador. Exportar um rascunho não altera a base pública: incorpore o arquivo ao projeto, revise, execute as verificações e publique por Git.

Totais agregados do Hall of Fame e registros individualizados têm coberturas diferentes. Filtros anuais usam as fichas documentadas. Equipes de gerações distintas, como GC 2018/2019 e GT 2021/2023, têm IDs separados.

O cadastro original e as imagens preservadas têm origem no RANK S e nos registros fornecidos pelo responsável pelo HBSTV. Este repositório não concede licença sobre marcas ou materiais de terceiros.
