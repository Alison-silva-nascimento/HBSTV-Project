import concurrent.futures, hashlib, html, json, mimetypes, re, time, urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
from html.parser import HTMLParser

ROOT=Path(__file__).resolve().parents[1]
BASE='https://ranksorg.godaddysites.com/'
OUT=ROOT/'dist'/'assets'/'archive'
OUT.mkdir(parents=True,exist_ok=True)

class Node:
 def __init__(self,tag='',attrs=None,parent=None):self.tag=tag;self.attrs=dict(attrs or []);self.parent=parent;self.children=[]
 def text(self):return ''.join(('\n' if c.tag=='br' else c.text()) if isinstance(c,Node) else c for c in self.children)
 def descendants(self):
  for c in self.children:
   if isinstance(c,Node):yield c;yield from c.descendants()

class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.root=Node();self.current=self.root
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs,self.current);self.current.children.append(n)
  if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:self.current=n
 def handle_endtag(self,tag):
  n=self.current
  while n.parent:
   if n.tag==tag:self.current=n.parent;break
   n=n.parent
 def handle_data(self,data):self.current.children.append(data)

def fetch(url):
 for attempt in range(3):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 RANKS archive migration'}),timeout=45) as r:return r.read(),r.headers.get('Content-Type','')
  except Exception:
   if attempt==2:raise
   time.sleep(1)

def clean(text):return '\n'.join(re.sub(r'[ \t\r\f\v]+',' ',x).strip() for x in text.split('\n') if x.strip())
def absolute(u):return urljoin(BASE,html.unescape(u))
def imageurl(n):
 for key in ['data-srclazy','data-src','src']:
  v=n.attrs.get(key,'')
  if v and not v.startswith('data:'):return absolute(v)
 return None

def blocks_for(n):
 blocks=[]
 def add(b):
  if not blocks or blocks[-1]!=b:blocks.append(b)
 def visit(n):
  if n.tag in {'script','style','svg','noscript'}:return
  a=n.attrs
  if n.tag=='img':
   src=imageurl(n)
   if src and '/static/' not in src:add({'type':'image','src':src,'originalSrc':src,'alt':a.get('alt','')})
   return
  if n.tag in {'iframe','video','source'}:
   src=a.get('data-srclazy') or a.get('src')
   if src:add({'type':'video','src':absolute(src),'href':absolute(src),'text':a.get('title','Vídeo do acervo')})
   return
  if n.tag=='a' and a.get('href'):
   href=absolute(a['href']);text=clean(n.text())
   if href.startswith(('http:','https:')) and ('godaddy.com' not in href):
    add({'type':'video' if re.search(r'youtu\.be/|youtube\.com/(?:watch|embed)',href) else 'link','href':href,'text':text or 'Abrir registro','src':href} if re.search(r'youtu\.be/|youtube\.com/(?:watch|embed)',href) else {'type':'link','href':href,'text':text or 'Abrir registro'})
  if re.fullmatch(r'h[1-6]',n.tag):
   t=clean(n.text())
   if t:add({'type':'heading','text':t,'level':int(n.tag[1])})
   return
  if a.get('data-ux')=='Text' or n.tag=='p':
   t=clean(n.text())
   if t:add({'type':'text','text':t})
   for c in n.descendants():
    if c.tag in {'img','iframe','video','a'}:visit(c)
   return
  for key in ['style','data-style']:
   for u in re.findall(r'url\([\x22\x27]?([^\)\x22\x27]+)',a.get(key,'')):
    if 'isteam/ip/' in u and '/static/' not in u:add({'type':'image','src':absolute(u),'originalSrc':absolute(u),'alt':''})
  for c in n.children:
   if isinstance(c,Node):visit(c)
 visit(n)
 return blocks

def extract(url,raw):
 parser=Parser();parser.feed(raw);root=parser.root
 nodes=list(root.descendants());title=next((clean(n.text()).split('| RANK')[0].strip() for n in nodes if n.tag=='title'),'RANK S')
 slug=urlparse(url).path.strip('/') or 'inicio'
 widgets=[n for n in nodes if 'widget' in n.attrs.get('class','').split() and not any(x in n.attrs.get('class','') for x in ['widget-header','widget-footer','widget-popup','widget-messaging','widget-cookie'])]
 sections=[];blocks=[]
 for n in widgets:
  bs=blocks_for(n)
  if not bs:continue
  sections.append({'title':next((b['text'] for b in bs if b['type']=='heading'),title),'blocks':bs})
  blocks.extend(bs)
 links=[absolute(n.attrs['href']) for n in nodes if n.tag=='a' and n.attrs.get('href')]
 # Preserve additional configured video destinations (some GoDaddy widgets hydrate from data attributes).
 known={b.get('src') for b in blocks}|{b.get('href') for b in blocks}
 for u in re.findall(r'(?:https?:)?//(?:www\.)?(?:youtube(?:-nocookie)?\.com/embed/|youtu\.be/)[A-Za-z0-9_?=&/.-]+',html.unescape(raw)):
  u=absolute(u)
  if u not in known:blocks.append({'type':'video','href':u,'src':u,'text':'Vídeo do acervo'});known.add(u)
 return {'slug':slug,'title':title,'url':url,'blocks':blocks,'sections':sections},links

