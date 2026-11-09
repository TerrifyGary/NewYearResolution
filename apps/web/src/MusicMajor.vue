<script setup lang="ts">
import {instruments} from '../../../packages/engine/src/music';
import type {Instrument,Language,Person} from '../../../packages/shared/src/types';
defineProps<{person:Person;lang:Language;year:number}>();
const emit=defineEmits<{select:[major:Instrument]}>();
</script>
<template><div class="music-major"><label for="music-major">{{lang==='zh'?'主修樂器（選一種）':'Major instrument (choose one)'}}</label><select id="music-major" :value="person.musicTraining?.major??''" :disabled="person.musicTraining?.lastPaidYear===year" @change="emit('select',($event.target as HTMLSelectElement).value as Instrument)"><option disabled value="">{{lang==='zh'?'請選擇主修樂器':'Choose your major'}}</option><optgroup v-for="group in ['弦樂','管樂','打擊']" :key="group" :label="lang==='zh'?group:group==='弦樂'?'Strings':group==='管樂'?'Winds':'Percussion'"><option v-for="i in instruments.filter(i=>i[3]===group)" :key="i[0]" :value="i[0]">{{lang==='zh'?i[1]:i[2]}}</option></optgroup></select><small>{{lang==='zh'?'自購打擊樂器以馬林巴木琴為主。':'Purchased percussion centers on a marimba.'}}</small></div></template>
