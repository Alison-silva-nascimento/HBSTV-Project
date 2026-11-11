(()=>{
const H=window.HBSTV,rows=[...H.person('4i20').rankings].sort((a,b)=>a.year-b.year),slug='4i20-sete-temporadas';
const chips=()=>rows.map(r=>`<span><small>${r.year}</small><b>#${r.rank}</b></span>`).join('');
const banner=document.createElement('a');banner.className='editorial-banner';banner.href='#noticia/'+slug;
banner.innerHTML=`<div class="editorial-copy"><span class="eyebrow">DESTAQUE HISTÓRICO · TOP 20</span><h2>4i20: sete temporadas<br>entre os melhores.</h2><p>De #2 em 2017 ao topo em 2018 e 2021. Uma trajetória que atravessa gerações.</p><strong>Ler a matéria <span aria-hidden="true">↗</span></strong></div><div class="editorial-art" aria-hidden="true"><img src="assets/player-silhouette.svg" alt=""><b>4i20</b><span>7 TOP 20 · 2 VEZES #1</span></div><div class="editorial-years">${chips()}</div>`;
document.querySelector('.intro').after(banner);function sync(){banner.hidden=!!location.hash&&location.hash!=='#inicio';}window.addEventListener('hashchange',sync);sync();
window.render4i20Article=()=>`<header class="hub-header"><span class="eyebrow">HBSTV · DESTAQUE HISTÓRICO</span><h2>4i20: sete temporadas entre os melhores</h2><p>4 de novembro de 2026 · Rankings históricos</p></header><article class="hub-article editorial-article"><p>Estar entre os melhores em uma temporada é um marco. Repetir essa presença em sete edições do ranking conta uma história de permanência. Nos registros anuais do HBSTV, Leonardo “4i20” aparece no Top 20 de 2017, 2018, 2020, 2021, 2023, 2024 e 2025.</p><div class="editorial-years">${chips()}</div><h3>Do segundo lugar ao topo</h3><p>A trajetória registrada começa com o #2 em 2017, atrás de SanSey. Na edição seguinte, em 2018, 4i20 assume a primeira posição. Era o primeiro de dois anos em que seu nome terminaria no topo da lista.</p><p>Em 2020, o jogador ocupa o #3. Em 2021, volta ao #1. Esses dois primeiros lugares, em 2018 e 2021, são os pontos mais altos de seu histórico anual preservado no site.</p><h3>Presença em diferentes gerações</h3><p>A sequência de registros continua com o #6 em 2023. Em 2024, 4i20 retorna ao segundo lugar e, em 2025, fecha a lista como #3. São seis pódios nas sete edições em que aparece.</p><p>Esses resultados permitem acompanhar sua trajetória entre temporadas diferentes do competitivo de Block Strike. Cada posição retrata a classificação publicada naquele ano; as sete participações não correspondem a sete anos consecutivos.</p><h3>Confira a trajetória</h3><p>O perfil reúne os rankings anuais, as conquistas e as premiações registradas. No Top 20 histórico, você também pode consultar as listas completas e as artes usadas como fonte.</p><div class="editorial-actions"><a class="hub-button" href="${H.playerHref('4i20')}">Ver perfil de 4i20 ↗</a><a class="hub-button" href="#acervo/top-20-players">Consultar Top 20 por ano ↗</a></div><p class="hub-note">Fonte: rankings anuais do RANK S preservados no HBSTV, de 2017 a 2025. Texto editorial baseado nas sete classificações documentadas do jogador.</p></article>`;
window.HBSTV_EDITORIAL_FEATURES = [
  {
    id: 'pir4tas-primeiro-titulo-2017', category: 'História', season: 2017,
    title: 'PIR4TAS e o primeiro título do competitivo', mark: 'P4',
    text: 'A campanha da P4 na TSL Major Cup e o MVP de OveR em 2017.',
    stats: [['Campeã', 'PIR4TAS'], ['MVP', 'OveR']],
    sections: [
      ['A primeira campeã', 'A PIR4TAS, também conhecida pela tag P4, venceu a TSL Major Cup de 2017. O acervo do HBSTV registra a equipe como a primeira campeã da história do competitivo de Block Strike. Ryan “OveR” ficou com o MVP da edição.'],
      ['O elenco campeão', 'A ficha reúne oito jogadores: 4i20, ShelzZ, 4KKp, OveR, s1mple, Page, SanSey e zenn. Quatro deles também aparecem com a tag P4 no Top 20 da TSL daquele ano.'],
      ['Do torneio ao ranking', 'SanSey liderou a classificação anual, com 4i20 em segundo lugar. zenn ficou em sétimo e OveR em nono. A P4 também aparece em segundo lugar no ranking anual de equipes de 2017.']
    ],
    links: [[H.eventHref('2017:tslmajorcup'), 'Ver a ficha do torneio'], ['#time/pir4tas', 'Explorar a PIR4TAS'], ['#acervo/top-20-players', 'Consultar o Top 20']]
  },
  {
    id: 'dois-majors-2021', category: 'Major History', season: 2021,
    title: '2021: O ano da rivalidade histórica entre FY x GT, dois MAJORS, dois campeões', mark: '2021',
    text: 'Um ano marcado por duas equipes que dominaram o cenário em 2021, conquistando juntas 9 títulos no ano.',
    stats: [['SUVOH', 'Team Infinity'], ['TSL', 'GT 2021']],
    sections: [
      ['O título da Team Infinity', 'A Team Infinity, identificada pela tag FY, conquistou o Major da SUVOH. Entre os jogadores do elenco campeão, RN, ScreaM, Helix e FugLY também aparecem na lista de EVPs da edição.'],
      ['A conquista da GT 2021', 'A GT 2021 venceu o Major da TSL com 4i20, NIKO, Ezeq, zenn, Valknut e Alfa no elenco registrado. NIKO e Alfa foram reconhecidos como EVPs do torneio.'],
      ['Dois prêmios para 4i20', '4i20 recebeu o MVP nos dois Majors registrados de 2021. Na TSL, o prêmio veio junto do título pela GT. Na SUVOH, o MVP ficou com ele e o troféu coletivo com a FY. O jogador também terminou em primeiro lugar no Top 20 daquela temporada.']
    ],
    links: [[H.eventHref('major:007759b02a7d7543b0a1'), 'Ver Major da SUVOH'], [H.eventHref('major:86ed67893904be137a59'), 'Ver Major da TSL']]
  }
];
})();
