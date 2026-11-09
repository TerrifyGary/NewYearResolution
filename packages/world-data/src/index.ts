import {t} from '../../shared/src/types';
import {districtRows} from './geography';
export const locations=districtRows.map(r=>({id:r.id,name:t(r.name,r.name)}));
export const provenance=[{id:'identity-setting',grade:'D',title:t('角色與家庭設定','Identity and family settings'),text:t('新角色40%偏好相同性別、60%偏好不同性別，是使用者指定的遊戲設定，非人口統計。同性伴侶在本作採簡化領養流程，未模擬法定程序。','New characters use a user-defined40% same-gender attraction setting, not demographic data. Same-gender couples follow a simplified game adoption route, not a legal procedure.'),url:''},
 
 {id:'pilot-1',grade:'D',title:t('試玩資料：虛構平衡值','Pilot data: fictional balance values'),text:t('出生地依2025年底戶籍人口快照加權（非2026人口）；收入、家庭、風險、考期及稅費均為未校準的遊戲示例，非人口統計或現行法規。','Origins use the 2025 year-end registered-population snapshot, not 2026 figures. Income, family generation, risks, exam dates and financial deductions are uncalibrated game examples, not official statistics or current law.'),url:''},
 {id:'design',grade:'C',title:t('歷史資料仍待匯入','Historical data import pending'),text:t('完整 2026 人口權重、分齡父母健康、完整歷史校名與招生、歷年考期及法定財務規則尚未匯入。','Full 2026 population weights, age-specific parent health, complete historical schools/admissions, historical calendars and statutory financial rules are not yet imported.'),url:'https://www.ris.gov.tw/info-popudata/app/awFastDownload/toMain_panel'}
];
export const attrs={str:t('力量','Strength'),dex:t('敏捷','Dexterity'),con:t('體質','Constitution'),int:t('智力','Intelligence'),wis:t('感知','Wisdom'),cha:t('魅力','Charisma')};
export const skills={academic:t('學科','Academics'),music:t('音樂','Music'),coffee:t('咖啡','Coffee'),social:t('社交','Social'),sports:t('體育','Sports')};
export const jobs={none:t('尚未就業','Not employed'),service:t('服務業職員（虛構職位）','Service worker (fictional role)'),technology:t('科技業職員（虛構職位）','Technology worker (fictional role)'),creative:t('音樂工作者（虛構職位）','Musician (fictional role)'),retired:t('退休','Retired')};
export const focusLabels={study:t('加強一般學科','Focus on academics'),talent:t('投入專長練習','Develop a specialty'),social:t('經營人際關係','Build relationships'),health:t('照顧身心健康','Care for your health'),career:t('投入工作與求職','Focus on work / job search'),balanced:t('尋找生活的平衡','Find a balance')};
