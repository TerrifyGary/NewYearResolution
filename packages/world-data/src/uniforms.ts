import schools from './high-115.json';
import referenceData from './uniform-references.json';

export type UniformGender='male'|'female';
/** Lookup records remain outside the simulation bundle; a directory match is not design evidence. */
export interface UniformMapLookup {
 code:string;name:string;city:string;checked:string;query:string;
 status:'description-reviewed'|'illustration-reviewed'|'conflict-primary-used'|'matched-directory'|'no-matched-index-result';
 pages:{title:string;url:string;summer:boolean;descriptionReviewed:boolean}[];note?:string;
}
export interface UniformDesign {
 top:string;bottom:string;description:string;cut:string;collar:string;
 trim:string|null;tie:string|null;stitch:string;pattern?:string;
 collarColor?:string;collarPattern?:string;tieStyle?:string;tiePattern?:string;patternColors?:string[];
 topPattern?:string;stripeColor?:string;
 beltColor?:string;cuffColor?:string;cuffPattern?:'plaid';patternScale?:number;dressPleats?:boolean;
}
export interface UniformSchool {
 code:string;schoolId:string;name:string;city:string;website:string;label:string;season:string;
 reference:{url:string;year:number|null;kind:string;checked:string;note?:string;evidence?:'third-party-description'|'third-party-illustration'}|null;
 variants:Record<UniformGender,{asset:string;sourced:boolean;design:UniformDesign|null}>;
}
const references=referenceData as Record<string,{label:string;source:NonNullable<UniformSchool['reference']>;variants:Partial<Record<UniformGender,UniformDesign>>}>;
const fallback={male:'illustrations/uniforms/white-shirt-black-trousers.svg',female:'illustrations/uniforms/white-shirt-black-pleated-skirt.svg',verified:false};
/** National identity coverage is distinct from researched artwork coverage. */
export const highSchoolUniforms:UniformSchool[]=schools.map(school=>{
 const ref=references[school.code];
 const variant=(gender:UniformGender)=>({asset:ref?.variants[gender]?`illustrations/uniforms/schools/${school.code}-${gender}-summer.svg`:fallback[gender],sourced:!!ref?.variants[gender],design:ref?.variants[gender]??null});
 return {...school,schoolId:'moe115-high-'+school.code,season:'summer',reference:ref?.source??null,label:ref?.label??school.name,variants:{male:variant('male'),female:variant('female')}};
});
const aliases:Record<string,string>={fgsh:'353303',cksh:'353301',pcsh:'013304',ccsh:'423302',cmsh:'193303','nk-senior':'580301'};
const byCode=new Map(highSchoolUniforms.map(r=>[r.code,r]));
export const uniformGallery:Record<string,{male:string;female:string;verified:boolean}>={default:fallback};
for(const row of highSchoolUniforms)uniformGallery[row.schoolId]={male:row.variants.male.asset,female:row.variants.female.asset,verified:row.reference?.kind==='official'};
for(const [id,code] of Object.entries(aliases))uniformGallery[id]=uniformGallery[byCode.get(code)!.schoolId];
export function uniformSchool(schoolId:string|null|undefined){return byCode.get(aliases[schoolId??'']??schoolId?.replace(/^moe115-high-/,'')??'');}
export function uniformAsset(schoolId:string|null|undefined,gender:UniformGender,level?:string){
 const school=uniformSchool(schoolId);
 if(school)return school.variants[gender].asset;
 if(gender==='female'&&level==='primary')return 'illustrations/uniforms/white-shirt-black-pinafore.svg';
 return fallback[gender];
}
