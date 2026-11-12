import type {World,Person} from '../../shared/src/types';
import {educationView} from './education';
import {careers} from '../../world-data/src/careers';
export function higherStudent(s:World,p=s.people.find(n=>n.id===s.playerId)!){const v=educationView(s,p);return !!v.active&&['university','master','juniorCollege'].includes(v.enrollment?.level??'');}
export function fullTimeJob(s:World,p=s.people.find(n=>n.id===s.playerId)!){return !higherStudent(s,p)&&s.year-p.birthYear>=22&&p.job!=='none'&&p.job!=='retired'&&!!p.employment&&(p.employment.monthlySalary??0)>0;}
export function stableWork(s:World,p=s.people.find(n=>n.id===s.playerId)!){return fullTimeJob(s,p)&&p.employedMonths>=12;}
/** 4.3 reference scale, not a claim that all institutions use the same conversion. */
export function gradePoint(score:number){return score>=90?4.3:score>=85?4:score>=80?3.7:score>=77?3.3:score>=73?3:score>=70?2.7:score>=67?2.3:score>=63?2:score>=60?1.7:0;}
export function undergraduateGPA(p:Person){const uni=p.enrollments.filter(e=>e.level==='university').at(-1);const rows=(p.life?.academicGrades??[]).filter(r=>r.level?r.level==='university':!uni||r.year>=uni.startYear&&r.year<=(uni.endYear??uni.graduationYear??uni.startYear+4));if(!rows.length)return null;const credits=rows.reduce((n,r)=>n+(r.credits??30),0);return Math.round(rows.reduce((n,r)=>n+(r.gpa??gradePoint(r.score))*(r.credits??30),0)/credits*100)/100;}
export function partTimeRate(id:string){const r=careers.find(r=>r.id===id);return Math.round((r?.monthly??7840)/40);}
export function thesisReady(s:World,p=s.people.find(n=>n.id===s.playerId)!){const e=p.enrollments.find(e=>e.level==='master'&&!e.outcome);return !!e&&s.year-e.startYear+(s.date.slice(5)>='09-01'?1:0)>=2;}
