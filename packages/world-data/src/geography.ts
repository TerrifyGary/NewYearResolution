import population from './population.json';
export const cityIds:Record<string,string>={'臺北市':'taipei','新北市':'new-taipei','臺中市':'taichung','高雄市':'kaohsiung','桃園市':'taoyuan','臺南市':'tainan'};
export const districtRows=Object.entries(population.districts).map(([name,weight])=>{const city=name.match(/^.+?[市縣]/)![0],district=name.slice(city.length);const aliases:Record<string,string>={'臺北市中正區':'zhongzheng','新北市板橋區':'banqiao','臺中市西區':'west','高雄市苓雅區':'lingya'};return {id:aliases[name]??name,city:cityIds[city]??city,cityName:city,district,name,weight};});
export function weightedLocation(draw:number){let target=draw*districtRows.reduce((v,r)=>v+r.weight,0);for(const row of districtRows){target-=row.weight;if(target<0)return row.id;}return districtRows.at(-1)!.id;}
export {population};
