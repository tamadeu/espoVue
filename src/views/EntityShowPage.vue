<template>
  <ion-page id="main-content">
    <app-header></app-header>
    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ app.title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <div v-if="record">
        
        <ion-card v-for="(panel, i) in layout" :key="i">
          <ion-card-header>
            <ion-card-title>{{ panel.label }}</ion-card-title>
          </ion-card-header>
          <ion-grid>
            <ion-row v-for="(row, j) in panel.rows" :key="j" style="display:flex; justify-content:space-around">
              <ion-col v-for="(field, k) in row" :key="k">
                <label><strong> {{ field.name }}</strong></label> 
                <p v-html="record[field.name]"></p>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card>
        <router-link v-if="route.params.id && route.params.entity" :to="{ name: 'Entity.edit', params: { id: route.params.id, entity: route.params.entity }}">
          Edit
        </router-link>
      </div>
    </ion-content>
  </ion-page>

</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import {  IonGrid, IonRow, IonCol } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { useRoute } from 'vue-router';
import { useAppStore } from '../store/app'

const app = useAppStore()
const route = useRoute()


const espoUrl = ref('http://espocrm.test');
const user = ref({
  userName: ''
});
const record = ref({});
const layout = ref({});
const token = ref('');

onBeforeMount( async () => {
  await setSavedToken()
  await setSavedUser()
  await fetchRecord(route.params.id)
  await fetchRecordLayout(route.params.entity)
  await  app.updateTitle(record.value.name)

})

  watch(
      () => route.params.id,
      async newId => {
        if(newId != null) {
          record.value = await fetchRecord(newId)
        }
      }
  )


  async function setSavedToken () {
    const savedToken = await Preferences.get({ key: 'token' })
    token.value = savedToken.value
  }
  async function setSavedUser () {
    const savedUser = await Preferences.get({ key: 'user' })
    user.value = JSON.parse(savedUser.value)
  }
  // async function setSavedPreferences () {
  //   const savedPreferences = await Preferences.get({ key: 'preferences' })
  //   preferences.value = JSON.parse(savedPreferences.value)
  // }
  // async function setSavedSettings () {
  //   const savedSettings = await Preferences.get({ key: 'settings' })
  //   appSettings.value = JSON.parse(savedSettings.value)
  // }

async function fetchRecord (id = route.params.id) {
const espoToken = btoa(`${user.value.userName}:${token.value}`)
await fetch(`${espoUrl.value}/api/v1/${route.params.entity}/${id}`, {
  method: "GET", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "include",
  headers: {
    "Accept": " */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    // "Host": `${espoUrl.value}`,
    "Host": `http://app.espocrm.test`,
    "Authorization": `Basic ${espoToken}`,
    "Espo-Authorization": `${espoToken}`,
    "Espo-Authorization-By-Token": "true",
    "Espo-Authorization-Create-Token-Secret": "false"
  }})
  .then(function(response) {
    return response.json()
  })
  .then((data) => {
    console.log(data)
    record.value = data
  })
  .catch(console.error);
}
async function fetchRecordLayout (entity = route.params.entity) {
const espoToken = btoa(`${user.value.userName}:${token.value}`)
await fetch(`${espoUrl.value}/api/v1/${entity}/layout/detail`, {
  method: "GET", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "include",
  headers: {
    "Accept": " */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    // "Host": `${espoUrl.value}`,
    "Host": `http://app.espocrm.test`,
    "Authorization": `Basic ${espoToken}`,
    "Espo-Authorization": `${espoToken}`,
    "Espo-Authorization-By-Token": "true",
    "Espo-Authorization-Create-Token-Secret": "false"
  }})
  .then(function(response) {
    return response.json()
  })
  .then((data) => {
    console.log(data)
    layout.value = data
  })
  .catch(console.error);
}

</script>

<style scoped>

#container a {
  text-decoration: none;
}
</style>
