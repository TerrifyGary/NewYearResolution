import {t,type World,type Person} from '../../shared/src/types';
export const sanity=(p:Person)=>p.sanity??70;
export const limit=(v:number)=>Math.max(0,Math.min(100,v));
export function familySupport(s:World){const p=s.people.find(n=>n.id===s.playerId)!;return s.people.filter(n=>n.alive&&s.year-n.birthYear>=12&&n.id!==p.id&&(p.parentIds.includes(n.id)||p.guardianIds.includes(n.id)||p.children.includes(n.id)||p.partnerId===n.id));}
export function stageFriend(a:number,student=false){return a<6?{id:'play',title:t('和朋友一起玩','Play with friends'),text:t('朋友邀你一起搭積木、輪流玩玩具。','A friend invites you to build with blocks and take turns with toys.')}:
 a<12?{id:'school',title:t('放學後的同伴','After-school companions'),text:t('同學邀你一起完成小組作業，再到操場走走。','Classmates invite you to finish a group assignment and walk around the playground.')}:
 a<15?{id:'study',title:t('一起準備五科','Preparing together'),text:t('朋友約你交換會考筆記，也想聽聽你最近的煩惱。','Friends suggest exchanging entrance-exam notes and listening to what has been on your mind.')}:
 a<18?{id:'club',title:t('社團夥伴的邀約','A club invitation'),text:t('社團夥伴邀你一起準備表演或運動練習，聊聊未來想讀哪裡。','Club friends invite you to rehearse or train and talk about future study plans.')}:
 student?{id:'campus',title:t('大學朋友的小聚','A campus gathering'),text:t('同學約你分享社團近況與專題進度，也留一些時間放鬆。','Classmates invite you to share club news and project progress, with time to unwind.')}:
 a<22?{id:'youngadult',title:t('成年朋友的邀約','A young-adult gathering'),text:t('朋友邀你聊聊接下來的生活，或一起試試新的興趣。','Friends invite you to talk about life plans or try a new interest.')} :
 a<65?{id:'adult',title:t('朋友下班後的邀約','An after-work invitation'),text:t('朋友約你免費散步聊天，也可以選擇一起練習咖啡興趣。','A friend suggests a free walk and chat, or practicing your coffee hobby together.')}:
 {id:'retirement',title:t('老朋友的日常','Time with old friends'),text:t('老朋友約你在公園散步，分享家人和生活的小事。','An old friend suggests a park walk and sharing everyday family stories.')};}
export function illnessProfile(age:number,n:number,stress:number){const kinds=age<6?['enterovirus','cold','gastroenteritis']:age<12?['cold','gastroenteritis','enterovirus']:stress>=65?['stress-overload','gastroenteritis','cold']:['gastroenteritis','cold','stress-overload'];return kinds[n%kinds.length];}
export const illnessNames:Record<string,ReturnType<typeof t>>={enterovirus:t('腸病毒感染（模擬事件）','Enterovirus infection (simulated event)'),gastroenteritis:t('急性腸胃炎（模擬事件）','Acute gastroenteritis (simulated event)'),cold:t('感冒（模擬事件）','A cold (simulated event)'),'stress-overload':t('壓力過載，需要調整步調','Stress overload: time to adjust your pace')};
