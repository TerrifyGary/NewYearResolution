"""Reconcile the observed Uniform Map directory offline; never fuzzy-merge schools.

This adds searchable source identities/aliases, not admissions or historical dates.
Keep raw observations and hand-reviewed aliases separate so imports are repeatable.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'packages/world-data/src'
PUBLIC = ROOT / 'apps/web/public/illustrations/uniforms'
CITY_REGIONS = {
    '臺北市': 1, '新北市': 2, '基隆市': 3, '桃園市': 4, '新竹縣': 5, '新竹市': 5,
    '苗栗縣': 6, '臺中市': 7, '南投縣': 8, '彰化縣': 9, '雲林縣': 10,
    '嘉義縣': 11, '嘉義市': 11, '臺南市': 12, '高雄市': 13, '屏東縣': 14,
    '宜蘭縣': 15, '花蓮縣': 16, '臺東縣': 17, '澎湖縣': 18, '金門縣': 19, '連江縣': 20,
}
REGION_NAMES = ['', '臺北', '新北', '基隆', '桃園', '新竹', '苗栗', '臺中', '南投',
                '彰化', '雲林', '嘉義', '臺南', '高雄', '屏東', '宜蘭', '花蓮', '臺東', '澎湖', '金門', '馬祖']


def normalize(name, region):
    name = name.replace('台', '臺').replace('敘', '敍')
    # Only spelling, ownership/municipality prefixes and standard school suffixes.
    prefixes = r'^(國立|私立|市立|縣立|財團法人|天主教|' + '|'.join(CITY_REGIONS) + ')'
    name = re.sub(prefixes + '+', '', name)
    name = name.removeprefix(REGION_NAMES[region])
    name = re.sub(prefixes + '+', '', name)
    name = name.replace('高級中等學校', '高中').replace('高級中學', '高中')
    return re.sub(r'(高中|中學)$', '', name)


def build():
    raw = json.loads((DATA / 'uniform-map-directory.json').read_text())
    official = json.loads((DATA / 'high-115.json').read_text())
    overrides = json.loads((DATA / 'uniform-map-aliases.json').read_text())
    refs = json.loads((DATA / 'uniform-references.json').read_text())
    if len(raw['schools']) != raw['expected'] or len({s['url'] for s in raw['schools']}) != raw['expected']:
        raise ValueError('Incomplete or duplicate source directory')
    by_code = {s['code']: dict(id='moe115-high-' + s['code'], code=s['code'], name=s['name'],
                             city=s['city'], website=s['website'], kind='moe-115', aliases=[], mapEntries=[])
               for s in official}
    regions = {r['regionId']: re.sub(r'\s+\d+$', '', r['label']).replace('台', '臺') for r in raw['regions']}
    extras = []
    for source in raw['schools']:
        site_id = source['url'].rsplit('/', 1)[1]
        region = source['regionId']
        candidates = [s['code'] for s in official if CITY_REGIONS[s['city']] == region
                      and normalize(s['name'], region) == normalize(source['name'], region)]
        code = overrides.get(site_id) or (candidates[0] if len(candidates) == 1 else None)
        if code and (code not in by_code or CITY_REGIONS[by_code[code]['city']] != region):
            raise ValueError('Alias points outside its source region: ' + site_id)
        entry = dict(siteId=site_id, name=source['name'], url=source['url'], regionId=region,
                     sourceRegion=regions[region], checked=raw['checked'],
                     sourceReportsClosure='停止辦學' in source['label'],
                     match='reviewed-alias' if site_id in overrides else 'name-region' if code else 'unmatched')
        if code:
            row = by_code[code]
            row['mapEntries'].append(entry)
            if source['name'] != row['name'] and source['name'] not in row['aliases']:
                row['aliases'].append(source['name'])
        else:
            extras.append(dict(id='uniform-map-' + site_id, code=None, name=source['name'],
                               city=None, website=source['url'], kind='reference-only', aliases=[], mapEntries=[entry]))
    rows = list(by_code.values()) + extras
    # Audit all existing artwork against the complete directory, without claiming
    # that a name match verifies clothing details. Official design evidence wins.
    audit = [dict(code=code, name=by_code[code]['name'],
                  status='directory-matched' if by_code[code]['mapEntries'] else 'not-in-directory',
                  pages=[e['url'] for e in by_code[code]['mapEntries']],
                  designEvidence=ref['source']['kind'],
                  designReview='existing-source-retained') for code, ref in refs.items()]
    result = dict(checked=raw['checked'], source='https://uniform.wingzero.tw/zh-TW/schools/tw/categories/1',
                  officialCount=len(official), sourceCount=len(raw['schools']),
                  matchedSourceCount=sum(len(s['mapEntries']) for s in by_code.values()),
                  referenceOnlyCount=len(extras), schools=rows, artworkDirectoryAudit=audit)
    content = json.dumps(result, ensure_ascii=False, separators=(',', ':')) + '\n'
    (DATA / 'school-name-catalog.json').write_text(content)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    (PUBLIC / 'school-name-catalog.json').write_text(content)
    with (PUBLIC / 'school-directory.csv').open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['字典ID', '教育部校碼', '校名', '類型', '教育部縣市', '別名', '制服地圖來源頁', '來源站分類（非校址認定）', '來源站標示停止辦學'])
        for s in rows:
            writer.writerow([s['id'], s['code'], s['name'], s['kind'], s['city'], '、'.join(s['aliases']),
                             '\n'.join(e['url'] for e in s['mapEntries']),
                             '、'.join(dict.fromkeys(e['sourceRegion'] for e in s['mapEntries'])),
                             any(e['sourceReportsClosure'] for e in s['mapEntries'])])
    print(f"{len(rows)} searchable identities; {result['matchedSourceCount']} source entries linked; "
          f"{len(extras)} reference-only entries; {sum(a['status'] == 'directory-matched' for a in audit)}/{len(audit)} existing artwork identities matched")


if __name__ == '__main__':
    build()
