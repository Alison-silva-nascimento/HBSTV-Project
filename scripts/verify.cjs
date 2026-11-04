const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
function run(args){const r=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);}
for(const file of fs.readdirSync(path.join(root,'dist')).filter(f=>f.endsWith('.js')))run(['--check',path.join('dist',file)]);
for(const file of ['validate-database.cjs','validate-general-players.cjs','validate-team-profiles.cjs','validate-manual-records.cjs','validate-awards.cjs','validate-player-awards.cjs','validate-team-years.cjs','validate-ranking-2017.cjs'])run([file]);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');for(const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"#]*)?"/g)){const target=match[1];if(!/^(?:https?:|data:)/.test(target)&&!fs.existsSync(path.join(root,'dist',target)))throw Error('Missing local asset: '+target);}
console.log('HBSTV: arquivos e dados verificados. Diretório de publicação: dist.');
