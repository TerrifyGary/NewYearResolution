import {describe,it,expect} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {highSchoolUniforms,uniformAsset,uniformSchool} from '../packages/world-data/src/uniforms';
import highRows from '../packages/world-data/src/high-115.json';
import references from '../packages/world-data/src/uniform-references.json';
import research from '../packages/world-data/src/uniform-research.json';
import mapResearch from '../packages/world-data/src/uniform-map-research.json';
import summerReview from '../packages/world-data/src/uniform-map-summer-review.json';
import {createGame,player} from '../packages/engine/src';
import {serialize,deserialize} from '../packages/engine/src/save';

describe('summer uniform catalog and saved school identities',()=>{
 it('covers every official high-school code once and discloses every generic fallback',()=>{
  expect(new Set(highSchoolUniforms.map(r=>r.code)).size).toBe(highRows.length);
  expect(highSchoolUniforms.map(r=>r.code)).toEqual(highRows.map(r=>r.code));
  for(const row of highSchoolUniforms)for(const [gender,variant] of Object.entries(row.variants)){
   expect(existsSync(join('apps/web/public',variant.asset))).toBe(true);
   expect(uniformAsset(row.schoolId,gender as 'male'|'female','senior')).toBe(variant.asset);
   if(variant.sourced){expect(row.reference?.url).toMatch(/^https:\/\//);expect(variant.design?.description).toBeTruthy();}
   else {expect(variant.design).toBeNull();expect(variant.asset).not.toContain('/schools/');}
  }
  expect(highSchoolUniforms.filter(r=>r.reference)).toHaveLength(Object.keys(references).length);
 });
 it('uses the green North First Girls design for both curated and official IDs',()=>{
  expect(uniformAsset('fgsh','female','senior')).toBe(uniformAsset('moe115-high-353303','female','senior'));
  const art=readFileSync(join('apps/web/public',uniformAsset('fgsh','female','senior')),'utf8');
  expect(art).toContain('#43815c');expect(art).toContain('<title>北一女中');
  expect(art).not.toContain('<text'); // School labels belong to the card and accessible title, not the icon.
  expect(uniformSchool('fgsh')?.variants.female.sourced).toBe(true);
  expect(uniformSchool('fgsh')?.variants.male.sourced).toBe(false);
  expect(uniformAsset('nk-senior','female','senior')).toBe(uniformAsset('moe115-high-580301','female','senior'));
 });
 it('retains the primary pinafore and unknown-school fallbacks without changing a saved life',()=>{
  const s=createGame('saved-uniform',1998);player(s).enrollments=[{level:'senior',schoolId:'fgsh',startYear:2013,track:'general'}];
  const before=serialize(s),rng=s.rng;
  uniformAsset(player(s).enrollments[0].schoolId,'female','senior');
  expect(serialize(s)).toBe(before);expect(s.rng).toBe(rng);expect(deserialize(before)).toEqual(s);
  expect(uniformAsset('unknown','female','primary')).toContain('pinafore.svg');
  expect(uniformAsset('unknown','female','junior')).toContain('pleated-skirt.svg');
 });
 it('publishes the same offline catalog to the standalone gallery and frames every illustration consistently',()=>{
  expect(JSON.parse(readFileSync('apps/web/public/illustrations/uniforms/catalog.json','utf8'))).toEqual(highSchoolUniforms);
  for(const row of highSchoolUniforms)for(const variant of Object.values(row.variants))if(variant.sourced){
   const svg=readFileSync(join('apps/web/public',variant.asset),'utf8');expect(svg).toContain('viewBox="0 0 240 280"');expect(svg).not.toContain('<text');expect(svg).toContain('<title>');expect(svg.replace('http://www.w3.org/2000/svg','')).not.toMatch(/<image|<script|https?:\/\//);
  }
 });
 it('keeps the 487 search records distinct from confirmed artwork and excludes unrelated Google Sites',()=>{
  expect(research.schools).toHaveLength(487);
  expect(new Set(research.schools.map(r=>r.code)).size).toBe(487);
  for(const row of research.schools){
   const school=highRows.find(s=>s.code===row.code)!;expect(school).toBeTruthy();
   expect(row.name).toBe(school.name);expect(row.status).toBe('searched');
   expect(row.reviewStatus==='illustrated').toBe(!!(references as Record<string,unknown>)[row.code]);
   for(const candidate of row.candidates){
    const source=new URL(candidate.url),site=new URL(school.website);
    if(site.hostname==='sites.google.com')expect(source.pathname.split('/')[1]).toBe(site.pathname.split('/')[1]);
    else expect(source.hostname.replace(/^www\d?\./,'').endsWith(site.hostname.replace(/^www\d?\./,''))).toBe(true);
   }
  }
  const csv=readFileSync('apps/web/public/illustrations/uniforms/research.csv','utf8');
  expect(csv).toContain('候選頁面（尚未核對）');
  for(const row of research.schools)expect(csv).toContain(row.code+','+row.name+',');
 });
 it('retains senior-division designs and renders distinct collars and combined patterns',()=>{
  const school=(code:string)=>uniformSchool('moe115-high-'+code)!;
  expect(school('051302').variants.female.design?.top).toBe('#fffdf6'); // 君毅高中部白衫，不是國中部綠水手服。
  expect(school('191313').variants.female.design?.bottom).toBe('#793c49'); // 曉明高中部暗紅裙。
  expect(school('540301').variants.female.design?.patternColors).toEqual(['#b76067','#fffdf6']); // 國光高中部藍紅白格。
  expect(school('563301').variants.male.design?.cut).toBe('trousers'); // 高中新興不是國中部短褲。
  const art=(code:string,gender:'male'|'female')=>readFileSync(join('apps/web/public',school(code).variants[gender].asset),'utf8');
  expect(art('011311','female')).toContain('M120 59V85'); // Polo短門襟不延伸至裙子。
  expect(art('021310','female')).toContain('fill="url(#stripe)"');
  expect(art('021310','female')).toContain('fill="url(#plaid)"');
  expect(art('540301','female').match(/fill="url\(#plaid\)"/g)?.length).toBeGreaterThanOrEqual(2);
  expect(school('330301').variants.female.design?.collar).toBe('round');
  expect(school('191313').reference?.year).toBeNull(); // 查閱年份不能冒充文件年份。
 });
 it('keeps Uniform Map directory matches separate from third-party design descriptions',()=>{
  expect(mapResearch.schools).toHaveLength(437);
  expect(new Set(mapResearch.schools.map(r=>r.code)).size).toBe(437);
  expect(JSON.parse(readFileSync('apps/web/public/illustrations/uniforms/uniform-map-research.json','utf8'))).toEqual(mapResearch);
  for(const row of mapResearch.schools){
   expect(highRows.find(s=>s.code===row.code)?.name).toBe(row.name);
   for(const page of row.pages)expect(page.url).toMatch(/^https:\/\/uniform\.wingzero\.tw\/zh-TW\/schools\/tw\/categories\/1\/regions\/\d+\/schools\/\d+(\/uniforms\/\d+)?$/);
  }
  for(const school of highSchoolUniforms)if(school.reference?.url.includes('uniform.wingzero.tw')){
   expect(school.reference.kind).toBe('secondary');expect(['third-party-description','third-party-illustration']).toContain(school.reference.evidence);
   expect(school.reference.note).toContain('尚待校方核對');
   expect(mapResearch.schools.find(r=>r.code===school.code)?.status).toBe(school.reference.evidence==='third-party-illustration'?'illustration-reviewed':'description-reviewed');
  }
  expect(mapResearch.schools.find(r=>r.code==='553302')?.pages.some(p=>p.url.includes('/schools/40/'))).toBe(false); // 三民高中不是三民家商。
  const chubei=uniformSchool('moe115-high-040308')!;
  expect(chubei.reference?.kind).toBe('official');expect(chubei.variants.female.design?.cut).toBe('dress');
  expect(chubei.variants.female.design?.top).toBe(chubei.variants.female.design?.bottom);
  expect(chubei.variants.female.design?.collarColor).toBe('#fffdf6'); // 用校方藏青連身裙白圓領，沒有採第三方背心裙。
  expect(mapResearch.schools.find(r=>r.code==='040308')?.status).toBe('conflict-primary-used');
  expect(uniformSchool('moe115-high-061317')?.variants.female.design?.top).toBe('#f0d98e'); // 弘文高中部，不混國際部白襯衫。
 });
 it('labels image-derived prototypes separately and uses the current 鹿港 skort rather than its old uniform',()=>{
  const school=(code:string)=>uniformSchool('moe115-high-'+code)!;
  expect(school('061313').reference?.evidence).toBe('third-party-illustration');
  expect(school('061313').reference?.note).toContain('AI 示意圖');
  expect(school('020403').reference?.evidence).toBe('third-party-description');
  const lugang=highSchoolUniforms.find(s=>s.label==='鹿港高中')!;
  expect(lugang.reference?.url).toContain('/uniforms/243');expect(lugang.reference?.year).toBeNull();
  expect(lugang.variants.female.design?.cut).toBe('skort');
  const mingde=readFileSync(join('apps/web/public',school('191309').variants.female.asset),'utf8');
  expect(mingde).toContain('cx="111"');expect(mingde).toContain('cx="146"');
  const shengkung=readFileSync(join('apps/web/public',school('211304').variants.female.asset),'utf8');
  expect(shengkung).toContain('fill="#5585b5"');expect(school('211304').variants.female.design?.cut).toBe('dress');
  expect(summerReview.records).toHaveLength(58);
  expect(summerReview.records.filter(r=>r.checked)).toHaveLength(56);
  expect(summerReview.records.find(r=>r.uniformId==='233')?.status).toBe('excluded-old-version');
  expect(summerReview.records.find(r=>r.uniformId==='230')?.status).toBe('excluded-department-specific');
  expect(summerReview.records.find(r=>r.uniformId==='134')?.status).toBe('excluded-sportswear');
  expect(summerReview.records.find(r=>r.uniformId==='34')?.checked).toBeNull();
  expect(JSON.parse(readFileSync('apps/web/public/illustrations/uniforms/uniform-map-summer-review.json','utf8'))).toEqual(summerReview);
 });
});
