<template>
  <ion-page id="main-content">
    <app-header></app-header>
    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ app.title }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="layout">
        <ion-card v-for="(panel, i) in layout" :key="i">
          <ion-card-header>
            <ion-card-title>{{ panel.label }}</ion-card-title>
          </ion-card-header>
          <ion-grid>
            <ion-row v-for="(row, j) in panel.rows" :key="j" style="display:flex; justify-content:space-around">
              <ion-col v-for="(field, k) in row" :key="k">
                <suspense>
                  <component 
                    :is="getFieldComponent(fields[field.name].type)" 
                    :settings="fields[field.name]" 
                    v-model:modelValue="record[field.name]"
                    :name="field.name">
                  </component>
                </suspense>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card>
        <ion-button expand="full" @click="updateRecord(record.id, route.params?.entity)">update</ion-button>
      </div>
    </ion-content>
  </ion-page>

</template>

<script async setup lang="ts">
import { ref, Suspense, watch, computed, defineAsyncComponent } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonGrid, IonRow, IonCol } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonButton } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { useRoute } from 'vue-router';
import { useAppStore } from '../store/app'

const app = useAppStore()
app.updateTitle(`edit ${route.params.entity}`)


const route = useRoute()


const getFieldComponent = (componentName: string) =>
  defineAsyncComponent(
    () =>
      import(
        `../components/fields/${componentName[0].toUpperCase()}${componentName.substring(1)}Field.vue`
      ),
  );

  const espoUrl = ref('http://espocrm.test');
  const user = ref({
    userName: ''
  });

const record = ref({});
const layout = ref({});
const metadata = ref({});
const token = ref('');
const fields = computed(() => {
  return metadata.value.entityDefs[route.params.entity].fields
})

  await setSavedToken()
  await setSavedUser()
  await setSavedMetadata()
  await fetchRecord(route.params.id)
  await fetchRecordLayout(route.params.entity)

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
  async function setSavedMetadata () {
    const savedMetadata = await Preferences.get({ key: 'metadata' })
    metadata.value = JSON.parse(savedMetadata.value)
  }


async function updateRecord (id = route.params.id, record = route.params.entity) {
  const espoToken = btoa(`${user.value.userName}:${token.value}`)
  await fetch(`${espoUrl.value}/api/v1/${route.params.entity}/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include",
    headers: {
      "Accept": " */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7",
      "Connection": "keep-alive",
      "Content-Type": "application/json",
      "Host": `http://app.espocrm.test`,
      "Authorization": `Basic ${espoToken}`,
      "Espo-Authorization": `${espoToken}`,
      "Espo-Authorization-By-Token": "true",
      "Espo-Authorization-Create-Token-Secret": "false"
    },
    body: JSON.stringify(record)})
  .then(function(response) {
    return response.json()
  })
  .then((data) => {
    console.log(data)
    record.value = data
  })
  .catch(console.error);
}
async function fetchRecord (id = route.params.id, entity = route.params.entity) {
const espoToken = btoa(`${user.value.userName}:${token.value}`)
await fetch(`${espoUrl.value}/api/v1/${entity}/${id}`, {
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
