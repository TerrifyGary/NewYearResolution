import data from './schools-115.json';
export const schoolDirectory=data;
export const directoryLocations:Record<string,string>={zhongzheng:'臺北市/中正區',banqiao:'新北市/板橋區',west:'臺中市/西區',lingya:'高雄市/苓雅區'};
export function districtSchools(city:string,district:string,level:'primary'|'junior'){return (data.districts as Record<string,{primary:DirectorySchool[];junior:DirectorySchool[]}>)[city.replaceAll('台','臺')+'/'+district]?.[level]??[];}
export interface DirectorySchool {code:string;name:string;city:string;district:string;address:string;public:boolean;website:string}
