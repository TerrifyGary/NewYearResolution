import {advance,chooseFocus,createGame,decide,nextYear,player,type World} from '../packages/engine/src';
export function partnered(seed='family-fixture'):World{
 const s=createGame(seed);s.year=2036;s.date='2036-08-12';s.phase='event';s.queue=[];s.cursor=0;
 s.current={id:'household-fixture',date:s.date,kind:'partnership',title:{zh:'成家',en:'Household'},text:{zh:'測試',en:'Fixture'},tone:0,grade:'D'};
 return decide(s,'form');
}
export function planning(profile:'typical'|'reduced'='typical'):World{
 const s=partnered();s.year=2038;s.date='2038-09-06';s.phase='event';s.rng=1;
 s.people.find(n=>n.id===player(s).partnerId)!.gender=player(s).gender==='male'?'female':'male';player(s).fertility.profile='typical';s.people.find(n=>n.id===player(s).partnerId)!.fertility.profile=profile;
 s.current={id:'planning-fixture',date:s.date,kind:'child',title:{zh:'孩子',en:'Child'},text:{zh:'測試',en:'Fixture'},tone:0,grade:'D'};return s;
}
export function awaitingName():World{
 let s=decide(planning(),'family');s.phase='review';s.date='2038-12-31';s=nextYear(s);s=chooseFocus(s,'balanced');s.queue=s.queue.filter(e=>e.kind==='birth');s.cursor=0;return advance(s);
}
