import {householdBand} from './housing';
import {locations,jobs} from '../../world-data/src';
import {instruments} from './music';
import {sports} from './sports';
import {schools,cityForDistrict,type School} from '../../world-data/src/schools';
import {t,type World,type Person,type EducationLevel,type Enrollment,type Gender} from '../../shared/src/types';
export const lengths:Record<EducationLevel,number>={kindergarten:3,primary:6,junior:3,senior:3,vocational:3,juniorCollege:5,university:4,master:4};
const zh:Record<EducationLevel,string>={kindergarten:'幼兒園',primary:'國小',junior:'國中',senior:'高中',vocational:'高職',juniorCollege:'五專',university:'大學',master:'碩士班'};
export function stableNumber(value:string){let n=2166136261;for(const c of value)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
export function identityDefaults(seed:string,id:string,genderOverride?:Gender){const gender=genderOverride??(stableNumber(seed+':gender:'+id)%2?'male' as const:'female' as const);let n=stableNumber(seed+':orientation-independent:'+id);n=Math.imul(n^(n>>>16),0x7feb352d);n=Math.imul(n^(n>>>15),0x846ca68b);n=(n^(n>>>16))>>>0;return {gender,attractedTo:n/4294967296<.4?gender:gender==='male'?'female' as const:'male' as const};}

export function schoolCandidates(s:World,level:EducationLevel):School[]{
 const city=cityForDistrict[s.locationId];
 const candidates=schools.filter(n=>n.level===level&&(n.from<=s.year||n.from===2026)&&(!n.gender||n.gender===s.people.find(p=>p.id===s.playerId)!.gender)&&(level==='university'||level==='master'||level==='senior'?(level!=='senior'||n.city===city||['new-taipei','taipei'].includes(city)&&['new-taipei','taipei'].includes(n.city)):n.district===s.locationId));
 if(candidates.length||!['primary','junior'].includes(level))return candidates;
 return schools.filter(n=>n.level===level&&n.city===city&&(n.from<=s.year||n.from===2026));
}
export function enrollmentLength(e:Enrollment){return e.graduationYear?e.graduationYear-e.startYear:lengths[e.level];}
export function enrollmentDetails(s:World,p:Person,e:Enrollment){const n=stableNumber(`${s.seed}:${p.id}:${e.level}:${e.startYear}:class`);return {classNumber:e.classNumber??1+n%8,seat:e.seat??1+Math.floor(n/8)%30,animal:e.animal??['大象','海豚','長頸鹿','企鵝','小熊'][n%5]};}
export function educationView(s:World,p:Person){
 const month=Number(s.date.slice(5,7));
 const records=p.enrollments.filter(e=>e.startYear<s.year||e.startYear===s.year&&month>=9).sort((a,b)=>b.startYear-a.startYear);
 const e=records[0]??(s.year-p.birthYear>=3&&s.year-p.birthYear<=5?{schoolId:null,level:'kindergarten' as const,track:'general' as const,startYear:p.birthYear+3}:undefined);if(!e)return {active:false,enrollment:null,grade:0,label:t('尚未入學／學籍未建檔','Not enrolled / record unavailable')};
 const grade=s.year-e.startYear+(month>=9?1:0),ended=!!e.outcome||grade>enrollmentLength(e)||e.level!=='master'&&grade===enrollmentLength(e)&&month>=7&&month<9;
 const simulated=['小樹','星光','向日葵'][stableNumber(s.seed+':'+p.id+':neighborhood')%3];
 const school=schools.find(n=>n.id===e.schoolId),name=e.schoolName?.zh??(school?.id==='cmjh'?(s.year<2001?'忠明國中':'忠明高中國中部'):school?.name)??`${locations.find(l=>l.id===s.locationId)?.name.zh??'所在地'}${simulated}模擬${zh[e.level]}（校名待查）`;
 const d=enrollmentDetails(s,p,e),numerals=['','一','二','三','四'];
 const yearLabel=e.level==='kindergarten'?`${d.animal}班${['小班','中班','大班'][grade-1]??'已結業'}`:e.level==='primary'?`${grade} 年級 ${d.classNumber} 班 · 座號 ${d.seat} 號`:e.level==='junior'?`${grade+6} 年級（${['七','八','九'][grade-1]}年級）${d.classNumber} 班 · 座號 ${d.seat} 號`:e.level==='vocational'?`高職${grade} · ${e.department?.zh??'科別待選'} ${d.classNumber} 班`:e.level==='juniorCollege'?`專${grade} · ${e.department?.zh??'科別待選'}`:e.level==='senior'?`高${grade}／高${numerals[grade]} ${d.classNumber} 班${e.group?' · '+e.group.zh:''}`:e.level==='university'?`大${Math.min(grade,4)}／大${numerals[Math.min(grade,4)]}${grade>4?'（教育學程延修）':''} · ${e.department?.zh??'科系待選'}${e.track==='music'?' · 主修'+(instruments.find(i=>i[0]===p.musicTraining?.major)?.[1]??'樂器'):''}`:`碩${Math.min(grade,4)}／碩${numerals[Math.min(grade,4)]} · ${e.department?.zh??'科系待選'}`;
 return {active:!ended,enrollment:e,grade,label:ended?t(`${name} · ${e.outcome==='graduated'?'已畢業':e.outcome==='withdrawn'?'已離校（未畢業）':e.level==='master'?'修業狀態待確認（未記錄畢業）':'已完成此階段'}`,`${school?.name??e.level} · ${e.outcome??'stage completed'}`):t(`在${name}就讀 · ${yearLabel}${e.track==='general'?'':e.track==='music'?' · 音樂途徑（模擬）':' · 體育途徑（模擬）'}`,`Studying at ${school?.name??'Simulated local '+e.level} · year ${grade} · ${e.level==='primary'||e.level==='junior'?`class ${d.classNumber}, seat ${d.seat}`:e.level==='kindergarten'?['Junior','Middle','Senior'][grade-1]+' '+d.animal:e.department?.en??e.group?.en??''}`)};
}
export function characterStatus(s:World,p:Person){const study=educationView(s,p);if(study.active)return study.label;if(p.job!=='none'&&p.job!=='retired'){const employment=p.employment;return t(`在${employment?.company.zh??'模擬公司'}上班 · ${employment?`工作第 ${s.year-employment.startYear+1} 年`:'工作年資未建檔'} · 職位：${employment?.position.zh??jobs[p.job].zh}${employment?.monthlySalary?' · 每月稅前 NT$'+employment.monthlySalary.toLocaleString():''}`,`Working at ${employment?.company.en??'Simulated employer'} · ${employment?'year '+(s.year-employment.startYear+1):'tenure unavailable'} · ${employment?.position.en??jobs[p.job].en}`);}return p.job==='retired'?t('已退休','Retired'):study.label;}
export function entryLevel(a:number):EducationLevel|null{return a===6?'primary':a===12?'junior':a===15?'senior':a===18?'university':a===22?'master':null;}
export function localAssignment(s:World,level:EducationLevel):string|null{const candidates=schoolCandidates(s,level);const previous=s.people.find(p=>p.id===s.playerId)?.enrollments.at(-1);const cluster=schools.find(n=>n.id===previous?.schoolId)?.cluster;const nearby=cluster?candidates.filter(n=>n.cluster===cluster):[];const pool=nearby.length?nearby:candidates;return pool[stableNumber(`${s.seed}:${s.playerId}:${level}:${s.year}`)%pool.length]?.id??null;}
export function admissionOptions(s:World,level:EducationLevel){
 const candidates=level==='primary'||level==='junior'?schoolCandidates(s,level).filter(n=>n.id===localAssignment(s,level)):schoolCandidates(s,level);
 const rows:(School|null)[]=candidates.length?candidates:[null];
 const result=rows.flatMap(school=>(['ntu','cksh','fgsh'].includes(school?.id??'')?(['general'] as const):(['general','music','sports'] as const)).map(track=>({id:`enroll:${level}:${school?.id??'local'}:${track}`,disabled:track==='music'?!s.people.find(p=>p.id===s.playerId)!.musicTraining||householdBand(s).index<3||s.people.find(p=>p.id===s.playerId)!.specialty!=='music':track==='sports'?!s.people.find(p=>p.id===s.playerId)!.sport||s.people.find(p=>p.id===s.playerId)!.specialty!=='sports':false,title:t(`${school?.name??'所在地學校（校名待查）'} · ${track==='general'?'一般入學':track==='music'?`音樂術科：${instruments.find(i=>i[0]===s.people.find(p=>p.id===s.playerId)!.musicTraining?.major)?.[1]??'請先選一種主修樂器'}（模擬班別）`:`體育術科：${sports.find(i=>i[0]===s.people.find(p=>p.id===s.playerId)!.sport)?.[1]??'請先選一種運動'}（模擬班別）`}`,`${school?.name??'Local school (unverified name)'} · ${track}`),detail:t(track==='general'?(level==='senior'?`D20＋智力／學科 · DC${school?.admissionDC??12}（遊戲難度，非實際錄取分數）`:'不設固定會考門檻 · 模擬一般入學'):'僅檢定該項術科 · 班別與招生資格為待驗證的遊戲情境，非官方招生承諾',track==='general'?(level==='senior'?`D20 + INT/academics · DC${school?.admissionDC??12} (game difficulty, not an actual cutoff)`:'No fixed CAP cutoff · simulated general entry'):'Specialty-only game check · program availability and eligibility unverified; not an official admission claim')})));
 if(level==='senior')return [{id:'enroll:senior:allocation:general',title:t('會考：五科各擲 D20，再選升學路線','School entrance exam: five D20 checks, then choose a route'),detail:t('先依地區與性別篩選，再以五科總分分發；門檻為遊戲值','Filter region and gender, then place by total score; thresholds are fictional')},...result.filter(o=>!o.id.endsWith(':general'))];
 return result;
}
export function recordEnrollment(p:Person,record:Enrollment){p.enrollments=p.enrollments.filter(e=>e.startYear!==record.startYear||e.level!==record.level);p.enrollments.push(record);}
