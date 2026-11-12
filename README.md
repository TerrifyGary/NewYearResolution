> 2026-11-12：最新進度與未完成項目見 [時間段與學生工作](docs/TIME_BLOCK_AND_STUDENT_WORK.md)、[癌症資料](docs/CANCER_MODEL.md)。

# 新年新希望 / New Year Resolution

以臺灣為背景的雙語文字人生 RPG。從出生、學校、工作走到家庭與晚年，選擇年度目標，經歷有日期的生活事件，以 D20 處理需要檢定的選擇。預設繁體中文，可切換英文。

**目前版本：v0.7 原型。** 可玩完整單代人生、保存進度並接續在世後代；歷史、招生、財務及健康系統仍有明確的簡化範圍。這不是已完成統計校準的現實人生模型。

## 快速開始 / Quick start

需要 Node.js 22.12+（建議24）及 npm。

```sh
git clone https://github.com/TerrifyGary/NewYearResolution.git
cd NewYearResolution
npm ci
npm run dev
```

開啟終端機印出的網址，通常為 `http://127.0.0.1:5173/`。

```sh
npm test              # 引擎、存檔、完整人生與 Vue 互動測試
npm run build         # TypeScript/Vue 檢查及正式打包
npm run preview       # 預覽 dist 靜態網站
```

完整人生測試會跑八條長人生，整套測試可能需要數分鐘。圖片與公開資料隨專案快取，遊玩不需要 Node 後端、帳號或付費 API。

