import {it,expect} from 'vitest';
import {cancerIncidence,cancerAnnualRisk,cancerYear} from '../packages/engine/src/cancer';
import {createGame,player} from '../packages/engine/src';
import {serialize,deserialize} from '../packages/engine/src/save';
it('converts age-specific rates per 100,000, not percentages',()=>{expect(cancerIncidence(60)).toBe(183.56/100000);expect(cancerIncidence(20)).toBe(.76/100000);});
it('uses conditional observed survival without treating five-year death as an annual rate',()=>{expect(cancerAnnualRisk(55,4,1)).toBeCloseTo(.391);expect(cancerAnnualRisk(55,4,2)).toBeCloseTo(1-41.3/60.9);expect(cancerAnnualRisk(80,4,1)).toBeCloseTo(.693);expect(cancerAnnualRisk(55,4,6)).toBeNull();expect(cancerAnnualRisk(10,4,1)).toBeNull();});
it('draws once per calendar year and preserves diagnosis through save/load',()=>{const s=createGame('cancer');s.year=2060;s.date='2060-01-01';s.queue=[];s.cursor=0;let draws=0;const random=()=>{draws++;return 0;};expect(cancerYear(s,random).diagnosed).toBe(true);const count=draws;cancerYear(s,random);expect(draws).toBe(count);expect(deserialize(serialize(s))).toEqual(s);expect(player(s).life?.cancer?.type).toBe('lung');});
