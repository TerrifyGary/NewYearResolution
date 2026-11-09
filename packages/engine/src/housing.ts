import {stableNumber} from './education';
import type {World,Housing} from '../../shared/src/types';
export function initialHousing(seed:string,householdId:string):Housing{
 const n=stableNumber(seed+':housing:'+householdId),owned=n%2===0;
 const value=6000000+(n%11)*1000000;
 return {householdId,tenure:owned?'owned':'rent',value:owned?value:0,mortgage:owned?(n%3===0?0:Math.round(value*.6)):0,monthlyRent:owned?0:10000+(n%5)*2000};
}
export function originFinances(s:World){
 const p=s.people.find(n=>n.id===s.playerId)!,home=s.housing.find(h=>h.householdId===p.originHouseholdId);
 const members=s.people.filter(n=>n.alive&&n.householdId===p.originHouseholdId);
 const cash=members.reduce((n,p)=>n+p.cash,0),otherDebt=members.reduce((n,p)=>n+p.debt,0);
 return {home,cash,otherDebt,property:home?.value??null,mortgage:home?.mortgage??null,assets:home?.value==null?null:cash+home.value,net:home?.value==null||home?.mortgage==null?null:cash+home.value-otherDebt-home.mortgage};
}

/** Fictional cash/debt-per-resident bands, never government welfare eligibility. */
export function householdBand(s:World){const p=s.people.find(n=>n.id===s.playerId)!,members=s.people.filter(n=>n.alive&&n.householdId===p.originHouseholdId);const available=members.reduce((v,n)=>v+n.cash-n.debt,0)/Math.max(1,members.length);const index=available<20000?0:available<80000?1:available<250000?2:available<1000000?3:4;return {index,zh:['低收','中低收','普通','小康','富有'][index],en:['Low resources','Lower resources','Ordinary','Comfortable','Wealthy'][index]};}
