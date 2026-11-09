import {districtRows} from '../../world-data/src/geography';
import {lifeSchema} from './life-schema';
import {z} from 'zod';
import {initialFertility} from './family';
import {identityDefaults,stableNumber} from './education';
import {schools,cityForDistrict} from '../../world-data/src/schools';
import type {World} from '../../shared/src/types';
const text=z.object({zh:z.string().max(5000),en:z.string().max(5000)}).strict();
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v+'T00:00:00Z');return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===v;});
const money=z.number().int().min(0).max(1e12),score=z.number().min(0).max(100);
const ids=z.array(z.string().max(100)).max(1000);
const legacyPerson=z.object({id:z.string().max(100),name:z.string().max(100),birthYear:z.number().int().min(1850).max(9999),alive:z.boolean(),health:score,stress:score,fatigue:score,
 attributes:z.object({str:z.number().int().min(1).max(20),dex:z.number().int().min(1).max(20),con:z.number().int().min(1).max(20),int:z.number().int().min(1).max(20),wis:z.number().int().min(1).max(20),cha:z.number().int().min(1).max(20)}).strict(),
 skills:z.object({academic:score,music:score,coffee:score,social:score}).strict(),cash:money,debt:money,job:z.enum(['none','service','technology','creative','retired']),parentIds:ids,guardianIds:ids,legalParentIds:ids,householdId:z.string().max(100),children:ids,credentials:ids,inventory:ids,agencyAge:z.number().int().min(2).max(4),employedMonths:z.number().int().nonnegative(),pensionBalance:money,insuredYears:z.number().nonnegative(),history:z.array(z.object({year:z.number().int(),text})).max(20000),deathDate:date.optional(),deathCause:text.optional()}).strict();
const fertility=z.object({profile:z.enum(['typical','reduced']),assessed:z.boolean(),attempts:z.number().int().nonnegative(),lastAttemptYear:z.number().int().nullable()}).strict();
const v2Person=legacyPerson.extend({partnerId:z.string().nullable(),familyName:z.string().max(200).nullable(),fertility});
const event=z.object({id:z.string(),date,kind:z.enum(['story','finance','illness','family','friend','academic','specialized','career','child','mortality','partnership','birth','enrollment','musicpractice','schoolstory','wellbeing','personality','club','life','termexam','universityentry']),title:text,text,tone:z.number().int(),grade:z.enum(['C','D']),data:z.string().optional()}).strict();
const check=z.object({die:z.number().int().min(1).max(20),modifier:z.number().int(),dc:z.number().int(),total:z.number().int(),success:z.boolean(),text}).strict().refine(c=>c.total===c.die+c.modifier&&c.success===(c.total>=c.dc));
const legacySchema=z.object({schemaVersion:z.literal(1),rulesVersion:z.literal('slice-1'),dataVersion:z.literal('pilot-1'),seed:z.string().min(1).max(100),rng:z.number().int().min(0).max(4294967295),year:z.number().int().min(1980).max(9999),date,playerId:z.string(),generation:z.number().int().positive(),locationId:z.string().min(1).max(100),phase:z.enum(['story','focus','event','resolved','review','dead']),
 people:z.array(legacyPerson).min(1).max(1000),journal:z.array(event.extend({personId:z.string()})).max(30000),ledger:z.array(z.object({id:z.string(),date,personId:z.string(),relatedPersonId:z.string().optional(),category:z.enum(['salary','living','education','medical','activity','insurance','labor','taxPayment','loan','repayment','familyAid','food','studentLoan']),amount:z.number().int().min(-1e12).max(1e12),text}).strict()).max(50000),
 reports:z.array(z.object({year:z.number().int(),personId:z.string(),openingCash:money,openingDebt:money,closingCash:money,closingDebt:money,income:money,expense:money,newDebt:money,taxAccrued:money,taxPaid:money,pensionAdded:money,fortune:text,summary:text}).strict()).max(1000),queue:z.array(event).max(100),cursor:z.number().int().nonnegative(),current:event.nullable(),resolution:z.object({text,check:check.optional(),checks:z.array(check).length(5).optional(),admissionTotal:z.number().int().optional()}).strict().nullable(),focus:z.enum(['study','talent','social','health','career','balanced']).nullable(),openingCash:money,openingDebt:money,taxDue:z.record(z.string(),money),estate:z.record(z.string(),money)}).strict();
