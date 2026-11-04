import concurrent.futures,json
import migrate
path=migrate.ROOT/'dist'/'archive-data.js'
data=json.loads(path.read_text(encoding='utf8').split(' = ',1)[1].rstrip(';\n'))
def upgrade(pair):
 url,asset=pair
 try:
  raw,ct=migrate.fetch(url)
  if not ct.startswith('image/'):raise ValueError(ct)
  file=migrate.ROOT/'dist'/asset['src'];file.write_bytes(raw)
  return url,len(raw),None
 except Exception as e:return url,None,str(e)
report=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for i,(u,size,err) in enumerate(pool.map(upgrade,data['assets'].items())):
  if not err:data['assets'][u]['bytes']=size
  report.append({'url':u,'bytes':size,'error':err})
  if i%20==0:print('ORIGINALS',i+1,'/',len(data['assets']),flush=True)
path.write_text('window.RANKS_ARCHIVE = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
(migrate.ROOT/'research'/'original-assets-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'originalImages':sum(not r['error'] for r in report),'failures':sum(bool(r['error']) for r in report),'bytes':sum(r['bytes'] or 0 for r in report)}))
