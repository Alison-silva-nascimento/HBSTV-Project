const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),c={window:{}};for(const f of ['team-profiles-data.js','general-players-data.js'])vm.runInNewContext(fs.readFileSync('dist/'+f,'utf8'),c);
const teams=c.window.HBSTV_TEAMS,players=c.window.HBSTV_PLAYER_INDEX.players;
const vanx=teams.find(t=>t.id==='vanx');assert.equal(vanx.titles.length,5);assert.equal(vanx.members.length,6);
const stt=teams.find(t=>t.id==='stompatopteam');assert(stt.rankings.some(r=>r.year===2018&&r.rank===4));assert(stt.titles.some(r=>r.title==='TSL | CBBS 2.0'&&r.year===2018));assert.equal(stt.members.length,6);assert(stt.members.some(p=>p.name==='Biondi'));
const rz=teams.find(t=>t.id==='controlz');assert(rz.searchAliases.includes('rz'));const title=rz.titles.find(r=>r.title==='G3X | CUP SEASON 2 2023');assert.equal(title.roster.length,9);assert.equal(rz.titles.length,3);
assert(players.find(p=>p.id==='raulbigode').rankings.some(r=>r.rank===10&&r.year===2024));assert(players.find(p=>p.id==='fabri').rankings.some(r=>r.rank===11&&r.year===2018));assert(players.find(p=>p.id==='ezeq').rankings.some(r=>r.rank===8&&r.year===2021));assert(players.some(p=>p.id==='sink'));assert(players.some(p=>p.id==='sick'));assert(!players.some(p=>p.id==='biond'));
console.log('VANX, STT, CONTROL Z/RZ, confirmed aliases and annual ranking corrections verified.');