const v2Schema=legacySchema.extend({schemaVersion:z.literal(2),rulesVersion:z.literal('slice-2'),people:z.array(v2Person).min(1).max(1000),phase:z.enum(['story','focus','event','resolved','review','dead','naming']),pregnancy:z.object({partnerId:z.string(),parentIds:ids,householdId:z.string(),dueDate:date}).strict().nullable(),pendingChildId:z.string().nullable()});
const enrollment=z.object({schoolId:z.string().nullable(),level:z.enum(['kindergarten','primary','junior','senior','vocational','juniorCollege','university','master']),track:z.enum(['general','music','sports']),startYear:z.number().int(),classNumber:z.number().int().min(1).max(30).optional(),seat:z.number().int().min(1).max(50).optional(),animal:z.string().max(20).optional(),department:text.optional(),group:text.optional(),outcome:z.enum(['graduated','withdrawn']).optional(),endYear:z.number().int().optional(),graduationYear:z.number().int().optional(),schoolName:text.optional()}).strict();
const person=v2Person.extend({skills:legacyPerson.shape.skills.extend({sports:score}),gender:z.enum(['male','female']),attractedTo:z.enum(['male','female']),originHouseholdId:z.string(),enrollments:z.array(enrollment).max(100),specialty:z.enum(['music','sports']),life:lifeSchema.optional(),sanity:score.optional(),personality:z.object({energy:score,openness:score,reasoning:score,planning:score,answers:z.array(z.enum(['a','b'])).max(4)}).strict().optional(),clubs:z.array(z.enum(['music','sports','film','volunteer'])).max(2).refine(v=>new Set(v).size===v.length).optional(),schoolExams:z.array(z.object({year:z.number().int(),total:z.number().int(),checks:z.array(check).length(5)}).strict()).max(100).optional(),juniorSubjects:z.object({chinese:score,math:score,english:score,science:score,socialStudies:score}).strict().optional(),juniorFocus:z.enum(['all','chinese','math','english','science','socialStudies']).optional(),employment:z.object({company:text,position:text,startYear:z.number().int(),startDate:date.optional(),monthlySalary:money.optional()}).strict().optional(),sport:z.enum(['athletics','swimming','basketball','volleyball','baseball','football','badminton','table-tennis','tennis','gymnastics','taekwondo','judo']).optional(),musicTraining:z.object({major:z.enum(['violin','viola','cello','double-bass','flute','clarinet','oboe','bassoon','saxophone','trumpet','horn','euphonium','trombone','tuba','percussion']),owned:z.boolean(),mode:z.enum(['private-teacher','studio-teacher','school-practice','school-loan']).nullable(),lastPaidYear:z.number().int().nullable(),purchaseYear:z.number().int().optional()}).strict().optional()});
const v3Schema=v2Schema.extend({schemaVersion:z.literal(3),rulesVersion:z.literal('slice-3'),dataVersion:z.literal('pilot-2'),people:z.array(person).min(1).max(1000),pendingAdmission:z.object({year:z.number().int(),total:z.number().int(),checks:z.array(check).length(5),route:z.enum(['senior','vocational','juniorCollege']).optional()}).strict().optional(),admissionNotice:z.object({id:z.string(),title:text,detail:text}).strict().optional(),housing:z.array(z.object({householdId:z.string(),tenure:z.enum(['rent','owned','unknown']),value:money.nullable(),mortgage:money.nullable(),monthlyRent:money.nullable()}).strict()).max(1000)});
const v4Schema=v3Schema.extend({schemaVersion:z.literal(4),rulesVersion:z.literal('slice-4'),dataVersion:z.literal('pilot-3')});
const v5Schema=v4Schema.extend({schemaVersion:z.literal(5),rulesVersion:z.literal('slice-5'),dataVersion:z.literal('pilot-4')});
const v6Schema=v5Schema.extend({schemaVersion:z.literal(6),rulesVersion:z.literal('slice-6'),dataVersion:z.literal('snapshot-2026-1')});
const schema=v6Schema.extend({schemaVersion:z.literal(7),rulesVersion:z.literal('slice-7'),dataVersion:z.literal('snapshot-2026-2'),adoption:v2Schema.shape.pregnancy.optional()});
/** Migration adds deterministic metadata without consuming RNG or rewriting previous decisions. */
function migrate(raw:unknown):unknown{
 let value=raw;
 if(typeof value==='object'&&value!==null&&'schemaVersion' in value&&value.schemaVersion===1){
  const old=legacySchema.parse(value);
  value={...old,schemaVersion:2,rulesVersion:'slice-2',pregnancy:null,pendingChildId:null,people:old.people.map(p=>({...p,partnerId:null,familyName:p.children.length?`${p.name}的家`:null,fertility:initialFertility(old.seed,p.id)}))};
 }
 if(typeof value==='object'&&value!==null&&'schemaVersion' in value&&value.schemaVersion===2){
  const old=v2Schema.parse(value);
  const people=old.people.map(p=>{
   const enrollments:import('../../shared/src/types').Enrollment[]=[];
   for(const [level,offset] of [['primary',6],['junior',12]] as const){
    const year=p.birthYear+offset;
    if(year<=old.year){const choices=schools.filter(n=>n.level===level&&n.district===old.locationId&&n.from<=year);enrollments.push({level,startYear:year,track:'general',schoolId:choices[stableNumber(`${old.seed}:${p.id}:${level}:${year}`)%choices.length]?.id??null});}
   }
   // Higher education is not inferred from age alone. Old admission opportunities are not enrollment proof.
   return {...p,skills:{...p.skills,sports:10},...identityDefaults(old.seed,p.id),originHouseholdId:old.people.find(n=>p.guardianIds.includes(n.id))?.householdId??p.householdId,enrollments,specialty:'music'};
  });
  value={...old,schemaVersion:3,rulesVersion:'slice-3',dataVersion:'pilot-2',people,housing:[...new Set(people.map(p=>p.householdId))].map(householdId=>({householdId,tenure:'unknown',value:null,mortgage:null,monthlyRent:null}))};
 }
 if(typeof value==='object'&&value!==null&&'schemaVersion' in value&&value.schemaVersion===3){const old=v3Schema.parse(value);value={...old,schemaVersion:4,rulesVersion:'slice-4',dataVersion:'pilot-3'};}
 if(typeof value==='object'&&value!==null&&'schemaVersion' in value&&value.schemaVersion===4){const old=v4Schema.parse(value);value={...old,schemaVersion:5,rulesVersion:'slice-5',dataVersion:'pilot-4'};}
 if(typeof value==='object'&&value!==null&&'schemaVersion' in value&&value.schemaVersion===5){const old=v5Schema.parse(value);value={...old,schemaVersion:6,rulesVersion:'slice-6',dataVersion:'snapshot-2026-1'};}
 if(typeof value==='object'&&value!==null&&'schemaVersion' in value&&value.schemaVersion===6){const old=v6Schema.parse(value);value={...old,schemaVersion:7,rulesVersion:'slice-7',dataVersion:'snapshot-2026-2'};}
 return value;
}