高中夏季制服可在 [本機圖庫](http://127.0.0.1:5173/uniform-library.html) 瀏覽；最新 [制服地圖整併](docs/UNIFORM_MAP_DIRECTORY.md) 收錄562筆來源、593筆可搜尋身分與100校／129款插畫；[前批制服地圖查找](docs/UNIFORM_MAP.md) 保留437校索引結果；前批 [制服查找紀錄](docs/UNIFORM_RESEARCH.md) 保留校方來源，重建方法見 [制服與畢業後修正](docs/POST_GRADUATION_AND_UNIFORMS.md)。

## 如何遊玩

- 選出生年1980–2026；每次新開局產生種子，可在進階設定指定種子以重播。新人物依性別使用命名偏好與中性姓名池，孩子仍可自行取名。
- 自主決策前由家人安排生活；幼兒可選人際／健康年度重心，小學起開放學科與專長。
- 選年度目標後，逐項閱讀日期事件並作決定。自動播放按鈕只處理目前階段，可隨時暫停；問答、取名及背包過重會停下。
- 普通、音樂與體育升學、五科成績、社團、學費、學貸、住房、打工與職涯逐步開放。
- 人格問答影響後續故事，但不顯示類型結果。可以交往、成家、照顧孩子；同性伴侶依本作規則採簡化領養流程。
- 財務帳本保留年度帳目與摘要；人生年表保留完整歷史；物品欄可檢視課本、制服、卡片與回憶。
- 深色模式可切換。死亡可發生於任何年齡；有在世後代時，可在既有世界日期接續其人生。

## 階段劇情與機率 / Stage events

[各階段劇情盤點與流程圖](docs/STAGE_EVENTS.md) 分開說明固定排程、條件機率、種子輪替和玩家選擇，不把選項數誤當等機率劇情。

| 劇情池 | 幼兒 | 國小 | 國中 | 高中 | 大學 | 成年 | 熟齡 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 朋友故事模板 | 3 | 3 | 5 | 5 | 10 | 12 | 2 |

另有國小、國中、高中、大學、研究所、職場與升遷各16款人格故事，共112款短事件。它們由答案與情境決定，不是每款各6.25%隨機抽取。

```sh
node node_modules/vite-node/vite-node.mjs scripts/analysis/stage-audit.ts
```

可重建模板清單和合成排程樣本。詳見 [盤點JSON](docs/STAGE_EVENT_AUDIT.json)。

## 目前系統

| 領域 | 已接入 |
|---|---|
| 基礎 | seeded engine、D20、雙語UI、日期事件、年度回顧、自動播放、深色模式 |
| 出身 | 368區人口加權、生成姓名與原生家庭、住房／資產／照顧者 |
| 教育 | 國小／國中離線名錄、高中全市候選、會考等級、段考校排、大學多輪入學、研究所與師培情境 |
| 生活 | 分齡朋友、社團、人格事件、戀愛、相處、家庭旅行、住房及交通 |
| 職涯 | 19個兼職／全職範例、背景加成、升遷、失業、年終及5種創業 |
| 家庭 | 生育或領養準備、子女取名、照顧與就學支出、父母死亡紀錄 |
| 回憶 | 具重量的道具、檢視卡片、制服SVG、人生紀念卡 |
| 財務 | 家庭資助／自己花費／子女開銷、學貸本金、房貸本息及簡化年度結算 |

「已接入」不代表完整真實法規或官方招生模型。具體限制以各系統文件為準。

## 資料與限制 / Data boundaries

- **人口：2025年底戶籍人口快照**，共368區、23,299,132人；不是2026人口，也不是各出生年代的真實人口。
- **學校：115學年度快取**國小2,609、國中740、高中506筆。較早年代可用2026名稱作場景基準，不代表已查證該年開設。完整各校科別、性別限制、名額、區域與年度招生規則仍待補齊。
- 學測／分科部分2026日期有來源；其他排程、D20分數換算、校排、入學門檻及推薦為遊戲模型。
- 薪資、費用、事件風險、房價、房貸資格、稅保與退休等多為簡化估值。職涯資料不是即時職缺。
- 新角色40%同性傾向是使用者指定的遊戲設定，不是現實人口比例。領養不代表模擬完整法定資格、媒合或法院程序。
- 高中夏季制服圖庫保留506校名錄，100校／129款插畫；10校第三方文字與18校來源站示意圖重繪均待校方核對。另有593筆學校搜尋字典，涵蓋制服地圖562筆來源校名；未對應的87筆不直接加入高中分發。406校實樣仍待補，圖庫不再以通用制服填圖，圖示不印校名。國小女生保留黑色吊帶百褶裙，完整歷史款式尚未完成。
- 玩家死亡率目前只依年齡，尚未連動健康、理智或職業風險。自主公式實際產生3／4歲；舊說明的2–4歲範圍尚待規則修正。
- 完整臨床疾病／疫苗、法定稅保退休、軍事義務、農曆假日、投資、完整企業營運、遺產分配、Flutter仍待擴充。

政府開放資料的來源與授權留在資料檔及 [HISTORICAL_DATA.md](docs/HISTORICAL_DATA.md)。程式碼授權尚未指定；公開原始碼不等於已授予任意再利用權。

## 存檔 / Saves

每個操作以 IndexedDB 自動保存於目前瀏覽器／網址來源，只有一個自動存檔槽。切換瀏覽器、裝置或由 localhost 移到 GitHub Pages前，先匯出 JSON，再在新來源匯入。沒有雲端同步。

目前格式：`schemaVersion:7` / `slice-7` / `snapshot-2026-2`。支援1–6版明確遷移，保留已記錄身份、骰點、學籍及帳目；新增規則主要作用於後續決定。未知未來格式會拒絕讀入。新開局會取代本來源的自動存檔。

## 專案結構 / Structure

```text
apps/web/                 Vue UI、IndexedDB、本機插畫
packages/engine/src/      確定性引擎、指令、存檔驗證
packages/shared/src/      Domain types、雙語文字格式
packages/world-data/      來源快取、學校／人口／職涯字典
scripts/data-import/      開放資料匯入工具
scripts/analysis/         劇情與機率盤點工具
tests/                    引擎與Vue測試
docs/                     設計、系統、來源、範圍與盤點
```

UI 不自行擲模擬用亂數，引擎不依賴 Vue。新增功能需保留確定性與舊存檔相容。

## GitHub Pages

網站是靜態打包，使用相對資產路徑，支援專案子路徑。建立repo／推送不等於已發布網站。CI會在push／PR測試與打包；Pages部署需明確啟用。

要發布時：在 repo 的 **Settings → Pages → Source** 選 **GitHub Actions**，並設定 Actions repository variable `ENABLE_PAGES=true`，再手動執行workflow或推送main。啟用前請先確認網站公開範圍。沒有改用Node伺服器或付費服務。

## 文件索引

- [姓名與角色性別一致性](docs/NAME_GENERATION.md)

- [畢業後播放、收手求職與高中夏季制服](docs/POST_GRADUATION_AND_UNIFORMS.md)
- [目前實作與驗證紀錄](docs/IMPLEMENTATION_STATUS.md)
- [各階段劇情與觸發機率](docs/STAGE_EVENTS.md)
- [遊戲設計](docs/GAME_DESIGN.md)／[系統](docs/GAME_SYSTEMS.md)／[路線圖](docs/ROADMAP.md)
- [升學與獨立生活](docs/EDUCATION_AND_INDEPENDENCE.md)
- [職涯、家庭與歷史區](docs/LIFE_PROGRESSION.md)
- [階段、地區與回憶](docs/CHAPTERS_AND_MEMORIES.md)
- [播放、道具與領養](docs/PLAYBACK_AND_KEEPSAKE_REFINEMENTS.md)

English: a bilingual, Taiwan-based life-simulation text RPG built with Vue and a framework-independent deterministic TypeScript engine. Run `npm ci && npm run dev`; run `npm test` and `npm run build` before contributing. See the linked scope documents for verified data, game estimates, save compatibility and unfinished systems.

碩班到職涯、成年自動遊玩、家庭分開／子女照顧、壓力疲勞滿值恢復與多年目標節奏，見 [2026-11-12實作範圍](docs/GRADUATE_CAREER_AND_ADULT_LIFE.md)。
