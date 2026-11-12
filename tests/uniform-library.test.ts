// @vitest-environment jsdom
import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {highSchoolUniforms} from '../packages/world-data/src/uniforms';
import mapResearch from '../packages/world-data/src/uniform-map-research.json';
import directory from '../packages/world-data/src/school-name-catalog.json';

async function gallery(lookupAvailable=true){
 document.documentElement.innerHTML=readFileSync('apps/web/public/uniform-library.html','utf8');
 const run=Object.getPrototypeOf(async function(){}).constructor;
 const fetch=async(url:string)=>({ok:!url.includes('uniform-map-research')||lookupAvailable,json:async()=>url.includes('school-name-catalog')?directory:url.includes('uniform-map-research')?mapResearch:highSchoolUniforms});
 await new run('document','fetch',readFileSync('apps/web/public/uniform-library.js','utf8'))(document,fetch);
 return {window};
}

describe('offline uniform gallery research disclosures',()=>{
 it('filters third-party drawings and shows their source without treating a directory as verified artwork',async()=>{
  const dom=await gallery(),doc=dom.window.document;
  const query=doc.querySelector<HTMLInputElement>('#query')!;query.value='安樂';query.dispatchEvent(new dom.window.Event('input'));
  expect(doc.querySelectorAll('#grid article')).toHaveLength(1);
  expect(doc.querySelector('#grid .tag')?.textContent).toBe('第三方文字 · 待校方核對');
  expect(doc.querySelector('#grid')?.textContent).toContain('制服地圖查找');
  expect(doc.querySelector('#grid a')?.getAttribute('href')).toContain('uniform.wingzero.tw');
  query.value='';const scope=doc.querySelector<HTMLSelectElement>('#scope')!;scope.value='map';scope.dispatchEvent(new dom.window.Event('input'));
  const matched=new Set([...directory.schools.filter(r=>r.kind==='moe-115'&&r.mapEntries.length).map(r=>r.code),...mapResearch.schools.filter(r=>r.pages.length).map(r=>r.code)]);
  expect(doc.querySelector('#status')?.textContent).toContain(`本次找到 ${matched.size} 校`);
  expect(doc.querySelector('#grid')?.textContent).toContain('款式整理中'); // A directory match does not create a design.
  expect(Array.from(doc.querySelectorAll<HTMLImageElement>('#grid img')).every(img=>img.src.includes('/schools/'))).toBe(true);
 });
 it('keeps illustrations and pagination usable when the optional lookup file cannot load',async()=>{
  const dom=await gallery(false),doc=dom.window.document;
  expect(doc.querySelectorAll('#grid article')).toHaveLength(48);
  doc.querySelector<HTMLButtonElement>('#more')!.click();
  expect(doc.querySelectorAll('#grid article')).toHaveLength(96);
  doc.querySelector<HTMLButtonElement>('#more')!.click();
  expect(doc.querySelectorAll('#grid article')).toHaveLength(highSchoolUniforms.filter(r=>r.reference).length);
  expect(doc.querySelector('#error')?.textContent).toBe('');
  expect(doc.querySelector('#status')?.textContent).toContain(`第三方文字待核 ${highSchoolUniforms.filter(r=>r.reference?.evidence==='third-party-description').length} 校`);
 });
 it('finds former names and source-only schools without showing generic artwork or the removed sentence',async()=>{
  const dom=await gallery(),doc=dom.window.document;
  const query=doc.querySelector<HTMLInputElement>('#query')!,scope=doc.querySelector<HTMLSelectElement>('#scope')!;
  scope.value='all';query.value='達人女中';query.dispatchEvent(new dom.window.Event('input'));
  expect(doc.querySelectorAll('#grid article')).toHaveLength(1);
  expect(doc.querySelector('#grid article')?.getAttribute('data-school')).toBe('401303');
  scope.value='directory';query.value='立人';query.dispatchEvent(new dom.window.Event('input'));
  expect(doc.querySelectorAll('#grid article')).toHaveLength(2); // Taipei closed school is separate from Taichung.
  expect(doc.querySelector('[data-school="uniform-map-193"]')?.textContent).toContain('來源站標示：停止辦學');
  expect(doc.querySelector('[data-school="uniform-map-193"] img')).toBeNull();
  query.value='中崙';query.dispatchEvent(new dom.window.Event('input'));
  expect(doc.querySelector('#grid img')).toBeNull();
  expect(doc.body.textContent).not.toContain('目前沿用通用插畫');
  expect(doc.body.textContent).not.toContain('尚未確認這所學校');
 });
});