export function deserialize(raw:string):World{
 if(raw.length>12_000_000)throw Error('Save file is too large');
 const s=schema.parse(migrate(JSON.parse(raw))) as World;
 if(s.pendingAdmission&&(s.pendingAdmission.year!==s.year||s.pendingAdmission.total!==s.pendingAdmission.checks.reduce((v,c)=>v+c.total,0)))throw Error('Invalid pending admission');
 if(s.people.some(p=>p.schoolExams?.some(e=>e.total!==e.checks.reduce((v,c)=>v+c.total,0))))throw Error('Invalid exam history');
 if(s.resolution?.checks&&s.resolution.admissionTotal!==s.resolution.checks.reduce((sum,c)=>sum+c.total,0))throw Error('Invalid admission total');
 const p=s.people.find(p=>p.id===s.playerId),ids=new Set(s.people.map(p=>p.id));
 if(!districtRows.some(r=>r.id===s.locationId))throw Error('Unknown district');
 if(!p||ids.size!==s.people.length||s.cursor>s.queue.length||!s.date.startsWith(String(s.year)))throw Error('Invalid world references');
 if(s.people.some(n=>[...n.parentIds,...n.guardianIds,...n.legalParentIds,...n.children,...(n.partnerId?[n.partnerId]:[])].some(id=>!ids.has(id)||id===n.id)))throw Error('Invalid family reference');
 if(s.phase==='event'&&['route','vocational-department','college-department'].includes(s.current?.data??'')&&!s.pendingAdmission)throw Error('Missing retained exam results');
 if(s.phase==='dead'&&p.alive||s.phase!=='dead'&&!p.alive)throw Error('Invalid death state');
 if((s.phase==='event'||s.phase==='resolved'||s.phase==='naming')&&!s.current)throw Error('Missing event');
 if(s.phase==='resolved'&&!s.resolution)throw Error('Missing result');
 if((s.phase==='focus'||s.phase==='event'||s.phase==='naming')&&s.year-p.birthYear<p.agencyAge)throw Error('Choice before agency');
 for(const entries of [s.ledger,s.journal,s.queue])if(new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('Duplicate event or posting');
 if(s.journal.some(j=>j.date>s.date||!ids.has(j.personId))||s.ledger.some(e=>e.date>s.date||!ids.has(e.personId)))throw Error('Future or orphaned record');
 if(new Set(s.housing.map(h=>h.householdId)).size!==s.housing.length)throw Error('Duplicate household property');
 if(s.people.some(n=>n.musicTraining?.lastPaidYear!=null&&n.musicTraining.lastPaidYear>s.year))throw Error('Invalid music year');
 if(s.people.some(n=>n.enrollments.some(e=>e.startYear<n.birthYear+(e.level==='kindergarten'?3:5)||e.schoolId&&!schools.some(school=>school.id===e.schoolId&&school.level===e.level&&(school.from<=e.startYear||school.from===2026)))))throw Error('Invalid school chronology');
 if(s.people.some(n=>Object.keys(n.life?.childPlans??{}).some(id=>!n.children.includes(id))))throw Error('Invalid child spending plan');
 if(s.people.some(n=>n.life?.academicGrades?.some(r=>r.year>s.year)))throw Error('Future coursework grade');
 if(s.people.some(n=>n.life?.relationship&&!ids.has(n.life.relationship.personId)))throw Error('Invalid dating partner');
 if(s.people.some(n=>n.life?.reports?.some(r=>r.date>s.date||Object.values(r.subjects).some(v=>v.score!==(r.formula===2?Math.min(99,Math.round(30+v.proficiency*2.2+v.die*1.2)):Math.min(100,(v.die+v.proficiency)*5))))))throw Error('Invalid term report');
 if(s.people.some(n=>n.life?.university?.rounds.some(r=>r.scores?r.total!==Object.values(r.scores).reduce((v,n)=>v+n,0):r.basis?r.checks.length!==0:r.total!==r.checks.reduce((v,c)=>v+c.total,0)&&r.checks.length!==1)))throw Error('Invalid university round');
 if(s.people.some(n=>n.partnerId&&s.people.find(other=>other.id===n.partnerId)?.partnerId!==n.id))throw Error('Nonreciprocal partner');
 if(s.pendingChildId!==null){const child=s.people.find(n=>n.id===s.pendingChildId);if(s.phase!=='naming'||!child||!child.alive||!child.legalParentIds.includes(s.playerId)||child.birthYear!==s.year||s.current?.kind!=='birth')throw Error('Invalid pending child');}
 if(s.phase==='naming'&&!s.pendingChildId)throw Error('Missing child awaiting name');
 if(s.adoption&&s.pregnancy)throw Error('Concurrent family arrival plans');
 if(s.adoption&&(!ids.has(s.adoption.partnerId)||s.adoption.parentIds.length!==2||new Set(s.adoption.parentIds).size!==2||s.adoption.parentIds.some(id=>!ids.has(id))||!s.adoption.parentIds.includes(s.playerId)||s.adoption.dueDate<=s.date))throw Error('Invalid adoption');
 if(s.pregnancy&&(!ids.has(s.pregnancy.partnerId)||s.pregnancy.parentIds.length!==2||new Set(s.pregnancy.parentIds).size!==2||s.pregnancy.parentIds.some(id=>!ids.has(id))||!s.pregnancy.parentIds.includes(s.pregnancy.partnerId)||s.pregnancy.dueDate<=s.date))throw Error('Invalid pregnancy');
 return s;
}
export function serialize(s:World):string{return JSON.stringify(s);}
