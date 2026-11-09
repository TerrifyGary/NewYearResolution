/** User-approved fallback designs. Add verified school-specific entries by school ID later. */
export const uniformGallery:Record<string,{male:string;female:string;verified:boolean}>={
 default:{male:'illustrations/uniforms/white-shirt-black-trousers.svg',female:'illustrations/uniforms/white-shirt-black-pleated-skirt.svg',verified:false}
};
export function uniformAsset(schoolId:string|null|undefined,gender:'male'|'female',level?:string){const verified=uniformGallery[schoolId??''];if(verified)return verified[gender];if(gender==='female'&&level==='primary')return 'illustrations/uniforms/white-shirt-black-pinafore.svg';return uniformGallery.default[gender];}
