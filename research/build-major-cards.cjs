const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const logo={
 chaos:{file:'ad01ce3028b8f3b83dae.jpeg',width:1500,height:1500,crop:137,x:54,y:28},
 gt:{file:'fe536df0c4f9d35c5061.jpg',width:631,height:717,crop:112,x:109,y:166},
 infinity:{file:'de3443dafa74cd6a62ab.jpeg',width:1500,height:1500,crop:137,x:54,y:28},
 astralis:{file:'dfd80ec13b6069c38926.jpg',width:624,height:705,crop:111,x:102,y:300},
 gc:{file:'450cbb3f1a617981795b.jpg',width:628,height:707,crop:112,x:105,y:300},
 razer:{file:'450cbb3f1a617981795b.jpg',width:628,height:707,crop:112,x:19,y:23}
};
const editions=[
 {year:2023,title:'RANK S · Major',winner:'CHAOS',logo:'chaos',image:'67b535053e8ba3d242da.jpeg'},
 {year:2023,title:'WHL · Major',winner:'Legendary TeaM',logo:'gt',image:'194c5f557f9f233ff918.jpeg'},
 {year:2021,title:'SUVOH · Major',winner:'TeaM Infinity',logo:'infinity',image:'007759b02a7d7543b0a1.jpeg'},
 {year:2021,title:'TSL · Major',winner:'Legendary TeaM',logo:'gt',image:'86ed67893904be137a59.jpeg'},
 {year:2020,title:'GSE · Major Adrenaline',winner:'Astralis',logo:'astralis',image:'4ed7f41456f8697e77c6.jpg'},
 {year:2019,title:'GSE · Brasil Extreme Masters',winner:'Goblins Cheating',logo:'gc',image:'7713f3c1b8fa50d7e849.jpeg'},
 {year:2018,title:'TSL · Major Premiere 2.0',winner:'Goblins Cheating',logo:'gc',image:'188f48896736e07cbe4d.jpeg'},
 {year:2018,title:'TSL · Major Premiere',winner:'RazeR',logo:'razer',image:'ba4b48dba7cb6e5526a7.jpeg'}
];
const years=[2023,2021,2020,2019,2018];
function card(e){const l=logo[e.logo];return `<button class="major-card major-edition" data-major="assets/archive/${e.image}" data-major-title="${e.title} [${e.year}]"><span class="mini-cup team-logo" role="img" aria-label="Logo ${e.winner}" style="--logo-width:${l.width/l.crop*100}%;--logo-left:${-l.x/l.crop*100}%;--logo-top:${-l.y/l.crop*100}%"><img src="assets/archive/${l.file}" alt="" width="${l.width}" height="${l.height}" loading="lazy" decoding="async"></span><span class="edition-copy"><small>${e.title}</small><strong>${e.winner}</strong><span class="gold">CAMPEÃO · VER CONQUISTA ↗</span></span></button>`;}
const section=`<section id="majors"><div class="section-head"><h2>Major History</h2><span>8 EDIÇÕES</span></div><p class="archive-description">Selecione um ano para ver as edições e seus campeões.</p><div class="major-year-tabs" role="group" aria-label="Filtrar campeões de Major por ano">${years.map(y=>`<button type="button" data-major-year="${y}" aria-controls="major-season-${y}" aria-pressed="${y===years[0]}"${y===years[0]?' class="active"':''}>${y}</button>`).join('')}</div>${years.map(y=>{const list=editions.filter(e=>e.year===y);return `<div class="major-year-group" id="major-season-${y}" data-major-group="${y}"${y===years[0]?'':' hidden'}><div class="major-year-heading"><h3>${y}</h3><span>${list.length} ${list.length===1?'EDIÇÃO':'EDIÇÕES'}</span></div><div class="major-grid">${list.map(card).join('')}</div></div>`;}).join('')}<a href="#acervo/major-history" class="full-link">Abrir registros completos dos Majors ↗</a></section>`;
const target=path.join(root,'dist/index.html');let html=fs.readFileSync(target,'utf8');if(!/<section id="majors">[\s\S]*?<\/section>/.test(html))throw Error('Major section missing');html=html.replace(/<section id="majors">[\s\S]*?<\/section>/,section).replaceAll('20261101-dark','20261101-all-majors');fs.writeFileSync(target,html);
fs.writeFileSync(path.join(root,'research/major-editions.json'),JSON.stringify(editions,null,2));
