import {t,type World,type Person,type Language} from '../../shared/src/types';
import {schools} from '../../world-data/src/schools';
import {itemName} from './chapters';
import {instruments} from './music';
import {sports} from './sports';
export function keepsakeView(s:World,p:Person,id:string,lang:Language='zh'){
 const match=id.match(/^(textbook|uniform|signed-uniform|album):([^:]+):(\d+)$/),record=match?p.enrollments.find(e=>e.level===match[2]&&e.startYear===Number(match[3])):undefined;
 const stage=record?.level??match?.[2],stageNames:Record<string,string>={primary:'國小',junior:'國中',senior:'高中',vocational:'高職',juniorCollege:'五專',university:'大學',master:'研究所',kindergarten:'幼兒園'};
 const school=record?.schoolName?.[lang]??schools.find(n=>n.id===record?.schoolId)?.name??(lang==='zh'?stageNames[stage??'']??'當時的學校':'Your former school');
 const kind=match?.[1],labels:Record<string,string>={textbook:'課本',uniform:'制服','signed-uniform':'畢業簽名制服',album:'畢業紀念冊'};
 const title=id.startsWith('love-card:')?(lang==='zh'?'告白情書':'Love letter'):id.startsWith('partner-card:')?(lang==='zh'?'另一半的卡片':'Partner’s card'):match?(lang==='zh'?school+'的'+labels[kind!]:school+' · '+({textbook:'textbook',uniform:'uniform','signed-uniform':'signed graduation uniform',album:'yearbook'})[kind! as 'textbook']):id.startsWith('instrument:')?(instruments.find(i=>i[0]===id.slice(11))?.[lang==='zh'?1:2]??itemName(id)):id.startsWith('sport:')?(sports.find(i=>i[0]===id.slice(6))?.[lang==='zh'?1:2]??itemName(id))+'裝備':itemName(id);
 const years=record?Math.max(0,s.year-(record.endYear??record.startYear+({primary:6,junior:3,senior:3,university:4,master:4,vocational:3,juniorCollege:5,kindergarten:3}[record.level]))):match?Math.max(0,s.year-Number(match[3])):0;
 const note=p.life?.itemNotes?.[id];const partner=s.people.find(n=>n.id===p.life?.relationship?.personId||n.id===p.partnerId);const friend=['以安','書妍','育誠','芷寧'][(record?.startYear??p.birthYear)%4];
 let description=note?.[lang]??(match?(lang==='zh'?(years?`上次翻看或使用它，已經是 ${years} 年前的事了。`:'這件物品還陪著你度過現在的日子。')+`好懷念當時和${friend}一起放學的日子，不知道對方現在過得好不好。`:`It brings back ${school} and a classmate you remember.`):lang==='zh'?'你把這件物品留在身邊，讓日常的小事有了可以觸摸的形狀。':'A small object holds a memory.');
 if(!note&&id==='love-card')description=lang==='zh'?'這是一張保留下來的告白卡片，寄信者與原文沒有記錄。紙張的摺痕，仍留下當時緊張又期待的心情。':'The old card survives, but its author and original text were not recorded.';
 if(!note&&id==='partner-card')description=lang==='zh'?`${partner?.name??'另一半'}留下的卡片，原文尚未記錄。`:'The card remains; its original text was not recorded.';
 return {title,description,school,years};
}
