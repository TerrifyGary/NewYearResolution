import {t} from '../../shared/src/types';
export interface CareerRecord {fields?:string[];minDegree?:'master';id:string;company:ReturnType<typeof t>;role:ReturnType<typeof t>;kind:'service'|'technology'|'creative';monthly:number;partTime:boolean;skill:'academic'|'music'|'sports'|'coffee'|'social';dc:number;degree?:'music'|'sports';source:string;salaryBasis:'estimate'|'advertised-range';range?:[number,number];checked:string}
const record=(id:string,company:string,role:string,kind:CareerRecord['kind'],monthly:number,partTime:boolean,skill:CareerRecord['skill'],dc:number,source:string,degree?:CareerRecord['degree']):CareerRecord=>({id,company:t(company,company),role:t(role,role),kind,monthly,partTime,skill,dc,source,degree,salaryBasis:'estimate',checked:'2026-11-09'});
export const careers:CareerRecord[]=[
 record('music-tutor','社區音樂教室','樂器家教','creative',10000,true,'music',12,'https://careercenter.ntnu.edu.tw/list-detail.php?lang=zh-tw&sid=15544&type=info-job','music'),
 record('academic-tutor','鄰近學區家教媒合','課業家教','service',9000,true,'academic',12,'https://www.mol.gov.tw/1607/28162/28166/28180/70460/'),
 record('cafe-part','路易莎咖啡','兼職門市夥伴','service',7840,true,'coffee',11,'https://www.louisacoffee.co/index.php/contact-wanted'),
 record('restaurant-part','社區餐廳','外場服務人員','service',7840,true,'social',10,'https://www.mol.gov.tw/1607/28162/28166/28180/70460/'),
 record('delivery','外送平台接案','機車外送夥伴','service',10000,true,'social',11,'https://www.mol.gov.tw/1607/28162/28166/28180/70460/'),
 record('fitness-part','社區健身工作室','兼職健身教練','service',12000,true,'sports',13,'https://www.fitnessfactory.com.tw/tw/announce/022603191087633065/','sports'),
 record('music-center','功學社音樂中心','音樂教室專員','creative',31000,false,'social',12,'https://alumni.nutn.edu.tw/job/音樂教室專員_高雄一心教學中心/'),
 record('music-teacher','這球流行音樂學院','樂器授課教師','creative',34000,false,'music',14,'https://careercenter.ntnu.edu.tw/list-detail.php?lang=zh-tw&sid=15544&type=info-job','music'),
 record('gym-coach','健身工廠','私人教練','service',32000,false,'sports',14,'https://career.nptu.edu.tw/p/404-1094-191485.php?Lang=zh-tw','sports'),
 record('worldgym','World Gym','健身顧問','service',31000,false,'social',12,'https://www.worldgymtaiwan.com/careers','sports'),
 record('cafe-full','路易莎咖啡','正職咖啡門市夥伴','service',31000,false,'coffee',12,'https://www.louisacoffee.co/index.php/contact-wanted'),
 record('office','地方企業','行政企劃專員','service',32000,false,'academic',12,'https://www.mol.gov.tw/1607/28162/28166/28180/70460/'),
 record('software','資訊服務公司','初級軟體工程師','technology',42000,false,'academic',15,'https://careercenter.ntnu.edu.tw/')
 ,record('software-mid','叡揚資訊','軟體工程師','technology',60000,false,'academic',15,'https://www.gss.com.tw/'),
 record('software-senior','趨勢科技','資深軟體工程師','technology',85000,false,'academic',18,'https://www.trendmicro.com/zh_tw/about/careers.html'),
 record('software-foreign','Microsoft Taiwan','軟體工程師','technology',110000,false,'academic',20,'https://careers.microsoft.com/v2/global/en/locations/taipei.html'),
 record('project-lead','台灣資訊企業','技術專案主管','technology',100000,false,'social',19,'https://www.mol.gov.tw/'),
 record('service-lead','連鎖服務企業','門市營運主管','service',48000,false,'social',16,'https://www.mol.gov.tw/'),
 record('creative-lead','藝文教育機構','課程企劃主管','creative',50000,false,'music',16,'https://www.mol.gov.tw/')
];
careers.find(r=>r.id==='music-center')!.salaryBasis='advertised-range';careers.find(r=>r.id==='music-center')!.range=[31000,34000];
export const teachingReference={year:2026,region:'new-taipei',vacancies:156,applicants:2222,ratio:156/2222,scope:'公立高中職30科整體；非音樂科個人錄取率',source:'https://www.ntpc.edu.tw/home.jsp?act=be4f48068b2b0031&dataserno=91293aa86679ff9766687eae0d1e68c6&id=d127e0ce0f4f407b',checked:'2026-11-09'};

