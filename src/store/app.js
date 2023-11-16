import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return { 
        settings: {},
        title: 'Espo Mobile app'
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    updateSettings(data) {
      this.settings = data;
    },
    updateTitle(title) {
      this.title = title;
    },

  },
})
