<template>
    <!-- <select :value="modelValue"
    :required="settings.required ? 'required' : ''"
    @change="$emit('update:modelValue', $event.target.value)"
    >
    <option v-for="(option, idx) in settings.options" :key="idx">{{ option }}</option>
    </select> -->
    <ion-select 
        :label="name"
        :value="modelValue"
        :required="settings.required ? 'required' : ''"
        @input="$emit('update:modelValue', $event.target.value)"
        label-placement="stacked" 
        fill="outline"
    >
        <ion-select-option v-for="(option, idx) in settings.options" :key="idx" :value="option">{{ option }}</ion-select-option>
    </ion-select>

</template>
<script setup lang="ts">
import { IonSelect, IonSelectOption } from '@ionic/vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
        required: true
    },
    name: {
        type: String,
        default: '',
        required: true
    },
    settings: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:modelValue']);

</script>
  
<style scoped>
</style>
  