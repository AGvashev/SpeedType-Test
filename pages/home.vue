<template>
  <v-container>
    <h1>Главная страница в разработке</h1>
  </v-container>
  
</template>
<script>
export default {
  layout: 'main_layout',
  socket: {
    connect() {
      console.log('Client connected')
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
