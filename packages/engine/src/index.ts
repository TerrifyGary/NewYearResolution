import {weightedLocation} from '../../world-data/src/geography';
import {scheduleChapter,memories,mortgageRate,mortgagePayment} from './chapters';
export {discardItem} from './chapters';
import {capResult,capBand} from './progression';
import {surnames,givenNames} from '../../world-data/src/names';
import {lifeYear,lifeOptions,resolveLife,lifeMonthly,enqueue,lifeEvent,musicStudent,type LifeContext} from './life-events';
import {ensureLife,life,supportedExpense,subjectProficiency,termReport} from './life-finance';
import {friendScene} from './life-scenes';
import {t,type World,type Person,type Focus,type GameEvent,type Option,type Check,type Skill,type Attribute,type Text,type JuniorSubject,type JournalEntry} from '../../shared/src/types';
import {sanity,familySupport,stageFriend,illnessProfile,illnessNames} from './wellbeing';
import {personality,personalityOptions,personalityQuestions} from './personality';
export {sanity} from './wellbeing';
export {personality,personalityAxes} from './personality';
import {stableNumber} from './education';
import {growSubjects,subjectAverage,subjectScores,juniorSubjects} from './subjects';
export {setJuniorFocus,subjectScores,juniorSubjects} from './subjects';
import {schools} from '../../world-data/src/schools';
import {locations,focusLabels} from '../../world-data/src';
import {initialFertility,nameSuggestions,validateGivenName} from './family';
export {familyView,nameSuggestions} from './family';
import {identityDefaults,entryLevel,educationView,enrollmentLength,admissionOptions,schoolCandidates,recordEnrollment,localAssignment} from './education';
import {initialHousing,householdBand} from './housing';
import {musicOptions,musicCost,musicPayer,instruments} from './music';
export {setSport,sports} from './sports';
export {setMusicMajor,instruments} from './music';
import {medicalQuote} from './healthcare';
export {educationView,characterStatus} from './education';
export * from '../../shared/src/types';
const clone=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export const player=(s:World)=>s.people.find(p=>p.id===s.playerId)!;
export const age=(s:World,p=player(s))=>s.year-p.birthYear;
function random(s:World){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296;}
function pick<T>(s:World,items:readonly T[]):T{return items[Math.floor(random(s)*items.length)];}
function hash(str:string){let n=2166136261;for(const c of str)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function person(s:World,id:string,birthYear:number,name?:string):Person{
 const attributes={} as Record<Attribute,number>;
 for(const a of ['str','dex','con','int','wis','cha'] as const)attributes[a]=8+Math.floor(random(s)*9);
 return {id,name:name??pick(s,surnames)+pick(s,givenNames),birthYear,alive:true,health:90,stress:15,fatigue:10,attributes,
 skills:{academic:15,music:10,coffee:0,social:15,sports:10},cash:0,debt:0,job:'none',parentIds:[],legalParentIds:[],guardianIds:[],householdId:'home-1',children:[],credentials:[],inventory:[],agencyAge:2+Math.floor((attributes.wis+attributes.int+Math.floor(random(s)*12))/16)%3,
 employedMonths:0,pensionBalance:0,insuredYears:0,history:[],partnerId:null,familyName:null,fertility:initialFertility(s.seed,id),...identityDefaults(s.seed,id),originHouseholdId:'home-1',enrollments:[],specialty:'music'};
}
function date(s:World,month:number,day:number){return `${s.year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;}
function event(s:World,month:number,day:number,kind:GameEvent['kind'],title:Text,text:Text,tone=0,data?:string):GameEvent{
 return {id:`${s.playerId}:${s.year}:${month}:${day}:${kind}`,date:date(s,month,day),kind,title,text,tone,grade:'D',data};
}
function log(s:World,e:GameEvent,text=e.text){
 if(!s.journal.some(j=>j.id===e.id)){s.journal.push({...e,text,personId:s.playerId});player(s).history.push({year:s.year,text});}
}
function post(s:World,p:Person,id:string,amount:number,category:World['ledger'][number]['category'],text:Text,relatedPersonId?:string){
 amount=amount===0?0:amount;
 if(s.ledger.some(e=>e.id===id))return;
 if(amount<0&&p.cash+amount<0){const loan=-(p.cash+amount);p.debt+=loan;s.ledger.push({id:id+':shortfall',date:s.date,personId:p.id,category:'loan',amount:loan,text:t('生活短缺：記入待償債務（試玩簡化）','Shortfall financed as debt (pilot simplification)')});p.cash+=loan;}
 p.cash+=amount;s.ledger.push({id,date:s.date,personId:p.id,category,amount,text,...(relatedPersonId?{relatedPersonId}:{})});
}
export function createGame(seed='new-year',birthYear=2008):World{
 if(!Number.isInteger(birthYear)||birthYear<1980||birthYear>2026)throw Error('Birth year must be 1980–2026');
 if(!seed.trim()||seed.length>100)throw Error('Invalid seed');
 const s:World={schemaVersion:7,rulesVersion:'slice-7',dataVersion:'snapshot-2026-2',seed,rng:hash(seed),year:birthYear,date:`${birthYear}-01-01`,playerId:'p1',generation:1,locationId:'',phase:'story',people:[],journal:[],ledger:[],reports:[],queue:[],cursor:0,current:null,resolution:null,focus:null,openingCash:0,openingDebt:0,taxDue:{},estate:{},pregnancy:null,pendingChildId:null,housing:[]};
 s.locationId=weightedLocation(random(s));
 const dad=person(s,'father',birthYear-27-Math.floor(random(s)*10));
 const mom=person(s,'mother',birthYear-25-Math.floor(random(s)*8));
 dad.job=pick(s,['service','technology'] as const);mom.job=pick(s,['service','technology','none'] as const);
 dad.cash=80000+Math.floor(random(s)*400000);mom.cash=50000+Math.floor(random(s)*250000);
 if(mom.name===dad.name)mom.name=mom.name[0]+givenNames[(givenNames.indexOf(mom.name.slice(1))+1)%givenNames.length];
 const p=person(s,'p1',birthYear);p.name=(random(s)<.05?mom.name[0]:dad.name[0])+p.name.slice(1);
 p.parentIds=[dad.id,mom.id];p.legalParentIds=[...p.parentIds];p.guardianIds=[...p.parentIds];p.inventory=['birth-record','blanket'];
 // Family contexts are fictional scenarios until the official generation distributions are imported.
 if(random(s)<.2){dad.householdId='home-2';p.guardianIds=[mom.id];}
 if(random(s)<.025){dad.alive=false;dad.job='none';dad.deathDate=`${birthYear-1}-12-01`;dad.deathCause=t('出生前因疾病過世','Illness before the child’s birth');p.guardianIds=[mom.id];}
 s.people=[p,dad,mom];s.housing=[...new Set(s.people.map(n=>n.householdId))].map(id=>initialHousing(seed,id));s.openingCash=p.cash;s.queue=buildYear(s);
 s.current=event(s,1,1,'story',t('你的人生，從這裡開始。','Your story begins here.'),t(`你的名字是${p.name}。照顧者正學著認識你的作息；在能自主決策之前，生活由他們安排。`,`Your name is ${p.name}. Your caregivers are learning your routines. They make decisions until your individual agency begins.`),1);
 log(s,s.current);return s;
}
function buildYear(s:World):GameEvent[]{
 const p=player(s),a=age(s),q:GameEvent[]=[];
 const add=(...args:Parameters<typeof event> extends [World,...infer R]?R:never)=>q.push(event(s,...args));
 for(let m=1;m<=12;m++)add(m,28,'finance',t('月度收支','Monthly ledger'),t('記錄本月帳目。','Recording this month’s ledger.'));
 if(a===0){
  add(2,10,'story',t('照顧日常','Everyday care'),t('照顧者記下吃奶與睡眠的情形，安排健康追蹤。','Your caregivers record feeding and sleep and arrange health follow-up.'),1);
  add(6,12,'story',t('新的味道','A new taste'),t('照顧者按你的發展情形準備副食品，奶類餵養仍持續。','Your caregivers introduce complementary foods according to your development; milk feeding continues.'),1);
 }else if(a<p.agencyAge)add(3,12,'story',t('慢慢長大','Growing day by day'),t('你開始留意熟悉的聲音，家人陪你探索身邊的世界。','You notice familiar voices as your family helps you explore.'),1);
 else{
  add(3,12,'story',t('身邊的小事','Lives around you'),a<22?t('朋友把練習時的小失誤說成笑話，你們笑了很久。','A friend turns a practice mishap into a joke, and you laugh together.'):t('老朋友換了新工作，聊天時仍惦記著週末的興趣課。','An old friend changes jobs but still talks about weekend hobby classes.'),1);
  const kind=pick(s,['illness','family','friend'] as const);const condition=illnessProfile(a,stableNumber(s.seed+':illness:'+s.year),p.stress);
  add(4,18,kind,kind==='illness'?illnessNames[condition]:kind==='family'?t('家人的來電','A call from home'):t('朋友的邀約','A friend’s invitation'),kind==='illness'?t('你這幾天不太舒服，原定的安排需要調整。','You have been feeling unwell; your plans may need adjusting.'):kind==='family'?t('一位家人身體不舒服，照顧者詢問你是否能陪伴。','A relative is unwell. Your family asks whether you can spend time with them.'):a<18?t('朋友邀你一起練習音樂，或到戶外走走。','A friend invites you to practice music or spend time outdoors.'):t('朋友邀你一起學手沖咖啡，也願意分享練習心得。','A friend invites you to learn pour-over coffee and share practice notes.'),kind==='friend'?1:-1,kind==='illness'?condition:kind==='friend'?'social:'+stageFriend(a).id:undefined);
 }
 if(a>=p.agencyAge){
  const university=p.enrollments.some(e=>e.level==='university'&&!e.outcome&&s.year-e.startYear<4),f=stageFriend(a,university);
  for(const [month,day] of [[2,8],[10,6]]){const friend=surnames[stableNumber(s.seed+':friend-surname:'+f.id)%surnames.length]+givenNames[stableNumber(s.seed+':friend:'+f.id)%givenNames.length];add(month,day,'friend',f.title,t(friend+'：'+f.text.zh+(personality(p).energy>=65?' 你也想約更多人一起參加。':' 這次可以只和熟悉的人相處。'),friend+': '+f.text.en),1,'social:'+f.id);}
  if(a>=12)add(11,10,'wellbeing',t('留意自己的心情','Check in with yourself'),t('這陣子過得還好嗎？你可以找家人聊聊、安排諮商，或留點時間給自己。','How have you been lately? Talk with family, arrange counseling, or make time for yourself.'),0);
  if(university)add(9,20,'club',t('大學社團招募','University club recruitment'),t('校園社團擺出攤位，你可以選擇參與。社團與活動費均為遊戲情境，最多保留兩個社團。','Campus clubs are recruiting. These simulated activities allow up to two memberships.'),1);
 }
 if(a===5&&personality(p).answers.length<4)add(1,12,'personality',personalityQuestions[personality(p).answers.length],t('快入小學了，先聊聊你覺得自在的選擇。每個人的答案都可以不一樣。','Before primary school, explore the choices that feel comfortable to you. Everyone can answer differently.'),0);
 if(a<p.agencyAge&&stableNumber(s.seed+':early-illness:'+s.year)%4===0)add(5,16,'illness',illnessNames.enterovirus,t('家人留意你的身體變化，替你安排就醫與休息；此為模擬照顧事件。','Your caregivers arrange care and rest; this is a simulated illness and care event.'),-1,'enterovirus');
 if(a>=6&&a<=21)add(7,12,'story',t('暑假裡的一天（示意日期）','A summer day (illustrative date)'),t('同學分享暑假的近況，你也替自己的生活留了一點空白。','A classmate shares summer news, and you leave some room to breathe.'),1);
 const caregivers=s.people.filter(n=>p.guardianIds.includes(n.id)&&n.alive);
 if(a<22&&householdBand(s).index>=3&&caregivers.reduce((n,v)=>n+v.cash,0)>350000&&random(s)<.18){
  add(8,12,'story',t('跟家人出國旅行','An overseas family trip'),t('你跟家人到澳洲旅遊，看見袋鼠十分開心，也一起參觀雪梨歌劇院。','You visit Australia with your family, enjoy seeing kangaroos, and explore the Sydney Opera House.'),2,'travel');
 }

 if(a===18&&!p.enrollments.some(e=>['senior','vocational'].includes(e.level))){
  add(2,14,'specialized',t('術科甄試（試玩模擬）','Specialized audition (pilot)'),t('你可以嘗試音樂術科；是否參加不會取消一般學科路線。','You may attempt a music audition. This does not remove your academic pathway.'),0);
  add(5,18,'academic',t('一般學科升學（試玩模擬）','Academic admission (pilot)'),t('普通班與專長班都能依準備情形參加。','Both general and specialist students may participate based on preparation.'),0,'university');
 }

 if(a>=22&&p.job!=='none'&&p.job!=='retired'){
  const risk={service:.07,technology:.1,creative:.12}[p.job];
  if(!life(p).business?.active&&random(s)<risk)add(8,15,'career',t('公司的變動','Changes at work'),t('雇主縮減人力，你的職位受到影響。','Your employer is reducing staff, and your position is affected.'),-2,'layoff');
 }
 if(a>=18&&!p.partnerId&&life(p).relationship?.active&&s.year-(life(p).relationship?.startYear??s.year)>=3)add(8,12,'partnership',t('一起建立一個家','Build a home together'),t('你與一位相處已久的伴侶討論共同生活。是否把彼此放進未來的安排裡？這是簡化成家劇情，不代表完成法律婚姻登記。','You and a long-term partner discuss sharing a home. This simplified family story is not a legal marriage-registration simulation.'),0);
 let level=entryLevel(a);if(level==='university'&&!p.enrollments.some(e=>['senior','vocational'].includes(e.level)&&e.startYear<=s.year-3))level=null;if(level==='master'&&!p.enrollments.some(e=>e.level==='university'&&e.startYear+enrollmentLength(e)<=s.year))level=null;
 if(a>=15&&a<=17&&!p.enrollments.some(e=>['senior','vocational','juniorCollege'].includes(e.level)))level='senior';
 if(a>=18&&a<=30&&!p.enrollments.some(e=>e.level==='university')&&p.enrollments.some(e=>['senior','vocational'].includes(e.level)&&e.startYear<=s.year-3))level='university';
 if(a>=22&&a<=30&&!p.enrollments.some(e=>e.level==='master')&&p.enrollments.some(e=>e.level==='university'&&e.startYear+enrollmentLength(e)<=s.year)&&(!life(p).teaching||life(p).teaching?.stage==='licensed'))level='master';
 if(level==='university')q.push(lifeEvent(s,1,10,'begin',t('大學入學的準備','Preparing for university admission'),t('你可以依準備選擇一般大學入學或音樂系術科。','Choose general university admission or a music audition according to your preparation.'),'universityentry'));
 else if(level)add(6,20,'enrollment',t('選擇下一段學習旅程','Choose your next school'),t('高中一般入學使用 D20 與各校遊戲難度，不設固定會考分數門檻。音樂、體育途徑僅進行相應術科檢定；學校名稱有來源，未核實的班別與招生條件皆為遊戲情境。','Senior-high general entry uses D20 and fictional school difficulty, without a fixed CAP score cutoff. Music and sports use specialty checks. School names are sourced; unverified programs and eligibility are game scenarios.'),0,level);
 if(p.enrollments.some(e=>e.level==='kindergarten'&&e.startYear===s.year))add(9,1,'story',t('幼兒園的新生活','Starting kindergarten'),t('家人替你安排了幼兒園，新的教室和同伴正等著你。','Your caregivers arrange kindergarten; a new classroom and companions await.'),1,'kindergarten-admitted');
 const senior=p.enrollments.find(e=>e.level==='senior'&&e.track==='general'&&!e.outcome);if(senior&&s.year>=senior.startYear+1&&s.year<=senior.startYear+2&&!senior.group)add(8,25,'schoolstory',t('升高二：選擇類組','Choose a senior-high study group'),t('你和老師討論接下來的學習方向。類組為簡化遊戲設定，不代表各校當年的實際分組。','Discuss your study direction. Groups are simplified gameplay settings, not verified historical school arrangements.'),0,'group');
 const master=p.enrollments.find(e=>e.level==='master'&&!e.outcome);if(master&&s.year>=master.startYear+2&&s.year<=master.startYear+4)add(6,15,'schoolstory',t('碩士論文與教授審查','Master’s thesis and supervisor review'),t('碩二起可每年嘗試畢業檢定。D20、學科能力與難度均為遊戲設定，不代表真實學位審查；試玩最多四年。','From year two, attempt an annual graduation check. The D20 model is fictional, not an actual degree assessment; this pilot allows four years.'),0,'graduate');
 const partner=s.people.find(n=>n.id===p.partnerId);
 if(a>=30&&a<=45&&p.children.length<3&&partner?.alive&&!s.pregnancy&&!s.adoption)add(9,6,'child',t('關於孩子，你們怎麼想？','What do you think about children?'),t(partner?.gender===p.gender?'你與伴侶討論是否開始領養與照顧孩子的準備。':'你與伴侶討論是否嘗試生育。結果使用未校準的遊戲機率，不保證懷孕；未成功也不等於醫學上的不孕診斷。','You discuss trying for a child. Uncalibrated game probabilities do not guarantee pregnancy; an unsuccessful attempt is not a medical infertility diagnosis.'),0);
 if(s.adoption?.dueDate.startsWith(String(s.year)))q.push({...event(s,6,6,'birth',t('領養孩子來到家中','Welcoming your adopted child'),t('完成這段準備，孩子來到你們的家。','After preparation, you welcome your adopted child.'),2,'adoption'),date:s.adoption.dueDate});
 if(s.pregnancy?.dueDate.startsWith(String(s.year)))q.push({...event(s,6,6,'birth',t('新生命來到家中','A new life arrives'),t('家人準備迎接孩子。','Your family prepares to welcome a child.'),2),date:s.pregnancy.dueDate});
 if(a>=55&&p.job!=='retired')add(10,12,'career',t('下一階段的人生','The next chapter'),t('你想繼續工作，還是先用現有資源安排退休？試玩版尚未計算法定退休給付。','Would you keep working or retire using your current resources? Statutory retirement benefits are not modeled yet.'),0,'retire');
 // One all-cause draw, then one cause; no overlapping cause-specific death rolls.
 const mortality=mortalityRisk(a);
 if(random(s)<mortality){const month=1+Math.floor(random(s)*12),day=2+Math.floor(random(s)*24);add(month,day,'mortality',t('人生的最後一頁','The final page'),t('這段生命因疾病或意外而結束。','This life ends through illness or accident.'),-3,random(s)<.8?'disease':'accident');}
 q.push(...lifeYear(s));
 return q.sort((x,y)=>x.date.localeCompare(y.date)||(x.kind==='mortality'?-1:y.kind==='mortality'?1:x.id.localeCompare(y.id)));
}
export function focuses(s:World):Option[]{
 if(s.phase!=='focus'||age(s)<player(s).agencyAge)return [];
 const a=age(s),p=player(s);if(a<6)return ['social','health'].map(id=>({id,title:focusLabels[id as Focus],detail:t('幼兒階段由家長安排學習，照顧相處與健康。','Parents arrange learning; focus on relationships or health.')}));return (['study','talent','social','health',...(a>=18?['career']:[]),'balanced'] as Focus[]).map(id=>({id,title:id==='study'&&(!!player(s).employment||player(s).job!=='none'&&player(s).job!=='retired')?t('工作進修與專業閱讀','Professional learning and reading'):focusLabels[id],detail:{
 study:(!!p.employment||p.job!=='none'&&p.job!=='retired')?t('閱讀工作相關書籍、精進專業 · 能力 +7','Read for professional development · proficiency +7'):t('學科 +7 · 疲勞 +4','Academics +7 · Fatigue +4'),talent:player(s).specialty==='sports'?t('體育 +7 · 疲勞 +4','Sports +7 · Fatigue +4'):t('音樂 +7 · 疲勞 +4','Music +7 · Fatigue +4'),social:t('社交 +6 · 壓力 −3','Social +6 · Stress −3'),health:t('健康 +5 · 疲勞 −8','Health +5 · Fatigue −8'),career:t('職涯準備：學科與社交各 +3','Career preparation: academics and social +3'),balanced:t('學科、音樂各 +3 · 健康 +2','Academics and music +3 · Health +2')
 }[id]}));
}
export function chooseFocus(input:World,focus:Focus):World{
 if(!focuses(input).some(o=>o.id===focus))throw Error('Focus is not available');
 const s=clone(input),p=player(s),beforePoints=subjectProficiency(p);s.focus=focus;if(focus==='talent')s.queue=s.queue.filter(e=>e.kind!=='academic');
 if(focus==='study'){if(p.employment){const work=ensureLife(p);work.workProficiency=clamp((work.workProficiency??0)+7);work.hobbies={...work.hobbies,reading:(work.hobbies?.reading??0)+2};}if((['junior','senior','vocational'].includes(educationView(s,p).enrollment?.level??'')||educationView(s,p).enrollment?.level==='primary'&&age(s)>=10)){const points={...beforePoints};for(const key of Object.keys(points) as JuniorSubject[])if(!p.juniorFocus||p.juniorFocus==='all'||p.juniorFocus===key)points[key]=Math.min(20,points[key]+1);ensureLife(p).subjectPoints=points;}if(educationView(s,p).enrollment?.level==='junior')growSubjects(p,7,true);else p.skills.academic=clamp(p.skills.academic+7);p.fatigue=clamp(p.fatigue+4);}
 if(focus==='talent'){p.skills[p.specialty]=clamp(p.skills[p.specialty]+7);p.fatigue=clamp(p.fatigue+4);}
 if(focus==='social'){p.skills.social=clamp(p.skills.social+6);p.stress=clamp(p.stress-3);}
 if(focus==='health'){p.sanity=clamp(sanity(p)+5);p.stress=clamp(p.stress-4);p.health=clamp(p.health+5);p.fatigue=clamp(p.fatigue-8);}
 if(focus==='career'){p.skills.academic=clamp(p.skills.academic+3);p.skills.social=clamp(p.skills.social+3);}
 if(focus==='balanced'){if(educationView(s,p).enrollment?.level==='junior')growSubjects(p,3);else p.skills.academic=clamp(p.skills.academic+3);p.skills.music=clamp(p.skills.music+3);p.health=clamp(p.health+2);}
 if(age(s)>=5&&p.specialty==='music'&&p.job==='none'&&((age(s)<18&&focus==='talent'&&(!!p.musicTraining||p.clubs?.includes('music')))||p.enrollments.some(e=>e.track==='music'&&s.year-e.startYear<enrollmentLength(e)))){scheduleMusic(s,2,15);}
 s.phase='story';s.current=event(s,1,1,'story',focus==='study'&&p.employment?t('工作進修與專業閱讀','Professional learning and reading'):focusLabels[focus],t('你寫下了今年的希望。接下來的生活仍會有意料之外的變化。','You write down your resolution. Life will still bring unexpected turns.'),1);log(s,s.current);return s;
}
function admissionStep(s:World,data:string){const day=new Date(s.date+'T00:00:00Z');day.setUTCDate(day.getUTCDate()+1);const e=event(s,day.getUTCMonth()+1,day.getUTCDate(),'schoolstory',data==='route'?t('會考後：選擇升學路線','After the exam: choose your route'):t('選擇科別並分發','Choose a department and receive placement'),t('保留這次五科總分，接下來的路線與科別選擇不會重擲考試。','Your five-subject total is retained; route and department choices do not reroll the exam.'),0,data);s.queue.push(e);s.queue.sort((a,b)=>a.date.localeCompare(b.date));}
function scheduleMusic(s:World,month:number,day:number){
 if(player(s).musicTraining?.lastPaidYear===s.year||s.queue.some(e=>e.kind==='musicpractice'))return;
 s.queue.push(event(s,month,day,'musicpractice',t('主修樂器與練習安排','Major instrument and practice arrangements'),t('先選主修樂器，再依家庭現金選擇本年的樂器與教學資源。金額、租借與可帶回家練習皆為模擬；不保證真實學校提供。','Choose a major, then an affordable annual instrument and teaching arrangement. Prices, rental and home practice are simulated, not guaranteed school services.'),0));
 s.queue.sort((a,b)=>a.date.localeCompare(b.date));
}
function monthFinance(s:World,e:GameEvent){
 const p=player(s),a=age(s),month=Number(e.date.slice(5,7));const study=educationView(s,p);if(study.active&&study.enrollment?.level==='master')p.job='none';
 for(const n of s.people.filter(n=>n.alive)){
  const na=age(s,n);if(n.id!==p.id){
   // Lightweight NPC economies and history exist before they become playable.
   if(na>=22&&na<65&&n.job==='none')n.job=n.skills.music>60?'creative':'service';
   if(na>=65)n.job='retired';
   const income=n.job==='technology'?45000:n.job==='service'?30000:n.job==='creative'?32000:0;
   n.cash=Math.max(0,n.cash+income-(na>=18?24000:0));
  }
 }
 for(const home of s.housing){
  const members=s.people.filter(n=>n.alive&&age(s,n)>=18&&n.householdId===home.householdId);
  const payer=home.householdId===p.householdId&&p.familyName?members.find(n=>n.id===p.id)??members[0]:members.find(n=>p.guardianIds.includes(n.id))??members.find(n=>n.id===p.id)??members[0];if(!payer)continue;
  const id=e.id+':housing:'+home.householdId;if(s.ledger.some(l=>l.id===id))continue;
  if(home.tenure==='rent'&&home.monthlyRent&&!(payer.id===p.id&&life(p).room))post(s,payer,id,-home.monthlyRent,'living',t('房租（遊戲估值）','Rent (game estimate)'));
  if(home.tenure==='owned'&&home.mortgage&&payer.id===p.id&&life(p).mortgagePlan){const plan=ensureLife(p).mortgagePlan!,rate=plan.startYear>=2026?mortgageRate(Math.floor(plan.paidMonths/12)+1):.02,interest=Math.round(home.mortgage*rate/12),payment=mortgagePayment(home.mortgage,rate,plan.term-plan.paidMonths);post(s,p,e.id+':mortgage-interest',-interest,'living',t('銀行房貸利息','Mortgage interest'));const principal=Math.min(home.mortgage,Math.max(0,payment-interest));post(s,p,e.id+':mortgage-principal',-principal,'repayment',t('房貸本金','Mortgage principal'));home.mortgage-=principal;plan.paidMonths++;}else if(home.tenure==='owned'&&home.mortgage){const interest=Math.round(home.mortgage*.02/12),principal=Math.min(home.mortgage,home.value===6000000?Math.max(0,20000-interest):10000),payment=Math.min(payer.cash,principal+interest);post(s,payer,id,-payment,'repayment',t('房貸付款（虛構利率與攤還值）','Mortgage payment (fictional rate/amortization)'));home.mortgage=Math.max(0,home.mortgage+interest-payment);}
 }
 if(life(p).teaching?.stage==='interning')p.job='none';let gross=a>=18&&p.job!=='none'&&p.job!=='retired'?(p.employment?.monthlySalary??{service:30000,technology:45000,creative:32000}[p.job]):0;
 if(gross){
  post(s,p,e.id+':salary',gross,'salary',t('稅前薪資（虛構平衡值）','Gross salary (fictional balance)'));
  post(s,p,e.id+':labor',-Math.round(gross*.025),'labor',t('勞保個人負擔估值（非法定試算）','Employee labor premium estimate (not statutory)'));
  p.employedMonths++;p.insuredYears+=1/12;p.stress=clamp(p.stress+3+(p.employedMonths>=6?1:0));p.fatigue=clamp(p.fatigue+2);p.sanity=clamp(sanity(p)-2-(p.stress>=70?2:0));
  if(s.year>=2005)p.pensionBalance+=Math.round(gross*.06); // Illustrative account, not complete statutory implementation.
 }
 if(a>=18){
  supportedExpense(s,p,e.id+':food',6000,'food',t('平日伙食與食材','Everyday meals and groceries'),lifeContext);if(study.active&&['university','master','juniorCollege'].includes(study.enrollment?.level??''))supportedExpense(s,p,e.id+':living',12000,'living',t('交通、日用品與日常開銷','Transport, supplies and daily expenses'),lifeContext);else post(s,p,e.id+':living',-12000,'living',t('交通、日用品與日常開銷','Transport, supplies and daily expenses'));
  if(s.year>=1995)post(s,p,e.id+':nhi',-(gross?Math.round(gross*.018):900),'insurance',t('健保保費估值（身分簡化）','NHI estimate (simplified category)'));
  
 }
 lifeMonthly(s,e,lifeContext);
 if(month===5&&s.taxDue[p.id]){post(s,p,e.id+':tax',-s.taxDue[p.id],'taxPayment',t('支付上年度所得稅估值','Payment of prior-year estimated tax'));s.taxDue[p.id]=0;}
}
function closeYear(s:World){
 const p=player(s),items=s.ledger.filter(e=>e.personId===p.id&&e.date.startsWith(String(s.year)));
 const income=items.filter(e=>e.category==='salary'||e.category==='familyAid'&&e.amount>0).reduce((n,e)=>n+e.amount,0);
 const expense=Math.abs(items.filter(e=>e.amount<0).reduce((n,e)=>n+e.amount,0));
 const newDebt=items.filter(e=>e.category==='loan'||e.category==='studentLoan').reduce((n,e)=>n+e.amount,0);
 const wageIncome=items.filter(e=>e.category==='salary').reduce((v,e)=>v+e.amount,0);const taxAccrued=Math.round(Math.max(0,wageIncome-400000)*.05);s.taxDue[p.id]=(s.taxDue[p.id]??0)+taxAccrued;
 const tones=s.journal.filter(j=>j.personId===p.id&&j.date.startsWith(String(s.year))).reduce((n,j)=>n+j.tone,0);
 const labels=[t('大凶','Great adversity'),t('中凶','Adversity'),t('小凶','Small setbacks'),t('小吉','Small blessings'),t('中吉','Good fortune'),t('大吉','Great fortune')];
 const index=tones<=-5?0:tones<=-3?1:tones<0?2:tones<3?3:tones<6?4:5;
 s.reports.push({year:s.year,personId:p.id,openingCash:s.openingCash,openingDebt:s.openingDebt,closingCash:p.cash,closingDebt:p.debt,income,expense,newDebt,taxAccrued,taxPaid:Math.abs(items.filter(e=>e.category==='taxPayment').reduce((n,e)=>n+e.amount,0)),pensionAdded:s.year>=2005?Math.round(income*.06):0,fortune:labels[index],summary:tones<0?t('生活帶來牽掛，你在變動中繼續尋找自己的步調。','Life brought concerns as you kept searching for your own rhythm.'):t('在日常的陪伴與練習裡，你替下一年留下新的可能。','Everyday support and practice opened possibilities for another year.')});
 s.phase='review';s.current=null;s.resolution=null;s.date=date(s,12,31);
}
export function advance(input:World):World{
 if(!['story','resolved'].includes(input.phase))throw Error('Resolve the current decision first');
 const s=clone(input);s.resolution=null;s.current=null;
 while(s.cursor<s.queue.length){
  const e=s.queue[s.cursor++];s.date=e.date;
  if(e.kind==='finance'){monthFinance(s,e);continue;}
  if(e.kind==='termexam'){if(['junior','senior','vocational'].includes(educationView(s,player(s)).enrollment?.level??'')){const r=termReport(s,player(s),random);s.current=e;log(s,e,t('段考成績：'+Object.entries(r.subjects).map(([k,v])=>juniorSubjects[k as JuniorSubject].zh+' '+v.score+'分').join('、'),'Term examination results are recorded in your report card.'));s.phase='story';return s;}continue;}
  if(e.kind==='mortality'){
   const p=player(s);p.alive=false;p.deathDate=e.date;p.deathCause=e.data==='accident'?t('意外','Accident'):t('疾病','Illness');
   s.estate[p.id]=p.cash;s.phase='dead';s.current=e;log(s,e,t('這段人生停在了這一天。留下的家人與記憶，仍是這個世界的一部分。','This life stopped on this day. Family and memories remain part of the world.'));s.queue=[];s.cursor=0;return s;
  }
  if(e.kind==='birth'){
   const adopted=e.data==='adoption',pregnancy=adopted?s.adoption:s.pregnancy,partner=s.people.find(n=>n.id===pregnancy?.partnerId);
   if(adopted)s.adoption=null;else s.pregnancy=null;
   if(!pregnancy||!partner?.alive||adopted&&pregnancy.parentIds.some(id=>{const parent=s.people.find(n=>n.id===id);return !parent?.alive||parent.householdId!==pregnancy.householdId;})){s.current=e;s.phase='story';log(s,e,t('照顧情況已改變，這段期待未能照原定安排繼續。','Care circumstances changed, and the planned family arrival did not proceed.'));return s;}
   const p=player(s),child=person(s,`child-${s.people.length}`,s.year);
   child.name=(random(s)<.05?partner.name[0]:p.name[0])+'（待取名）';child.parentIds=adopted?[]:[...pregnancy.parentIds];child.legalParentIds=[...pregnancy.parentIds];child.guardianIds=child.legalParentIds.filter(id=>s.people.find(n=>n.id===id)?.alive);child.householdId=pregnancy.householdId;child.originHouseholdId=pregnancy.householdId;
   for(const id of child.legalParentIds){const parent=s.people.find(n=>n.id===id);if(parent&&!parent.children.includes(child.id))parent.children.push(child.id);}
   s.people.push(child);
   if(!child.legalParentIds.includes(p.id)){
    child.name=child.name[0]+nameSuggestions(s,child.id)[0];post(s,partner,e.id+':care',-12000,'activity',t(adopted?'領養孩子初期照顧費':'新生兒初期照顧費估值',adopted?'Initial care for an adopted child':'Estimated newborn care cost'));
    s.current=e;s.phase='story';log(s,e,t(`家中迎來新生兒${child.name}，由照顧者安排取名與生活。`,`Your family welcomes ${child.name}; their caregivers choose a name and arrange care.`));return s;
   }
   p.fatigue=clamp(p.fatigue+12);post(s,p,e.id+':care',-12000,'activity',t(adopted?'領養孩子初期照顧費':'新生兒初期照顧費估值',adopted?'Initial care for an adopted child':'Estimated newborn care cost'));
   s.current=e;s.phase='naming';s.pendingChildId=child.id;log(s,e,t(adopted?'孩子來到你們的家，你們準備一起確認孩子的名字。':'孩子平安出生，你們準備替孩子取個名字。',adopted?'You welcome your adopted child and prepare to confirm a name.':'Your child is born, and you prepare to choose a name.'));return s;
  }
  s.current=e;if(e.kind==='friend'&&e.data?.startsWith('social:')){const scene=friendScene(s,player(s),e.id);e.title=scene.title;e.text=scene.story;}if(e.kind==='illness'&&e.data){const p=player(s);p.health=clamp(p.health-(e.data==='enterovirus'?8:e.data==='gastroenteritis'?7:e.data==='cold'?4:0));p.stress=clamp(p.stress+4);if(e.data==='stress-overload')p.sanity=clamp(sanity(p)-6);}
  if(e.kind==='story'){if(e.data==='partner-message'){const id='partner-card:'+e.date+':'+(life(player(s)).relationship?.personId??'unknown');if(!player(s).inventory.includes(id)){player(s).inventory.push(id);ensureLife(player(s)).itemNotes={...life(player(s)).itemNotes,[id]:e.text};}}if(e.data==='kindergarten-admitted')admissionNotice(s,e.id,t(educationView(s,player(s)).label.zh.split('就讀')[0].replace(/^在/,''),'Kindergarten'));
   if(e.data==='travel'){
    const payer=s.people.find(n=>player(s).guardianIds.includes(n.id)&&n.alive&&n.cash>=100000);
    if(!payer){s.current=null;continue;}supportedExpense(s,player(s),e.id+':travel',100000,'activity',t('全家出國旅費','Family overseas travel'),lifeContext);
   }
   log(s,e);s.phase='story';return s;
  }
  if(age(s)<player(s).agencyAge){if(e.kind==='illness'){const quote=medicalQuote(s,'care');post(s,quote.payer,e.id+':cost',-quote.amount,'medical',t('照顧者安排普通門診（遊戲估值）','Caregiver-arranged routine visit (game estimate)'));player(s).health=clamp(player(s).health+4);log(s,e,t('家人替你安排就醫與休息。'+quote.detail.zh,'Your caregivers arrange care and rest. '+quote.detail.en));s.phase='story';return s;}log(s,e);continue;}
  s.phase='event';return s;
 }
 closeYear(s);return s;
}
export function options(s:World):Option[]{
 if(s.phase!=='event'||!s.current||age(s)<player(s).agencyAge)return [];
 const p=player(s),e=s.current;
 const richOptions=lifeOptions(s);if(richOptions)return richOptions;
 const o=(id:string,title:Text,detail:Text,disabled=false):Option=>({id,title,detail,disabled});
 switch(e.kind){
  case 'personality':return personalityOptions(p);
  case 'wellbeing':{const payer=medicalQuote(s,'care').payer;return [o('family-talk',t('免費：和家人聊聊','Free: talk with family'),t('70% 理智 +8／壓力 −8；30% 聊完更難受：理智 −5／壓力 +5（虛構機率）','70%: sanity +8/stress −8; 30%: sanity −5/stress +5 (fictional probabilities)'),!familySupport(s).length),o('counsel',t('安排付費心理諮商','Arrange paid counseling'),t(`理智 +10 · 壓力 −8 · 估值 NT$1,500，由 ${payer.name} 支付（遊戲效果，非療效保證）`,`Sanity +10 · Stress −8 · estimated NT$1,500 paid by ${payer.name} (game effect, not a clinical guarantee)`),payer.cash<1500||age(s)<12),o('quiet',t('免費：留些安靜休息時間','Free: take quiet time'),t('理智 +3 · 壓力 −3','Sanity +3 · Stress −3'))];}
  case 'club':return [...(['music','sports','film','volunteer'] as const).map((id,i)=>o(id,[t('音樂社','Music club'),t('運動社','Sports club'),t('電影社','Film club'),t('志工社','Volunteer club')][i],t('免費體驗 · 社交 +3 · 理智 +3（遊戲值）','Free introduction · Social +3 · Sanity +3 (game values)'),(p.clubs??[]).includes(id)||(p.clubs??[]).length>=2)),o('skip',t('這次先逛逛','Look around this time'),t('不加入社團','Do not join a club'))];
  case 'illness':return [o('rest',t('調整行程，好好休息','Adjust plans and rest'),t('健康 +4 · 疲勞 −8 · '+medicalQuote(s,'rest').detail.zh,'Health +4 · Fatigue −8 · '+medicalQuote(s,'rest').detail.en)),o('care',t('就醫並減少活動','Seek care and reduce activities'),t('健康 +6 · '+medicalQuote(s,'care').detail.zh,'Health +6 · '+medicalQuote(s,'care').detail.en))];
  case 'family':if(age(s)<18||!life(player(s)).room)return [o('visit',t('陪伴生病的家人','Stay with your unwell family'),t('家人此時需要你的陪伴','Your family needs your support'))];return [o('visit',t('去陪伴家人','Visit your family'),t('社交 +2 · 疲勞 +4','Social +2 · Fatigue +4')),o('call',t('先聯絡，再協調陪伴時間','Call and coordinate another time'),t('疲勞 +1 · 持續保持聯繫','Fatigue +1 · Stay in touch'))];
  case 'friend':if(e.data?.startsWith('social:'))return [o('join',t('和朋友一起參加','Spend time with friends'),t('免費 · 社交 +3 · 理智 +3 · 依階段累積學科／專長（遊戲值）','Free · Social +3 · Sanity +3 · stage-specific learning (game values)')),o('chat',t('只聊聊天、互相聽聽','Just talk and listen'),t('免費 · 理智 +4 · 壓力 −3','Free · Sanity +4 · Stress −3')),...(personality(p).energy>=65?[o('organize',t('主動邀大家一起來','Organize a gathering'),t('社交 +4 · 理智 +2 · 疲勞 +5','Social +4 · Sanity +2 · Fatigue +5'))]:[]),...(personality(p).openness>=65?[o('explore',t('和朋友試試新興趣','Explore a new hobby together'),t('相關專長 +3 · 理智 +2 · 疲勞 +3','Related skill +3 · Sanity +2 · Fatigue +3'))]:[]),...(personality(p).planning>=65?[o('plan',t('先協調時間與分工','Plan the time and tasks together'),t('學科 +3 · 壓力 −1','Academics +3 · Stress −1'))]:[]),o('decline',t('這次先休息','Rest this time'),t('疲勞 −3','Fatigue −3'))];return [o('join',t(age(s)<18?'一起練習音樂':'參加咖啡練習',age(s)<18?'Practice music together':'Join coffee practice'),t('相關專長 +5 · 費用估值 NT$500','Relevant skill +5 · Estimated cost NT$500')),o('decline',t('這次先休息','Rest this time'),t('疲勞 −3','Fatigue −3'))];
  case 'specialized':case 'academic':{
   const skill:Skill=e.kind==='specialized'?p.specialty:'academic';
   return [o('attempt',t('參加檢定 · 擲 D20','Take the check · Roll D20'),e.kind==='specialized'&&p.skills[skill]<25?t('準備不足：需要熟練度 25（遊戲門檻）','Not ready: proficiency 25 required (game threshold)'):t('能力修正＋熟練度修正 · 難度 15（遊戲值）','Attribute + proficiency modifiers · DC 15 (game value)'),e.kind==='specialized'&&p.skills[skill]<25),o('skip',t('不參加這個途徑','Skip this pathway'),t('保留其他符合資格的路線','Other eligible pathways remain available'))];}
  case 'career':if(e.data==='layoff')return [o('accept',t('整理履歷，開始找工作','Update your résumé and seek work'),t('本職後續薪資停止 · 下年度可再次應徵','This job’s subsequent salary stops · Apply again next year'))];
   if(e.data==='retire')return [o('continue',t('繼續目前安排','Keep current arrangements'),t('保留工作與求職機會','Keep work and job-search opportunities')),o('retire',t('退休，以現有資源生活','Retire using existing resources'),t('工作收入停止 · 不自動獲得退休給付','Work income stops · No automatic pension benefit'))];
   return [o('apply',t('準備面試 · 擲 D20','Prepare for an interview · Roll D20'),t('社交與學科準備影響表現 · 難度 12','Social and academic preparation affect results · DC 12')),o('skip',t('暫緩申請','Defer the application'),t('今年可能仍無工作收入','You may remain without wage income this year'))];
  case 'schoolstory':if(e.data==='route')return [o('senior',t('高中','General senior high'),t('以保留的五科總分分發高中','Use the saved five-subject total')),o('vocational',t('高職','Vocational high school'),t('先選科別，再以同一總分分發','Choose a vocational department before placement')),o('juniorCollege',t('五專','Five-year junior college'),t('先選科別，包含護理科，再分發','Choose a department, including nursing, before placement'))];
   if(e.data==='vocational-department'||e.data==='college-department')return ['商管科','美顏科','資訊科',...(e.data==='college-department'?['護理科']:[])].map((name,i)=>o('specialty-department:'+i,t(name,['Business management','Beauty care','Information technology','Nursing'][i]),t('模擬科別／學校，以保留會考總分分發，不重擲','Simulated department/school; use the saved total without rerolling')));
   if(e.data==='group')return [o('humanities',t('一類','Group I'),t('人文、社會、商管方向','Humanities, social sciences and business')),o('science',t('二類','Group II'),t('數學、物理、工程與資訊方向','Mathematics, physics, engineering and computing')),o('health-science',t('三類','Group III'),t('生物、生命科學與健康方向','Biology, life and health sciences'))];
   if(e.data==='department')return (p.enrollments.at(-1)?.track==='music'?['音樂']:['資訊工程','企業管理','音樂','體育']).map((name,i)=>o('department:'+i,t(name+'學系（模擬）',['Computer Science','Business Administration','Music','Physical Education'][i]+' (simulated department)'),t('科系選項為遊戲情境；實際校系開設待查','Simulated department; actual school offerings unverified')));
   if(e.data==='graduate')return [o('defend',t('提交論文，接受教授審查（D20）','Submit thesis for review (D20)'),t('智力＋學科 · DC15（遊戲值）','INT + academics · DC15 (game value)')),o('defer-graduation',t('暫不申請畢業','Defer graduation'),t('碩四後以未畢業離校結束此階段','After year four, leave this stage without a degree'))];return [];
  case 'musicpractice':return musicOptions(s);
  case 'enrollment':if(e.id.endsWith(':fallback'))return admissionOptions(s,'senior').filter(o=>o.id.endsWith(':general'));return [...admissionOptions(s,e.data as import('../../shared/src/types').EducationLevel),...(e.data==='master'?[o('skip',t('先不讀碩班','Do not enter a master’s program'),t('保留工作安排','Keep work arrangements'))]:[])];
  case 'partnership':return [o('form',t('與伴侶共同成家','Form a household together'),t('建立伴侶 NPC 與家庭名稱 · 不強制生育','Create a partner and household name · Children are optional')),o('skip',t('暫時維持目前生活','Keep your current living arrangements'),t('未來仍可再次討論','You can discuss this again later'))];
  case 'child':{
   const partner=s.people.find(n=>n.id===p.partnerId);
   if(!partner?.alive)return [o('skip',t('先維持目前生活','Keep current arrangements'),t('生育規劃需要在世伴侶；舊存檔可在後續成家事件繼續','A living partner is needed; migrated saves can use a later household event'))];
   if(partner.gender===p.gender)return [o('adopt',t('開始領養與照顧準備','Begin adoption and care preparation'),t('準備照顧計畫，下一年安排孩子來到家中','Plan care and welcome a child next year'),!!s.adoption||!!s.pregnancy||p.children.length>=3),o('skip',t('暫不規劃孩子','Not now'),t('繼續目前生活','Keep current arrangements'))];
   return [o('family',t('一起嘗試生育','Try for a child together'),t('未校準遊戲機率 · 預產期在下一年 · 不使用 D20','Uncalibrated game probability · Due next year · No D20'),!!s.pregnancy||!!s.adoption||p.fertility.lastAttemptYear===s.year),o('consult',t('共同接受生育評估','Seek an assessment together'),t('記錄雙方生育狀態 · 費用估值 NT$1,500 · 不保證懷孕','Record both partners’ game fertility status · Estimated cost NT$1,500 · No guarantee')),o('skip',t('暫不規劃孩子','Do not plan for a child now'),t('繼續目前生活','Continue your current life'))];}
  default:return [];
 }
}
function check(s:World,attribute:Attribute,skill:Skill,dc:number):Check{
 const p=player(s),die=1+Math.floor(random(s)*20),modifier=Math.floor((p.attributes[attribute]-10)/2)+Math.floor(p.skills[skill]/15);
 return {die,modifier,dc,total:die+modifier,success:die+modifier>=dc,text:t('遊戲技能檢定，非真實考試評分','Gameplay skill check, not actual exam scoring')};
}
export function decide(input:World,id:string):World{
 if(!options(input).some(o=>o.id===id&&!o.disabled))throw Error('Choice unavailable');
 const s=clone(input),p=player(s),e=s.current!;let result:Text=t('你調整了接下來的安排。','You adjusted your plans.');let roll:Check|undefined;let subjectChecks:Check[]|undefined;let admissionTotal:number|undefined;
 const richResult=resolveLife(s,id,lifeContext);if(richResult){scheduleChapter(s);memories(s);log(s,e,richResult.text);s.resolution=richResult;s.phase='resolved';return s;}
 const charge=(n:number)=>{const payer=age(s)<18?s.people.find(v=>p.guardianIds.includes(v.id)&&v.alive)??p:p;post(s,payer,e.id+':cost',-n,(e.kind==='illness'||e.kind==='child'&&id==='consult')?'medical':'activity',e.title);};
 if(e.kind==='illness'){p.health=clamp(p.health+(id==='rest'?4:6));p.fatigue=clamp(p.fatigue-8);const quote=medicalQuote(s,id as 'rest'|'care');if(quote.amount)post(s,quote.payer,e.id+':cost',-quote.amount,'medical',t('普通門診自付（遊戲估值）','Routine outpatient cost (game estimate)'));result=t('你留了時間恢復，也重新安排接下來的活動。'+quote.detail.zh,'You made room for recovery and adjusted your activities. '+quote.detail.en);}
 if(e.kind==='family'){p.fatigue=clamp(p.fatigue+(id==='visit'?4:1));if(id==='visit')p.skills.social=clamp(p.skills.social+2);result=id==='visit'?t('你陪家人度過等候的時間，原本的練習延到明天。','You kept your family company and moved practice to tomorrow.'):t('你確認照顧人手，約好之後能陪伴的時間。','You checked care arrangements and agreed on another time to visit.');}
 if(e.kind==='personality'){p.personality={...personality(p),answers:[...personality(p).answers,id]};const axes=['energy','openness','reasoning','planning'] as const;const index=p.personality.answers.length-1;p.personality[axes[index]]=id==='a'?70:30;result=t('你更認識自己的偏好。性格沒有優劣，也不會封鎖人生路線。','You learn about your preferences. No trait is better, and none locks a life path.');if(index<3){const e2={...e,id:e.id+':'+(index+1),title:personalityQuestions[index+1]};s.queue.splice(s.cursor,0,e2);}}
 if(e.kind==='wellbeing'){if(id==='family-talk'){const worse=random(s)<.3;e.tone=worse?-1:1;p.sanity=clamp(sanity(p)+(worse?-5:8));p.stress=clamp(p.stress+(worse?5:-8));result=worse?t('對話沒有得到期待的理解，你暫時更難受，決定先留些空間。','The conversation did not bring the understanding you hoped for; you feel worse and take some space.'):t('家人願意聽你說，你感到被陪伴，壓力稍微鬆開。','Your family listens, and you feel supported and less tense.');if(personality(p).reasoning>=65)result=t(result.zh+' 你試著把問題與下一步一項項寫下來。',result.en+' You write down the problem and possible next steps.');else result=t(result.zh+' 你先說出自己此刻的感受。',result.en+' You begin by naming how you feel.');}else if(id==='counsel'){post(s,medicalQuote(s,'care').payer,e.id+':counsel',-1500,'medical',t('心理諮商費（遊戲估值）','Counseling fee (game estimate)'));p.sanity=clamp(sanity(p)+10);p.stress=clamp(p.stress-8);result=t('你在諮商中整理了近況，留意後續感受；遊戲數值不代表真實療效。','You reflect on your situation in counseling; game values do not represent clinical effectiveness.');}else {p.sanity=clamp(sanity(p)+3);p.stress=clamp(p.stress-3);result=t('你替自己留了一段安靜時間。','You take some quiet time for yourself.');}}
 if(e.kind==='club'&&id!=='skip'){p.clubs=[...(p.clubs??[]),id as 'music'|'sports'|'film'|'volunteer'];p.skills.social=clamp(p.skills.social+3);p.sanity=clamp(sanity(p)+3);if(id==='music')p.skills.music=clamp(p.skills.music+3);if(id==='sports')p.skills.sports=clamp(p.skills.sports+3);result=t('你加入社團，認識了願意一起活動的新朋友。','You join a club and meet people to share activities with.');}
 if(e.kind==='friend'&&e.data?.startsWith('social:')){if(id==='decline')p.fatigue=clamp(p.fatigue-3);else if(id==='explore'){p.skills[p.specialty]=clamp(p.skills[p.specialty]+3);p.sanity=clamp(sanity(p)+2);p.fatigue=clamp(p.fatigue+3);}else if(id==='plan'){p.skills.academic=clamp(p.skills.academic+3);p.stress=clamp(p.stress-1);}else if(id==='organize'){p.skills.social=clamp(p.skills.social+4);p.sanity=clamp(sanity(p)+2);p.fatigue=clamp(p.fatigue+5);}else{p.sanity=clamp(sanity(p)+(id==='chat'?4:3));p.stress=clamp(p.stress-3);if(id==='join'){p.skills.social=clamp(p.skills.social+3);const skill:Skill=age(s)<15?'academic':age(s)<18?p.specialty:age(s)<22?'social':'coffee';p.skills[skill]=clamp(p.skills[skill]+3);}}result=t('你和朋友交換近況，這段相處成為本年的一則生活記事。','You catch up with friends, adding another shared moment to the year.');}
 if(e.kind==='friend'&&!e.data?.startsWith('social:')){if(id==='join'){const skill=age(s)<18?'music':'coffee';p.skills[skill]=clamp(p.skills[skill]+5);charge(500);p.fatigue=clamp(p.fatigue+2);result=t('你和朋友一起練習，累積了新的經驗。','Practice with your friend gave you new experience.');}else p.fatigue=clamp(p.fatigue-3);}
 if((e.kind==='academic'||e.kind==='specialized')&&id==='attempt'){
  roll=check(s,e.kind==='specialized'?(p.specialty==='music'?'dex':'con'):'int',e.kind==='specialized'?p.specialty:'academic',15);
  if(roll.success){const credential=e.kind==='specialized'?(p.specialty==='music'?'music-admission':'sports-admission'):e.data==='secondary'?'secondary-admission':'academic-admission';if(!p.credentials.includes(credential))p.credentials.push(credential);}
  result=roll.success?t('這次評量通過，你保留了新的升學機會。其他途徑仍依各自條件處理。','You passed this assessment and gained an admission opportunity. Other pathways remain independent.'):t('這次未通過。其他升學途徑仍然開放，你也可以繼續累積能力。','You did not pass this time. Other pathways remain open, and you can keep learning.');
 }
 if(e.kind==='career'){
  if(e.data==='layoff'){p.job='none';result=t('這份工作告一段落。帳目將從今天起反映收入的變化。','This job has ended. Your ledger will reflect the change from today.');}
  else if(id==='retire'){p.job='retired';result=t('你暫別職場，接下來需要持續留意財務能否負擔生活。','You leave work and will need to watch whether your resources cover daily life.');}
  else if(id==='apply'){roll=check(s,'cha','social',12);if(roll.success)p.job=p.credentials.includes('music-admission')&&p.skills.music>60?'creative':p.skills.academic>=60?'technology':'service';if(roll.success)p.employment={company:t(p.job==='technology'?'新望科技（虛構公司）':p.job==='creative'?'新望音樂工作室（虛構）':'新望生活服務（虛構公司）',p.job==='technology'?'New Hope Technology (fictional)':p.job==='creative'?'New Hope Music Studio (fictional)':'New Hope Services (fictional)'),position:t(p.job==='technology'?'初級工程師':p.job==='creative'?'音樂工作者':'服務專員',p.job==='technology'?'Junior engineer':p.job==='creative'?'Musician':'Service associate'),startYear:s.year};result=roll.success?t('你獲得這個虛構職位，從本月開始計算薪資。','You received this fictional position. Salary begins this month.'):t('這次面試沒有錄取。你仍可在之後繼續求職。','This interview did not lead to an offer. You can seek work again.');}
 }
 if(e.kind==='schoolstory'){if(['route','vocational-department','college-department'].includes(e.data??'')&&s.pendingAdmission){subjectChecks=s.pendingAdmission.checks;admissionTotal=s.pendingAdmission.total;}
  if(e.data==='route'){
   if(!s.pendingAdmission)throw Error('Missing exam results');s.pendingAdmission.route=id as 'senior'|'vocational'|'juniorCollege';
   if(id==='senior')result=placeAdmission(s,e.id);else {admissionStep(s,id==='vocational'?'vocational-department':'college-department');result=t('已選升學路線，接著選擇科別再分發。','Route selected. Choose a department before placement.');}
  }
  if(e.data==='vocational-department'||e.data==='college-department'){const department=options(input).find(o=>o.id===id)!.title;result=placeAdmission(s,e.id,department);}
  if(e.data==='group'){const entry=p.enrollments.find(e=>e.level==='senior')!;entry.group=options(input).find(o=>o.id===id)!.title;result=t('你選擇了'+entry.group.zh+'，接下來的角色狀態會保留這個方向。','Your chosen study group is recorded: '+entry.group.en);}
  if(e.data==='department'){const entry=p.enrollments.at(-1)!;entry.department=options(input).find(o=>o.id===id)!.title;result=t('已記錄就讀科系：'+entry.department.zh,'Department recorded: '+entry.department.en);}
  if(e.data==='graduate'){const entry=p.enrollments.find(e=>e.level==='master'&&!e.outcome)!;if(id==='defend')roll=check(s,'int','academic',15);if(roll?.success){entry.outcome='graduated';entry.endYear=s.year;p.credentials.push('master-degree');enqueue(s,lifeEvent(s,9,10,'career',t('畢業後的職涯選擇','Career choices after graduation'),t('看看適合目前學習與經驗的職位。','Explore roles that fit your education and experience.')));result=t('論文審查通過，你取得碩士學位（模擬）。','Thesis review passed; you earn a simulated master’s degree.');}else if(s.year-entry.startYear>=4){entry.outcome='withdrawn';entry.endYear=s.year;result=t('本次未取得畢業資格，碩四後以未畢業離校結束。','No degree was awarded; you leave after year four.');}else result=t('本年尚未畢業，明年繼續研究並可再次接受審查。','You continue research and may seek review again next year.');}
 }
 if(e.kind==='musicpractice'){if(id==='renew'){const m=p.musicTraining!,price=instruments.find(i=>i[0]===m.major)![4];post(s,musicPayer(s),e.id+':renew',-price,'education',t('更新主修樂器','Instrument replacement'));m.purchaseYear=s.year;result=t('更新樂器，原有練習與教學安排保留。','Instrument replaced; current lesson arrangement retained.');}else if(id!=='defer'){const mode=id as import('../../shared/src/types').MusicMode,m=p.musicTraining!;post(s,musicPayer(s),e.id+':music',-musicCost(s,mode),'education',t('樂器與本年練習資源（遊戲估值）','Instrument and annual practice resources (game estimate)'));if(mode!=='school-loan'){if(!m.owned)m.purchaseYear=s.year;m.owned=true;}m.mode=mode;m.lastPaidYear=s.year;p.skills.music=clamp(p.skills.music+(mode==='private-teacher'?5:3));result=t('已安排本年練習資源。自購打擊樂器以馬林巴木琴為主；資源不保證術科錄取。','Annual practice resources arranged. Purchased percussion centers on a marimba; resources do not guarantee admission.');}else result=t('本年暫緩付費安排，保留基礎練習與升學選擇。','Paid arrangements deferred; basic practice and admission options remain.');}
 if(e.kind==='enrollment'&&id.startsWith('enroll:')){
  const [,level,school,track]=id.split(':') as [string,import('../../shared/src/types').EducationLevel,string,'general'|'music'|'sports'];
  if(track==='general'&&level==='senior'&&p.juniorSubjects)p.skills.academic=subjectAverage(p);
  if(track==='general'&&level==='senior'){
   const scores=subjectScores(p);subjectChecks=(Object.keys(juniorSubjects) as import('../../shared/src/types').JuniorSubject[]).map(subject=>{const die=1+Math.floor(random(s)*20),modifier=Math.floor((p.attributes.int-10)/2)+(p.life?.subjectPoints?.[subject]??Math.floor(scores[subject]/15)),dc=12;return {die,modifier,dc,total:die+modifier,success:die+modifier>=dc,text:juniorSubjects[subject]};});admissionTotal=subjectChecks.reduce((sum,c)=>sum+c.total,0);
  }
  if(track!=='general')roll=check(s,track==='music'?'dex':'con',track,15);
  let chosenSchool=school;let accepted=!roll||roll.success;if(subjectChecks){const keys=Object.keys(juniorSubjects) as JuniorSubject[];ensureLife(p).cap={year:s.year,subjects:Object.fromEntries(subjectChecks.map((c,i)=>[keys[i],{score:Math.min(100,c.total*5),band:capBand(c.total)}])) as NonNullable<import('../../shared/src/life').LifeState['cap']>['subjects'],summary:capResult(subjectChecks)};result=t('會考結果：'+capResult(subjectChecks)+'，接著選擇升學路線。','CAP bands: '+capResult(subjectChecks)+'. Choose your route.');accepted=false;s.pendingAdmission={year:s.year,total:admissionTotal!,checks:subjectChecks};p.schoolExams=[...(p.schoolExams??[]),{year:s.year,total:admissionTotal!,checks:subjectChecks}];admissionStep(s,'route');}
  if(accepted){recordEnrollment(p,{level,schoolId:chosenSchool==='local'?null:chosenSchool,track,startYear:s.year});if(track!=='general')p.specialty=track;if(track==='music')scheduleMusic(s,6,21);if(level==='university'){s.queue.push(event(s,9,20,'club',t('大學社團招募','University club recruitment'),t('新生社團體驗開始了，你可以選擇參加。','New-student club introductions are beginning.'),1));s.queue.sort((a,b)=>a.date.localeCompare(b.date));}if(level==='university'||level==='master'){s.queue.push(event(s,6,21,'schoolstory',t('選擇就讀科系','Choose your department'),t('請選擇這段學習旅程的科系；各校實際科系及招生仍待核實。','Select a simulated department; actual school offerings/admissions remain unverified.'),0,'department'));s.queue.sort((a,b)=>a.date.localeCompare(b.date));}if(level==='university'&&!p.credentials.includes('academic-admission'))p.credentials.push('academic-admission');result=t('已記錄九月開始的學籍與入學途徑，角色欄將依月份顯示年級。此為遊戲錄取，非真實校方錄取標準。','Enrollment is recorded for September; the character sheet follows the school year. This is simulated admission, not the school’s actual standards.');}
  else {if(level==='senior'&&!subjectChecks){const fallback=event(s,6,21,'enrollment',t('術科後的一般升學準備','General admission after the audition'),t('術科未通過，仍可以在今年參加會考與普通升學。','You can still take the general entrance examination this year.'),0,'senior');fallback.id+=':fallback';s.queue.push(fallback);s.queue.sort((a,b)=>a.date.localeCompare(b.date));}if(level==='primary'||level==='junior')recordEnrollment(p,{level,schoolId:localAssignment(s,level),track:'general',startYear:s.year});result=t('這次術科未通過；國小、國中仍保留一般就學安排，其他升學機會不因專長身分被封鎖。','The specialty check did not pass. Primary/junior pupils retain general schooling; specialty status does not lock other routes.');}
  if(subjectChecks)result=t(`會考五科總分 ${admissionTotal} 分（遊戲值）。接下來選高中、高職或五專，再進行分發；總分已保留。`,`Five-subject total: ${admissionTotal} (game points). Next choose senior high, vocational high or five-year college, then receive placement. Your total is saved.`);
 }
 if(e.kind==='partnership'&&id==='form'){
  const existingDate=life(p).relationship?.active?s.people.find(n=>n.id===life(p).relationship?.personId):undefined;const partner=existingDate??person(s,`partner-${s.people.length}`,p.birthYear+1);if(!existingDate)partner.name=partner.name[0]+pick(s,givenNames);partner.job='service';partner.cash=60000;
  partner.gender=p.attractedTo;partner.attractedTo=p.gender;partner.partnerId=p.id;p.partnerId=partner.id;p.familyName=`${p.name}與${partner.name}的家`;partner.familyName=p.familyName;
  p.householdId=`family-${p.id}-${partner.id}`;partner.householdId=p.householdId;if(!existingDate)s.people.push(partner);s.housing.push({householdId:p.householdId,tenure:'rent',value:0,mortgage:0,monthlyRent:12000});
  enqueue(s,lifeEvent(s,8,13,'family-assets',t('成家後的住處計畫','A home for your new family'),t('討論租屋、購屋及自備款。','Discuss renting, purchasing and savings.')));result=t(`你與${partner.name}建立共同家庭。原生家庭的紀錄依然保留。`,`You and ${partner.name} form a shared household. Your family-of-origin records remain.`);
 }
 if(e.kind==='child'&&id==='adopt'){const partner=s.people.find(n=>n.id===p.partnerId)!;s.adoption={partnerId:partner.id,parentIds:[p.id,partner.id],householdId:p.householdId,dueDate:`${s.year+1}-06-06`};result=t('你們開始準備照顧與領養安排，孩子尚未來到家中。','You begin adoption and care preparations; the child has not arrived yet.');}
 if(e.kind==='child'&&(id==='family'||id==='consult')){
  const partner=s.people.find(n=>n.id===p.partnerId)!;
  if(id==='consult'){
   p.fertility.assessed=true;partner.fertility.assessed=true;charge(1500);
   result=p.fertility.profile==='reduced'||partner.fertility.profile==='reduced'?t('評估記錄了生育困難的遊戲設定。這不是永久無法生育的判定；醫療處置與收養路線仍待擴充。','The assessment records a game fertility difficulty. This does not mean permanent sterility; treatment and adoption routes remain planned.'):t('本次評估未發現預設的生育困難；仍不保證每次嘗試都會懷孕。','No preset fertility difficulty was recorded; pregnancy is still not guaranteed.');
  }else{
   p.fertility.attempts++;partner.fertility.attempts++;p.fertility.lastAttemptYear=s.year;partner.fertility.lastAttemptYear=s.year;
   const probability=p.fertility.profile==='reduced'||partner.fertility.profile==='reduced'?.15:.65;
   if(random(s)<probability){s.pregnancy={partnerId:partner.id,parentIds:[p.id,partner.id],householdId:p.householdId,dueDate:`${s.year+1}-06-06`};result=t('你們迎來懷孕的消息，開始安排下一年的照顧。預產期為試玩估計，孩子尚未出生。','You receive news of pregnancy and plan care for next year. The due date is a pilot estimate; the child is not yet born.');}
   else result=t('這次嘗試未能懷孕。你們可以之後再討論，或共同接受生育評估；不會直接歸咎任何一方。','This attempt did not lead to pregnancy. You may discuss trying again or seek an assessment together; neither partner is automatically blamed.');
  }
 }
 if(e.kind==='enrollment'&&player(s).enrollments.some(n=>n.startYear===s.year&&n.level===e.data)){const n=player(s).enrollments.find(n=>n.startYear===s.year&&n.level===e.data)!;admissionNotice(s,e.id,t(schools.find(school=>school.id===n.schoolId)?.name??'所在地模擬學校（校名待查）',schools.find(school=>school.id===n.schoolId)?.name??'Simulated local school'));}
 if(e.kind==='career'&&id==='apply'&&roll?.success)admissionNotice(s,e.id,p.employment!.company);
 if(e.kind==='enrollment'&&subjectChecks)result=t('會考結果：'+capResult(subjectChecks)+'。接下來選高中、高職或五專。','CAP result: '+capResult(subjectChecks)+'. Choose your route next.');
 log(s,e,result);scheduleChapter(s);memories(s);s.resolution={text:result,...(roll?{check:roll}:{}),...(subjectChecks?{checks:subjectChecks,admissionTotal}:{})};s.phase='resolved';return s;
}
export function nameChild(input:World,givenName:string,surnameParentId?:string):World{
 if(input.phase!=='naming'||!input.pendingChildId||!input.current||!player(input).alive)throw Error('No child awaiting a name');
 const name=validateGivenName(givenName),s=clone(input),child=s.people.find(n=>n.id===s.pendingChildId);
 if(!child||!child.legalParentIds.includes(s.playerId))throw Error('Invalid child');
 const surnameParent=surnameParentId?s.people.find(n=>n.id===surnameParentId&&child.legalParentIds.includes(n.id)):undefined;if(surnameParentId&&!surnameParent)throw Error('Invalid surname parent');
 child.name=(surnameParent?.name[0]??child.name[0])+name;s.pendingChildId=null;
 const result=t(`你們替孩子取名為${child.name}，將這個名字寫進家庭記事。`,`You name your child ${child.name} and record it in your family journal.`);
 log(s,{...s.current!,id:s.current!.id+':name',tone:0,title:t('孩子的名字','Your child’s name')},result);
 s.phase='resolved';scheduleChapter(s);memories(s);s.resolution={text:result};return s;
}
export function nextYear(input:World):World{
 if(input.phase!=='review')throw Error('Year is not complete');
 const s=clone(input);delete s.pendingAdmission;s.year++;s.date=date(s,1,1);const p=player(s);s.focus=null;s.current=null;s.resolution=null;s.cursor=0;s.openingCash=p.cash;s.openingDebt=p.debt;
 for(const n of s.people.filter(v=>v.alive)){
  if(n.life)delete n.life.tutoring;
  const a=age(s,n);if(a===3&&!n.enrollments.some(e=>e.level==='kindergarten'))recordEnrollment(n,{level:'kindergarten',schoolId:localAssignment({...s,playerId:n.id},'kindergarten'),track:'general',startYear:s.year});n.health=clamp(n.health-(a>60?1:0));n.fatigue=clamp(n.fatigue-5);
  if(n.id!==p.id){if(a>=6&&a<=22){n.skills.academic=clamp(n.skills.academic+3);n.skills.music=clamp(n.skills.music+2);}const level=entryLevel(a);if(level&&level!=='master'&&!n.enrollments.some(e=>e.level===level))recordEnrollment(n,{level,schoolId:localAssignment({...s,playerId:n.id},level),track:'general',startYear:s.year});n.history.push({year:s.year,text:t('這一年，你也有自己的生活與選擇。','You lived another year with your own experiences.')});if(a>65&&random(s)<Math.min(.9,.02*Math.exp((a-65)/12))){recordNpcDeath(s,n,random(s)<.8?t('疾病','Illness'):t('意外','Accident'));if(life(p).relationship?.personId===n.id)ensureLife(p).relationship!.active=false;}}
 }
 s.queue=buildYear(s);scheduleChapter(s);memories(s);s.phase=age(s)>=p.agencyAge?'focus':'story';
 if(s.phase==='story'){s.current=event(s,1,1,'story',t('又長大了一點','Growing a little more'),t('家人繼續安排你的生活。自主決策尚未開始。','Your family continues arranging your care. Personal choices have not begun yet.'),0);log(s,s.current);}
 return s;
}
export function successors(s:World):Person[]{
 if(s.phase!=='dead')return [];
 const ids=new Set<string>(),walk=(id:string)=>{for(const c of s.people.find(p=>p.id===id)?.children??[])if(!ids.has(c)){ids.add(c);walk(c);}};walk(s.playerId);
 return s.people.filter(p=>ids.has(p.id)&&p.alive);
}
export function continueAs(input:World,id:string):World{
 if(!successors(input).some(p=>p.id===id))throw Error('Ineligible successor');
 const s=clone(input);delete s.pendingAdmission;delete s.admissionNotice;s.playerId=id;s.generation++;const p=player(s);s.current=null;s.resolution=null;s.focus=null;s.openingCash=p.cash;s.openingDebt=p.debt;
 // Continue at the actual world date. Never replay months before transfer of control.
 s.queue=buildYear(s).filter(e=>e.date>s.date);s.cursor=0;s.phase='story';
 s.current={id:`${p.id}:${s.date}:legacy`,date:s.date,kind:'story',title:t('接續一段已經開始的人生','Continue a life already in progress'),text:t('你接手了當下的生活、關係與財務。這一年剩下的日子，現在由你繼續。','You take over existing relationships and finances. The rest of this year is now yours to live.'),tone:0,grade:'D'};
 log(s,s.current);
 return s;
}
export function visibleJournal(s:World):JournalEntry[]{return s.journal.filter(j=>j.date<=s.date);}

export function setSpecialty(input:World,value:'music'|'sports'):World{if(input.phase!=='focus'||!['music','sports'].includes(value))throw Error('Specialty unavailable');const s=clone(input);player(s).specialty=value;for(const e of s.queue)if(e.kind==='specialized'){e.title=value==='sports'?t('體育術科甄試（試玩模擬）','Sports assessment (pilot)'):t('音樂術科甄試（試玩模擬）','Music audition (pilot)');e.text=t('你可以參加對應術科；是否參加不會取消一般學科路線。','You may take the specialty assessment without removing academic routes.');}return s;}

function admissionNotice(s:World,id:string,name:Text){s.admissionNotice={id,title:t('恭喜錄取 '+name.zh,'Congratulations! Accepted by '+name.en),detail:t('確認後繼續這段新生活。班別與職位會顯示在角色狀態。','Continue into this new stage. Your class or role appears in the character status.')};}
export function dismissAdmission(input:World):World{const s=clone(input);delete s.admissionNotice;return s;}

function placeAdmission(s:World,eventId:string,department?:Text):Text{
 const pending=s.pendingAdmission;if(!pending?.route)throw Error('Missing admission route');const p=player(s),route=pending.route,total=pending.total;delete s.pendingAdmission;
 if(route==='senior'){
  const eligible=schoolCandidates(s,'senior').filter(n=>(n.admissionDC??12)*5<=total).sort((a,b)=>(b.admissionDC??12)-(a.admissionDC??12)||a.id.localeCompare(b.id));
  const school=eligible[0]??schoolCandidates(s,'senior').sort((a,b)=>(a.admissionDC??12)-(b.admissionDC??12)||a.id.localeCompare(b.id))[0];if(!school){recordEnrollment(p,{level:'senior',track:'general',schoolId:null,startYear:s.year});admissionNotice(s,eventId,t('所在地普通高中','Local senior high school'));return t(`五科總分 ${total}，已安排今年九月的一般高中就學。`,`Total ${total}: general senior-high schooling is arranged for this September.`);}
  recordEnrollment(p,{level:'senior',track:'general',schoolId:school.id,startYear:s.year});admissionNotice(s,eventId,t(school.name,school.name));return t(`五科總分 ${total}，恭喜錄取${school.name}。`,`Total ${total}: congratulations on admission to ${school.name}.`);
 }
 // Official vocational/college catalogs are pending: clearly fictional local placement.
 const minimum=route==='vocational'?40:50;if(total<minimum)return t(`總分 ${total}，本輪未錄取（分發門檻為遊戲值）。`,`Total ${total}: no placement (fictional threshold).`);
 recordEnrollment(p,{level:route,track:'general',schoolId:null,startYear:s.year,department});const name=t(`${route==='vocational'?'所在地模擬高職':'所在地模擬五專'} ${department?.zh??''}`,`Simulated local ${route==='vocational'?'vocational high school':'five-year college'} ${department?.en??''}`);admissionNotice(s,eventId,name);return t(`五科總分 ${total}，恭喜錄取${name.zh}。`,`Total ${total}: congratulations on admission to ${name.en}.`);
}

/** Uncalibrated prototype all-cause hazard; never a minimum-lifespan rule. */
export function mortalityRisk(a:number){return a<1?.003:a<15?.0003:a<50?.001:a<70?.008:Math.min(.95,.025*Math.exp((a-70)/9));}

const lifeContext:LifeContext={post,random,check,notice:admissionNotice,newPerson:person};
export {subjectProficiency} from './life-finance';
export {careers} from '../../world-data/src/careers';

export function recordNpcDeath(s:World,n:Person,cause:Text){if(!n.alive)return;n.alive=false;n.job='none';n.deathDate=s.date;n.deathCause=cause;if(player(s).parentIds.includes(n.id)||player(s).legalParentIds.includes(n.id)){const e=event(s,1,1,'story',t(n.name+'過世了',n.name+' has died'),t(n.name+'於'+s.date+'因'+cause.zh+'過世，家人將這一天記在心裡。',n.name+' died on '+s.date+' from '+cause.en+'.'),-2);log(s,{...e,id:e.id+':npc-death:'+n.id});}}
