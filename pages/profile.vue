<template>
  <v-container>
    <h1 v-if="userName.length > 0">Профиль пользователя {{userName}}</h1>
    <v-row>
      <v-col class="text-lg-h6">
        Твои лучшие результаты:
      </v-col>
      <v-col
      v-for="(value, name) in stats"
      :key="name"
      class="px-2"
      >
        <v-icon
          dense
          medium
          class="pa-2"
        >
          {{
            name == 'bestWPM' ? 'mdi-speedometer' :
            name == 'bestTime' ? 'mdi-timer' :
            name == 'bestAccuracy' ? 'mdi-checkbox-marked-circle-outline' : ''
          }}
        </v-icon>
        {{
          name == 'bestWPM' ? 'Скорость' :
          name == 'bestTime' ? 'Время' :
          name == 'bestAccuracy' ? 'Точность' : ''
        }}
        :
        {{ value }}
      </v-col>
    </v-row>
  </v-container>
  
</template>
<script>
export default {
  layout: 'main_layout',
  async mounted() {
      let uid = '';
      await this.$fire.auth.onAuthStateChanged(user => {
        if (!user) {
          this.$router.push('/login')
        } else {
           uid = user.uid
          this.$fire.database.ref(`/users/${uid}/info`).once('value')
            .then( (data) => {
              this.userName = data.val().name
          })
          this.$fire.database.ref(`/users/${uid}/results`).once('value')
            .then( (data) => {
              this.stats.bestAccuracy = data.val().bestAcuuracy
              this.stats.bestWPM = data.val().bestWpm
              this.stats.bestTime = data.val().bestTime
          })
        }
      })
      await this.$nextTick(async () => {
        this.$nuxt.$loading.start()
        setTimeout(() => this.$nuxt.$loading.finish(), 1000)
      })
  },
  data() {
    return {
      userName: '',
      stats: {
        bestAccuracy: 0,
        bestWPM: 0,
        bestTime: 0,
      },

    }
  }
}
</script>

<style scoped>

</style>
