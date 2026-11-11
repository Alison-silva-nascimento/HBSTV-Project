(() => {
const data=window.HBSTV_PLAYER_INDEX,esc=escapeHtml;if(!data)return;
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const key=s=>norm(data.aliases[norm(s)]||s).replace(/0/g,'o');
const records=new Map(data.players.map(p=>[p.id,p]));
window.getRegisteredPlayerId=name=>{const id=key(name);return records.has(id)?id:null;};
const empty='<p class="gp-empty">Sem registro disponível.</p>';
const title=s=>s.replace(/\s*\[TIER[^\]]*\]/gi,'').replace(/\s*\|\s*/g,' | ');
function events(rows, kind) {
  if (!rows.length) return empty;
  const cards = rows.map(record => {
    const event = window.HBSTV.event(record.id);
    const major = record.major || event?.major || /[Ⓜ🅼]/u.test(record.title);
    const name = title(record.title);
    const label = name + ' · ' + record.year + ' · ' + kind;
    const classes = 'gp-title gp-trophy' + (major ? ' gp-major' : '');
    const badge = major && kind === 'TÍTULO' ? 'MAJOR' : kind;
    const content = `<b class="gp-award-kind">${badge}</b>${window.renderOrganizationEmblem?.(name)||''}<strong class="gp-trophy-org">${esc(window.getTitleOrganization?.(name).short||'—')}</strong><small class="gp-trophy-year">${record.year}</small>`;
    if (!event) return `<span class="${classes}" role="img" aria-label="${esc(label)}" title="${esc(label)}">${content}</span>`;
    return `<a href="${window.HBSTV.eventHref(event.id)}" data-entity-close class="${classes}" title="${esc(label)}" aria-label="${esc(label)} — abrir campeonato">${content}</a>`;
  });
  return `<div class="gp-titles gp-trophy-gallery gp-award-gallery" aria-label="${esc(kind)}">${cards.join('')}</div>`;
}
window.renderPlayerTitleCards = (player, fallback = []) => {
  const rows = player
    ? [...new Map([...(player.historicalTitles || []), ...player.titles].map(record => [record.id, record])).values()]
    : fallback.map(title => ({ title, year: Number(title.match(/20\d{2}/)?.[0]) }));
  for (const record of player?.seasonTitles || []) {
    if (!rows.some(title => title.id === record.id)) rows.push(record);
  }
  rows.sort((a,b) => b.year - a.year);
  return `<section class="gp-section"><div class="gp-section-head"><h3>Títulos conquistados</h3><span>${rows.length} REGISTROS</span></div>${events(rows,'TÍTULO')}</section>`;
};
function teamEmblem(id){const t=[...window.HBSTV_TEAMS,...(window.HBSTV_TEAM_TAGS||[])].find(t=>t.id===id),l=t?.logo;if(!l)return `<span class="gp-team-initials" aria-hidden="true">${esc((t?.name||id).slice(0,2))}</span>`;const c=l.crop;return `<span class="gp-team-emblem"><img src="${esc(l.src)}" alt="" loading="lazy" style="width:${100/c.w}%;height:${100/c.h}%;left:${-100*c.x/c.w}%;top:${-100*c.y/c.h}%"></span>`;}
window.renderPlayerTeamCards = (player, legacyTags = []) => {
  const teams = [...window.HBSTV_TEAMS, ...(window.HBSTV_TEAM_TAGS || [])];
  const memberships = new Map((player?.teams || []).map(team => [team.id, team]));
  for (const tag of legacyTags) {
    const normalized = norm(tag);
    if (normalized === 'ntc' && ['rn','inovate'].includes(player?.id)) continue;
    const lookupTag = normalized === 'st' ? 'saintsteam' : normalized;
    const candidates = teams.filter(team =>
      [team.id, team.name, ...(team.aliases || []), ...(team.searchAliases || [])]
        .some(label => norm(label) === lookupTag));
    if (candidates.some(team => memberships.has(team.id))) continue;
    if (candidates.length === 1) {
      const team = candidates[0];
      memberships.set(team.id, {id: team.id, name: team.name, years: []});
    } else {
      const emblemId = ['gt','legendaryteam'].includes(normalized) ? candidates.find(team => team.logo)?.id : undefined;
      memberships.set('tag:' + normalized, {name: tag, years: [], emblemId});
    }
  }
  const cards = [...memberships.values()].map(team => {
    const seasons = [...team.years].sort((a,b) => b-a);
    const label = [team.name, ...seasons].join(' · ');
    const emblem = team.id || team.emblemId ? teamEmblem(team.id || team.emblemId) :
      `<span class="gp-team-initials" aria-hidden="true">${esc(team.name.slice(0,2))}</span>`;
    const content = `${emblem}<strong>${esc(team.name)}</strong>${seasons.length ? '<small>' + seasons.join(' · ') + '</small>' : ''}`;
    return team.id
      ? `<a class="gp-team-tile" href="#time/${encodeURIComponent(team.id)}" data-entity-close title="${esc(label)}">${content}</a>`
      : `<span class="gp-team-tile">${content}</span>`;
  });
  return `<section class="gp-section"><div class="gp-section-head"><h3>Equipes no histórico</h3><span>${cards.length} ${cards.length === 1 ? 'EQUIPE' : 'EQUIPES'}</span></div>${cards.length ? '<div class="gp-teams gp-team-gallery">' + cards.join('') + '</div>' : empty}</section>`;
};
window.renderDocumentedPlayerAwards = player => {
  if (!player) return '';
  return [['MVPs', 'MVP', player.mvps], ['EVPs', 'EVP', player.evps], ['MVS · Melhor sniper', 'MVS', player.mvs]]
    .filter(([, , records]) => records?.length)
    .map(([heading, kind, records]) => `<section class="gp-section"><div class="gp-section-head"><h3>${heading}</h3><span>${records.length} REGISTROS</span></div>${events(records,kind)}</section>`).join('');
};
window.showRegisteredPlayerProfile=id=>{
const p=records.get(key(id));if(!p)return false;
document.querySelector('#detail').classList.remove('image-dialog');document.querySelector('#detail').classList.add('profile-dialog','registered-player-dialog');
const best=p.rankings.length?Math.min(...p.rankings.map(r=>r.rank)):null,majors=p.titles.filter(r=>r.major).length;
const bestLabel=best?'#'+best+' — '+p.rankings.filter(r=>r.rank===best).map(r=>r.year).join(', '):'NO TOP 20 INDICATION';
showDetail(`<div class="hof-profile gp-profile"><div class="hof-identity"><div class="hof-portrait" role="img" aria-label="Silhueta padrão de ${esc(p.name)}"><span class="hof-player-label">JOGADOR</span><span class="hof-portrait-footer">HISTÓRICO COMPETITIVO<br><b>HBSTV.ORG</b></span></div><div class="hof-bio"><span class="eyebrow">${p.hallOfFame?'HBSTV · HALL OF FAME':'HBSTV · JOGADOR REGISTRADO'}</span><h2>${esc(p.name)}</h2><p class="hof-real-name">${esc(p.realNames.at(-1)||'Histórico nos registros competitivos')}</p><dl class="hof-facts"><div><dt>Equipes registradas</dt><dd>${p.teams.length}</dd></div><div><dt>MVPs registrados</dt><dd>${p.mvps.length?p.mvps.length:'NO MVP WIN'}</dd></div><div><dt>Melhor Top 20 anual</dt><dd>${esc(bestLabel)}</dd></div>${window.renderPlayerAnnualFacts?.(p.rankings)||''}<div><dt>Awards registrados</dt><dd>${p.awards.length}</dd></div>${majors?`<div><dt>Conquistas em Majors</dt><dd><span class="hof-major-badge">${majors} ${majors===1?'Major conquistado':'Majors conquistados'}</span></dd></div>`:''}</dl></div></div><div class="gp-metrics"><div><b>${p.titles.length}</b><span>Títulos registrados</span></div><div><b>${p.mvps.length}</b><span>MVPs</span></div><div><b>${p.evps.length}</b><span>EVPs</span></div><div><b>${p.rankings.length}</b><span>Top 20 anuais</span></div></div>${window.renderPlayerTitleCards(p)}${window.renderPlayerTeamCards(p)}<section class="gp-section"><div class="gp-section-head"><h3>MVPs</h3><span>${p.mvps.length} REGISTROS</span></div>${events(p.mvps,'MVP')}</section><section class="gp-section"><div class="gp-section-head"><h3>EVPs</h3><span>${p.evps.length} REGISTROS</span></div>${events(p.evps,'EVP')}</section>${p.mvs?.length?'<section class="gp-section"><div class="gp-section-head"><h3>MVS · Melhor sniper</h3></div>'+events(p.mvs,'MVS')+'</section>':''}<section class="gp-section"><div class="gp-section-head"><h3>Top 20 · Histórico anual</h3><span>${p.rankings.length} APARIÇÕES</span></div>${p.rankings.length?`<div class="gp-ranks">${p.rankings.map(r=>`<span><b>#${r.rank}</b><small>${r.year}</small></span>`).join('')}</div>`:'<p class="gp-empty">NO TOP 20 INDICATION</p>'}</section><section class="gp-section"><div class="gp-section-head"><h3>Awards vencidos</h3><span>${p.awards.length} REGISTROS</span></div>${p.awards.length?`<div class="gp-awards">${p.awards.map(r=>`<a href="#acervo/${r.source}" data-entity-close><span aria-hidden="true">♜</span><div><strong>${esc(r.category)}</strong><small>${r.year} · ${esc(r.series)}</small></div><i>↗</i></a>`).join('')}</div>`:empty}</section><p class="gp-source-note">Dados dos torneios e rankings registrados. Títulos são atribuídos quando o jogador consta na escalação campeã. MVPs e EVPs são contados por campeonato; MVS não entra nessas contagens. Campos sem registro não indicam ausência de conquistas.</p></div>`);
return true;
};
document.querySelector('#detail').addEventListener('close',()=>document.querySelector('#detail').classList.remove('registered-player-dialog'));
})();
