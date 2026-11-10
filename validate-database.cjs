const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ctx={window:{}};for(const f of ['database-data.js','general-players-data.js'])vm.runInNewContext(fs.readFileSync('dist/'+f,'utf8'),ctx);const d=ctx.window.HBSTV_DATABASE;
assert(d.players.length>=230);assert.equal(new Set(d.players.map(p=>p.id)).size,d.players.length);assert.equal(new Set(d.events.map(e=>e.id)).size,d.events.length);const ids=new Set(d.players.map(p=>p.id));for(const e of d.events){assert(e.year>=2017);assert(e.title&&e.organizer&&e.sources.length);for(const field of ['roster','mvps','evps']){assert.equal(new Set(e[field]).size,e[field].length);for(const id of e[field])assert(ids.has(id));}for(const t of e.winners)assert(d.teams.some(x=>x.id===t));}assert.equal(d.events.filter(e=>e.major).length,8);assert(d.events.some(e=>e.year===2018&&e.title.includes('2.0')&&e.winners.includes('gc2018')));const michel=d.players.find(p=>p.id==='michel');assert(michel&&michel.aliases.includes('robertinha'));assert(!d.players.some(p=>p.id==='robertinha'));assert(d.aliases.robertinha==='Michel');for(const id of ['gt2021','gt2023','gc2018','gc2019'])assert(d.teams.some(t=>t.id===id));assert.equal(d.players.reduce((sum,p)=>sum+p.rankings.length,0),160);
if(process.argv[2]){const exportData=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));assert.equal(exportData.schemaVersion,1);assert(exportData.events.every(e=>e.roster.every(id=>ids.has(id))));}console.log('Registry identities, 88 linked events, 8 Majors and 160 annual positions verified.');

assert(!d.players.some(p=>p.id==='misutaa'));assert(d.aliases.misutaa==='misuuta');assert(d.players.find(p=>p.id==='misuuta').aliases.some(a=>a.toLowerCase()==='misutaa'));

const masters = d.events.find(event => event.id === '2021:gsemasters');
const mastersRoster = [...masters.roster, ...(masters.rosterReference?.players || [])];
for (const id of ['rn', 'inovate']) assert(!mastersRoster.includes(id));
for (const id of ['nescau', 'zenn']) {
  assert(mastersRoster.includes(id));
  assert(d.players.find(player => player.id === id).titles.some(title => title.id === masters.id));
}
const shelzz = d.players.find(player => player.id === 'shelzz');
const llpTitles = [...shelzz.titles, ...(shelzz.historicalTitles || [])]
  .filter(title => title.year === 2024 && /^LLP\s*\|/.test(title.title));
assert.deepEqual([...new Set(llpTitles.map(title => title.id))], ['2024:llpstrikeones4']);
const normalizeTitle = require('./research/reconcile-historical-titles.cjs').normalizeTitle;
for (const player of d.players) for (const field of ['mvps', 'evps']) {
  const eventIds = new Set();
  const editions = new Set();
  for (const record of player[field]) {
    const event = d.events.find(event => event.id === record.id);
    assert(event?.[field].includes(player.id), player.id + ' ' + field + ' ' + record.id);
    const edition = normalizeTitle(event.title, event.year)?.key || event.id;
    assert(!eventIds.has(record.id) && !editions.has(edition), player.id + ' ' + field + ' ' + edition);
    eventIds.add(record.id);
    editions.add(edition);
  }
}
