<template>
  <ion-page id="main-content">
    <app-header></app-header>
    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ app.title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <div>
        <ion-card v-if="!loggedIn">
          <ion-card-header>
            <ion-card-title>SignIn</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-input label="CRM URL" v-model="espoUrl" ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Username" v-model="userInfo.username"></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="password" type="password" v-model="userInfo.password"></ion-input>
            </ion-item>
            <ion-button expand="full" @click="login()">Login</ion-button>
            <p>User: (token: {{ token }})</p>
            <div v-if="user">
              {{ user }}
            </div>
            <p>Metadata is: </p>
            <div v-if="metadata">
              {{ metadata.entityDefs }}
            </div>
            <ion-button expand="full" @click="getMetadata()">Get Metadata</ion-button>
      
          </ion-card-content>
        </ion-card>
        <ion-card v-else>
          <ion-card-header>
            <ion-card-title>Hi {{ user.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>You have access to:</p>
            <ul v-if="appSettings.tabList">
              <li v-for="(tab, index) in appSettings.tabList" :key="index">
                <router-link :to="{ name: 'Entity.list', params: { entity: tab }}">
                  {{ tab }}
                </router-link>
              </li>
            </ul>
          </ion-card-content>
        </ion-card>
        <ion-button expand="full" @click="loggedIn = !loggedIn">toggle login</ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { useAppStore } from '../store/app'

const app = useAppStore()
app.updateTitle('Home')

const loggedIn = ref(false);
const espoUrl = ref('http://espocrm.test');
const userInfo = ref({
  username: '',
  password: ''
});
const user = ref({});
const preferences = ref({});
const appSettings = ref({});
const token = ref('');
const metadata = ref({});

  setSavedToken()
  setSavedUser()
  setSavedPreferences()
  setSavedSettings()
  setAuthState()
  setSavedMetadata()


async function login () {
  const tokenString = btoa(`${userInfo.value.username}:${userInfo.value.password}`)
  await fetch(`${espoUrl.value}/api/v1/App/user`, {
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
      "Authorization": `Basic ${tokenString}`,
      "Espo-Authorization": `${tokenString}`,
      "Espo-Authorization-By-Token": "false",
      "Espo-Authorization-Create-Token-Secret": "true"
    }})
    .then(function(response) {
      return response.json()
    })
    .then((data) => {
      console.log(data)
      Preferences.set({
        key: 'token',
        value: data.token,
      });
      Preferences.set({
        key: 'user',
        value: JSON.stringify(data.user),
      });
      Preferences.set({
        key: 'preferences',
        value: JSON.stringify(data.preferences),
      });

      console.log(data.settings)
      Preferences.set({
        key: 'settings',
        value: JSON.stringify(data.settings),
      });
      Preferences.set({
        key: 'loggedIn',
        value: JSON.stringify(true),
      });
      
      setSavedToken()
      setSavedUser()
      setSavedPreferences()
      setSavedSettings()
      setAuthState()
    })
    .catch(console.error);
}
  async function setAuthState () {
    const authState = await Preferences.get({ key: 'loggedIn' })
    loggedIn.value = JSON.parse(authState.value)
  }
  async function setSavedMetadata () {
    const savedMetadata = await Preferences.get({ key: 'metadata' })
    metadata.value = JSON.parse(savedMetadata.value)
  }

  async function setSavedToken () {
    const savedToken = await Preferences.get({ key: 'token' })
    token.value = savedToken.value
  }
  async function setSavedUser () {
    const savedUser = await Preferences.get({ key: 'user' })
    user.value = JSON.parse(savedUser.value)
  }
  async function setSavedPreferences () {
    const savedPreferences = await Preferences.get({ key: 'preferences' })
    preferences.value = JSON.parse(savedPreferences.value)
  }
  async function setSavedSettings () {
    const savedSettings = await Preferences.get({ key: 'settings' })
    appSettings.value = JSON.parse(savedSettings.value)
  }

  async function getMetadata () {
    const espoToken = btoa(`${user.value.userName}:${token.value}`)
    await fetch(`${espoUrl.value}/api/v1/Metadata`, {
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
      Preferences.set({
        key: 'metadata',
        value: JSON.stringify(data),
      });
      setSavedMetadata()


    })
    .catch(console.error);
}

</script>

<style scoped>
</style>
