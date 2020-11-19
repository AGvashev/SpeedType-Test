<template>
  <div>
    
    <main>
      
    </main>
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

}
</script>
<style>
.container {
  width: 80%;
  margin: 0 auto;
}
</style>