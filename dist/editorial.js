(()=>{
const H=window.HBSTV,rows=[...H.person('4i20').rankings].sort((a,b)=>a.year-b.year),slug='4i20-sete-temporadas';
const chips=()=>rows.map(r=>`<span><small>${r.year}</small><b>#${r.rank}</b></span>`).join('');
const banner=document.createElement('a');banner.className='editorial-banner';banner.href='#noticia/'+slug;
banner.innerHTML=`<div class="editorial-copy"><span class="eyebrow">DESTAQUE HISTÓRICO · TOP 20</span><h2>4i20: sete temporadas<br>entre os melhores.</h2><p>De #2 em 2017 ao topo em 2018 e 2021. Uma trajetória que atravessa gerações.</p><strong>Ler a matéria <span aria-hidden="true">↗</span></strong></div><div class="editorial-art" aria-hidden="true"><img src="assets/player-silhouette.svg" alt=""><b>4i20</b><span>7 TOP 20 · 2 VEZES #1</span></div><div class="editorial-years">${chips()}</div>`;
document.querySelector('.intro').after(banner);function sync(){banner.hidden=!!location.hash&&location.hash!=='#inicio';}window.addEventListener('hashchange',sync);sync();
window.render4i20Article=()=>`<header class="hub-header"><span class="eyebrow">HBSTV · DESTAQUE HISTÓRICO</span><h2>4i20: sete temporadas entre os melhores</h2><p>4 de novembro de 2026 · Rankings históricos</p></header><article class="hub-article editorial-article"><p>Estar entre os melhores em uma temporada é um marco. Repetir essa presença em sete edições do ranking conta uma história de permanência. Nos registros anuais do HBSTV, Leonardo “4i20” aparece no Top 20 de 2017, 2018, 2020, 2021, 2023, 2024 e 2025.</p><div class="editorial-years">${chips()}</div><h3>Do segundo lugar ao topo</h3><p>A trajetória registrada começa com o #2 em 2017, atrás de SanSey. Na edição seguinte, em 2018, 4i20 assume a primeira posição. Era o primeiro de dois anos em que seu nome terminaria no topo da lista.</p><p>Em 2020, o jogador ocupa o #3. Em 2021, volta ao #1. Esses dois primeiros lugares, em 2018 e 2021, são os pontos mais altos de seu histórico anual preservado no site.</p><h3>Presença em diferentes gerações</h3><p>A sequência de registros continua com o #6 em 2023. Em 2024, 4i20 retorna ao segundo lugar e, em 2025, fecha a lista como #3. São seis pódios nas sete edições em que aparece.</p><p>Esses resultados permitem acompanhar sua trajetória entre temporadas diferentes do competitivo de Block Strike. Cada posição retrata a classificação publicada naquele ano; as sete participações não correspondem a sete anos consecutivos.</p><h3>Confira a trajetória</h3><p>O perfil reúne os rankings anuais, as conquistas e as premiações registradas. No Top 20 histórico, você também pode consultar as listas completas e as artes usadas como fonte.</p><div class="editorial-actions"><a class="hub-button" href="${H.playerHref('4i20')}">Ver perfil de 4i20 ↗</a><a class="hub-button" href="#acervo/top-20-players">Consultar Top 20 por ano ↗</a></div><p class="hub-note">Fonte: rankings anuais do RANK S preservados no HBSTV, de 2017 a 2025. Texto editorial baseado nas sete classificações documentadas do jogador.</p></article>`;
window.HBSTV_EDITORIAL_FEATURES = [
{
  "id": "why-is-goat",
  "category": "Debate",
  "season": "2017–2025",
  "title": "WHY IS GOAT?",
  "mark": "GOAT?",
  "text": "Quem é o melhor jogador da história do Block Strike? Quatro trajetórias, diferentes gerações e um debate que atravessa o competitivo.",
  "stats": [
    [
      "Legado",
      "4i20 · RN"
    ],
    [
      "Gerações",
      "Tamashi · Tabsenn"
    ]
  ],
  "sections": [
    [
      "Quem é o melhor jogador da história do Block Strike?",
      "Esse debate acontece desde o início do competitivo. Em 2017, SanSey, 4i20 e Galaxy disputavam o trono. Com o ano histórico de 2018, pareceu que 4i20 seria intocável, já que seus rivais haviam se aposentado."
    ],
    [
      "RN entra na disputa",
      "Porém, em 2019, um jovem chamado Kauan “RN” ganhou destaque com grandes atuações por PC, GC e TSY. Em um ano histórico, foi coroado o Top 1 de 2019 e estabeleceu o recorde de 50 kills em uma única final de Major, marca que permanece até hoje."
    ],
    [
      "Uma rivalidade que atravessou os anos",
      "Em 2020, Sharp1 teve um ano histórico e muitos pensaram que ele entraria nesse debate. Com o passar dos anos, porém, 4i20 e RN continuaram protagonizando grandes batalhas no servidor, disputando MVPs, EVPs, títulos e finais. Em 2021, RN venceu 4i20 na grande final do SUVOH | MAJOR. Para muitos, o debate seria sempre entre os dois."
    ],
    [
      "Tamashi muda a discussão",
      "Algo mudou quando Ysn “Tamashi” se provou no competitivo brasileiro e fez história ao conquistar o Top 1 em duas edições consecutivas do Top 20, em 2023 e 2024. Um francês alcançava um feito inédito nos rankings anuais registrados. Com títulos, MVPs e EVPs, Tamashi mudou o meta e o padrão do jogo. Mesmo com RN e 4i20 ainda presentes nos rankings, havia espaço para mais um nome na discussão."
    ],
    [
      "O ápice de Tabsenn",
      "Em 2024, outro prodígio que sempre demonstrou talento chegava ao seu ápice. Gustavo “Tabsenn”, também conhecido como tab, firmou-se como um dos melhores jovens jogadores da história do Block Strike. Revelação de 2020, duas vezes melhor rifler e coroado o melhor jogador em 2025, ele acumulou atuações históricas entre 2023 e 2025 e colocou seu nome no debate."
    ],
    [
      "E para o público, quem é o GOAT?",
      "Leonardo “4i20”, Kauan “RN”, Ysn “Tamashi” ou Gustavo “Tabsenn”? Cada trajetória traz títulos, premiações e momentos que marcaram gerações. Explore os perfis e os feitos de cada jogador e forme sua opinião."
    ]
  ],
  "links": [
    [
      "#jogador/4i2o",
      "Leonardo “4i20”"
    ],
    [
      "#jogador/rn",
      "Kauan “RN”"
    ],
    [
      "#jogador/tamashi",
      "Ysn “Tamashi”"
    ],
    [
      "#jogador/tabsenn",
      "Gustavo “Tabsenn”"
    ]
  ]
},
  {
    id: 'pir4tas-primeiro-titulo-2017', category: 'História', season: 2017,
    title: 'P4 a primeira campeã da história do Block Strike', mark: 'P4', teamId: 'pir4tas',
    text: 'A campanha da P4 na TSL Major Cup e o MVP de OveR em 2017.',
    stats: [['Campeã', 'PIR4TAS'], ['MVP', 'OveR']],
    sections: [
      ['A primeira campeã', 'A P4 venceu a TSL | MAJOR CUP 2017, o primeiro torneio da história do competitivo, em uma atuação histórica na final contra a ES. Ryan “OveR” foi coroado como o MVP do torneio.'],
      ['O elenco campeão', 'Os oito jogadores — 4i20, ShelzZ, 4KKp, OveR, s1mple, Page, SanSey e zenn — fizeram história e conquistaram o primeiro torneio oficial da TSL e do Block Strike competitivo em 2017.'],
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
      ["Team Infinity","A FY terminou o ano de 2021 conquistando 5 títulos principais, incluindo o SUVOH | MAJOR 2021, vencido sobre a GT em uma MD3 histórica que encerrou a grande rivalidade no ano."],
      ["GT","A GT conquistou 4 grandes torneios no ano, incluindo o TSL | MAJOR 2021, vencido sobre a equipe russa QNTS. O destaque foi o primeiro semestre de 2021, quando a equipe dominou o cenário e conquistou grandes vitórias."],
      ["Destaques das equipes","GT e FY tinham grandes destaques em seus elencos. A FY tinha a base da lineup da PENTA eSports, oito vezes campeã e Top 1 de 2020. Já a GT, liderada por Leo “4i20” e João “4KKp”, montou uma grande base com jogadores jovens e talentosos que estavam em seu ápice mecânico no jogo."]
    ],
    links: [[H.eventHref('major:007759b02a7d7543b0a1'), 'Ver Major da SUVOH'], [H.eventHref('major:86ed67893904be137a59'), 'Ver Major da TSL']]
  }
];
})();
