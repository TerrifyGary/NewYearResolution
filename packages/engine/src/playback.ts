import type {World,PlaybackStage} from '../../shared/src/types';
import {higherStudent} from './student-life';
import {educationView} from './education';

/** One stage definition for both the playback button and its timer. Viewing never draws RNG. */
export function playbackStage(s:World):PlaybackStage {
 const p=s.people.find(n=>n.id===s.playerId)!;
 const study=educationView(s,p);
 if(study.active&&study.enrollment)return study.enrollment.level;
 if(s.year-p.birthYear<6)return 'kindergarten';
 if(p.job==='retired')return 'retired';
 if(s.year-p.birthYear>=18&&s.year-p.birthYear<22)return 'university';if(s.year-p.birthYear>=22)return 'work';
 return study.enrollment?.level??'primary';
}

import type {Option} from '../../shared/src/types';
import {departmentField} from './career-paths';
/** Stable preferences; no random draw, and unavailable options are never selected. */
export function automaticChoice(s:World,options:Option[],graduate=true){const rows=options.filter(o=>!o.disabled),p=s.people.find(n=>n.id===s.playerId)!,data=s.current?.data;const prefer=(...ids:string[])=>ids.map(id=>rows.find(o=>o.id===id)).find(Boolean)?.id;
 if(s.phase==='focus')return prefer(p.stress>=75||p.fatigue>=75?'health':p.job!=='none'?'study':'balanced')??rows[0]?.id;
 if(data==='adult-crisis')return prefer('rest','community');
 if(data==='marriage-review')return prefer('keep');if(data==='divorce-confirm')return prefer('cancel');
 if(data==='relationship'||data==='partner-transition')return prefer('keep','stay','date');
 if(data==='career'||data==='business'||data==='retire')return p.job!=='none'?prefer('skip','continue','work'):prefer('job:research-associate','job:operations-analyst')??rows.find(o=>o.id.startsWith('job:'))?.id??prefer('skip');
 if(data==='master'&&graduate)return prefer('graduate-start');
 if(data==='master'&&!graduate)return prefer('skip');
 if(data==='grad-department'){const field=departmentField(p.enrollments.filter(e=>e.level==='university').at(-1)?.department?.zh??'');return rows.find(o=>departmentField(o.title.zh)===field)?.id??rows[0]?.id;}
 if(data==='grad-route')return prefer('exam','prepare','record','skip');
 if(data==='graduate')return prefer('defend');if(data==='work-scene')return prefer('pace');
 if(data?.startsWith('child-plan:'))return prefer('keep','basic');
 if(data==='internship-apply')return prefer('apply','skip');
 if(data==='promotion')return prefer('apply','skip');if(data==='business-review')return prefer('continue','skip');
 return rows[s.rng%Math.max(1,rows.length)]?.id;
}
