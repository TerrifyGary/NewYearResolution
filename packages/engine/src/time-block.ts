import type {World,GameEvent} from '../../shared/src/types';
const player=(s:World)=>s.people.find(n=>n.id===s.playerId)!;
export function turnYears(age:number){return age<25?1:age<30?2:age<50?3:age<60?4:5;}
export function blockKey(s:World){const b=player(s).life?.timeBlock;return b&&s.year>=b.startYear&&s.year<=b.endYear?b.startYear:s.year;}
export function continuation(s:World){const b=player(s).life?.timeBlock;return !!b&&s.year>b.startYear&&s.year<=b.endYear;}
/** Fixed expenses and mortality remain annual; routine choices occur once per block. */
export function blockEvents(s:World,events:GameEvent[]){if(!continuation(s))return events;const p=player(s);return events.filter(e=>e.kind==='finance'||e.kind==='mortality'||e.kind==='birth'||e.kind==='enrollment'||e.kind==='universityentry'||e.kind==='schoolstory'&&e.data==='graduate'||e.kind==='life'&&(['cancer-check','bonus','course-grades','internship-finish','teacher-exam','teacher-internship','teacher-jobs'].includes(e.data??'')||e.data==='career'&&p.job==='none'||e.data?.startsWith('child-plan:')&&!p.life?.childPlans?.[e.data.slice(11)]));}
export function periodAccounts(s:World){const p=player(s),b=p.life?.timeBlock,from=b?.startYear??s.year,to=b?.reviewAtNextYear?b.endYear:s.year,rows=s.reports.filter(r=>r.personId===p.id&&r.year>=from&&r.year<=to);return {from,to,years:rows.length,income:rows.reduce((n,r)=>n+r.income,0),expense:rows.reduce((n,r)=>n+r.expense,0),openingCash:rows[0]?.openingCash??s.openingCash,closingCash:p.cash};}
