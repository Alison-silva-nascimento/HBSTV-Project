const fs=require('node:fs');
const replace=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
replace('research/build-team-profiles.cjs',s=>s.replaceAll(":'Raz3r'",":'RAZER'"));
const p='research/team-top5.json',rankings=JSON.parse(fs.readFileSync(p,'utf8'));for(const row of rankings)for(const t of row.teams)if(/^(raz3r|razer|raz3r team)$/i.test(t.name))t.name='RAZER';fs.writeFileSync(p,JSON.stringify(rankings,null,2)+'\n');
replace('dist/team-profiles.js',s=>s.replace("if(hash==='#time/legendaryteam')","if(hash==='#time/raz3r'){location.replace('#time/razer');return true;}if(hash==='#time/legendaryteam')"));
replace('dist/index.html',s=>s.replaceAll('20261103-gt-generations','20261103-razer'));
