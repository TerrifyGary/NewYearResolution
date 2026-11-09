<script setup lang="ts">
import {sports} from '../../../packages/engine/src/sports';
import type {Person,Language,Sport} from '../../../packages/shared/src/types';
defineProps<{person:Person;lang:Language}>();const emit=defineEmits<{select:[sport:Sport]}>();
</script>
<template><div class="music-major"><label for="sport-major">{{lang==='zh'?'體育主項（選一種）':'Sport (choose one)'}}</label><select id="sport-major" :value="person.sport??''" @change="emit('select',($event.target as HTMLSelectElement).value as Sport)"><option disabled value="">{{lang==='zh'?'請選擇一種運動':'Choose one sport'}}</option><option v-for="sport in sports" :key="sport[0]" :value="sport[0]">{{sport[lang==='zh'?1:2]}}</option></select><small>{{lang==='zh'?'以此項目準備體育術科。':'Prepare this sport for assessment.'}}</small></div></template>
