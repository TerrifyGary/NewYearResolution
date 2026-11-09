import {z} from 'zod';
const text=z.object({zh:z.string().max(5000),en:z.string().max(5000)}).strict(),score=z.number().min(0).max(100),money=z.number().int().min(0).max(1e12);
const iso=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v+'T00:00:00Z');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v;});
const subject=z.enum(['chinese','math','english','science','socialStudies']);
const check=z.object({die:z.number().int().min(1).max(20),modifier:z.number().int(),dc:z.number().int(),total:z.number().int(),success:z.boolean(),text}).strict().refine(c=>c.total===c.die+c.modifier&&c.success===(c.total>=c.dc));
const term=z.object({formula:z.literal(2).optional(),rank:z.number().int().positive().optional(),cohort:z.number().int().positive().optional(),date:iso,semester:z.union([z.literal(1),z.literal(2)]),exam:z.union([z.literal(1),z.literal(2),z.literal(3)]),subjects:z.record(subject,z.object({die:z.number().int().min(1).max(20),proficiency:z.number().int().min(0).max(20),score}).strict())}).strict();
export const lifeSchema=z.object({
 itemNotes:z.record(z.string(),text).optional(),
 mortgagePlan:z.object({startYear:z.number().int(),paidMonths:z.number().int().min(0),term:z.number().int().min(1).max(480),grace:z.number().int().min(0).max(60)}).strict().optional(),
 profiles:z.record(z.string(),z.array(z.enum(['a','b'])).max(4)).optional(),memoryStages:z.array(z.string()).optional(),clubNames:z.array(z.string()).max(4).optional(),
 clubStage:z.string().optional(),car:z.object({owned:z.boolean(),licensed:z.boolean()}).strict().optional(),
 academicGrades:z.array(z.object({year:z.number().int(),score,department:text}).strict()).max(300).optional(),
 graduate:z.object({department:z.string(),route:z.enum(['exam','record']).optional(),preparation:z.number().int().min(0).max(10)}).strict().optional(),
 cap:z.object({year:z.number().int(),subjects:z.record(subject,z.object({score,band:z.enum(['A++','A+','A','B++','B+','B','C'])}).strict()),summary:z.string()}).strict().optional(),
 career:z.object({roleId:z.string().optional(),lastPromotionYear:z.number().int().optional(),level:z.number().int().min(0).max(10)}).strict().optional(),
 business:z.object({id:z.string(),since:z.number().int(),capital:money,profit:z.number().int().min(-1000000).max(1000000),active:z.boolean()}).strict().optional(),
 childPlans:z.record(z.string(),z.object({care:z.enum(['parent','grandparent','nanny']),privateKindergarten:z.boolean(),tutoring:z.boolean(),music:z.boolean(),uniform:z.enum(['new','used'])}).strict()).optional(),
 workProficiency:score.optional(),unfundedNeeds:money.optional(),subjectPoints:z.record(subject,z.number().int().min(0).max(20)).optional(),hobbies:z.partialRecord(z.enum(['reading','music','sports','coffee','film','drawing','travel','cooking','hiking','camping','sup','gaming','animation','photography','japanese','tea','railway','chess','calligraphy']),money).optional(),tutoring:z.partialRecord(subject,z.boolean()).optional(),reports:z.array(term).max(1000).optional(),
 partTime:z.object({id:z.string().max(100),monthly:money,startDate:iso}).strict().optional(),jobSearchYear:z.number().int().optional(),room:z.object({city:z.string().max(100),rent:money,haunted:z.boolean()}).strict().optional(),scooter:z.object({owned:z.boolean(),licensed:z.boolean()}).strict().optional(),loanPrincipal:money.optional(),
 teaching:z.object({stage:z.enum(['program','exam-passed','interning','licensed']),startYear:z.number().int(),readyYear:z.number().int(),internshipEnd:iso.optional()}).strict().optional(),relationship:z.object({personId:z.string(),active:z.boolean(),startYear:z.number().int(),quality:score}).strict().optional(),
 university:z.object({group:z.union([z.literal(1),z.literal(2),z.literal(3)]).optional(),year:z.number().int(),music:z.boolean(),sports:z.boolean().optional(),rounds:z.array(z.object({name:text,total:z.number().int(),checks:z.array(check).max(6),scores:z.record(z.string(),score).optional(),basis:z.string().optional()}).strict()).max(6),offers:z.array(z.object({schoolId:z.string(),programs:z.array(z.string()).max(20),threshold:z.number()}).strict()).max(4),schoolId:z.string().optional()}).strict().optional()
}).strict();
