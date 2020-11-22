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
                <NuxtLink class="text-decoration-none mx-5 white--text" to="/testing">
                  Crash test page
                </NuxtLink>
              </div>

              <v-spacer></v-spacer>

              <NuxtLink v-if="!loggedIn" class="text-decoration-none mx-5 white--text" to="/login">
                  Login or registration
              </NuxtLink>

              <v-hover v-if="loggedIn">
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
                            :src='userImage'
                            alt="Eliot Anderson"
                          >
                        </v-avatar>
                        <span class="px-1">{{ userName }}</span>
                      </v-card-title>
                    </v-card>
                  </template>

                  <v-list>
                    <v-list-item link>
                      <NuxtLink class="text-decoration-none black--text" to='/profile'>
                        <v-list-item-title>Профиль</v-list-item-title>
                      </NuxtLink>
                    </v-list-item>
                    <v-list-item link>
                      <NuxtLink class="text-decoration-none black--text" to='/settings'>
                      <v-list-item-title>Настройки</v-list-item-title>
                      </NuxtLink>
                    </v-list-item>
                    <v-list-item link @click='logout'>
                      <v-list-item-title>Выход</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-hover>

              

          </div>
        </v-app-bar>  
</template>

<script>
import Cookies from 'js-cookie'
export default {
    mounted() {
      this.setupFirebase()
    },
    data() {
      return {
        loggedIn: false,
        showMenu: false,
        userName: '',
        userImage: '',
      }
    },
    methods: {
      logout() {
        this.$fire.auth.signOut().then(() => {
          this.$router.push('/home')
        })
      },
      setupFirebase() {
        this.$fire.auth.onAuthStateChanged(user => {
          if (user) {
            console.log('Пользователь залогинился')
            this.loggedIn = true
            this.$fire.auth.currentUser.getIdToken(true)
              .then( token => {
                Cookies.set('access_token', token)
            })
            const uid = this.$fire.auth.currentUser.uid
            
            this.$fire.database.ref(`/users/${uid}/info`).once('value')
              .then( (data) => {
                this.userName = data.val().name
                this.$fire.storage.ref(data.val().avatarURL).getDownloadURL()
                  .then( (img) => {
                      this.userImage = img
                  })
            })

          } else {
            this.loggedIn = false
            Cookies.remove('access_token')
          }
        })
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