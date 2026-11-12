"""Build original summer-uniform SVGs and an offline national school catalog.
Run: python3 scripts/assets/uniforms.py
Only sourced variants receive school-specific artwork. Unknowns retain approved generic assets.
"""
import csv
import json
from html import escape
from pathlib import Path
from school_directory import build as build_school_directory

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'packages/world-data/src'
PUBLIC = ROOT / 'apps/web/public'
ART = PUBLIC / 'illustrations/uniforms/schools'
REFERENCES = json.loads((DATA / 'uniform-references.json').read_text())
SCHOOLS = json.loads((DATA / 'high-115.json').read_text())


def svg(label, design):
    top, bottom = design['top'], design['bottom']
    collar, cut = design['collar'], design['cut']
    if cut not in ['trousers', 'shorts', 'skirt', 'skort', 'a-line', 'dress'] or collar not in ['shirt', 'double-pocket', 'double-breasted', 'sailor', 'square', 'polo', 'round']:
        raise ValueError(f'Unsupported uniform shape: {label} / {cut} / {collar}')
    ink = '#4b5e60'
    pattern = design.get('pattern')
    top_fill = 'url(#stripe)' if design.get('topPattern', pattern) == 'stripe' else top
    bottom_fill = 'url(#plaid)' if pattern == 'plaid' else bottom
    plaid = design.get('patternColors', ['#9aa99b', '#1f3530'])
    stripe = design.get('stripeColor', '#adc9d9')
    collar_fill = 'url(#plaid)' if design.get('collarPattern') == 'plaid' else design.get('collarColor', top)
    # Identical framing for shirts, trousers, skirts and skorts prevents inventory layout shifts.
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280" role="img">'
             f'<title>{escape(label)}・夏季制服插畫</title>'
             f'<defs><pattern id="stripe" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="{top}"/><path d="M2 0v7" stroke="{stripe}" stroke-width="1"/></pattern>'
             f'<pattern id="plaid" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="scale({design.get("patternScale", 1)})"><rect width="18" height="18" fill="{bottom}"/><path d="M4 0v18M0 4h18" stroke="{plaid[0]}" stroke-width="4" opacity=".65"/><path d="M13 0v18M0 13h18" stroke="{plaid[1]}" stroke-width="2"/></pattern>'
             f'<pattern id="neck" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="{design.get("tie") or top}"/><path d="M3 0v10" stroke="{plaid[0]}" stroke-width="3"/><path d="M7 0v10" stroke="{plaid[1]}" stroke-width="1"/></pattern></defs>'
             '<rect width="240" height="280" rx="30" fill="#e8efe1"/>'
             '<ellipse cx="120" cy="251" rx="72" ry="8" fill="#d1decc"/>'
             f'<g stroke="{ink}" stroke-width="2.5" stroke-linejoin="round">']
    if cut in ['trousers', 'shorts']:
        leg = 'M78 139h84l7 57h-38l-11-29-11 29H71Z' if cut == 'shorts' else 'M78 139h84l10 103h-37l-15-75-15 75H68Z'
        seam = 'M120 148v19M81 147l-3 38m81-38 3 38' if cut == 'shorts' else 'M120 148v19M81 147l-6 82m84-82 6 82'
        parts.append(f'<path d="{leg}" fill="{bottom}"/>'
                     f'<path d="{seam}" fill="none" opacity=".55"/>'
                     '<path d="M78 139h84v11H78Z" fill="#3d4543"/>'
                     '<rect x="113" y="138" width="15" height="13" rx="2" fill="#c4bba2"/>')
    elif cut != 'dress':
        parts.append(f'<path d="M78 140h84l27 96q-68 13-138 0Z" fill="{bottom_fill}"/>'
                     f'<path d="M79 140h82v9H79Z" fill="{bottom}"/>')
        if cut == 'skort':
            parts.append('<path d="M119 151v90m-29-88-8 80m69-80 8 80" fill="none" stroke="#738391"/>')
        elif cut != 'a-line':
            parts.append('<path d="m89 151-15 82m29-82-8 85m20-85v86m14-86 8 85m7-85 15 82m-1-82 17 80" '
                         'fill="none" stroke="#7d8c98" opacity=".6"/>')
    shirt = 'M82 30 38 59 59 92 77 79v61l-26 96q68 13 138 0l-26-96V79l18 13 21-33-44-29-23 11h-30Z' if cut == 'dress' else 'M82 30 38 59 59 92 77 79v61q43 8 86 0V79l18 13 21-33-44-29-23 11h-30Z'
    parts.append(f'<path d="{shirt}" fill="{top_fill}"/>')
    if cut == 'dress' and design.get('dressPleats'):
        parts.append('<path d="m89 151-15 82m29-82-8 85m20-85v86m14-86 8 85m7-85 15 82m-1-82 17 80" fill="none" stroke="#7d8c98" opacity=".6"/>')
    if cut == 'dress' and design.get('beltColor'):
        parts.append(f'<path d="M78 137q42 9 84 0v9q-42 9-84 0Z" fill="{design["beltColor"]}"/>'
                     '<rect x="113" y="138" width="14" height="12" rx="2" fill="#eee8db"/>')
    if design.get('cuffPattern') == 'plaid' or design.get('cuffColor'):
        cuff = 'url(#plaid)' if design.get('cuffPattern') == 'plaid' else design['cuffColor']
        parts.append(f'<path d="m43 67 17 26 8-6-17-26Zm154 0-17 26-8-6 17-26Z" fill="{cuff}" stroke-width="1"/>')
    if collar == 'sailor':
        sailor_fill = collar_fill if design.get('collarPattern') else design.get('collarColor', '#294b70')
        parts.append(f'<path d="M82 30 120 80l38-50-23 11h-30Z" fill="{sailor_fill}"/>')
        if design.get('trim'):
            parts.append(f'<path d="m85 36 35 44 35-44" fill="none" stroke="{design["trim"]}" stroke-width="4"/>')
    elif collar == 'square':
        parts.append(f'<path d="M84 31h23l13 16 13-16h23l-23 27h-26Z" fill="{top}"/>')
    elif collar == 'round':
        parts.append(f'<path d="M83 30q-5 29 18 35l19-16 19 16q23-6 18-35l-24 10h-26Z" fill="{collar_fill}"/>')
    else:
        parts.append(f'<path d="m83 30 24 10 13 19-22 6Zm74 0-24 10-13 19 22 6Z" fill="{collar_fill}"/>')
    if collar != 'sailor':
        parts.append(f'<path d="M{141 if collar == "double-breasted" else 120} 59V{85 if collar == "polo" else 139}" fill="none" opacity=".65"/>')
        for y in ((69, 80) if collar == 'polo' else (74, 91, 108, 125)):
            for x in ((111, 146) if collar == 'double-breasted' else (125,)):
                parts.append(f'<circle cx="{x}" cy="{y}" r="2.2" fill="#edece2" stroke-width="1"/>')
    parts.append('<path d="M143 83h15v20l-7 4-8-4Z" fill="none" stroke-width="1.5" opacity=".75"/>')
    if collar == 'double-pocket':
        parts.append('<path d="M85 83h15v20l-7 4-8-4Zm0 0 8 6 7-6m43 0 8 6 7-6" fill="none"/>')
    if design.get('tie'):
        tie = {'plaid': 'url(#plaid)', 'diagonal': 'url(#neck)'}.get(design.get('tiePattern'), design['tie'])
        if design.get('tieStyle') == 'bow' or collar == 'sailor':
            parts.append(f'<path d="m120 78-18 10 3 15 15-10 15 10 3-15Z" fill="{tie}"/>')
        else:
            parts.append(f'<path d="m120 59-6 8 3 9-6 41 9 10 9-10-6-41 3-9Z" fill="{tie}"/>')
    parts.append('<path d="m47 67 15 22m116 0 15-22" fill="none" opacity=".4"/>')
    parts.append('</g>')
    parts.append('<path d="M29 25h11m-5-5v10m169 211h9m-4.5-4.5v9" stroke="#c4ac78" stroke-width="2" stroke-linecap="round"/>')
    parts.append('</svg>')
    return ''.join(parts) + '\n'


