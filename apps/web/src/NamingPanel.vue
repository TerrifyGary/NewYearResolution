<script setup lang="ts">
import {computed,ref} from 'vue';
import {nameSuggestions,type World,type Language} from '../../../packages/engine/src';
const props=defineProps<{state:World;lang:Language;error:string}>();
const emit=defineEmits<{confirm:[name:string,parentId?:string]}>();
const name=ref(''),surnameParent=ref('');
const parents=computed(()=>props.state.people.filter(n=>child.value?.legalParentIds.includes(n.id)));
const child=computed(()=>props.state.people.find(n=>n.id===props.state.pendingChildId));
const l=(zh:string,en:string)=>props.lang==='zh'?zh:en;
</script>
<template>
 <div v-if="child" class="naming-panel">
  <p class="chapter-number">{{l('新生命 · 孩子的名字','NEW LIFE · A NAME')}}</p>
  <h1>{{l('想給孩子什麼名字？','What will you name your child?')}}</h1>
  <p class="narrative">{{l(`孩子隨姓「${child.name[0]}」。可以選一個建議名字，也可以自己取名。`,`The child's surname is ${child.name[0]}. Pick a suggestion or enter a given name.`)}}</p>
  <p class="child-gender">{{l('孩子性別：','Child gender: ')}}{{child.gender==='male'?l('男生','Boy'):l('女生','Girl')}}</p>
  <label for="surname-parent">{{l('孩子的姓氏','Child surname')}}</label><select id="surname-parent" v-model="surnameParent"><option value="">{{l('沿用預設姓氏','Keep the generated surname')}} {{child.name[0]}}</option><option v-for="parent in parents" :key="parent.id" :value="parent.id">{{parent.name}} · {{parent.name[0]}}</option></select><div class="name-suggestions"><button v-for="suggestion in nameSuggestions(state,child.id)" :key="suggestion" :aria-pressed="name===suggestion" @click="name=suggestion">{{(parents.find(n=>n.id===surnameParent)?.name[0]??child.name[0])+suggestion}}</button></div>
  <form class="name-form" @submit.prevent="emit('confirm',name,surnameParent||undefined)">
   <label for="child-name">{{l('名字（不含姓氏）','Given name (without surname)')}}</label>
   <input id="child-name" v-model="name" maxlength="40" autocomplete="off" required :placeholder="l('例如：以樂','For example: Yi-Le')">
   <p class="name-preview">{{l('姓名預覽','Full name')}}：{{(parents.find(n=>n.id===surnameParent)?.name[0]??child.name[0])}}{{name.trim()||'…'}}</p>
   <p v-if="error" role="alert" class="name-error">{{error}}</p>
   <button type="submit" class="primary">{{l('確認孩子的名字','Confirm your child’s name')}} →</button>
  </form>
 </div>
</template>
