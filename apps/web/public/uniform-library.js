const grid=document.querySelector('#grid'),query=document.querySelector('#query'),city=document.querySelector('#city'),scope=document.querySelector('#scope'),status=document.querySelector('#status'),more=document.querySelector('#more');
let rows=[],limit=48,mapLookup=new Map(),directory=null;
const el=(tag,text,className)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
function refreshCities(){
 const selected=city.value;city.replaceChildren();const all=el('option','全部縣市／來源分類');all.value='';city.append(all);
 const names=new Set(rows.map(r=>r.city));if(directory)for(const r of directory.schools)if(!r.city)names.add(r.mapEntries[0].sourceRegion);
 const official=new Set(rows.map(r=>r.city));for(const name of [...names].sort()){const option=el('option',name+(official.has(name)?'':'（來源分類）'));option.value=name;city.append(option);}city.value=selected;
}
function render(){
 const key=query.value.trim().replaceAll('台','臺');
 const entries=directory?.schools??rows;
 const names=new Map(entries.map(r=>[r.code,r]));
 const library=rows.map(r=>({...r,...names.get(r.code)}));
 const collection=scope.value==='directory'?[...library,...entries.filter(r=>r.kind==='reference-only')]:library;
 const found=collection.filter(r=>(!city.value||city.value===(r.city??r.mapEntries?.[0]?.sourceRegion))&&(!key||(r.name+(r.label??'')+(r.aliases??[]).join(' ')).replaceAll('台','臺').includes(key))&&(scope.value==='all'||scope.value==='directory'||(scope.value==='map'?!!r.mapEntries?.length||!!mapLookup.get(r.code)?.pages.length:scope.value==='sourced'?!!r.reference:!r.reference)));
 const sourced=rows.filter(r=>r.reference).length,variants=rows.reduce((n,r)=>n+Object.values(r.variants).filter(v=>v.sourced).length,0);
 const descriptions=rows.filter(r=>r.reference?.evidence==='third-party-description').length,illustrations=rows.filter(r=>r.reference?.evidence==='third-party-illustration').length;
 status.textContent=`高中職名錄 ${rows.length} 校 · 有參考插畫 ${sourced} 校／${variants} 款（第三方文字待核 ${descriptions} 校 · 示意圖待核 ${illustrations} 校）`+(directory?` · 學校字典 ${directory.schools.length} 筆／涵蓋制服地圖 ${directory.sourceCount} 筆來源`:'')+` · 本次找到 ${found.length} 校`;
 grid.replaceChildren();for(const row of found.slice(0,limit)){
  const card=el('article');card.dataset.school=row.code??row.id;
  card.append(el('span',row.kind==='reference-only'?'校名參考':row.reference?(row.reference.evidence==='third-party-illustration'?'制服地圖示意 · 待核對':row.reference.evidence==='third-party-description'?'第三方文字 · 待校方核對':row.reference.kind==='official'?'校方資料':'其他參考資料'):'款式整理中','tag'+(!row.reference||row.reference.evidence?' pending':'')));
  const art=el('div','','art');
  for(const [gender,variant] of Object.entries(row.variants??{})){
   if(!variant.sourced)continue;
   const figure=el('figure'),img=el('img');img.src=variant.asset;img.alt=row.label+'夏季制服';img.loading='lazy';img.width=180;img.height=210;figure.append(img,el('figcaption',(gender==='male'?'男款':'女款')+(variant.sourced?'':' · 通用款')));art.append(figure);
  }
  if(art.childElementCount)card.append(art);
  card.append(el('h2',row.label??row.name),el('p',row.city?row.city+' · '+row.name:'制服地圖分類 · '+row.mapEntries[0].sourceRegion));
  if(row.aliases?.length)card.append(el('p','別名／來源校名：'+row.aliases.join('、')));
  if(row.reference)card.append(el('p',Object.values(row.variants).filter(v=>v.sourced).map(v=>v.design.description).join(' ')));
  if(row.kind==='reference-only')card.append(el('p','保留來源站校名，學制與適用年度待核對。'));
  if(row.mapEntries?.some(e=>e.sourceReportsClosure))card.append(el('p','來源站標示：停止辦學；停辦年度待核對。'));
  if(row.reference?.note){const details=el('details'),summary=el('summary','款式備註');details.append(summary,el('p',row.reference.note));card.append(details);}
  const lookup=mapLookup.get(row.code);
  const pages=[...(row.mapEntries??[]).map(e=>({title:e.name,url:e.url})),...(lookup?.pages??[])].filter((p,i,a)=>a.findIndex(e=>e.url===p.url)===i);
  if(pages.length||lookup){const details=el('details'),summary=el('summary','制服地圖查找');details.append(summary,el('p',pages.length?'同名同地區參考頁，仍需核對學部、季節及實際款式。':'本次未找到可明確對應的索引頁，不代表該校沒有制服。'));
   for(const page of pages){const link=el('a',page.title),p=el('p');link.href=page.url;link.target='_blank';link.rel='noopener noreferrer';p.append(link);details.append(p);}
   if(lookup?.note)details.append(el('p',lookup.note));card.append(details);
  }
  const source=el('a',row.reference?`參考資料 · ${row.reference.year??'年份未註'}`:row.kind==='reference-only'?'查看 Uniform Map':'學校網站');source.href=row.reference?.url??row.website;source.target='_blank';source.rel='noopener noreferrer';card.append(source);grid.append(card);
 }
 more.hidden=found.length<=limit;
}
for(const input of [query,city,scope])input.addEventListener('input',()=>{limit=48;render();});
more.addEventListener('click',()=>{limit+=48;render();});
try{const response=await fetch('./illustrations/uniforms/catalog.json');if(!response.ok)throw Error('catalog');rows=await response.json();const featured=['353303','353301','383301','210309','170301','323301'];const order=r=>{const index=featured.indexOf(r.code);return index<0?featured.length:index;};rows.sort((a,b)=>order(a)-order(b));refreshCities();render();
 try{const lookupResponse=await fetch('./illustrations/uniforms/uniform-map-research.json');if(lookupResponse.ok){const data=await lookupResponse.json();mapLookup=new Map(data.schools.map(r=>[r.code,r]));render();}}catch{/* The artwork remains usable when the optional research list cannot load. */}
 try{const response=await fetch('./illustrations/uniforms/school-name-catalog.json');if(response.ok){directory=await response.json();refreshCities();render();}}catch{/* The primary artwork catalog works without the extended name directory. */}
}catch{status.textContent='';document.querySelector('#error').textContent='圖庫暫時無法讀取，請重新整理。';}
