<template>
    <ion-menu content-id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-title>Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding" v-if="app.settings.tabList">
          <template v-for="(tab, index) in app.settings.tabList" :key="index">
    
            <ion-item button :router-link="{ name: 'Entity.list', params: { entity: tab }}">
              <ion-label>{{ tab }}</ion-label>
            </ion-item>
          </template>
        </ion-content>
    </ion-menu>
</template>
<script setup lang="ts">
import { IonItem, IonLabel, IonMenu, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { useAppStore } from '../store/app'

const app = useAppStore()

</script>