def build():
    build_school_directory()
    ART.mkdir(parents=True, exist_ok=True)
    catalog = []
    for school in SCHOOLS:
        code = school['code']
        ref = REFERENCES.get(code)
        entry = dict(school, schoolId='moe115-high-' + code, season='summer',
                     reference=ref['source'] if ref else None,
                     label=ref['label'] if ref else school['name'], variants={})
        for gender, generic in [('male', 'white-shirt-black-trousers.svg'), ('female', 'white-shirt-black-pleated-skirt.svg')]:
            design = ref['variants'].get(gender) if ref else None
            asset = f'illustrations/uniforms/schools/{code}-{gender}-summer.svg' if design else f'illustrations/uniforms/{generic}'
            entry['variants'][gender] = dict(asset=asset, sourced=bool(design), design=design)
            if design:
                (PUBLIC / asset).write_text(svg(ref['label'], design))
        catalog.append(entry)
    if set(REFERENCES) - {r['code'] for r in SCHOOLS}:
        raise ValueError('Uniform reference has no matching official school code')
    content = json.dumps(catalog, ensure_ascii=False, separators=(',', ':')) + '\n'
    (DATA / 'uniform-catalog.json').write_text(content)
    (PUBLIC / 'illustrations/uniforms/catalog.json').write_text(content)
    map_research = json.loads((DATA / 'uniform-map-research.json').read_text())
    (PUBLIC / 'illustrations/uniforms/uniform-map-research.json').write_text(json.dumps(map_research, ensure_ascii=False, separators=(',', ':')) + '\n')
    summer_review = json.loads((DATA / 'uniform-map-summer-review.json').read_text())
    (PUBLIC / 'illustrations/uniforms/uniform-map-summer-review.json').write_text(json.dumps(summer_review, ensure_ascii=False, separators=(',', ':')) + '\n')
    with (PUBLIC / 'illustrations/uniforms/uniform-map-summer-review.csv').open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['制服記錄ID', '校碼', '學校', '款式', '來源頁', '查閱日', '審閱結果', '備註'])
        for row in summer_review['records']:
            writer.writerow([row['uniformId'], row['code'], row['name'], row['title'], row['url'], row['checked'], row['status'], row['note']])
    with (PUBLIC / 'illustrations/uniforms/uniform-map-research.csv').open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['學校代碼', '學校', '縣市', '查閱日', '制服地圖查找狀態', '本機插畫來源', '搜尋式', '相符頁面（非官方實樣證明）'])
        for row in map_research['schools']:
            ref = REFERENCES.get(row['code'])
            writer.writerow([row['code'], row['name'], row['city'], row['checked'], row['status'],
                             ref['source']['kind'] if ref else '待補', row['query'], '\n'.join(p['url'] for p in row['pages'])])
    # Keep search leads separate from verified designs and outside the game bundle.
    research = json.loads((DATA / 'uniform-research.json').read_text())
    with (PUBLIC / 'illustrations/uniforms/research.csv').open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['學校代碼', '學校', '縣市', '查閱日', '狀態', '已繪款式', '搜尋式', '候選頁面（尚未核對）'])
        for row in research['schools']:
            ref = REFERENCES.get(row['code'])
            status = '已有參考插畫' if ref else ('候選頁待核對' if row['candidates'] else '本次未找到本站索引；待再查')
            variants = '、'.join(ref['variants']) if ref else ''
            writer.writerow([row['code'], row['name'], row['city'], row['checked'], status, variants,
                             row['query'], '\n'.join(c['url'] for c in row['candidates'])])
    print(f'{len(catalog)} schools; {len(REFERENCES)} schools with sourced variants; '
          f'{sum(len(r["variants"]) for r in REFERENCES.values())} original SVGs')


if __name__ == '__main__':
    build()
