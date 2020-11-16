<template>
      
        <v-app-bar 
          app
          prominent
          flat
          color="blue"
          class="rounded-b-xl container"
        >
          <div class="header__content">
              <v-img 
              :src="require('../assets/svg-editor-image.svg')"
              max-width="300px"
              ></v-img>
              
              <div class="header__links text-lg-h6">
                <NuxtLink class="text-decoration-none mx-5 white--text" to="/home">
                  Home page
                </NuxtLink>

                <NuxtLink class="text-decoration-none mx-5 white--text" to="/test">
                  Test page
                </NuxtLink>
              </div>

              <v-spacer></v-spacer>

          <v-hover>
            <v-menu
              v-model="showMenu"
              absolute
              offset-y
              style="max-width: 600px"
            > 
              <template v-slot:activator="{ on }">
                <v-card 
                class="rounded-xl text-lg-h6 white--text blue darken-2"
                v-on="on"
                >
                  <v-card-title class="pa-2">
                    <v-avatar
                    size="70"
                    >
                      <img
                        src="https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_episode/773/773-1553448700813-e68e026ee0a3.jpg"
                        alt="Eliot Anderson"
                      >
                    </v-avatar>
                    <span class="px-1">Eliot Anderson</span>
                  </v-card-title>
                </v-card>
              </template>

              <v-list>
                <v-list-item link>
                  <v-list-item-title>Профиль</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Настройки</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title>Выход</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-hover>

              

          </div>
        </v-app-bar>  
</template>

<script>
export default {
    data() {
      return {
        showMenu: false
      }
    }
}
</script>

<style scoped>
  .header__content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
  
</style>