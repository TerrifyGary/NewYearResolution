/** Read-only catalog audit. Run with: node node_modules/vite-node/vite-node.mjs scripts/analysis/stage-audit.ts */
import ts from 'typescript';
import {readFileSync,writeFileSync} from 'node:fs';
import {createGame,nextYear,player,type EducationLevel} from '../../packages/engine/src';
import {personalityScenes} from '../../packages/world-data/src/personality-scenes';
import {stageQuestions} from '../../packages/world-data/src/profile-questions';
import {clubCatalog} from '../../packages/world-data/src/clubs';
import {careers} from '../../packages/world-data/src/careers';
import {businesses} from '../../packages/world-data/src/businesses';
const source=ts.createSourceFile('life-scenes.ts',readFileSync('packages/engine/src/life-scenes.ts','utf8'),ts.ScriptTarget.Latest,true);
const pools:Record<string,string[]>={};
const sceneTitle=(n:ts.Expression)=>ts.isCallExpression(n)&&ts.isIdentifier(n.expression)&&n.expression.text==='scene'&&ts.isStringLiteral(n.arguments[0])?n.arguments[0].text:null;
function walk(node:ts.Node){
 if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name)&&node.initializer&&ts.isArrayLiteralExpression(node.initializer)){const titles=node.initializer.elements.map(n=>sceneTitle(n as ts.Expression)).filter((s):s is string=>s!==null);if(titles.length)pools[node.name.text]=titles;}
 if(ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression)&&node.expression.name.text==='push'&&ts.isIdentifier(node.expression.expression)){const pool=pools[node.expression.expression.text];if(pool)for(const arg of node.arguments){if(ts.isSpreadElement(arg)&&ts.isIdentifier(arg.expression))pool.push(...pools[arg.expression.text]);else {const title=sceneTitle(arg);if(title)pool.push(title);}}}
 ts.forEachChild(node,walk);
}walk(source);
const stages:[string,number,EducationLevel|null,number][]=[['出生',0,null,0],['幼稚園',4,'kindergarten',3],['國小',10,'primary',6],['國中',13,'junior',12],['高中',16,'senior',15],['大學',20,'university',18],['研究所',23,'master',22],['職場',30,null,0],['退休',70,null,0]];
const examples=stages.map(([name,age,level,offset])=>{const s=createGame('stage-audit',Math.max(1980,2026-age));s.year=2025;s.date='2025-12-31';s.phase='review';s.journal=[];s.queue=[];s.cursor=0;const p=player(s);p.birthYear=2026-age;p.agencyAge=3;if(level)p.enrollments=[{level,schoolId:null,track:'general',startYear:p.birthYear+offset}];if(name==='職場'){p.job='technology';p.employment={company:{zh:'樣本公司',en:'Sample company'},position:{zh:'工程師',en:'Engineer'},startYear:2022,monthlySalary:42000};}if(name==='退休')p.job='retired';const n=nextYear(s);return {stage:name,age,notes:'One synthetic fixture; scheduled events, not a total stage-story count or a probability estimate.',scheduled:[...new Set(n.queue.filter(e=>e.kind!=='finance').map(e=>e.kind+':'+(e.data??e.title.zh)))]};});
const agency={3:0,4:0};for(let w=8;w<=16;w++)for(let i=8;i<=16;i++)for(let r=0;r<12;r++)agency[(2+Math.floor((w+i+r)/16)%3) as 3|4]++;
const result={version:JSON.parse(readFileSync('package.json','utf8')).version,friendPools:Object.fromEntries(Object.entries(pools).filter(([key])=>key!=='extras').map(([key,titles])=>[key,{count:titles.length,titles}])),personalityScenes:Object.fromEntries(Object.entries(personalityScenes).map(([key,values])=>[key,values.length])),questionBanks:Object.fromEntries(Object.entries(stageQuestions).map(([key,values])=>[key,values.length])),clubs:Object.fromEntries(Object.entries(clubCatalog).map(([key,values])=>[key,{catalog:values.length,additionalLegacyOptions:4,total:values.length+4}])),careers:{partTime:careers.filter(r=>r.partTime).length,fullTime:careers.filter(r=>!r.partTime).length},businesses:businesses.length,agencyCombinations:{total:972,counts:agency},examples};
writeFileSync('docs/STAGE_EVENT_AUDIT.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({friendPools:Object.fromEntries(Object.entries(result.friendPools).map(([k,v])=>[k,v.count])),personalityScenes:result.personalityScenes,clubs:result.clubs,careers:result.careers,businesses:result.businesses,agency:result.agencyCombinations},null,2));
