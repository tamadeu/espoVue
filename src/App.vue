<template>
  <ion-app>
    <suspense>
      <component :is="route.meta.layoutComponent || 'div'">
          <ion-router-outlet></ion-router-outlet>
      </component>
    </suspense>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { Suspense } from 'vue';
const route = useRoute();
</script>
