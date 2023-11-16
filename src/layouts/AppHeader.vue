<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ app.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

</template>
<script setup lang="ts">
import { IonButtons, IonMenuButton, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { useAppStore } from '../store/app'

const app = useAppStore()

</script>
