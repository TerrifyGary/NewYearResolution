import {t} from '../../shared/src/types';
/** Grade D: authored capital, income, risk and skill settings, not franchise quotes. */
export const businesses=[
 {id:'chicken',name:t('社區雞排店','Neighborhood fried-chicken shop'),capital:180000,dc:11,skill:'cooking' as const,profit:26000},
 {id:'cafe',name:t('咖啡廳','Café'),capital:450000,dc:14,skill:'coffee' as const,profit:35000},
 {id:'bar',name:t('小酒吧','Small bar'),capital:600000,dc:16,skill:'social' as const,profit:40000},
 {id:'software',name:t('軟體工程接案工作室','Software contracting studio'),capital:80000,dc:17,skill:'academic' as const,profit:65000},
 {id:'recruiter',name:t('人力獵頭公司','Recruitment agency'),capital:300000,dc:18,skill:'social' as const,profit:60000}
];
