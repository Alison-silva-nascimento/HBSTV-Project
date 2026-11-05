(() => {
const esc=escapeHtml;
const icons={home:'⌂',players:'♙',events:'♜',stats:'▥',menu:'☰'};
const dock=document.createElement('nav');dock.className='mobile-dock';dock.setAttribute('aria-label','Navegação mobile');
dock.innerHTML=[['#inicio','Início','home'],['#jogadores-todos','Jogadores','players'],['#campeonatos','Eventos','events'],['#estatisticas','Estatísticas','stats']].map(([href,label,icon])=>`<a href="${href}"><span aria-hidden="true">${icons[icon]}</span>${label}</a>`).join('')+'<button type="button" aria-label="Abrir menu" aria-expanded="false"><span aria-hidden="true">☰</span>Menu</button>';
document.body.append(dock);
dock.querySelector('button').addEventListener('click',()=>document.querySelector('.mobile-menu-toggle').click());
let letter='';
function directory(){const list=document.querySelector('#hub-player-list');if(!list)return;
 if(!document.querySelector('.mobile-alphabet')){const bar=document.createElement('div');bar.className='mobile-alphabet';bar.setAttribute('role','group');bar.setAttribute('aria-label','Filtrar jogadores pela inicial');bar.innerHTML=['Todos',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(x=>`<button type="button" data-initial="${x==='Todos'?'':x}" aria-pressed="false">${x}</button>`).join('');list.before(bar);letter='';}
 document.querySelectorAll('[data-initial]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.initial===letter)));
 list.querySelectorAll('.hub-person').forEach(a=>{const name=a.querySelector('strong').textContent.trim();a.hidden=!!letter&&!name.toUpperCase().startsWith(letter);});
}
function enhance(){
 const hash=location.hash||'#inicio';document.body.classList.toggle('mobile-home',hash==='#inicio');
 dock.querySelectorAll('a').forEach(a=>{const active=a.hash===hash||(a.hash==='#jogadores-todos'&&hash.startsWith('#jogador/'))||(a.hash==='#campeonatos'&&hash.startsWith('#campeonato/'));if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 directory();
 const profile=document.querySelector('.hub-full-profile');
 if(profile&&!profile.querySelector('.mobile-profile-tabs')){const sections=[...profile.querySelectorAll('.gp-section,.hof-section')].filter(s=>s.querySelector('h3'));if(sections.length){const tabs=document.createElement('nav');tabs.className='mobile-profile-tabs';tabs.setAttribute('aria-label','Seções do perfil');tabs.innerHTML=sections.map((s,i)=>{s.id='profile-section-'+i;return `<button type="button" data-profile-section="${i}">${esc(s.querySelector('h3').textContent)}</button>`;}).join('');const metrics=profile.querySelector('.gp-metrics,.hof-metrics');(metrics||profile.firstElementChild).after(tabs);}}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-initial]');if(b){letter=b.dataset.initial;directory();}const t=e.target.closest('[data-profile-section]');if(t){document.querySelector('#profile-section-'+t.dataset.profileSection)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}});
document.addEventListener('input',e=>{if(e.target.id==='hub-player-search'){letter='';queueMicrotask(directory);}});
window.addEventListener('hashchange',()=>queueMicrotask(enhance));
new MutationObserver(()=>dock.querySelector('button').setAttribute('aria-expanded',String(document.body.classList.contains('mobile-menu-open')))).observe(document.body,{attributes:true,attributeFilter:['class']});
enhance();
})();
