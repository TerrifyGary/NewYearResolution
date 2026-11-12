import type {Text,JuniorSubject,Check} from './types';
export type Hobby='reading'|'music'|'sports'|'coffee'|'film'|'drawing'|'travel'|'cooking'|'hiking'|'camping'|'sup'|'gaming'|'animation'|'photography'|'japanese'|'tea'|'railway'|'chess'|'calligraphy';
export interface TermReport {formula?:2;rank?:number;cohort?:number;date:string;semester:1|2;exam:1|2|3;subjects:Record<JuniorSubject,{die:number;proficiency:number;score:number}>}
export interface LifeState {
 cancerCheckedYear?:number;
 cancer?:{type:'lung';stage:number;diagnosisYear:number;diagnosisAge:number};
 timeBlock?:{version:1;startYear:number;endYear:number;reviewAtNextYear?:boolean};
 childPlanReviewed?:Record<string,number>;
 internship?:{year:number;company:Text;monthly:number;startDate:string;endDate:string};
 resolutionPlan?:{focus:import('./types').Focus;nextYear:number};
 wellbeingCauses?:{stress:Text[];fatigue:Text[]};
 separations?:{date:string;formerPartnerId:string;children:{childId:string;caregiverId:string;payerId:string;monthlySupport:number}[]}[];
 itemNotes?:Record<string,Text>;
 mortgagePlan?:{startYear:number;paidMonths:number;term:number;grace:number};
 profiles?:Record<string,string[]>;memoryStages?:string[];clubNames?:string[];
 clubStage?:string;car?:{owned:boolean;licensed:boolean};
 academicGrades?:{year:number;score:number;department:Text;gpa?:number;credits?:number;level?:'university'|'master'}[];
 graduate?:{department:string;route?:'exam'|'record';preparation:number};
 cap?:{year:number;subjects:Record<JuniorSubject,{score:number;band:'A++'|'A+'|'A'|'B++'|'B+'|'B'|'C'}>;summary:string};
 career?:{roleId?:string;lastPromotionYear?:number;level:number};
 business?:{id:string;since:number;capital:number;profit:number;active:boolean;closedDate?:string;mode?:'side'|'full';stableYears?:number;lastReviewedYear?:number};
 childPlans?:Record<string,{care:'parent'|'grandparent'|'nanny';privateKindergarten:boolean;tutoring:boolean;music:boolean;uniform:'new'|'used'}>;
 workProficiency?:number;unfundedNeeds?:number; subjectPoints?:Record<JuniorSubject,number>; hobbies?:Partial<Record<Hobby,number>>;tutoring?:Partial<Record<JuniorSubject,boolean>>;reports?:TermReport[];
 partTime?:{id:string;monthly:number;startDate:string;hourly?:number;hoursPerMonth?:number};jobSearchYear?:number;room?:{city:string;rent:number;haunted:boolean};scooter?:{owned:boolean;licensed:boolean};
 loanPrincipal?:number;teaching?:{stage:'program'|'exam-passed'|'interning'|'licensed';startYear:number;readyYear:number;internshipEnd?:string};
 relationship?:{personId:string;active:boolean;startYear:number;quality:number};
 university?:{group?:1|2|3;year:number;music:boolean;sports?:boolean;rounds:{name:Text;total:number;checks:Check[];scores?:Record<string,number>;basis?:string}[];offers:{schoolId:string;programs:string[];threshold:number}[];schoolId?:string};
}
