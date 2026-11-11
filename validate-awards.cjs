const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const load=file=>{const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'dist',file),'utf8'),context);return context.window;};
const archive=load('archive-data.js').RANKS_ARCHIVE,data=load('awards-data.js').RANKS_AWARDS;
const expected=new Set(archive.pages.filter(p=>data.sourcePages.includes(p.slug)).flatMap(p=>p.blocks.filter(b=>b.type==='image').map(b=>b.src))),actual=new Set(data.records.map(r=>r.sourceImage).filter(Boolean));
assert.deepEqual([...actual].sort(),[...expected].sort(),'Every original awards image must be transcribed');assert.equal(actual.size,36);assert.equal(data.records.filter(r=>r.group==='awards').length,28);assert.equal(data.records.filter(r=>r.group==='legacy').length,36);assert.equal(data.records.filter(r=>r.group==='history').length,41);assert.equal(new Set(data.records.map(r=>r.id)).size,data.records.length);
for(const r of data.records){assert.ok(r.year>=2017&&r.year<=2025);assert.ok(r.category&&r.winner&&r.series);if(r.sourceImage)assert.ok(fs.existsSync(path.join(__dirname,'dist',r.sourceImage)));if(r.placements){assert.equal(r.placements.length,5);assert.equal(r.placements[0].name,r.winner);r.placements.forEach((p,i)=>{assert.equal(p.position,i+1);assert.ok(Number.isInteger(p.votes)&&p.votes>0);});}}
for(const year of [2018,2019,2020,2021])assert.equal(data.records.filter(r=>r.group==='legacy'&&r.year===year).length,9);
console.log(JSON.stringify({records:data.records.length,sourceImages:actual.size,allSourceImagesTranscribed:true,publicVotes:data.records.filter(r=>r.placements).length,integrity:'passed'}));

const elements = new Map();
const listeners = {};
const element = id => {
  if (!elements.has(id)) elements.set(id, {value:'', innerHTML:'', textContent:''});
  return elements.get(id);
};
element('#search').value = 'consulta da busca global';
const context = {
  window: {RANKS_AWARDS: data},
  players: [],
  normalizeText: value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),
  escapeHtml: value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])),
  document: {
    querySelector: element,
    addEventListener: (type, callback) => { listeners[type] = callback; }
  }
};
context.window.RANKS_ARCHIVE = archive;
const app = fs.readFileSync(path.join(__dirname,'dist','app.js'),'utf8');
const setup = app.slice(0,app.indexOf('let filter=')).split('\n')
  .filter(line => !/^const (escapeHtml|normalizeText)=/.test(line)).join('\n');
vm.runInNewContext(setup,context);
for (const file of ['general-players-data.js','database-data.js','database.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'dist',file),'utf8'),context);
}
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'dist','awards.js'),'utf8'),context);
const count = () => Number.parseInt(element('#awards-count').textContent,10);
const rows = () => element('#awards-results').innerHTML;
const change = (id,value) => listeners.change({target:{id,value:String(value)}});
const search = value => listeners.input({target:{id:'awards-query',value}});
const click = (selector, value) => listeners.click({
  target: {closest: candidate => candidate === selector ? value : null}
});
assert(context.window.renderAwardsScreen('awards'));
assert.equal(count(),80);
const mergedIds = new Set([...rows().matchAll(/data-award-id="([^"]+)"/g)].map(match => match[1]));
assert.equal(mergedIds.size,80);
change('awards-category','Melhor IGL');
for (const year of [2024,2023,2021,2020,2018]) {
  change('awards-year',year);
  assert.equal(count(),1);
  assert.match(rows(),/Conferir arte/);
  assert.match(rows(),/Também registrado em STATS AWARDS/);
}
change('awards-year',2019);
assert.equal(count(),2);
assert.match(rows(),/YODA/i);
assert.match(rows(),/Amz/i);
assert.match(element('#awards-year').innerHTML,/2017/);
assert.match(element('#awards-category').innerHTML,/Melhor jogadora/);

let combinations = 0;
for (const group of ['all','awards','legacy','history']) {
  click('[data-award-group]',{dataset:{awardGroup:group}});
  const expected = data.records.filter(row => group === 'all' ? mergedIds.has(context.escapeHtml(row.id)) : row.group === group);
  assert.equal(count(),expected.length);
  for (const year of ['',...new Set(expected.map(row=>row.year))]) {
    change('awards-year',year);
    for (const category of ['',...new Set(expected.map(row=>row.category))]) {
      change('awards-category',category);
      const matches = expected.filter(row =>
        (!year || row.year === year) && (!category || row.category === category));
      assert.equal(count(),matches.length,JSON.stringify({group,year,category}));
      assert.equal((rows().match(/<tr data-award-id=/g)||[]).length,matches.length);
      combinations++;
    }
  }
}
click('[data-award-group]',{dataset:{awardGroup:'all'}});
change('awards-category','Jogador revelação');
assert.equal(count(),data.records.filter(row=>mergedIds.has(context.escapeHtml(row.id))&&row.category==='Jogador revelação').length);
search('fway emerson');
assert.equal(count(),1);
assert.match(rows(),/2024/);
change('awards-category','');
search('ry0ta');
assert.match(rows(), /RY[O0]TA/i);
assert.match(rows(), /2019/);
search('vencedor inexistente');
assert.equal(count(),0);
click('[data-awards-reset]',{});
assert.equal(count(),80);
assert.equal(element('#search').value,'consulta da busca global');
assert(context.window.renderAwardsScreen('ak-de-ouro-awards'));
assert.equal(count(),36);
assert(context.window.renderAwardsScreen('awards'));
assert.equal(count(),80);
console.log('Awards: ' + combinations + ' combinações de fonte, ano e categoria, busca e limpeza verificadas.');
