import {describe,it,expect} from 'vitest';
import {createGame,decide,player,nameSuggestions,nameChild,type World,type Gender} from '../packages/engine/src';
import {givenNames,givenNamePools,givenNamesFor} from '../packages/world-data/src/names';
import {serialize,deserialize} from '../packages/engine/src/save';
import {awaitingName} from './family-fixtures';

function romance(gender:Gender,attractedTo:Gender){
 const s=createGame('names-'+gender+'-'+attractedTo,2006);s.year=2026;s.date='2026-10-20';s.phase='event';s.queue=[];s.cursor=0;
 Object.assign(player(s),{gender,attractedTo});
 s.current={id:'names-romance',kind:'life',data:'romance-received',date:s.date,title:{zh:'告白',en:'Confession'},text:{zh:'告白',en:'Confession'},tone:0,grade:'D'};
 return s;
}
function form(s:World){s.year=2036;s.date='2036-08-12';Object.assign(player(s),{job:'service',employedMonths:24,employment:{company:{zh:'公司',en:'Company'},position:{zh:'專員',en:'Staff'},startYear:2034,monthlySalary:36000}});s.current={id:'names-partnership',kind:'partnership',date:s.date,title:{zh:'成家',en:'Household'},text:{zh:'成家',en:'Household'},tone:0,grade:'D'};s.phase='event';return decide(s,'form');}

describe('names follow the generated identity',()=>{
 it('keeps all authored names classified once and retains neutral options for both genders',()=>{
  const classified=Object.values(givenNamePools).flat();expect(classified).toHaveLength(givenNames.length);expect(new Set(classified).size).toBe(classified.length);expect(new Set(classified)).toEqual(new Set(givenNames));
  expect(givenNamesFor('male')).toContain('俊傑');expect(givenNamesFor('female')).not.toContain('俊傑');
  expect(givenNamesFor('female')).toContain('雅婷');expect(givenNamesFor('male')).not.toContain('雅婷');
  for(const name of givenNamePools.neutral){expect(givenNamesFor('male')).toContain(name);expect(givenNamesFor('female')).toContain(name);}
 });
 it('fixes a reproducible female 俊傑 without changing initial gameplay draws, stats or attraction',()=>{
  const s=createGame('name-repro-95'),p=player(s);
  expect(p.gender).toBe('female');expect(p.name).not.toBe('賴俊傑');expect(givenNamesFor(p.gender)).toContain(p.name.slice(1));
  expect(s.rng).toBe(2845681870);expect(s.locationId).toBe('臺中市北屯區');expect(p.attractedTo).toBe('male');
  expect(p.attributes).toEqual({str:14,dex:11,con:13,int:11,wis:11,cha:14});expect(p.agencyAge).toBe(4);
  expect(createGame('name-repro-95')).toEqual(s);
 });
 it('creates varied role-appropriate player and parent names with distinct parent identities',()=>{
  const combinations=new Set<string>();
  for(let i=0;i<500;i++){
   const s=createGame('name-sampling-'+i,1980+i%47),p=player(s),dad=s.people.find(n=>n.id==='father')!,mom=s.people.find(n=>n.id==='mother')!;
   expect(dad.gender).toBe('male');expect(mom.gender).toBe('female');expect(dad.name).not.toBe(mom.name);
   for(const n of [p,dad,mom])expect(givenNamesFor(n.gender)).toContain(n.name.slice(1));
   combinations.add(p.gender+':'+p.attractedTo);
  }
  expect(combinations.size).toBe(4);
 });
 it.each([['male','female'],['female','male'],['male','male'],['female','female']] as [Gender,Gender][])('creates a %s player’s %s dating partner with a matching name before recording letters', (gender,attractedTo)=>{
  const n=decide(romance(gender,attractedTo),'accept'),partner=n.people.find(p=>p.id===player(n).life?.relationship?.personId)!;
  expect(partner.gender).toBe(attractedTo);expect(partner.attractedTo).toBe(gender);expect(givenNamesFor(partner.gender)).toContain(partner.name.slice(1));
  expect(Object.values(player(n).life?.itemNotes??{})[0].zh).toContain(partner.name);expect(deserialize(serialize(n))).toEqual(n);
  const formed=form(n),record=formed.people.find(p=>p.id===partner.id)!;expect(record.name).toBe(partner.name);expect(record.gender).toBe(partner.gender);
 });
 it.each(['male','female'] as const)('also names a directly generated %s household partner consistently',gender=>{
  const n=form(romance(gender==='male'?'female':'male',gender)),partner=n.people.find(p=>p.id===player(n).partnerId)!;
  expect(partner.gender).toBe(gender);expect(givenNamesFor(gender)).toContain(partner.name.slice(1));expect(player(n).familyName).toContain(partner.name);
 });
 it('does not rewrite an existing date’s name or gender when forming a household',()=>{
  const s=decide(romance('male','female'),'accept'),date=s.people.find(n=>n.id===player(s).life?.relationship?.personId)!;
  date.name='江俊傑';player(s).attractedTo='male';
  const n=form(s),partner=n.people.find(n=>n.id===date.id)!;expect(partner.name).toBe('江俊傑');expect(partner.gender).toBe('female');
 });
 it.each(['male','female'] as const)('offers six distinct %s child suggestions without RNG changes and keeps custom naming free',gender=>{
  const s=awaitingName(),child=s.people.find(p=>p.id===s.pendingChildId)!;child.gender=gender;const before=serialize(s),names=nameSuggestions(s,child.id);
  expect(new Set(names).size).toBe(6);for(const name of names)expect(givenNamesFor(gender)).toContain(name);
  expect(serialize(s)).toBe(before);expect(nameSuggestions(deserialize(before),child.id)).toEqual(names);
  const n=nameChild(s,'俊傑');expect(n.people.find(p=>p.id===child.id)!.name).toBe(child.name[0]+'俊傑');expect(n.people.find(p=>p.id===child.id)!.gender).toBe(gender);
 });
 it('preserves recorded female 江俊傑 and all saved history rather than inferring gender from a name',()=>{
  const s=createGame('existing-name');player(s).name='江俊傑';player(s).gender='female';const raw=serialize(s);
  expect(deserialize(raw)).toEqual(s);
 });
});
