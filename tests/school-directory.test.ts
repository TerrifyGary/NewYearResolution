import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import raw from '../packages/world-data/src/uniform-map-directory.json';
import catalog from '../packages/world-data/src/school-name-catalog.json';
import high from '../packages/world-data/src/high-115.json';
import references from '../packages/world-data/src/uniform-references.json';
import {schoolNameDirectory,searchSchoolNames} from '../packages/world-data/src/school-name-directory';
import {schools} from '../packages/world-data/src/schools';
import {createGame} from '../packages/engine/src';
import {schoolCandidates} from '../packages/engine/src/education';
import {serialize} from '../packages/engine/src/save';

describe('complete offline Uniform Map school-name reconciliation',()=>{
 it('retains all 562 observed identities once, with all 506 official codes and no invented school dates',()=>{
  const entries=schoolNameDirectory.flatMap(s=>s.mapEntries);
  expect(raw.schools).toHaveLength(562);expect(entries).toHaveLength(562);
  expect(new Set(entries.map(e=>e.siteId)).size).toBe(562);
  expect(new Set(entries.map(e=>e.url))).toEqual(new Set(raw.schools.map(e=>e.url)));
  expect(schoolNameDirectory.filter(s=>s.kind==='moe-115').map(s=>s.code)).toEqual(high.map(s=>s.code));
  expect(schoolNameDirectory).toHaveLength(593);
  expect(new Set(schoolNameDirectory.map(s=>s.id)).size).toBe(593);
  for(const s of schoolNameDirectory.filter(s=>s.kind==='reference-only')){
   expect(s.code).toBeNull();expect(s.city).toBeNull();expect(s).not.toHaveProperty('from');
   expect(s).not.toHaveProperty('gender');expect(schools.some(n=>n.id===s.id)).toBe(false);
  }
  expect(JSON.parse(readFileSync('apps/web/public/illustrations/uniforms/school-name-catalog.json','utf8'))).toEqual(catalog);
 });
 it('links nicknames while keeping ownership, campuses, levels and unrelated institutions separate',()=>{
  const code=(siteId:string)=>schoolNameDirectory.find(s=>s.mapEntries.some(e=>e.siteId===siteId))?.code;
  expect(code('32')).toBe('343302');expect(code('271')).toBe('341302');
  expect(code('228')).toBe('054309');expect(code('230')).toBe('050315');
  expect(code('321')).toBe('040308'); // 竹北高中舊名，不是縣立竹北實驗高中。
  expect(searchSchoolNames('達人女中').map(s=>s.code)).toEqual(['401303']);
  expect(searchSchoolNames('立人').map(s=>s.id)).toEqual(['moe115-high-061318','uniform-map-193']);
  expect(code('522')).toBeNull();expect(code('540')).toBe('610405'); // 高餐大不合併餐旅中學。
  expect(code('19453')).toBeNull();expect(code('7934')).toBeNull(); // 國中部、國際部保留個別紀錄。
  expect(code('89')).toBeNull();expect(code('511')).toBeNull(); // 崇仁兩校區不合併。
  expect(schoolNameDirectory.find(s=>s.id==='uniform-map-193')?.mapEntries[0].sourceReportsClosure).toBe(true);
  expect(schoolNameDirectory.find(s=>s.id==='uniform-map-18406')?.city).toBeNull(); // 不把錯置的來源分類當校址。
 });
 it('audits all existing illustrations as directory matches without claiming a new design verification',()=>{
  expect(catalog.artworkDirectoryAudit).toHaveLength(Object.keys(references).length);
  for(const audit of catalog.artworkDirectoryAudit){
   expect(audit.status).toBe('directory-matched');expect(audit.pages.length).toBeGreaterThan(0);
   expect(audit.designReview).toBe('existing-source-retained');
  }
 });
 it('does not change eligibility, saved school IDs, random draws or state when searching',()=>{
  const state=createGame('school-directory-compatibility',1998),before=serialize(state);
  const candidates=schoolCandidates(state,'senior').map(s=>s.id);
  searchSchoolNames('台北');searchSchoolNames('竹北');
  expect(serialize(state)).toBe(before);expect(schoolCandidates(state,'senior').map(s=>s.id)).toEqual(candidates);
  expect(candidates.some(id=>id.startsWith('uniform-map-'))).toBe(false);
 });
});
