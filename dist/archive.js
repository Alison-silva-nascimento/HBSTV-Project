/* Full public RANK S collection. Source content is rendered as text, never executable HTML. */
(() => {
  const archive=window.RANKS_ARCHIVE;
  if(!archive?.pages?.length) return;
  const hallPages=archive.pages.filter(p=>/^hall-of-fame/.test(p.slug));
  const titleCount=p=>window.getPlayerTitleRecords(window.HBSTV.person(p.name)).length;
  const hallPlayers=[...players].sort((a,b)=>titleCount(b)-titleCount(a)||Number(b.mvps||0)-Number(a.mvps||0)||a.name.localeCompare(b.name,'pt-BR'));
  const hallSections=hallPlayers.map(p=>({title:p.name,blocks:p.blocks}));
  const unifiedHall={...hallPages[0],slug:'hall-of-fame',title:'Hall of Fame',sections:hallSections,blocks:hallSections.flatMap(s=>s.blocks)};
  const pages=archive.pages.filter(p=>!/^hall-of-fame/.test(p.slug));pages.splice(archive.pages.findIndex(p=>/^hall-of-fame/.test(p.slug)),0,unifiedHall);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=value=>{try{const url=new URL(value,location.href);return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}};
  const textOf=p=>[p.title,...p.blocks.map(b=>b.text||b.alt||'')].join(' ');
  const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const pageSlug=p=>p.slug||'inicio-original';
  const pageLink=p=>'#acervo/'+encodeURIComponent(pageSlug(p));
  const category=p=>/events/.test(p.slug)?'Campeonatos':/hall/.test(p.slug)?'Jogadores':/top-20/.test(p.slug)?'Rankings':/award/.test(p.slug)?'Premiações':/forum/.test(p.slug)?'Circuitos':/news/.test(p.slug)?'Notícias':/teams/.test(p.slug)?'Equipes':/major/.test(p.slug)?'Majors':'História';
  const imageSrc=b=>/^assets\/archive\/[a-zA-Z0-9._-]+$/.test(b.src||'')?b.src:safeUrl(b.src||b.localSrc||b.url);
  const metrics=p=>({images:p.blocks.filter(b=>b.type==='image').length,videos:p.blocks.filter(b=>b.type==='video').length});
  const friendly=p=>p.slug==='ak-de-ouro-awards'?'GSE Awards · AK de Ouro':/^hall-of-fame/.test(p.slug)?'Hall of Fame':p.title.replace(/\s*\|\s*RANK S\.org/ig,'').trim();
  const cardImage=p=>p.slug==='inicio'?{src:'assets/archive/rank-s-original-brand.jpeg',alt:'Marca original RANK S'}:p.blocks.find(b=>b.type==='image'&&imageSrc(b));
  let selectedCategory='Tudo',activePage=null;
  const mainContent=document.querySelector('.content');
  const landingSections=[...mainContent.children];
  const library=document.createElement('section');library.id='acervo';library.className='complete-archive';
  library.innerHTML=`<div class="section-head"><h2>Coleções HBSTV.ORG</h2><span id="archive-total"></span></div><p class="archive-description">Campeonatos, lendas, premiações e registros originais. Toda a memória do competitivo em um só lugar.</p><div id="archive-categories" class="archive-categories" role="group" aria-label="Categorias do acervo"></div><div id="archive-catalog" class="archive-catalog" aria-live="polite"></div>`;
  mainContent.insertBefore(library,document.querySelector('#comunidade'));
  const reader=document.createElement('section');reader.id='archive-reader';reader.hidden=true;mainContent.append(reader);
  const q=()=>normalize(document.querySelector('#search').value.trim());
  function renderCatalog(){const term=q();const available=pages.filter(p=>(selectedCategory==='Tudo'||category(p)===selectedCategory)&&normalize(textOf(p)).includes(term));
    document.querySelector('#archive-total').textContent=`${pages.length} PÁGINAS PRESERVADAS`;
    document.querySelector('#archive-categories').innerHTML=['Tudo',...new Set(pages.map(category))].map(c=>`<button type="button" data-archive-category="${esc(c)}" class="${c===selectedCategory?'active':''}" aria-pressed="${c===selectedCategory}">${esc(c)}</button>`).join('');
    document.querySelector('#archive-catalog').innerHTML=available.length?available.map(p=>{const image=cardImage(p),m=metrics(p);return `<a href="${pageLink(p)}" class="collection-card">${image?`<img loading="lazy" src="${esc(imageSrc(image))}" alt="${esc(image.alt||friendly(p))}">`:'<span class="collection-placeholder" aria-hidden="true">S</span>'}<div><span class="eyebrow">${esc(category(p))}</span><h3>${esc(friendly(p))}</h3><p>${m.images} imagens${m.videos?' · '+m.videos+' vídeos':''}</p><span class="text-link">Explorar coleção ↗</span></div></a>`;}).join(''):'<p class="empty">Nenhuma coleção encontrada para esta busca.</p>';
  }
  function renderBlock(b,index){if(activePage?.slug==="top-20-players"&&b.type==="image"){const year=window.annualPosterYearByImage?.[b.src?.split("/").pop()],entries=window.HBSTV_ANNUAL_POSTERS?.[year];if(entries)return window.renderAnnualPlayerRanking({year,entries,source:"Classificação transcrita e conferida a partir da arte original do ranking."});}if(b.type==='player-ranking')return window.renderAnnualPlayerRanking(b);const text=esc(b.text);switch(b.type){case 'heading':return `<h3 id="registro-${index}" class="archive-heading">${text}</h3>`;case 'text':return `<p class="archive-text">${text.replace(/\n/g,'<br>')}</p>`;case 'image':{const src=imageSrc(b);return src?`<figure class="archive-figure"><button class="image-zoom" data-zoom="${esc(src)}" data-caption="${esc(b.alt||b.text||friendly(activePage||{title:'Registro RANK S'}))}" aria-label="Ampliar imagem: ${esc(b.alt||b.text||friendly(activePage||{title:'Registro RANK S'}))}"><img loading="lazy" decoding="async" src="${esc(src)}" alt="${esc(b.alt||b.text||'Registro visual do acervo '+friendly(activePage||{title:'Registro RANK S'}))}"><span>Ampliar ↗</span></button>${b.alt?`<figcaption>${esc(b.alt)}</figcaption>`:''}</figure>`:'';}case 'video':{const raw=safeUrl(b.href||b.src||b.url);const id=raw.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/)?.[1];const url=id?'https://www.youtube.com/watch?v='+id:raw;return url?`<a class="archive-video" href="${esc(url)}" target="_blank" rel="noopener"><span aria-hidden="true">▷</span><div><strong>${text||'Assistir ao registro em vídeo'}</strong><small>Abrir vídeo na plataforma original ↗</small></div></a>`:'';}case 'link':{const url=safeUrl(b.href||b.url);return url?`<a class="archive-inline-link" href="${esc(url)}" target="_blank" rel="noopener">${text||'Abrir referência'} ↗</a>`:'';}default:return '';}}
  function chunks(p){
    const indexed=p.blocks.map((b,index)=>({...b,index}));
    if(/^(gse|tsl)-forum$/.test(p.slug)){
      const list=[];let pending=[];
      for(const b of indexed){pending.push(b);if(b.type==='heading'&&b.level===4){list.push({title:b.text,blocks:pending});pending=[];}}
      if(pending.length)list.push({title:'Registros adicionais',blocks:pending});return list;
    }
    if(p.slug==='major-history'){
      const list=[];let pending=[];
      for(const b of indexed){pending.push(b);if(b.type==='text'&&/^FINAL/i.test(b.text)){list.push({title:pending.find(x=>x.type==='heading'&&x.level===4)?.text||'Major',blocks:pending});pending=[];}}
      if(pending.length)list.push({title:'Registros adicionais',blocks:pending});return list;
    }
    let offset=0;
    return (p.sections||[{title:p.title,blocks:p.blocks}]).map(section=>{const result={title:section.title,blocks:indexed.slice(offset,offset+section.blocks.length)};offset+=section.blocks.length;return result;}).filter(s=>s.blocks.length);
  }
  window.ranksRenderArchiveBlocks=blocks=>blocks.map((b,i)=>renderBlock(b,i)).join('');
  function renderReader(){if(!activePage)return;if(window.renderAwardsScreen?.(activePage.slug))return;if(window.renderTeamYearsScreen?.(activePage.slug))return;const term=q(),sections=chunks(activePage);const filtered=term?sections.filter(c=>normalize([c.title,...c.blocks.map(b=>b.text||b.alt||'')].join(' ')).includes(term)):sections;const m=metrics(activePage);
    reader.innerHTML=`<div class="reader-toolbar"><a href="#acervo" class="back-link">← Todas as coleções</a><a href="${esc(activePage.url)}" target="_blank" rel="noopener">Fonte original ↗</a></div><div class="reader-header"><span class="eyebrow">${esc(category(activePage))} · ARQUIVO RANK S</span><h2>${esc(friendly(activePage||{title:'Registro RANK S'}))}</h2><p>${/^hall-of-fame/.test(activePage.slug)?'Jogadores em ordem de títulos vencidos · ':''}${m.images} imagens preservadas${m.videos?' · '+m.videos+' vídeos':''}. Textos e registros visuais do site original.</p></div><div class="reader-tools"><label>Ir para um registro<select id="archive-jump" aria-label="Ir para um registro"><option value="">Selecione um registro</option>${sections.filter(c=>c.title!=='Abertura').map(c=>`<option value="entry-${c.blocks[0].index}">${esc(c.title)}</option>`).join('')}</select></label><span>${filtered.length} ${filtered.length===1?'SEÇÃO':'SEÇÕES'}${term?' NA BUSCA':''}</span></div><div class="reader-body">${filtered.length?filtered.map(c=>`<article id="entry-${c.blocks[0].index}" class="archive-entry">${(/^hall-of-fame/.test(activePage.slug)&&window.renderHallSection?.(c.blocks))||c.blocks.map(b=>renderBlock(b,b.index)).join('')}</article>`).join(''):'<p class="empty">Nenhum registro nesta coleção corresponde à busca. Limpe o campo para ver todos.</p>'}</div><div class="reader-end"><p>Você chegou ao final desta coleção.</p><a href="#acervo" class="primary">Explorar mais coleções ↗</a></div>`;
  }
  function route(){if(location.hash==='#jogadores'){location.replace('#acervo/hall-of-fame');return;}if(location.hash==='#acervo/hall-of-fame-3'){location.replace('#acervo/hall-of-fame');return;}const match=location.hash.match(/^#acervo\/(.+)$/);activePage=match?pages.find(p=>pageSlug(p)===decodeURIComponent(match[1])):null;
    if(match&&!activePage){location.hash='#acervo';return;}
    const hash=location.hash||'#inicio';const pageTarget={'#arquivo':'arquivo','#majors':'majors','#comunidade':'comunidade'}[hash];landingSections.forEach(s=>s.hidden=Boolean(activePage)||(pageTarget?s.id!==pageTarget:s.id!=='portal-news'));library.hidden=Boolean(activePage)||hash!=='#acervo';reader.hidden=!activePage;if(window.renderHubRoute?.()){landingSections.forEach(s=>s.hidden=s.id!=='hub-screen');library.hidden=true;reader.hidden=true;return;}if(window.renderTeamProfileRoute?.()){landingSections.forEach(s=>s.hidden=s.id!=='team-profile-screen');library.hidden=true;reader.hidden=true;return;}if(window.renderStatisticsRoute?.()){landingSections.forEach(s=>s.hidden=s.id!=='statistics-screen');library.hidden=true;reader.hidden=true;return;}
    if(activePage){renderReader();reader.scrollIntoView({block:'start'});document.title=friendly(activePage||{title:'Registro RANK S'})+' — HBSTV.ORG';}else{document.title='HBSTV.ORG — Block Strike competitivo';renderCatalog();}
  }
  document.addEventListener('click',e=>{const categoryButton=e.target.closest('[data-archive-category]');if(categoryButton){selectedCategory=categoryButton.dataset.archiveCategory;renderCatalog();}const zoom=e.target.closest('[data-zoom]');if(zoom){document.querySelector('#detail').classList.add('image-dialog');document.querySelector('#detail-content').innerHTML=`<img class="full-archive-image" src="${esc(zoom.dataset.zoom)}" alt="${esc(zoom.dataset.caption)}"><p>${esc(zoom.dataset.caption)}</p><a href="${esc(zoom.dataset.zoom)}" target="_blank" rel="noopener">Abrir imagem em tamanho completo ↗</a>`;if(!document.querySelector('#detail').open)document.querySelector('#detail').showModal();}});
  document.querySelector('#detail').addEventListener('close',()=>document.querySelector('#detail').classList.remove('image-dialog'));
  document.addEventListener('change',e=>{if(e.target.id==='archive-jump'&&e.target.value)document.getElementById(e.target.value)?.scrollIntoView({behavior:'smooth',block:'start'});});
  document.querySelector('#search').addEventListener('input',()=>{renderCatalog();renderReader();});window.addEventListener('hashchange',route);
  // Bring existing collection links into the migrated portal while retaining explicit source references.
  document.querySelectorAll('a[href^="https://ranksorg.godaddysites.com/"]').forEach(a=>{const slug=new URL(a.href).pathname.replace(/^\/+|\/+$/g,'');const p=pages.find(p=>p.slug===slug);if(p&&!/original|fonte/i.test(a.textContent)){a.href=pageLink(p);a.removeAttribute('target');a.removeAttribute('rel');}});
  const nav=document.querySelector('nav');const navLink=document.createElement('a');navLink.href='#acervo';navLink.textContent='Coleções';nav.insertBefore(navLink,nav.lastElementChild);
  const top20Link=document.querySelector('.side-nav a[href="#ranking"]');if(top20Link)top20Link.href='#acervo/top-20-players';
  const side=document.querySelector('.side-nav');side.insertAdjacentHTML('beforeend','<a href="#acervo">▤ <span>Coleções</span><b>06</b></a>');

  side.insertAdjacentHTML('beforeend','<a href="#acervo/awards">◇ <span>Awards</span><b>07</b></a>');
  document.querySelector('.hero-bottom b').textContent='ACERVO RANK S';
  const totalImages=archive.counts?.images||pages.reduce((sum,p)=>sum+metrics(p).images,0);
  document.querySelector('.stat-strip').innerHTML=`<div><b>${pages.length}</b><span>COLEÇÕES DO ACERVO</span></div><div><b>${totalImages}</b><span>IMAGENS ORIGINAIS</span></div><div><b>2017 — 2025</b><span>MEMÓRIA COMPETITIVA</span></div>`;
  const banner=document.createElement('div');banner.className='migration-banner';banner.innerHTML=`<div><strong>O acervo RANK S agora mora aqui.</strong><p>${pages.length} coleções · ${events.length} campeonatos e finais · ${players.length} jogadores históricos</p></div><a href='#acervo'>Explorar todo o acervo ↗</a>`;mainContent.insertBefore(banner,document.querySelector('#arquivo'));
  landingSections.push(banner);
  document.querySelectorAll('.side-nav a').forEach((a,i)=>{const n=a.querySelector('b');if(n)n.textContent=String(i+1).padStart(2,'0');});
  route();
})();
