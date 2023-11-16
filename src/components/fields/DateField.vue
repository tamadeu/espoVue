<template>
    <ion-input 
    type="date"
        :label="name"
        :value="modelValue"
        :required="settings.required ? 'required' : ''"
        @change="$emit('update:modelValue', $event.target.value)"
        label-placement="stacked" 
        fill="outline"
        ></ion-input>

</template>
  
<script setup lang="ts">
import { IonInput } from '@ionic/vue';

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
  