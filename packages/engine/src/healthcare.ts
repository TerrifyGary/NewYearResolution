import {t,type World,type Person} from '../../shared/src/types';
/** Routine minor-illness pilot only: not a statutory fee calculator or hospital bill. */
export interface MedicalQuote {amount:number;payer:Person;detail:ReturnType<typeof t>}
export function medicalQuote(s:World,choice:'rest'|'care'):MedicalQuote{
 const p=s.people.find(n=>n.id===s.playerId)!;
 const guardians=s.people.filter(n=>n.alive&&p.guardianIds.includes(n.id)).sort((a,b)=>b.cash-a.cash||a.id.localeCompare(b.id));
 const payer=s.year-p.birthYear<18?(guardians[0]??p):p;
 // Historical pre-NHI fees remain explicitly uncalibrated; never apply modern copay rules retrospectively.
 const amount=choice==='rest'?0:s.date>='1995-03-01'?200:600;
 const funding=payer.id===p.id?t('由你支付','Paid by you'):t(`由家長／監護人 ${payer.name} 支付`,`Paid by parent/guardian ${payer.name}`);
 return {amount,payer,detail:t(`${funding.zh} · ${amount===0?'無診療費':`普通門診自付估值 NT$${amount.toLocaleString('en-US')}（遊戲估值，非官方費率）`}`,`${funding.en} · ${amount===0?'No consultation charge':`Routine outpatient estimate NT$${amount.toLocaleString('en-US')} (game estimate, not an official tariff)`}`)};
}
