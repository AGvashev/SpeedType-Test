<template>
  <v-container>
    <h1>Страница профиля в разработке</h1>
  </v-container>
  
</template>
<script>
export default {
  layout: 'main_layout',
  mounted() {
      this.$fire.auth.onAuthStateChanged(user => {
        if (user) {
          this.$router.push('/profile')
        }
      })
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
