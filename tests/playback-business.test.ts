import {describe,it,expect} from 'vitest';
import {createGame,player,decide,advance,options,type World} from '../packages/engine/src';
import {playbackStage} from '../packages/engine/src/playback';
import {lifeEvent,lifeYear} from '../packages/engine/src/life-events';
import {serialize,deserialize} from '../packages/engine/src/save';

function owner(){
 const s=createGame('business-exit',2004);s.year=2026;s.date='2026-09-10';s.phase='event';s.queue=[];s.cursor=0;s.journal=[];s.ledger=[];
 const p=player(s);p.enrollments=[{level:'university',schoolId:'ntnu',track:'general',startYear:2022}];
 p.job='service';p.employment={company:{zh:'雞排店',en:'Chicken shop'},position:{zh:'負責人',en:'Owner'},startYear:2025,monthlySalary:0};
 p.life={business:{id:'chicken',since:2025,capital:150000,profit:30000,active:true}};
 return s;
}
function at(s:World,data:string){s.current=lifeEvent(s,Number(s.date.slice(5,7)),Number(s.date.slice(8)),data,{zh:data,en:data},{zh:data,en:data});s.phase='event';return s;}
describe('post-graduation playback and business exits',()=>{
 it('has a stable work stage before hiring, after layoffs and after closing a business',()=>{
  const s=owner(),p=player(s),before=serialize(s);expect(playbackStage(s)).toBe('work');expect(serialize(s)).toBe(before);
  p.job='none';delete p.employment;expect(playbackStage(s)).toBe('work');
  p.job='retired';expect(playbackStage(s)).toBe('retired');
  s.date='2026-06-01';expect(playbackStage(s)).toBe('university');
 });
 it('closes from a career event without rerolling or refunding capital and immediately offers jobs',()=>{
  const s=at(owner(),'career'),before=serialize(s),cash=player(s).cash,rng=s.rng;
  expect(options(s).map(o=>o.id)).toContain('close-business');
  const n=decide(s,'close-business');expect(serialize(s)).toBe(before);expect(n.rng).toBe(rng);expect(player(n).cash).toBe(cash);
  expect(player(n).life?.business).toMatchObject({active:false,closedDate:'2026-09-10',capital:150000,profit:30000});
  expect(player(n).job).toBe('none');expect(player(n).employment).toBeUndefined();expect(n.ledger).toEqual([]);
  expect(deserialize(serialize(n))).toEqual(n);expect(()=>decide(n,'close-business')).toThrow();
  const next=advance(n);expect(next.current?.data).toBe('career');expect(next.date).toBe('2026-09-11');expect(options(next).some(o=>o.id.startsWith('job:'))).toBe(true);
  expect(playbackStage(next)).toBe('work');
 });
 it('offers student part-time work after closing and stops operating income',()=>{
  const s=owner();s.date='2026-03-06';player(s).enrollments[0].startYear=2023;
  const n=decide(at(s,'part-time'),'close-business'),next=advance(n);expect(next.current?.data).toBe('part-time');expect(options(next).some(o=>o.id==='job:restaurant-part')).toBe(true);
  next.phase='story';next.current=null;next.queue=[lifeEvent(next,3,28,'month',{zh:'月結',en:'Month'},{zh:'月結',en:'Month'},'finance')];next.cursor=0;
  const month=advance(next);expect(month.ledger.some(e=>e.id.endsWith(':business'))).toBe(false);
 });
 it('schedules the first review in the startup year and safely ignores it after closure',()=>{
  const s=owner();s.date='2026-05-24';delete player(s).life!.business;player(s).cash=3000000;
  const startup=options(at(s,'business')).find(o=>o.id.startsWith('start:')&&!o.disabled)!;
  const n=decide(s,startup.id);expect(n.queue.filter(e=>e.data==='business-review')).toHaveLength(1);
  const pending=n.queue.find(e=>e.data==='business-review')!;
  n.date='2026-09-10';const closed=decide(at(n,'business-review'),'close');closed.date=pending.date;closed.current=pending;closed.phase='event';
  expect(options(closed).map(o=>o.id)).toEqual(['skip']);expect(()=>decide(closed,'continue')).toThrow();
  const done=decide(closed,'skip');expect(player(done).life?.business?.active).toBe(false);expect(deserialize(serialize(done))).toEqual(done);
 });
 it('keeps existing active-business saves usable and closes from the annual review too',()=>{
  const s=deserialize(serialize(owner()));expect(lifeYear(s).some(e=>e.data==='business-review')).toBe(true);
  s.date='2026-11-20';const n=decide(at(s,'business-review'),'close');expect(player(n).life?.business?.closedDate).toBe(s.date);expect(n.queue.some(e=>e.data==='career')).toBe(true);
 });
});