def main():
 sitemap,ct=fetch(BASE+'sitemap.website.xml');(ROOT/'research'/'sitemap.website.xml').write_bytes(sitemap)
 urls=[absolute(u.replace('http://','https://')) for u in re.findall(r'<loc>(.*?)</loc>',sitemap.decode())]
 queue=list(dict.fromkeys([BASE]+urls));seen=set();pages=[];failures=[]
 while queue:
  batch=[u for u in queue if u not in seen];queue=[]
  if not batch:break
  def getpage(u):
   try:
    data,ct=fetch(u)
    if 'text/html' not in ct:return u,None,[]
    raw=data.decode('utf-8-sig');p,links=extract(u,raw)
    (ROOT/'research'/((p['slug'] if p['slug']!='inicio' else 'original')+'.html')).write_text(raw,encoding='utf8')
    return u,p,links
   except Exception as e:return u,None,[str(e)]
  with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
   for u,p,links in pool.map(getpage,batch):
    seen.add(u)
    if p:
     pages.append(p);print('PAGE',p['slug'],len(p['blocks']),flush=True)
     for link in links:
      x=urlparse(link)
      if x.hostname==urlparse(BASE).hostname and not x.query and x.path not in {'/signin','/privacy-policy'}:
       canonical=BASE+x.path.strip('/')
       if canonical==BASE:canonical=BASE
       if canonical not in seen and not re.search(r'\.(?:jpg|png|gif|svg|pdf|xml|webmanifest)$',x.path,re.I):queue.append(canonical)
    else:failures.append({'url':u,'error':links})
  queue=list(dict.fromkeys(queue))
 assets={}
 for p in pages:
  for b in p['blocks']:
   if b['type']=='image':
    original=b['src'].split('/:/')[0];assets[original]=None
 def download(original):
  suffix=Path(unquote(urlparse(original).path)).suffix.lower()
  if suffix not in ['.jpg','.jpeg','.png','.webp','.gif','.svg']:suffix='.jpg'
  name=hashlib.sha256(original.encode()).hexdigest()[:20]+suffix
  file=OUT/name
  try:
   if not file.exists():
    data,ct=fetch(original)
    if not ct.startswith('image/'):raise ValueError('Not an image: '+ct)
    file.write_bytes(data)
   return original,{'src':'assets/archive/'+name,'bytes':file.stat().st_size}
  except Exception as e:return original,{'src':original,'error':str(e)}
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
  for i,(u,a) in enumerate(pool.map(download,assets)):
   assets[u]=a
   if i%20==0:print('ASSETS',i+1,'/',len(assets),flush=True)
 for p in pages:
  for b in p['blocks']:
   if b['type']=='image':b['src']=assets[b['originalSrc'].split('/:/')[0]]['src']
  # sections refer to the same blocks and therefore retain their downloaded destinations.
 pages.sort(key=lambda p:queue_order.index(p['slug']) if p['slug'] in queue_order else 99)
 counts={'pages':len(pages),'blocks':sum(len(p['blocks']) for p in pages),'images':len(assets),'downloadedImages':sum('error' not in a for a in assets.values()),'videoLinks':sum(b['type']=='video' for p in pages for b in p['blocks']),'textBlocks':sum(b['type'] in {'heading','text'} for p in pages for b in p['blocks'])}
 result={'source':BASE,'migratedAt':'2026-10-31','pages':pages,'assets':assets,'counts':counts,'failures':failures}
 (ROOT/'dist'/'archive-data.js').write_text('window.RANKS_ARCHIVE = '+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
 (ROOT/'research'/'migration-report.json').write_text(json.dumps({'counts':counts,'pages':[{'slug':p['slug'],'title':p['title'],'blocks':len(p['blocks']),'sections':len(p['sections'])} for p in pages],'failures':failures,'assetFailures':{u:a for u,a in assets.items() if 'error' in a}},ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps(counts),flush=True)

queue_order=['inicio','events-2025','events-2024','events-2023','major-history','gse-forum','tsl-forum','hall-of-fame','hall-of-fame-3','top-20-players','top-1-teams-of-years','awards','ak-de-ouro-awards','news-competitive']
if __name__=='__main__':main()
