(() => {
 const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/0/g,'o').replace(/[^a-z\d]+/g,' ').trim();
 const aliasMap={tabsenn:['tabsen','tab'],c0njure:['conjure']};
 function category(label){const s=norm(label);if(/equipe|time |torneio|organizacao/.test(s))return null;if(/igl/.test(s))return 'Melhor IGL';if(/rifler/.test(s))return 'Melhor rifler';if(/awp|awm|sniper/.test(s))return 'Melhor AWP';if(/revelacao/.test(s))return 'Jogador revelação';if(/clutch/.test(s))return 'Melhor jogador em clutch';if(/completo|complete/.test(s))return 'Jogador completo';if(/estrangeiro|gringo|europ/.test(s))return 'Melhor jogador estrangeiro';if(/melhor jogador|melhor player/.test(s))return /bstv/.test(s)?'Melhor jogador · BSTV':'Melhor jogador';return null;}
 window.getPlayerAwards=(player,records=window.RANKS_AWARDS?.records||[])=>{
   const byCategory=new Map(),aliases=[player.name,...(aliasMap[String(player.name).toLowerCase()]||[])].map(norm);
   const add=(label,year)=>{const c=category(label);if(!c)return;if(!byCategory.has(c))byCategory.set(c,new Set());byCategory.get(c).add(Number(year));};
   for(const record of records){const words=norm(record.winner).split(' ');if(aliases.some(alias=>words.includes(alias)||norm(record.winner)===alias))add(record.category,record.year);}
   const section=player.text.match(/PREMIAÇÕES[\s\S]*?(?=RECORDES|TEAMS|PRINCIPAIS|$)/i)?.[0]||'';
   for(const line of section.split('\n'))for(const match of line.matchAll(/20\d{2}/g))add(line,match[0]);
   return [...byCategory].map(([category,years])=>({category,years:[...years].sort((a,b)=>a-b),count:years.size})).sort((a,b)=>b.count-a.count||a.category.localeCompare(b.category,'pt-BR'));
 };
})();