const roleEnglish:Record<string,string>={'music-tutor':'Instrument tutor','academic-tutor':'Academic tutor','cafe-part':'Part-time café team member','restaurant-part':'Restaurant server',delivery:'Delivery partner','fitness-part':'Part-time fitness instructor','music-center':'Music center coordinator','music-teacher':'Instrument teacher','gym-coach':'Personal trainer',worldgym:'Fitness consultant','cafe-full':'Café team member',office:'Administrative coordinator',software:'Junior software engineer'};
const companies:Record<string,string>={'music-tutor':'Community music studio','academic-tutor':'Local tutoring network','cafe-part':'Louisa Coffee','restaurant-part':'Neighborhood restaurant',delivery:'Delivery platform','fitness-part':'Community fitness studio','music-center':'KHS Music Center','music-teacher':'The Ball Music Academy','gym-coach':'Fitness Factory',worldgym:'World Gym','cafe-full':'Louisa Coffee',office:'Local business',software:'IT services company'};
Object.assign(roleEnglish,{'software-mid':'Software engineer','software-senior':'Senior software engineer','software-foreign':'Software engineer','project-lead':'Technical project lead','service-lead':'Store operations manager','creative-lead':'Education program lead'});Object.assign(companies,{'software-mid':'Galaxy Software Services','software-senior':'Trend Micro','software-foreign':'Microsoft Taiwan','project-lead':'Taiwan IT company','service-lead':'Service company','creative-lead':'Arts education organization'});for(const r of careers){r.role.en=roleEnglish[r.id];r.company.en=companies[r.id];}



const fieldRoles:[string,string,string,string,number,string,boolean?][]=[
 ['lab-assistant','研究機構','實驗室研究助理','bio',38000,'Laboratory research assistant'],
 ['food-quality','食品製造企業','食品品管專員','bio',36000,'Food quality specialist'],
 ['research-associate','生技研發企業','研發研究員','bio',52000,'Research associate',true],
 ['marketing','品牌與行銷企業','行銷企劃專員','business',36000,'Marketing specialist'],
 ['operations-analyst','企業營運部門','營運分析師','business',48000,'Operations analyst',true],
 ['editor','出版與內容企業','文字編輯','language',34000,'Editor'],
 ['content-planner','教育與內容企業','內容企劃','language',36000,'Content planner']
];
for(const [id,company,role,field,monthly,en,master] of fieldRoles){const r=record(id,company,role,field==='bio'?'technology':'service',monthly,false,'academic',master?16:13,'https://jobooks.taiwanjobs.gov.tw/');r.fields=[field];if(master)r.minDegree='master';r.role.en=en;r.company.en='Local employer';careers.push(r);}
for(const r of careers){if(r.id.startsWith('software')||r.id==='project-lead')r.fields=['it'];if(['music-center','music-teacher','creative-lead'].includes(r.id))r.fields=['music'];}

export const careersById:Readonly<Record<string,CareerRecord>>=Object.fromEntries(careers.map(r=>[r.id,r]));
