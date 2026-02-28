<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('settings', ['getSettings']),
    ...mapActions('tasks', ['getTasks'])
  },
  mounted() {
    this.getTasks()
    this.getSettings()
  }
}
</script>
