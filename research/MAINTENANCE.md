# Manutenção do HBSTV

O painel `#manutencao` prepara correções de campeonatos e nomes alternativos. Os rascunhos são locais ao navegador. Exporte o JSON para incorporar as alterações à fonte e publicar uma versão revisada.

```powershell
node research/import-maintenance.cjs C:/caminho/hbstv-correcoes.json
node research/build-database.cjs
node validate-database.cjs
```

O importador valida os jogadores e as equipes existentes. As correções ficam em `research/registry-corrections.json`, conservam os IDs dos eventos e são reaplicadas pelo construtor do índice. A publicação segue o fluxo do Sites.

Para refazer os dados extraídos das fontes após uma nova confirmação de identidade:

```powershell
node research/build-team-years.cjs
node research/build-team-profiles.cjs
node research/build-player-index.cjs
node research/build-database.cjs
node validate-general-players.cjs
node validate-database.cjs
```

`player-aliases.json` reúne nomes alternativos confirmados; `player-identity-corrections.json` conserva grafias e nomes confirmados. GC 2018/2019 e GT 2021/2023 têm IDs distintos. Totais originais do Hall of Fame são preservados. Filtros anuais usam registros individualizados, sem repartir os totais agregados.
