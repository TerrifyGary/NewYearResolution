import {t} from '../../shared/src/types';
export const collegeCatalog=[
 {id:'ntu',name:'國立臺灣大學',city:'taipei',tier:105,source:'https://ntuinfo.ntu.edu.tw/p1_1_0.html',programs:[['中國文學系',1],['工商管理學系',1],['資訊工程學系',2],['生命科學系',3]]},
 {id:'ntnu',name:'國立臺灣師範大學',city:'taipei',tier:85,source:'https://www.ntnu.edu.tw/',programs:[['國文學系',1],['企業管理學系',1],['資訊工程學系',2],['生命科學系',3],['音樂學系',0],['體育與運動科學系',-1]]},
 {id:'thu',name:'東海大學',city:'taichung',tier:60,source:'https://www.thu.edu.tw/',programs:[['中國文學系',1],['企業管理學系',1],['資訊工程學系',2],['生命科學系',3],['音樂學系',0]]},
 {id:'fju',name:'輔仁大學',city:'new-taipei',tier:65,source:'https://www.fju.edu.tw/',programs:[['中國文學系',1],['企業管理學系',1],['資訊工程學系',2],['食品科學系',3],['音樂學系',0],['體育學系',-1]]},
 {id:'tnua',name:'國立臺北藝術大學',city:'taipei',tier:90,source:'https://udb.moe.edu.tw/ulist/Institution?id=000021E731C2',programs:[['音樂學系',0]]},
 {id:'ntsu',name:'國立體育大學',city:'taoyuan',tier:75,source:'https://dsp.ntsu.edu.tw/',programs:[['體育推廣學系',-1]]},
 {id:'ntus',name:'國立臺灣體育運動大學',city:'taichung',tier:70,source:'https://pe.ntus.edu.tw/',programs:[['體育學系',-1]]}
 ,{id:'ncku',name:'國立成功大學',city:'tainan',tier:100,source:'https://cge.ncku.edu.tw/p/450-1007-16692%2Cc1.php?Lang=zh-tw',programs:[['中國文學系',1],['企業管理學系',1],['資訊工程學系',2],['護理學系',3]]}
] as const;
export function groupText(group:number){return [t('音樂','Music'),t('一類','Group I'),t('二類','Group II'),t('三類','Group III')][group]??t('未分組','Undeclared');}

const englishPrograms:Record<string,string>={'中國文學系':'Chinese Literature','國文學系':'Chinese Language and Literature','企業管理學系':'Business Administration','工商管理學系':'Business Administration','資訊工程學系':'Computer Science and Information Engineering','生命科學系':'Life Sciences','食品科學系':'Food Science','護理學系':'Nursing','音樂學系':'Music','體育與運動科學系':'Physical Education and Sport Sciences','體育學系':'Physical Education','體育推廣學系':'Physical Education Promotion'};
export const programText=(name:string)=>t(name,englishPrograms[name]??name);
export const collegeText=(id:string)=>{const school=collegeCatalog.find(c=>c.id===id)!;return t(school.name,({ntu:'National Taiwan University',ntnu:'National Taiwan Normal University',thu:'Tunghai University',fju:'Fu Jen Catholic University',tnua:'Taipei National University of the Arts',ntsu:'National Taiwan Sport University',ntus:'National Taiwan University of Sport',ncku:'National Cheng Kung University'} as Record<string,string>)[id]);};
export const roundText=(name:string)=>t(name,({'免試入學':'Application round','學測':'General Scholastic Ability Test','分科測驗':'Subject-Specific Test'} as Record<string,string>)[name]??name);
