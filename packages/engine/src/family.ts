import {givenNamesFor} from '../../world-data/src/names';
import {t,type FertilityState,type Person,type Text,type World} from '../../shared/src/types';
/** Separate deterministic stream: generating a profile or viewing suggestions never moves world RNG. */
function familyHash(value:string){let n=2166136261;for(const c of value)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
export function initialFertility(seed:string,id:string):FertilityState{
 // 12% is a fictional pilot frequency, NOT Taiwan prevalence or WHO lifetime prevalence.
 return {profile:familyHash(`${seed}:fertility:${id}`)/4294967296<.12?'reduced':'typical',assessed:false,attempts:0,lastAttemptYear:null};
}
export function nameSuggestions(s:World,childId:string):string[]{
 const child=s.people.find(n=>n.id===childId),available=[...givenNamesFor(child?.gender)];
 // Without replacement: all six suggestions remain distinct even if pool sizes change.
 return Array.from({length:Math.min(6,available.length)},(_,i)=>available.splice(familyHash(`${s.seed}:names:${childId}:${i}`)%available.length,1)[0]);
}
export function validateGivenName(input:string):string{
 const name=input.normalize('NFC').trim();
 if([...name].length<1||[...name].length>20||!/^\p{L}[\p{L}\p{M} ·・'’-]*$/u.test(name))throw Error('Invalid given name');
 return name;
}
export interface FamilyView {formed:boolean; name:Text; partner:Person|null; parents:Person[]; children:Person[]; members:Person[]; status:Text}
export function familyView(s:World):FamilyView{
 const p=s.people.find(n=>n.id===s.playerId)!;
 const partner=s.people.find(n=>n.id===p.partnerId)??null;
 const parents=s.people.filter(n=>(p.parentIds.includes(n.id)||p.legalParentIds.includes(n.id)));
 const children=s.people.filter(n=>p.children.includes(n.id));
 const formed=!!p.familyName||!!partner||children.length>0;
 const members=formed?[p,...(partner?[partner]:[]),...children]:s.people.filter(n=>n.householdId===p.householdId&&n.alive);
 const aliveGuardians=s.people.filter(n=>p.guardianIds.includes(n.id)&&n.alive);
 const status=formed?partner?(partner.alive?t('共同家庭','Shared family'):t('伴侶已故，家人紀錄保留','Partner deceased; family records retained')):t('與子女組成家庭','Family with children'):
  aliveGuardians.length===0?t('目前沒有在世的原登記照顧者','No surviving originally registered caregiver'):parents.some(n=>!n.alive)?t('一位家長已故','A parent has died'):aliveGuardians.length===1?t('主要由一位家長照顧，父母分住','One primary caregiver; parents live separately'):t('由父母共同照顧','Care from both parents');
 return {formed,name:formed?t(p.familyName??`${p.name}的家`,`${p.name}'s household`):t('原生家庭','Family of origin'),partner,parents,children,members,status};
}
