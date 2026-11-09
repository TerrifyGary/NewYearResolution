import {t,type Person,type World,type Option} from '../../shared/src/types';
export const personalityAxes={energy:t('獨處 ↔ 互動','Solitude ↔ interaction'),openness:t('熟悉 ↔ 探索','Familiarity ↔ exploration'),reasoning:t('感受 ↔ 分析','Feeling ↔ analysis'),planning:t('隨性 ↔ 規劃','Spontaneity ↔ planning')};
export const personalityQuestions=[
 t('休息時，你比較想怎麼過？','How would you like to spend a break?'),
 t('朋友提議一個沒玩過的新遊戲，你會？','A friend suggests a new game. What do you prefer?'),
 t('朋友為了玩具吵架，你會先？','Friends argue over a toy. What do you do first?'),
 t('明天要去校外玩，你會？','There is an outing tomorrow. What do you prefer?')
];
const answers=[[t('和朋友一起玩','Play with friends'),t('自己安靜玩一會兒','Play quietly on your own')],[t('試試看新玩法','Try something new'),t('先玩熟悉的遊戲','Start with something familiar')],[t('弄清楚事情和規則','Understand the situation and rules'),t('先聽聽彼此的心情','Listen to everyone’s feelings')],[t('先準備好要帶的東西','Prepare what you need'),t('到時候再看想做什麼','Decide as you go')]];
export function personality(p:Person){return p.personality??{energy:50,openness:50,reasoning:50,planning:50,answers:[]};}
export function personalityOptions(p:Person):Option[]{const index=personality(p).answers.length;return (answers[index]??[]).map((title,i)=>({id:i===0?'a':'b',title,detail:t('沒有好壞，這是會影響故事選項的遊戲光譜','No right or wrong answer; this game spectrum affects story choices')}));}
