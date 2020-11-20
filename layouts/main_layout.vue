<template>
  <div v-if="loader">
      <v-app>
          <TheHeader />
        <!-- Sizes your content based upon application components -->
        <v-main>
          <v-container fluid>
            <Nuxt />
          </v-container>
        </v-main>
        <v-footer app>
          <span>Это у нас футер</span>
        </v-footer>
      </v-app>
  </div>
</template>
<script>
export default {
  mounted() {
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
        this.loader = true
        setTimeout(() => this.$nuxt.$loading.finish(), 2000)
      })
  },
  data() {
    return {
    loader: false,
    }
  }
}
</script>
<style>
.container {
  width: 80%;
  margin: 0 auto;
}
</style>