const fs=require('node:fs');
let p='dist/profiles.js',s=fs.readFileSync(p,'utf8');s=s.replace("const unique=[...new Map(rankings.map(r=>[r.year,r])).values()].sort((a,b)=>b.year-a.year);","const verified=window.HBSTV?.person(p.name)?.rankings;\n const unique=(verified?verified.map(r=>({year:r.year,rank:r.rank})):[...new Map(rankings.map(r=>[r.year,r])).values()]).sort((a,b)=>b.year-a.year);");
const marker="<div><dt>Conquistas em Majors</dt>";if(!s.includes(marker))throw Error('HOF summary marker not found');s=s.replace(marker,"${window.renderPlayerAnnualFacts?.(s.rankings)||''}"+marker);fs.writeFileSync(p,s);
p='dist/general-players.js';s=fs.readFileSync(p,'utf8');s=s.replace('<div><dt>Awards registrados</dt>','${window.renderPlayerAnnualFacts?.(p.rankings)||\'\'}<div><dt>Awards registrados</dt>');fs.writeFileSync(p,s);
p='dist/index.html';s=fs.readFileSync(p,'utf8').replaceAll('20261103-trophy-gallery','20261104-top20-audit');fs.writeFileSync(p,s);
