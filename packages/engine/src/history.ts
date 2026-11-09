import type {World,LedgerEntry} from '../../shared/src/types';
/** A supported expense is counted once: gift receipt for aid, net own payment for personal spending. */
export function spendingHistory(s:World){const p=s.people.find(n=>n.id===s.playerId)!;
 const classify=(e:LedgerEntry)=>/制服|衣服|尿布/.test(e.text.zh)?'clothing':e.category==='education'||/學|補習|樂器|書籍/.test(e.text.zh)?'learning':e.category==='food'||/伙食|午餐|奶粉|食材/.test(e.text.zh)?'food':e.category==='medical'||/就醫|生病/.test(e.text.zh)?'health':'living';
 const aid=s.ledger.filter(e=>e.personId===p.id&&e.category==='familyAid'&&e.amount>0&&!e.relatedPersonId?.startsWith('child-'));
 const supportById=new Map(s.ledger.filter(e=>e.personId===p.id&&e.category==='familyAid'&&e.amount>0).map(e=>[e.id,e.amount]));
 const expenses=s.ledger.filter(e=>e.personId===p.id&&e.amount<0&&e.category!=='loan');
 const isChild=(e:LedgerEntry)=>!!e.relatedPersonId&&p.children.includes(e.relatedPersonId);
 const group=(entries:{entry:LedgerEntry;amount:number}[])=>{const total=entries.reduce((v,e)=>v+e.amount,0);return {total,categories:Object.entries(entries.reduce<Record<string,number>>((v,e)=>{const key=classify(e.entry);v[key]=(v[key]??0)+e.amount;return v;},{})).map(([category,amount])=>({category,amount,percent:total?Math.round(amount/total*100):0})),entries};};
 return {aid:group(aid.map(entry=>({entry,amount:entry.amount}))),personal:group(expenses.filter(e=>!isChild(e)).map(entry=>({entry,amount:Math.max(0,-entry.amount-(supportById.get(entry.id+':support')??0))})).filter(e=>e.amount>0)),family:group(expenses.filter(isChild).map(entry=>({entry,amount:-entry.amount})))};
}
