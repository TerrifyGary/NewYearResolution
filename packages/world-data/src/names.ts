import type {Gender} from '../../shared/src/types';
/** Authored naming pool; not a demographic frequency table. */
export const surnames=['陳','林','黃','張','李','王','吳','劉','蔡','楊','許','鄭','謝','郭','洪','邱','曾','廖','賴','徐','周','葉','蘇','莊','呂','江','何','蕭','羅','高'];
export const givenNames=['宇安','思妤','柏辰','佳穎','子晴','承恩','以樂','沐言','允禾','予晴','品澄','映安','書妍','庭宇','宥廷','品妍','昀潔','彥呈','奕帆','芷寧','安禾','育誠','詠恩','若棠','晏甯','秉謙','哲維','采薇','芊羽','宸睿','致遠','語彤','雨澄','靖涵','家齊','佩珊','鈺庭','孟軒','立衡','雅筑','淳安','韋辰','馨予','維恩','懷瑾','信宏','美玲','淑惠','志明','建文','雅芳','明哲','惠如','文琪','國維','秀琴','宗翰','俊傑','怡君','婉如','靜宜','慧珍','俊宏','雅婷','詩涵','思齊','可昕','澄希','予恩','知夏','星佑','晞辰','樂謙','舒涵','柏諺','祐甯','晴川','恩曦','佑庭','珮瑜'];

export type GivenNameStyle=Gender|'neutral';
/** Conventional naming preferences for generation only; never used to infer a real person's gender.
 *  Example cross-check: MOI 112 name statistics, table 51 lists 俊傑 among common male names.
 *  https://www.ris.gov.tw/documents/data/5/2/112namestat.pdf (data: 2023-06-30; checked 2026-11-11).
 *  Other classifications and equal sampling within each pool are authored game settings.
 */
export const givenNamePools:Readonly<Record<GivenNameStyle,readonly string[]>>={
 male:['柏辰','承恩','庭宇','宥廷','彥呈','奕帆','育誠','秉謙','哲維','宸睿','致遠','孟軒','立衡','韋辰','信宏','志明','建文','明哲','國維','宗翰','俊傑','俊宏','星佑','晞辰','樂謙','柏諺','佑庭'],
 female:['思妤','佳穎','子晴','予晴','映安','書妍','品妍','昀潔','芷寧','若棠','晏甯','采薇','芊羽','語彤','雨澄','靖涵','佩珊','鈺庭','雅筑','馨予','美玲','淑惠','雅芳','惠如','文琪','秀琴','怡君','婉如','靜宜','慧珍','雅婷','詩涵','可昕','澄希','知夏','舒涵','祐甯','恩曦','珮瑜'],
 neutral:['宇安','以樂','沐言','允禾','品澄','安禾','詠恩','家齊','淳安','維恩','懷瑾','思齊','予恩','晴川']
};
const candidateNames:Record<Gender,readonly string[]>={male:[...givenNamePools.male,...givenNamePools.neutral],female:[...givenNamePools.female,...givenNamePools.neutral]};
export function givenNamesFor(gender?:Gender):readonly string[]{return gender?candidateNames[gender]:givenNames;}
