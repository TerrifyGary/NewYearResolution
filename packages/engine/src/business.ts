import type {Person} from '../../shared/src/types';

/** Close once; preserve capital, past results and ledger history. No invented sale proceeds. */
export function closeBusiness(p:Person,date:string){
 const business=p.life?.business;
 if(!business?.active)return false;
 business.active=false;
 business.closedDate=date;
 if(business.mode==='side')return true;
 p.job='none';
 delete p.employment;
 delete p.life!.partTime;
 return true;
}
