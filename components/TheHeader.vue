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
              
              <div class="header__links text-lg-h6 ">
                <NuxtLink class="header__link text-decoration-none" to="/home">
                  Home page
                </NuxtLink>

                <NuxtLink class="header__link text-decoration-none" to="/test">
                  Test page
                </NuxtLink>
              </div>

              <v-spacer>
                
              </v-spacer>

              <div class="header__profile">
                <span style="color:#fff">Здесь профиль</span>
              </div>
          </div>
        </v-app-bar>  
</template>

<script>
export default {
    data() {
      return {

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

  .header__link {
    margin: 0 20px;
    color: #fff;
  }

</style>