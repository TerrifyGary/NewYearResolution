import {lungIncidence,lungStages,lungSurvival} from '../../world-data/src/cancer';
import {t,type World,type Person} from '../../shared/src/types';
import {ensureLife} from './life-finance';
export function cancerIncidence(age:number){return age<0?0:lungIncidence[Math.min(17,Math.floor(age/5))]/100000;}
export function cancerAnnualRisk(diagnosisAge:number,stage:number,followupYear:number){if(stage<1||stage>4||followupYear<1||followupYear>5||diagnosisAge<15)return null;const group=diagnosisAge<30?'15-29':diagnosisAge<50?'30-49':diagnosisAge<65?'50-64':diagnosisAge<75?'65-74':'75+',row=lungSurvival[group][stage-1],previous=followupYear===1?100:row[followupYear-2];return previous?Math.max(0,1-row[followupYear-1]/previous):1;}
export function cancerFollowup(p:Person,year:number){const c=p.life?.cancer;return c?cancerAnnualRisk(c.diagnosisAge,c.stage,year-c.diagnosisYear+1):null;}
/** Annual draw, independent of visible turn length; no new draw on rendering or loading. */
export function cancerYear(s:World,random:(s:World)=>number){const p=s.people.find(n=>n.id===s.playerId)!,state=ensureLife(p);if(state.cancerCheckedYear===s.year)return {diagnosed:false,death:false};state.cancerCheckedYear=s.year;let diagnosed=false;if(!state.cancer&&random(s)<cancerIncidence(s.year-p.birthYear)){let pick=random(s)*lungStages.reduce((n,r)=>n+r.count,0);const stage=lungStages.find(r=>(pick-=r.count)<0)?.stage??0;state.cancer={type:'lung',stage,diagnosisYear:s.year,diagnosisAge:s.year-p.birthYear};diagnosed=true;}
 const risk=cancerFollowup(p,s.year);return {diagnosed,death:risk!==null&&random(s)<risk,risk};}
export function cancerLabel(p:Person){const c=p.life?.cancer;return c?t(`肺癌 · ${c.stage?['','I','II','III','IV'][c.stage]+'期':'分期不詳'} · ${c.diagnosisYear} 年確診`,`Lung cancer · ${c.stage?'stage '+c.stage:'unknown stage'} · diagnosed ${c.diagnosisYear}`):null;}
