import catalog from './school-name-catalog.json';

export interface SchoolDirectorySource {
 siteId:string;name:string;url:string;regionId:number;sourceRegion:string;checked:string;
 sourceReportsClosure:boolean;match:'reviewed-alias'|'name-region'|'unmatched';
}
export interface SchoolNameEntry {
 id:string;code:string|null;name:string;city:string|null;website:string;
 /** Reference-only records have no verified admission level or historical dates. */
 kind:'moe-115'|'reference-only';aliases:string[];mapEntries:SchoolDirectorySource[];
}
/** Offline name lookup only. Admissions continue to use schools.ts and saved IDs. */
export const schoolNameDirectory=catalog.schools as SchoolNameEntry[];
const normalize=(text:string)=>text.trim().replaceAll('台','臺').toLocaleLowerCase('en');
export function searchSchoolNames(query:string){
 const key=normalize(query);
 return schoolNameDirectory.filter(s=>[s.name,...s.aliases].some(n=>normalize(n).includes(key)));
}
