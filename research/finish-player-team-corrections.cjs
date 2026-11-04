const fs=require('node:fs');
let f='dist/team-profiles.js',s=fs.readFileSync(f,'utf8');s=s.replace('<span aria-hidden="true">♜</span><strong>${esc(niceTitle(r.title))}</strong>',`\${window.renderOrganizationEmblem?.(niceTitle(r.title))||'<span aria-hidden="true">♜</span>'}<strong>\${esc(niceTitle(r.title))}</strong>`);
if(!s.includes("hash==='#time/tempstormygoblinscheating'"))s=s.replace("const hash=location.hash;screen.hidden=true;","const hash=location.hash;screen.hidden=true;if(hash==='#time/tempstormygoblinscheating'){location.replace('#time/gc2019');return true;}");fs.writeFileSync(f,s);
f='dist/team-years.js';s=fs.readFileSync(f,'utf8').replace('<span aria-hidden="true">♜</span><b>${esc(titleLabel(title))}</b>',`\${window.renderOrganizationEmblem?.(titleLabel(title))||'<span aria-hidden="true">♜</span>'}<b>\${esc(titleLabel(title))}</b>`);fs.writeFileSync(f,s);
f='dist/general-players.js';s=fs.readFileSync(f,'utf8').replaceAll('renderOrganizationEmblem?.(r.title)','renderOrganizationEmblem?.(title(r.title))');fs.writeFileSync(f,s);
f='dist/portal.js';s=fs.readFileSync(f,'utf8').replace("['Briza','BR']","['Brizado','BR']");fs.writeFileSync(f,s);
