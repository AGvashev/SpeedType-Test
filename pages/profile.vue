<template>
  <v-container>
    <h1>Страница профиля в разработке</h1>
  </v-container>
  
</template>
<script>
export default {
  layout: 'main_layout',
  created() {
    let user = this.$fire.auth.currentUser
    if (!user) {
        console.log('Пользователь не вошел в систему')
        this.$router.push('/login')
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
