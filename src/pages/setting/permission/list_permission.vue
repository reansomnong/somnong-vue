<script setup lang="ts">
import { ref } from 'vue';

export interface Item {
  id: number;
  name: string;
  checked: boolean
}

const props = defineProps<{
  items: Item[];
  selected: number[]    
}>();

const emit = defineEmits(['update:selected']);

const internalModel = ref(props.selected);
  
const selectedHandler = () => emit('update:selected', internalModel.value);

const toggleAll = ($event) => {
  internalModel.value = [];
  if ( ($event.target as HTMLInputElement).checked ) {
    props.items.map(item => internalModel.value.push(item.id));
  }
  emit('update:selected', internalModel.value);
};
</script>

<template>
  <label>
    <input type="checkbox" @change="toggleAll($event)" :checked="internalModel.length === items.length" />
    toggle all
  </label>
  <ul>
    <li v-for="item in items" :key="item.id">
      <label>
        <input type="checkbox" :value="item.id" v-model="internalModel" @change="selectedHandler(item.id)" :checked="item.checked"/>
        <span>{{ item.name }}</span>
      </label>
    </li>
  </ul>
  internalModel: {{ internalModel }}
</template>