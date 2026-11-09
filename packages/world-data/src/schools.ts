import highRows from './high-115.json';
import {districtRows} from './geography';
import {schoolDirectory,directoryLocations} from './school-directory';
import type {EducationLevel} from '../../shared/src/types';
export interface School {id:string; name:string; city:string; district?:string; cluster?:string; gender?:'male'|'female'; admissionDC?:number; level:EducationLevel; from:number; source:string; checked:string}
// Curated identity catalog, not official admissions cutoffs or a full nationwide dataset.
const school=(id:string,name:string,city:string,level:EducationLevel,from:number,source:string,district?:string):School=>({id,name,city,level,from,source,district,checked:'2026-11-05'});
export const schools:School[]=[
 school('mdes','國語實驗國民小學','taipei','primary',2026,'https://www.meps.tp.edu.tw/nss/s/main/15','zhongzheng'),
 school('pcps','板橋國小','new-taipei','primary',1968,'https://www.pcps.ntpc.edu.tw/p/404-1000-328.php','banqiao'),
 school('xpps','新埔國小','new-taipei','primary',1973,'https://www.pcps.ntpc.edu.tw/p/404-1000-328.php','banqiao'),
 school('zmps','忠明國小','taichung','primary',1953,'https://www.tc.edu.tw/page/d61c396e-63a3-4286-ac38-9874ac4092fe/school-content?id=741','west'),
 school('ljps','苓洲國小','kaohsiung','primary',1968,'https://www.ljps.kh.edu.tw/view/index.php?MainMenuId=29393&MainType=0&SubMenuId=29394&SubType=103&WebID=285','lingya'),
 school('pcjh','板橋國中','new-taipei','junior',1968,'https://www.pcjh.ntpc.edu.tw/p/405-1000-345%2Cc123.php','banqiao'),
 school('cmjh','忠明國中／忠明高中國中部','taichung','junior',1971,'https://cmsh.tc.edu.tw/p/412-1065-16388.php?Lang=zh-tw','north'),
 school('nk-junior','高師大附中國中部','kaohsiung','junior',1989,'https://www.nknush.kh.edu.tw/about-us/history/','lingya'),
 school('pcsh','板橋高中','new-taipei','senior',1952,'https://www.pcsh.ntpc.edu.tw/p/412-1000-96.php'),
 school('ccsh','中正高中','taipei','senior',1987,'https://www.ccsh.tp.edu.tw/wp-content/uploads/doc/admin/ccsh-schoolhistory.pdf'),
 school('cmsh','忠明高中','taichung','senior',2001,'https://cmsh.tc.edu.tw/p/412-1065-16388.php?Lang=zh-tw'),
 school('nk-senior','高師大附中高中部','kaohsiung','senior',1989,'https://www.nknush.kh.edu.tw/about-us/history/'),
 school('ntu','國立臺灣大學','taipei','university',1945,'https://ntuinfo.ntu.edu.tw/p1_1_0.html'),
 school('ntnu','國立臺灣師範大學','taipei','university',1967,'https://pr.ntnu.edu.tw/archive/file/附件一_大學校齡認定報告_20181105V2.pdf'),
 school('ntnu-master','國立臺灣師範大學（碩士班）','taipei','master',1980,'https://teric.naer.edu.tw/wSite/PDFReader?fileName=1472592037174&format=pdf&xmlId=1889214')
];
schools.push({...school('cksh','建國高中','taipei','senior',2026,'https://www.ck.tp.edu.tw/uploads/1669956254815ntHeXJJ6.pdf'),gender:'male',admissionDC:18},{...school('fgsh','北一女中','taipei','senior',2026,'https://sites.google.com/gapps.fg.tp.edu.tw/aplustfg'),gender:'female',admissionDC:18});
for(const n of schools){if(['cksh','fgsh'].includes(n.id))n.checked='2026-11-08';if(['zmps','cmjh'].includes(n.id))n.cluster='zhongming';}
export const cityForDistrict:Record<string,string>={banqiao:'new-taipei',west:'taichung',lingya:'kaohsiung',zhongzheng:'taipei'};

const aliases:Record<string,string>={'353604':'mdes','014601':'pcps','014603':'xpps','193611':'zmps','583601':'ljps','014501':'pcjh'};
for(const [location,key] of Object.entries(directoryLocations)){
 const group=schoolDirectory.districts[key as keyof typeof schoolDirectory.districts];
 for(const level of ['primary','junior'] as const)for(const row of group[level]){
  if(aliases[row.code])continue;
  schools.push({id:`moe115-${level}-${row.code}`,name:row.name,city:cityForDistrict[location],district:location,level,from:2026,source:schoolDirectory.sources[level].url,checked:'2026-11-08'});
 }
}

for(const row of [{id:'thu',name:'東海大學',city:'taichung',source:'https://www.thu.edu.tw/'},{id:'fju',name:'輔仁大學',city:'new-taipei',source:'https://www.fju.edu.tw/'},{id:'tnua',name:'國立臺北藝術大學',city:'taipei',source:'https://udb.moe.edu.tw/ulist/Institution?id=000021E731C2'}])schools.push({...row,level:'university',from:2026,checked:'2026-11-09'});

for(const row of [{id:'ntsu',name:'國立體育大學',city:'taoyuan',source:'https://dsp.ntsu.edu.tw/'},{id:'ntus',name:'國立臺灣體育運動大學',city:'taichung',source:'https://pe.ntus.edu.tw/'}])schools.push({...row,level:'university',from:2026,checked:'2026-11-09'});

schools.push({id:'ncku',name:'國立成功大學',city:'tainan',level:'university',from:2026,source:'https://cge.ncku.edu.tw/p/450-1007-16692%2Cc1.php?Lang=zh-tw',checked:'2026-11-09'});

for(const r of districtRows){cityForDistrict[r.id]=r.city;const group=schoolDirectory.districts[(r.cityName+'/'+r.district) as keyof typeof schoolDirectory.districts];if(group)for(const level of ['primary','junior'] as const)for(const row of group[level]){if(schools.some(n=>n.level===level&&(n.id===`moe115-${level}-${row.code}`||aliases[row.code]===n.id)))continue;schools.push({id:`moe115-${level}-${row.code}`,name:row.name,city:r.city,district:r.id,level,from:2026,source:schoolDirectory.sources[level].url,checked:'2026-11-09'});}}
for(const r of highRows){const city=districtRows.find(d=>d.cityName===r.city)?.city??r.city;if(schools.some(s=>s.level==='senior'&&s.name===r.name))continue;schools.push({id:'moe115-high-'+r.code,name:r.name,city,level:'senior',from:2026,source:'https://stats.moe.gov.tw/files/school/115/high.csv',checked:'2026-11-09',...(/女中|女子/.test(r.name)?{gender:'female' as const}:{})});}
