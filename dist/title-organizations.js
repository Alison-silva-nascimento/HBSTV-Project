(() => {
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const canonical=value=>value.normalize('NFKC').replace(/\s+/g,' ').trim().toUpperCase().replace(/^GAME\s*ZONE$/,'GZ').replace(/^BS:G$/,'BSG');
 window.getTitleOrganization=title=>{
   const text=String(title).normalize('NFKC').trim();
   let name=text.includes('|')?text.split('|')[0]:text.match(/^(.+?)\s+I\s+/)?.[1];
   if(!name){const keys=Object.keys(window.RANKS_ORGANIZATIONS||{}).sort((a,b)=>b.length-a.length);name=keys.find(key=>text.toUpperCase().startsWith(key+' '));}
   const key=name?canonical(name).replace(/^XMS [×&] BSTV$/,'XMS X BSTV'):'';
   const organization=window.RANKS_ORGANIZATIONS?.[key];
   const parts=key.split(/\s+[X×&]\s+/).filter(Boolean);
   if(!organization?.src && parts.length>1)return {key,label:parts.join(' × '),short:parts.join('/'),parts,logo:null};
   return {key,label:organization?.name||key||'Organização não informada',short:key||'—',logo:organization?.src?organization:null};
 };
 window.renderOrganizationEmblem=title=>{
   const org=window.getTitleOrganization(title),logo=org.logo;
   if(org.parts)return `<span class="hof-org-composite" role="img" aria-label="${esc(org.label)}">${org.parts.map(part=>window.renderOrganizationEmblem(part+' |')).join('')}</span>`;
   if(!logo)return `<span class="hof-org-initials" role="img" aria-label="${esc(org.label)}">${esc(org.short)}</span>`;
   const crop=logo.crop;const style=crop?` style="--org-width:${crop.width/crop.size*100}%;--org-left:${-crop.x/crop.size*100}%;--org-top:${-crop.y/(crop.frameHeight||crop.size)*100}%;--org-frame-height:${(crop.frameHeight||crop.size)/crop.size*100}%"`:'';
   const img=`<img src="${esc(logo.src)}" alt="" loading="lazy" decoding="async">`;
   return `<span class="hof-org-logo${crop?' is-cropped':''}" role="img" aria-label="Logo ${esc(org.label)}"${style}>${crop?'<span class="hof-org-frame">'+img+'</span>':img}</span>`;
 };
})();
