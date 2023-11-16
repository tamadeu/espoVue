<template>
  <ion-page id="main-content">
    <app-header></app-header>
    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ app.title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card v-if="records">
      <ion-card-header>
        <ion-card-title>{{route.params.entity}} Index</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ul v-if="records">
          <li v-for="(record, index) in records" :key="index">
            <router-link :to="{ name: 'Entity.show', params: { id: record.id, entity: route.params.entity }}">
              {{ record.name }}
            </router-link>
          </li>
        </ul>
      </ion-card-content>
    </ion-card>
    <ion-button expand="full" router-link="/home">Home</ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { useRoute } from 'vue-router';
import { useAppStore } from '../store/app'

const app = useAppStore()
const route = useRoute()

app.updateTitle(`${route.params.entity} index`)


const espoUrl = ref('http://espocrm.test');
const user = ref({
  userName: ''
});
const records = ref([]);
const token = ref('');

onBeforeMount( async () => {
  await setSavedToken()
  await setSavedUser()
  await fetchRecords()
})


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

  async function fetchRecords () {
  const espoToken = btoa(`${user.value.userName}:${token.value}`)
  await fetch(`${espoUrl.value}/api/v1/${route.params.entity}`, {
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
      records.value = data.list
    })
    .catch(console.error);
}

</script>

<style scoped>
/* #container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
 */
#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
