import {t,type World,type Person,type LedgerEntry,type LifeState,type JuniorSubject,type TermReport} from '../../shared/src/types';
import {enrollmentLength} from './education';
import {householdBand} from './housing';
import {subjectScores} from './subjects';
export interface FinanceContext {post:(s:World,p:Person,id:string,amount:number,category:LedgerEntry['category'],text:ReturnType<typeof t>,relatedPersonId?:string)=>void}
export const life=(p:Person):LifeState=>p.life??{};
export const ensureLife=(p:Person):LifeState=>p.life??(p.life={});
export function fundingParent(s:World,p:Person){return s.people.filter(n=>n.alive&&p.guardianIds.includes(n.id)).sort((a,b)=>b.cash-a.cash||a.id.localeCompare(b.id))[0];}
export function familyBudget(s:World,p:Person){const parent=fundingParent(s,p);if(!parent)return 0;if(s.year-p.birthYear<18)return parent.cash;const studying=p.enrollments.some(e=>!e.outcome&&['university','master','juniorCollege'].includes(e.level)&&(s.year-e.startYear<enrollmentLength(e)||s.year-e.startYear===enrollmentLength(e)&&s.date.slice(5)<='06-30'));return studying&&householdBand(s).index>=2?Math.max(0,parent.cash-30000):0;}
export function supportedExpense(s:World,p:Person,id:string,amount:number,category:LedgerEntry['category'],label:ReturnType<typeof t>,ctx:FinanceContext,studentLoan=false){
 if(s.ledger.some(e=>e.id===id))return;
 const parent=fundingParent(s,p),minor=s.year-p.birthYear<18;const support=parent&&minor&&['food','medical','education'].includes(category)?amount:Math.min(amount,familyBudget(s,p));
 if(parent&&support>0){ctx.post(s,parent,id+':parent',-support,'familyAid',label,p.id);ctx.post(s,p,id+':support',support,'familyAid',t('家庭資助：'+label.zh,'Family support: '+label.en),parent.id);}
 if(studentLoan&&p.cash<amount){const borrowed=amount-p.cash;p.debt+=borrowed;ensureLife(p).loanPrincipal=(life(p).loanPrincipal??0)+borrowed;ctx.post(s,p,id+':student-loan',borrowed,'studentLoan',t('就學貸款撥款','Student loan disbursement'));}
 if(s.year-p.birthYear<18&&!studentLoan&&p.cash<amount){ensureLife(p).unfundedNeeds=(life(p).unfundedNeeds??0)+amount-p.cash;amount=p.cash;}
 ctx.post(s,p,id,-amount,category,label);
}
export function subjectProficiency(p:Person):Record<JuniorSubject,number>{const scores=subjectScores(p);return life(p).subjectPoints??Object.fromEntries(Object.entries(scores).map(([k,v])=>[k,Math.floor(v/15)])) as Record<JuniorSubject,number>;}
export function termReport(s:World,p:Person,random:(s:World)=>number):TermReport{
 const month=Number(s.date.slice(5,7)),semester=month<=6?2:1,index=month<=6?[3,5,6].indexOf(month):[10,11,12].indexOf(month),points=subjectProficiency(p);const report:TermReport={formula:2,date:s.date,semester,exam:(index+1) as 1|2|3,subjects:{} as TermReport['subjects']};
 for(const key of Object.keys(points) as JuniorSubject[]){const die=1+Math.floor(random(s)*20);report.subjects[key]={die,proficiency:points[key],score:Math.min(99,Math.round(30+points[key]*2.2+die*1.2))};}
 const avg=Object.values(report.subjects).reduce((v,n)=>v+n.score,0)/5;report.cohort=200;report.rank=Math.max(1,Math.round(200/(1+Math.exp((avg-62)/7))));
 const state=ensureLife(p);state.subjectPoints={...points};state.reports=[...(state.reports??[]),report];return report;
}
