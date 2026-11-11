const $=s=>document.querySelector(s);
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalizeText=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const archivePages=window.RANKS_ARCHIVE?.pages||[];
const events=[],players=[];
for(const page of archivePages){
  if(/^events-/.test(page.slug)) for(const section of page.sections){
    const content=section.blocks.filter(b=>b.type==='text').map(b=>b.text).join('\n');
    if(!/MVP|CAMPE[ÃA]O/i.test(content))continue;
    const heading=section.blocks.find(b=>b.type==='heading'&&b.level===4)?.text||section.title;
    events.push({title:section.title,year:Number(page.slug.match(/\d{4}/)[0]),org:heading.split('|')[0].trim(),winner:content.match(/CAMPE[ÃA]O\s*\[\s*([^\]]+)/i)?.[1]?.trim(),mvp:content.match(/MVP\s*\|?\s*([^\n]+)/i)?.[1]?.trim(),type:(heading+' '+section.title).match(/TIER\s*S\s*\+?/i)?.[0]?.replace(/\s+/g,' ')||'Torneio',image:section.blocks.find(b=>b.type==='image')?.src,source:page.slug,blocks:section.blocks,search:content});
  }
  if(/^hall-of-fame/.test(page.slug))for(const section of page.sections){
    const full=section.blocks.find(b=>b.type==='heading'&&b.level===4)?.text;
    if(!full)continue;
    const text=section.blocks.filter(b=>b.type==='text').map(b=>b.text).join('\n');
    const name=full.match(/(?:´´|“|”|"|''|‘)([^´“”"‘]+?)(?:´´|“|”|"|''|‘)/)?.[1]?.trim()||full;
    players.push({name,full,label:section.title.replace(/´´/g,''),mvps:text.match(/(?:^|\n)\s*[-–]?\s*(\d+)\s*x?\s*MVP\b/i)?.[1],titles:text.match(/T[ÍI]TULOS[;:\s]*\s*(\d+)/i)?.[1],initial:name[0],className:'',text,blocks:section.blocks,source:page.slug});
  }
  if(/^(gse|tsl)-forum$/.test(page.slug)){
    let video;
    for(const block of page.blocks){if(block.type==='video')video=block;if(block.type==='heading'&&block.level===4){const year=Number(block.text.match(/20\d{2}/)?.[0]);events.push({title:block.text,year,org:page.slug.startsWith('gse')?'GSE':'TSL',type:'Arquivo de final',source:page.slug,blocks:[block,...(video?[video]:[])],search:block.text});video=null;}}
  }
}
const majorPage=archivePages.find(p=>p.slug==='major-history');
if(majorPage){let pending=[];for(const block of majorPage.blocks){pending.push(block);if(block.type==='text'&&/^FINAL/i.test(block.text)){const title=pending.find(b=>b.type==='heading'&&b.level===4)?.text||'Major';events.push({title,year:Number(title.match(/20\d{2}/)?.[0]),org:title.split('|')[0].trim(),type:'Major',winner:pending.find(b=>b.type==='text'&&/^CAMPE/i.test(b.text))?.text.match(/\[([^\]]+)/)?.[1],final:block.text.replace(/^FINAL\s*\[|\]$/g,''),image:pending.find(b=>b.type==='image')?.src,source:majorPage.slug,blocks:pending,search:pending.map(b=>b.text||'').join(' ')});pending=[];}}}
players.sort((a,b)=>Number(b.titles||0)-Number(a.titles||0)||Number(b.mvps||0)-Number(a.mvps||0)||a.name.localeCompare(b.name,'pt-BR'));
events.sort((a,b)=>b.year-a.year);
let filter='Todos',showAllEvents=false,showAllPlayers=false;
function render(){const term=normalizeText($('#search').value.trim()),year=$('#year').value;const list=events.filter(e=>(filter==='Todos'||normalizeText(e.org).includes(normalizeText(filter))||e.type===filter)&&(!year||String(e.year)===year)&&normalizeText([e.title,e.org,e.winner,e.mvp,e.search].join(' ')).includes(term));const shown=showAllEvents||term||year||filter!=='Todos'?list:list.slice(0,10);$('#count').textContent=`${list.length} ${list.length===1?'REGISTRO':'REGISTROS'}`;$('#events').innerHTML=shown.length?shown.map(e=>`<button class="event-row" data-event="${events.indexOf(e)}">${e.image?`<img src="${escapeHtml(e.image)}" loading="lazy" alt="Registro de ${escapeHtml(e.winner||e.title)}">`:`<span class="event-icon">${escapeHtml(e.org.slice(0,3))}</span>`}<span class="event-title"><strong>${escapeHtml(e.title)}</strong><small>${escapeHtml(e.type)}${e.mvp?' · MVP '+escapeHtml(e.mvp):e.final?' · '+escapeHtml(e.final):''}</small></span><span class="event-year">${e.year||'—'}</span><span class="winner">${escapeHtml(e.winner||'Ver registro')} ↗</span></button>`).join('')+(shown.length<list.length?`<button class="load-more" id="more-events">Ver os ${list.length} campeonatos e finais ↓</button>`:''):'<p class="empty">Nenhum registro encontrado. Tente outro termo, ano ou circuito.</p>';
  renderPlayerCards(term);
}
function renderPlayerCards(term){
  const titleCount=p=>window.getPlayerTitleRecords?.(window.HBSTV?.person(p.name)).length ?? p.titles ?? 0;
  const ps=players.filter(p=>normalizeText(p.full+' '+p.label+' '+p.text).includes(term)),visible=showAllPlayers||term?ps:ps.slice(0,6);$('#players').innerHTML=visible.length?visible.map(p=>`<button class="player-card" data-player="${players.indexOf(p)}"><span class="avatar ${p.className}">${escapeHtml(p.initial)}</span><small>${escapeHtml(p.label)}</small><h3>${escapeHtml(p.name)}</h3><p>${p.mvps?escapeHtml(p.mvps)+' MVPs':''}${titleCount(p)?(p.mvps?' · ':'')+escapeHtml(titleCount(p))+' títulos':''} ↗</p></button>`).join('')+(visible.length<ps.length?`<button id="more-players" class="load-more">Ver os ${ps.length} jogadores do Hall of Fame ↓</button>`:''):'<p class="empty">Nenhum perfil encontrado.</p>';
}
function showDetail(content){$('#detail-content').innerHTML=content;$('#detail').showModal();}
function fullRecord(blocks){return window.ranksRenderArchiveBlocks?window.ranksRenderArchiveBlocks(blocks):blocks.filter(b=>b.text).map(b=>`<p>${escapeHtml(b.text)}</p>`).join('');}
function eventDetail(e){if(e.type==='Major'){const card=[...document.querySelectorAll('[data-major]')].find(card=>card.dataset.major===e.image);const title=card?.dataset.majorTitle||e.title;showDetail(`<h2>${escapeHtml(title)}</h2><img class="major-result-image" src="${escapeHtml(e.image)}" alt="Registro do ${escapeHtml(title)}">`);return;}showDetail(`<span class="eyebrow">${e.year||''} · ${escapeHtml(e.type)}</span><h2>${escapeHtml(e.title)}</h2><div class="record-detail">${fullRecord(e.blocks)}</div><a class="primary" href="#acervo/${e.source}" data-close-record>Explorar coleção completa ↗</a><p class="source-note">Transcrição do acervo original. Eventuais divergências entre páginas foram preservadas.</p>`);}
document.addEventListener('click',e=>{const eb=e.target.closest('[data-event]');if(eb)eventDetail(events[Number(eb.dataset.event)]);const pb=e.target.closest('[data-player]');if(pb){const p=players[Number(pb.dataset.player)];if(window.showPlayerProfile)window.showPlayerProfile(p);else showDetail(`<span class="eyebrow">HALL OF FAME · ${escapeHtml(p.label)}</span><h2>${escapeHtml(p.full)}</h2><div class="record-detail">${fullRecord(p.blocks)}</div><a class="primary" href="#acervo/${p.source}" data-close-record>Explorar Hall of Fame ↗</a>`);}const mb=e.target.closest('[data-major]');if(mb){const item=events.find(x=>x.type==='Major'&&x.image===mb.dataset.major);if(item)eventDetail({...item,title:mb.dataset.majorTitle||item.title});}const cb=e.target.closest('[data-circuit]');if(cb){filter=cb.dataset.circuit;$('#year').value='';$('#search').value='';updateTabs();render();}if(e.target.closest('#more-events')){showAllEvents=true;render();}if(e.target.closest('#more-players')){showAllPlayers=true;render();}if(e.target.closest('[data-close-record]'))$('#detail').close();});
function updateTabs(){document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;updateTabs();render();}));
$('#year').innerHTML='<option value="">Todos os anos</option>'+[...new Set(events.map(e=>e.year).filter(Boolean))].sort((a,b)=>b-a).map(y=>`<option>${y}</option>`).join('');
$('#search').addEventListener('input',render);$('#year').addEventListener('change',render);$('#close').addEventListener('click',()=>$('#detail').close());$('#detail').addEventListener('click',e=>{if(e.target===$('#detail')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#detail').open){e.preventDefault();$('#search').focus();}});
function activeNav(){const hash=location.hash||'#inicio';document.querySelectorAll('nav a,.side-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===hash||(hash.startsWith('#acervo/')&&a.getAttribute('href')==='#acervo')));}
window.addEventListener('hashchange',activeNav);activeNav();render();

document.querySelectorAll('[data-major-year]').forEach(button=>button.addEventListener('click',()=>{const year=button.dataset.majorYear;document.querySelectorAll('[data-major-year]').forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-major-group]').forEach(group=>{group.hidden=year!=='all'&&group.dataset.majorGroup!==year;});}));

document.addEventListener('DOMContentLoaded',()=>renderPlayerCards(normalizeText($('#search').value.trim())),{once:true});
