<template>
  <app-menu></app-menu>
  <slot></slot>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences';
import { useAppStore } from '@/store/app'

const app = useAppStore()


const loggedIn = ref(false);
const user = ref({});
const preferences = ref({});
const token = ref('');
const metadata = ref({});

  setSavedToken()
  setSavedUser()
  setSavedPreferences()
  setSavedSettings()
  setAuthState()
  setSavedMetadata()

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
    app.updateSettings(JSON.parse(savedSettings.value))
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
} */
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