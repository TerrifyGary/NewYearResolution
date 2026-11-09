"""Offline MOE importer. Download source CSVs explicitly; this script never uses the network."""
import csv, json, re, hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[2]
sources={'primary':('primary-115.csv','https://stats.moe.gov.tw/files/school/115/e1_new.csv'),'junior':('junior-104-115.csv','https://stats.moe.gov.tw/files/opendata/j1_new.csv')}
result={'academicYear':115,'checked':'2026-11-08','license':'政府資料開放授權條款第1版','sources':{},'districts':{}}
for level,(filename,url) in sources.items():
 path=root/'packages/world-data/raw'/filename
 result['sources'][level]={'url':url,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 rows=list(csv.DictReader(path.open(encoding='utf-8-sig')))
 for row in rows:
  if row['學年度']!='115':continue
  city=re.sub(r'^\[.*?\]','',row['縣市名稱']).replace('台','臺')
  address=re.sub(r'^\[.*?\]','',row['地址']).replace('台','臺')
  rest=address.removeprefix(city)
  match=re.match(r'(.+?[區鄉鎮市])',rest)
  if not match:raise ValueError((row['代碼'],address))
  district=match[1];key=city+'/'+district
  result['districts'].setdefault(key,{'primary':[],'junior':[]})[level].append({'code':row['代碼'],'name':row['學校名稱'],'city':city,'district':district,'address':address,'public':row['公/私立']=='公立','website':row['網址']})
for group in result['districts'].values():
 for rows in group.values():rows.sort(key=lambda r:r['code'])
result['districts']=dict(sorted(result['districts'].items()))
output=root/'packages/world-data/src/schools-115.json'
output.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
print({k:sum(len(g[k]) for g in result['districts'].values()) for k in sources},'districts',len(result['districts']))
