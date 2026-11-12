<script setup lang="ts">
import {immersive} from './presentation';
import {computed} from 'vue';
import {age,familyView,player,educationView,type Language,type World,type Text,type Person} from '../../../packages/engine/src';
import {jobs} from '../../../packages/world-data/src';
import {originFinances,householdBand} from '../../../packages/engine/src/housing';
const props=defineProps<{state:World;lang:Language}>();
const f=computed(()=>familyView(props.state)),p=computed(()=>player(props.state));
const band=computed(()=>householdBand(props.state));
const currentHome=computed(()=>props.state.housing.find(h=>h.householdId===p.value.householdId));
const finances=computed(()=>originFinances(props.state));
const money=(value:number|null|undefined)=>value==null?l('未建檔','Not recorded'):'NT$ '+value.toLocaleString();
const l=(zh:string,en:string)=>immersive(props.lang==='zh'?zh:en),text=(t:Text)=>immersive(t[props.lang]);
function fertility(n:Person){return !n.fertility.assessed?l('生育狀態：尚未評估','Fertility: not assessed'):n.fertility.profile==='reduced'?l('生育困難（未校準遊戲設定）','Fertility difficulty (uncalibrated game setting)'):l('評估未見預設困難（遊戲設定）','No preset difficulty (game assessment)');}
const personName=(id:string)=>props.state.people.find(n=>n.id===id)?.name??l('未記錄','Not recorded');
</script>
<template>
 <details class="family-overview">
  <summary><span>{{f.formed?l('我的家庭','My household'):l('原生家庭','Family of origin')}}</span><small>{{f.formed?f.partner?.name??l('與子女組成家庭','Family with children'):f.parents.map(n=>n.name).join('、')}}</small></summary>
  <div class="family-overview-body">
   <details v-if="p.life?.separations?.length"><summary>{{l('分開後的家庭照顧紀錄','Family care after separation')}}</summary><article v-for="record in p.life.separations" :key="record.date+record.formerPartnerId"><p>{{record.date}} · {{personName(record.formerPartnerId)}}</p><p v-for="plan in record.children" :key="plan.childId">{{personName(plan.childId)}} · {{l('主要照顧：','Primary caregiver: ')}}{{personName(plan.caregiverId)}} · {{l('每月扶養費：','Monthly support: ')}}{{money(plan.monthlySupport)}} · {{l('支付者：','Paid by: ')}}{{personName(plan.payerId)}}</p></article></details>
   <h3>{{text(f.name)}}</h3><p class="family-status">{{text(f.status)}}</p>
   <template v-if="f.formed"><div class="current-family-assets"><h3>{{l('目前家庭資產','Current household assets')}}</h3><p>{{l('家庭現金：','Household cash: ')}}{{money(f.members.filter(n=>n.alive).reduce((v,n)=>v+n.cash,0))}}</p><p>{{l('住宅：','Home: ')}}{{currentHome?.tenure==='owned'?l('自有住宅','Owned'):l('租屋','Rented')}} · {{money(currentHome?.value)}}</p><p>{{l('房貸餘額：','Mortgage: ')}}{{money(currentHome?.mortgage)}}</p><p>{{l('車輛：','Vehicles: ')}}{{p.life?.car?.owned?l('二手汽車','Used car'):''}} {{p.life?.scooter?.owned?l('機車','Scooter'):''}}</p></div>
    <div v-if="f.partner" class="family-member"><span>{{f.partner.gender==='female'?l('伴侶／妻子','Partner / wife'):l('伴侶','Partner')}}</span><b>{{f.partner.name}}</b><small>{{f.partner.alive?text(jobs[f.partner.job]):l('已故','Deceased')}}</small><small v-if="f.partner.alive">{{fertility(f.partner)}}</small></div>
    <p v-else class="small-note">{{l('尚無登記伴侶','No recorded partner')}}</p>
    <div v-for="child in f.children" :key="child.id" class="family-member"><span>{{l('子女','Child')}}</span><b>{{child.name}}</b><small>{{child.alive?l(`${age(state,child)} 歲`,`${age(state,child)} years old`):l('已故','Deceased')}}</small><small v-if="child.alive&&age(state,child)>=3">{{text(educationView(state,child).label)}}</small></div>
    <p v-if="!f.children.length" class="small-note">{{l('目前沒有子女','No children yet')}}</p>
    <p v-if="state.adoption?.parentIds.includes(p.id)" class="pregnancy-note">{{l('領養準備中 · 預計迎接日期','Adoption preparations · Planned arrival')}} {{state.adoption?.dueDate}}</p><p v-if="state.pregnancy?.parentIds.includes(p.id)" class="pregnancy-note">{{l('期待新生命 · 預產期估計','Expecting a child · Estimated due date')}} {{state.pregnancy.dueDate}}</p>
    <details class="origin-record"><summary>{{l('保留的原生家庭','Family-of-origin records')}}</summary><p v-for="parent in f.parents" :key="parent.id">{{parent.name}} · {{parent.alive?l('在世','Living'):l('已故','Deceased')}} <span v-if="!parent.alive">{{parent.deathDate}} · {{parent.deathCause?text(parent.deathCause):l('死因未建檔','Cause unrecorded')}}</span></p></details>
   </template>
   <template v-else>
    <div v-for="parent in f.parents" :key="parent.id" class="family-member"><span>{{(p.parentIds.length?parent.id===p.parentIds[0]:parent.gender==='male')?l('父親／家長','Father / parent'):l('母親／家長','Mother / parent')}}</span><b>{{parent.name}}</b><small>{{parent.alive?text(jobs[parent.job]):l('已故','Deceased')}}</small><small v-if="!parent.alive">{{parent.deathDate}} · {{parent.deathCause?text(parent.deathCause):l('死因未建檔','Cause unrecorded')}}</small><small>{{parent.householdId===p.householdId?l('同住家庭','Same household'):l('居住於其他家庭','Lives in another household')}}</small></div>
   </template>
   <section class="origin-finances"><p class="household-band">{{l('家庭狀況：','Family resources: ')}}{{lang==='zh'?band.zh:band.en}}</p><h3>{{l('原生家庭資產','Family-of-origin finances')}}</h3><dl><div><dt>{{l('現金','Cash')}}</dt><dd>{{money(finances.cash)}}</dd></div><div><dt>{{l('住宅狀態','Housing')}}</dt><dd>{{finances.home?.tenure==='owned'?l('自有住宅','Owned'):finances.home?.tenure==='rent'?l('租屋','Rented'):l('未建檔','Not recorded')}}</dd></div><div><dt>{{l('住宅估值','Property estimate')}}</dt><dd>{{money(finances.property)}}</dd></div><div><dt>{{l('房貸餘額','Mortgage')}}</dt><dd>{{finances.home?.tenure==='rent'?l('不適用','Not applicable'):finances.mortgage===0?l('已繳清','Paid off'):money(finances.mortgage)}}</dd></div><div><dt>{{l('其他欠債','Other debt')}}</dt><dd>{{money(finances.otherDebt)}}</dd></div><div><dt>{{l('總資產','Total assets')}}</dt><dd>{{money(finances.assets)}}</dd></div><div><dt>{{l('淨資產','Net worth')}}</dt><dd>{{money(finances.net)}}</dd></div></dl></section>
   
  </div>
 </details>
</template>
