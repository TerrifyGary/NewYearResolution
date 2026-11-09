"""Explicit network importer for the annual RIS open API. Never runs during gameplay.
Run: python3 scripts/data-import/population.py 114
Fails closed on missing/partial/duplicate pages. Snapshot year is ROC year + 1911.
"""
import sys,json,urllib.request,collections,datetime
from pathlib import Path
roc=int(sys.argv[1]) if len(sys.argv)>1 else 114
url=f'https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/{roc}'
def fetch(page):
    with urllib.request.urlopen(url+f'?page={page}',timeout=30) as response:return json.load(response)
first=fetch(1)
assert first['responseCode']=='OD-0101-S',first.get('responseMessage')
rows=first['responseData']
for page in range(2,int(first['totalPage'])+1):rows+=fetch(page)['responseData']
assert len(rows)==int(first['totalDataSize'])
assert len({r['district_code'] for r in rows})==len(rows)
result=collections.Counter()
for r in rows:
    assert r['statistic_yyy']==str(roc)
    result[r['site_id']]+=sum(int(r[k]) for k in ['household_ordinary_m','household_business_m','household_single_m','household_ordinary_f','household_business_f','household_single_f'])
assert len(result)==368 and sum(result.values())>20000000
out={'year':roc+1911,'checked':datetime.date.today().isoformat(),'source':url,'note':f'{roc+1911}年度戶籍人口快照，非其他年度人口','districts':dict(result)}
root=Path(__file__).resolve().parents[2]
(root/'packages/world-data/src/population.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
print(len(result),sum(result.values()))
