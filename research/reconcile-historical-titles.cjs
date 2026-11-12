const organizers = {
  gz: 'GAMEZONE', gamezone: 'GAMEZONE', pns: 'PNL', pnl: 'PNL', bsg: 'BSG'
};

function normalizeTitle(title, year, reviewed = true) {
  const text = title.replace(/[Ⓜ🅼]\uFE0F?/gu, '').normalize('NFKC')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const match = text.trim().match(/^(.+?)\s*(?:\||\s+i\s+)\s*(.+)$/);
  if (!match) return null;
  const tag = match[1].replace(/[^a-z0-9]/g, '');
  let organizer = organizers[tag] || match[1].trim().toUpperCase();
  let name = match[2].replace(new RegExp('\\b' + year + '\\b', 'g'), '')
    .replace(/[^a-z0-9]/g, '');
  if (year === 2019 && organizer === 'TSL' && name === 'hardnessproleague') organizer = 'GSE';
  const variants = {
    '2018:TSL': {cbbs: 'cbbs20'},
    '2019:GSE': {majorextrememasters: 'brasilextrememastersmajor', extrememastersmajor: 'brasilextrememastersmajor',
      tour2: 'tourii', tuesseason1: 'tuesseasonone', hardnessproleague: 'hplseason3', gplseason2: 'hplseason2', hardnessproleagueseason2: 'hplseason2'},
    '2020:GSE': {tour3: 'tour', touriii: 'tour'},
    '2020:TSL': {ronovatedgameleague: 'renovatedgameleague'},
    '2020:ACE': {leaguecup: 'cupseason1', cup: 'cupseason1'},
    '2020:MAWARE': {seasonone: 'season'},
    '2021:GSE': {masters: 'mastersinverno', msters: 'mastersinverno'},
    '2021:SUVOH': {majorcup: 'major'},
    '2021:LLP': {strikeone: 'strikeoneseasonfive', strikeoneseason5: 'strikeoneseasonfive'},
    '2021:TSL': {majorcup: 'major', smack: 'smackcup'}
  };
  const reviewedVariants = {
    '2023:TSL': {blastleague: 'blaststrikeleague'},
    '2023:RANK S': {invitional: 'invitationalleague', invitational: 'invitationalleague',
      dreamhack: 'dreamhackbrazil', majorleague: 'major'},
    '2024:LLP': {strikeone: 'strikeoneseason4', strikeone40: 'strikeoneseason4'},
    '2024:BCN': {challengersbrasil: 'challengersbrazil', challengersbr: 'challengersbrazil'},
    '2024:GAMEZONE': {pslseason1: 'proseriesleague', psls1: 'proseriesleague',
      pslseason2: 'proseriesleagueseason2', psls2: 'proseriesleagueseason2',
      pslseason3: 'proseriesleagueseason3', psls3: 'proseriesleagueseason3'},
    '2024:PREMIER': {premierseriea: 'premierleaguea', premierleagueseriea: 'premierleaguea'},
    '2024:WHL': {worldrankingseason2: 'worldrankings2'},
    '2025:BCN': {finals25: 'finals', yallacampass: 'yallacompass'},
    '2025:LCS': {leagueseason1: 'leagues1', leagueseason2: 'leagues2', lcsleagues2: 'leagues2'},
    '2025:WHL': {leagueseason2: 'leagues2'},
    '2025:XMS': {mastersleague: 'masterleague'}
  };
  name = variants[year + ':' + organizer]?.[name] || name;
  if (reviewed) name = reviewedVariants[year + ':' + organizer]?.[name] || name;
  return { organizer, key: year + ':' + organizer + ':' + name };
}

module.exports = ({ archive, players, events, key }) => {
  const eventByName = new Map();
  for (const e of events.values()) {
    const name = normalizeTitle(e.title, e.year);
    if (!name) continue;
    const candidates = eventByName.get(name.key) || [];
    candidates.push(e);
    eventByName.set(name.key, candidates);
  }

  for (const page of archive.pages.filter(page => /^hall-of-fame/.test(page.slug))) {
    for (const section of page.sections) {
      const heading = section.blocks.find(block => block.level === 4)?.text || '';
      const nickname = heading.match(/(?:´´|“|")([^´”"]+)(?:´´|”|")/)?.[1];
      const player = nickname && players.find(player => player.id === key(nickname));
      if (!player) continue;
      const text = section.blocks.filter(block => block.type === 'text').map(block => block.text).join('\n');
      const list = text.split(/PRINCIPAIS T[ÍI]TULOS/i)[1] || '';
      const titles = new Map((player.historicalTitles || []).map(title => [title.id, title]));
      for (const match of list.matchAll(/🥇([^\n]+)/g)) {
        const title = match[1].trim();
        const year = Number(title.match(/20\d{2}/)?.[0]);
        const name = year && normalizeTitle(title, year);
        if (!name) continue;
        const candidates = eventByName.get(name.key) || [];
        let event = candidates.length === 1 ? candidates[0] : null;
        // A title in the Hall of Fame can include a team member absent from the recorded lineup.
        // If the lineup omits the player, require a matching season with the winning team.
        if (event?.roster.length && !event.roster.includes(player.id)) {
          const wasOnWinningTeam = player.teams.some(team =>
            event.winners.includes(team.id) && team.years.includes(year));
          if (!wasOnWinningTeam) {
            const previousMatch = normalizeTitle(title, year, false)?.key ===
              normalizeTitle(event.title, year, false)?.key;
            if (previousMatch) continue;
            event = null;
          }
        }
        const id = event?.id || 'hof:' + name.key;
        titles.set(id, {id, title: event?.title || title, year, organizer: event?.organizer || name.organizer, major: event?.major ?? /[Ⓜ🅼]/u.test(title), source: page.slug});
      }
      player.historicalTitles = [...titles.values()];
    }
  }
};


module.exports.normalizeTitle = normalizeTitle;
