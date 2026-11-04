const fs=require('node:fs'),vm=require('node:vm');const c={window:{}};vm.runInNewContext(fs.readFileSync('dist/archive-data.js','utf8'),c);
// Organização confirmada pelo proprietário do acervo: GS, Super League 2023.
function correct(value){if(typeof value==='string')return value.replace(/(?:(?:GS|GTR)\s*\|\s*)?Super League 2023/gi,'GS | SUPER LEAGUE 2023');if(Array.isArray(value))return value.map(correct);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,correct(v)]));return value;}
fs.writeFileSync('dist/archive-data.js','window.RANKS_ARCHIVE = '+JSON.stringify(correct(c.window.RANKS_ARCHIVE),null,2)+';\n');
