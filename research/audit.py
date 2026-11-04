import json,re
from pathlib import Path
import migrate
data=json.loads((migrate.ROOT/'dist'/'archive-data.js').read_text(encoding='utf8').split(' = ',1)[1].rstrip(';\n'))
reports=[]
for page in data['pages']:
 raw=(migrate.ROOT/'research'/((page['slug'] if page['slug']!='inicio' else 'original')+'.html')).read_text(encoding='utf8')
 p=migrate.Parser();p.feed(raw)
 widgets=[n for n in p.root.descendants() if 'widget' in n.attrs.get('class','').split() and not any(x in n.attrs.get('class','') for x in ['widget-header','widget-footer','widget-popup','widget-messaging','widget-cookie'])]
 extracted=re.sub(r'\s+',' ', ' '.join(b.get('text','') for b in page['blocks']))
 missing=[];leafcount=0
 for widget in widgets:
  for n in widget.descendants():
   if n.tag in {'script','style','svg','noscript'}:continue
   ancestor=n
   excluded=False
   while ancestor is not widget:
    if ancestor.tag in {'script','style','svg','noscript'}:excluded=True;break
    ancestor=ancestor.parent
   if excluded:continue
   for c in n.children:
    if isinstance(c,str):
     t=re.sub(r'\s+',' ',c).strip()
     if t:
      leafcount+=1
      if t not in extracted:missing.append(t)
 reports.append({'slug':page['slug'],'contentWidgets':len(widgets),'textLeaves':leafcount,'missingTextLeaves':list(dict.fromkeys(missing)),'images':sum(b['type']=='image' for b in page['blocks']),'videos':sum(b['type']=='video' for b in page['blocks']),'links':sum(b['type']=='link' for b in page['blocks'])})
(migrate.ROOT/'research'/'coverage-audit.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(reports,ensure_ascii=True,indent=2))
