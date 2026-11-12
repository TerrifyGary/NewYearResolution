/** HPA CRIS, retrieved 2026-11-12. Rates are per 100,000, both sexes, Taiwan, 2023.
 * Incidence scope: lung/bronchus/trachea (C33-C34); survival scope: lung (C34).
 * See docs/CANCER_MODEL.md for this small scope mismatch and incomplete coverage. */
export const lungIncidence=[0,0,.10,.29,.76,2.52,6.03,13.04,25.82,44.01,86.79,129.37,183.56,217.49,260.89,302.52,317.83,293.09];
/** 2018 diagnoses, AJCC8, observed survival through 2024; rows I–IV, columns years1–5.
 * Observed survival includes all causes of death. Not cancer-specific mortality. */
export const lungSurvival:Record<string,number[][]>={
 '15-29':[[100,100,100,100,100],[100,100,100,100,100],[100,66.7,66.7,66.7,66.7],[66.7,66.7,66.7,50,33.3]],
 '30-49':[[100,99.2,99,97.9,97.3],[95.7,87.2,83,80.9,72.3],[88.3,75.2,64.2,56.9,51.8],[70.3,50,37.7,30.6,23.6]],
 '50-64':[[99,97.7,96.5,95.2,93.9],[93.8,87.3,82.5,77.6,72],[80.4,64.1,54.1,46.9,41.5],[60.9,41.3,30.1,22.9,18]],
 '65-74':[[97.6,94.5,91.6,88.7,85.1],[93.6,82.7,73.8,61.4,55],[70.7,51.8,42.5,37.1,32.3],[50.5,31.9,22,15.2,11.1]],
 '75+':[[93.3,85,78.6,71.5,64.3],[77.2,57.3,44.4,35.7,29.2],[50.5,31.4,20.9,15.6,11.1],[30.7,16.3,10.4,7.1,4.9]]
};
/** 2023 long-form report tables13-3/13-7, all ages, NSCLC + small-cell.
 * Stage0 excluded because incidence above is invasive; unknown retained. */
export const lungStages=[{stage:1,count:7465},{stage:2,count:684},{stage:3,count:1870},{stage:4,count:7998},{stage:0,count:73}];
export const cancerSources={incidence:'https://cris.hpa.gov.tw/Incidence/IRQuery',survival:'https://cris.hpa.gov.tw/rate/period',stage:'https://twcr.tw/wp-content/uploads/2025/12/CA17_LF112.pdf'};
