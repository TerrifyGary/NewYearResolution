import type {LifeState} from './life';
export type {LifeState,Hobby,TermReport} from './life';
export type Language = 'zh' | 'en';
export type Text = { zh: string; en: string };
export type Attribute = 'str'|'dex'|'con'|'int'|'wis'|'cha';
export type Skill = 'academic'|'music'|'coffee'|'social'|'sports';
export type EducationLevel='kindergarten'|'primary'|'junior'|'senior'|'vocational'|'juniorCollege'|'university'|'master';
export interface Enrollment {schoolId:string|null; level:EducationLevel; track:'general'|'music'|'sports'; startYear:number; classNumber?:number; seat?:number; animal?:string; department?:Text; group?:Text; outcome?:'graduated'|'withdrawn'; endYear?:number;graduationYear?:number;schoolName?:Text}
export interface Housing {householdId:string; tenure:'rent'|'owned'|'unknown'; value:number|null; mortgage:number|null; monthlyRent:number|null}
export type JuniorSubject='chinese'|'math'|'english'|'science'|'socialStudies';
export type Sport='athletics'|'swimming'|'basketball'|'volleyball'|'baseball'|'football'|'badminton'|'table-tennis'|'tennis'|'gymnastics'|'taekwondo'|'judo';
export type Instrument='violin'|'viola'|'cello'|'double-bass'|'flute'|'clarinet'|'oboe'|'bassoon'|'saxophone'|'trumpet'|'horn'|'euphonium'|'trombone'|'tuba'|'percussion';
export type MusicMode='private-teacher'|'studio-teacher'|'school-practice'|'school-loan';
export interface MusicTraining {major:Instrument;owned:boolean;mode:MusicMode|null;lastPaidYear:number|null;purchaseYear?:number}
export type Focus = 'study'|'talent'|'social'|'health'|'career'|'balanced';
export type Phase = 'story'|'focus'|'event'|'resolved'|'review'|'dead'|'naming';
export type EventKind = 'story'|'finance'|'illness'|'family'|'friend'|'academic'|'specialized'|'career'|'child'|'mortality'|'partnership'|'birth'|'enrollment'|'musicpractice'|'schoolstory'|'wellbeing'|'personality'|'club'|'life'|'termexam'|'universityentry';
export interface FertilityState {profile:'typical'|'reduced'; assessed:boolean; attempts:number; lastAttemptYear:number|null}
export interface Pregnancy {partnerId:string; parentIds:string[]; householdId:string; dueDate:string}
export interface Person {
 id:string; name:string; birthYear:number; alive:boolean; health:number; stress:number; fatigue:number;
 attributes:Record<Attribute,number>; skills:Record<Skill,number>; cash:number; debt:number;
 job:'none'|'service'|'technology'|'creative'|'retired'; parentIds:string[]; guardianIds:string[];
 legalParentIds:string[]; householdId:string; children:string[]; credentials:string[]; inventory:string[];
 agencyAge:number; employedMonths:number; pensionBalance:number; insuredYears:number;
 history: {year:number; text:Text}[]; deathDate?:string; deathCause?:Text;
 partnerId:string|null; familyName:string|null; fertility:FertilityState;
 gender:'male'|'female'; attractedTo:'male'|'female'; originHouseholdId:string; enrollments:Enrollment[]; specialty:'music'|'sports'; musicTraining?:MusicTraining; sport?:Sport; life?:LifeState; sanity?:number; personality?:{energy:number;openness:number;reasoning:number;planning:number;answers:string[]}; clubs?:('music'|'sports'|'film'|'volunteer')[]; schoolExams?:{year:number;total:number;checks:Check[]}[]; juniorSubjects?:Record<JuniorSubject,number>; juniorFocus?:JuniorSubject|'all'; employment?:{company:Text;position:Text;startYear:number;startDate?:string;monthlySalary?:number};
}
export interface JournalEntry {id:string; date:string; title:Text; text:Text; tone:number; personId:string; grade:'C'|'D'}
export interface GameEvent {id:string; date:string; kind:EventKind; title:Text; text:Text; tone:number; grade:'C'|'D'; data?:string}
export interface LedgerEntry {id:string; date:string; personId:string; category:'salary'|'living'|'education'|'medical'|'activity'|'insurance'|'labor'|'taxPayment'|'loan'|'repayment'|'familyAid'|'food'|'studentLoan'; relatedPersonId?:string; amount:number; text:Text}
export interface Check {die:number; modifier:number; dc:number; total:number; success:boolean; text:Text}
export interface Report {year:number; personId:string; openingCash:number; openingDebt:number; closingCash:number; closingDebt:number; income:number; expense:number; newDebt:number; taxAccrued:number; taxPaid:number; pensionAdded:number; fortune:Text; summary:Text}
export interface Resolution {text:Text; check?:Check; checks?:Check[]; admissionTotal?:number}
export interface World {
 schemaVersion:7; rulesVersion:'slice-7'; dataVersion:'snapshot-2026-2'; seed:string; rng:number;
 year:number; date:string; playerId:string; generation:number; locationId:string; phase:Phase;
 people:Person[]; journal:JournalEntry[]; ledger:LedgerEntry[]; reports:Report[];
 queue:GameEvent[]; cursor:number; current:GameEvent|null; resolution:Resolution|null; focus:Focus|null;
 openingCash:number; openingDebt:number; taxDue:Record<string,number>; estate:Record<string,number>;
 adoption?:Pregnancy|null;
 pregnancy:Pregnancy|null; pendingChildId:string|null;
 housing:Housing[]; pendingAdmission?:{year:number;total:number;checks:Check[];route?:'senior'|'vocational'|'juniorCollege'}; admissionNotice?:{id:string;title:Text;detail:Text};
}
export interface Option {id:string; title:Text; detail:Text; disabled?:boolean}
export const t=(zh:string,en:string):Text=>({zh,en});
