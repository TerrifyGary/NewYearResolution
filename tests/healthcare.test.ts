import {describe,it,expect} from 'vitest';
import {createGame,player,options,decide} from '../packages/engine/src';
import {medicalQuote} from '../packages/engine/src/healthcare';
import {serialize,deserialize} from '../packages/engine/src/save';
function illness(a=10,year=2026){const s=createGame('medical-fixture',year-a);s.year=year;s.date=`${year}-04-18`;s.phase='event';s.current={id:'illness-test',date:s.date,kind:'illness',title:{zh:'身體不適',en:'Unwell'},text:{zh:'測試',en:'Fixture'},tone:-1,grade:'D'};return s;}
describe('routine medical costs and guardians',()=>{
 it('shows the guardian and estimated routine fee before choosing',()=>{const s=illness();const q=medicalQuote(s,'care');expect(q.amount).toBe(200);expect(q.payer.id).not.toBe(s.playerId);expect(options(s).find(o=>o.id==='care')!.detail.zh).toContain(q.payer.name);});
 it('charges a funded guardian once and preserves the child account and RNG',()=>{const s=illness();const q=medicalQuote(s,'care'),cash=q.payer.cash;const n=decide(s,'care');expect(player(n).cash).toBe(player(s).cash);expect(player(n).debt).toBe(player(s).debt);expect(n.people.find(p=>p.id===q.payer.id)!.cash).toBe(cash-200);expect(n.ledger.filter(e=>e.category==='medical')).toHaveLength(1);expect(n.rng).toBe(s.rng);expect(deserialize(serialize(n))).toEqual(n);expect(()=>decide(n,'care')).toThrow();});
 it('does not bill consultation for home rest',()=>{const s=illness(),n=decide(s,'rest');expect(n.ledger).toEqual(s.ledger);expect(n.people.map(p=>p.cash)).toEqual(s.people.map(p=>p.cash));});
 it('uses the better-funded living guardian, never a deceased guardian',()=>{const s=illness();player(s).guardianIds=[...player(s).parentIds];const [a,b]=player(s).guardianIds.map(id=>s.people.find(p=>p.id===id)!);a.alive=true;a.cash=0;b.alive=true;b.cash=500;expect(medicalQuote(s,'care').payer.id).toBe(b.id);b.alive=false;expect(medicalQuote(s,'care').payer.id).toBe(a.id);});
 it('bills an adult personally and explicitly falls back if no guardian survives',()=>{const s=illness(18);expect(medicalQuote(s,'care').payer.id).toBe(s.playerId);const child=illness();player(child).guardianIds=[];expect(medicalQuote(child,'care').detail.zh).toContain('由你支付');});
 it('does not apply a modern outpatient estimate to pre-NHI years',()=>{expect(medicalQuote(illness(10,1994),'care').amount).toBe(600);expect(medicalQuote(illness(10,1995),'care').amount).toBe(200);const early=illness(10,1995);early.date='1995-02-28';early.current!.date=early.date;expect(medicalQuote(early,'care').amount).toBe(600);});
});
