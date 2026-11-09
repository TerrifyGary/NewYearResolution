/** Provenance stays in data/about; play screens show decisions, costs and consequences. */
export function immersive(value:string){return value
 .replace(/這次的人格傾向為[^。]*。/g,'你記下了現在的感受，接下來的生活仍會帶來新的體會。')
 .replace(/Current preference: (?:[EI][NS][TF][JP])\. This is not a diagnosis\./g,'Your answers are recorded. Life will bring new experiences.')
 .replace(/\b[EI][NS][TF][JP](?:\s+(?:指揮官|建築師|邏輯學家|辯論家|提倡者|調停者|主人公|競選者|物流師|守衛者|總經理|執政官|鑑賞家|探險家|企業家|表演者))?\s*·\s*/g,'')
 .replace(/（[^）]*(?:虛構|模擬|遊戲值|遊戲設定|遊戲估值|遊戲效果|遊戲問答|未校準|校名待查|待驗證)[^）]*）/g,'')
 .replace(/\([^)]*(?:fictional|simulated|game value|game estimate|uncalibrated|pilot)[^)]*\)/gi,'')
 .replace(/(?:此為|這是|金額、|班別與招生資格為|學校名稱有來源，)[^。]*(?:模擬|虛構|待驗證|遊戲情境)[^。]*。/g,'')
 .replace(/(?:這是|此為)[^。]*(?:非真實|非官方)[^。]*。/g,'')
 .replace(/未校準的遊戲機率/g,'機率').replace(/住宅估值/g,'房屋估價')
 .replace(/費用估值|本年估值|自付估值/g,'費用')
 .replace(/虛構|模擬|未校準|遊戲分級/g,'').replace(/fictional|simulated|uncalibrated|pilot/gi,'')
 .replace(/\s{2,}/g,' ').trim();}
