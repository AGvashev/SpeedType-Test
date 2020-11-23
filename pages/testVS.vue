<template>
  <v-container>
    <v-alert
    type="error"
    v-if="roomError"
    >{{ roomErrorText }}</v-alert>
    <v-row justify="start">
        <v-col md="2"> 
            <v-btn :disabled="roomName == 0" @click="createRoom">Создать комнату</v-btn>
        </v-col>
        <v-col md="4"> 
            <v-text-field
                    label="Название комнаты"
                    v-model="roomName"
                    outlined
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row 
    v-for="el in rooms"
    :key="el.roomName"
    >
        <v-col class="d-flex flex-column justify-center room">
            <div class="room__title align-self-center">
                Комната "{{ el.roomName}}"
            </div>
            <div class="room__content d-flex flex-row justify-space-around align-center">
                <div class="d-flex flex-column align-center">
                    {{ el.userName }}
                    <v-img 
                    :src="el.userImage" 
                    max-height="150"
                    max-width="250"
                    alt="First player image">
                    </v-img>
                </div>
                <v-img 
                contain
                src="https://yt3.ggpht.com/a/AATXAJy9XRKwaLZC6tq5cpVuqMEGHZ2IuXK7WMxQkCOb=s900-c-k-c0xffffffff-no-rj-mo" 
                max-height="100"
                max-width="100"
                alt="Versus icon">
                </v-img>

                <div>
                    <v-btn v-if="!playerJoin" width="250px" @click="joinInRoom(el)">Войти</v-btn>
                    <div v-if="playerJoin" class="d-flex flex-column align-center">
                        {{ el.enemyUserName }}
                        <v-img 
                        :src="enemyUserImage" 
                        max-height="150"
                        max-width="250"
                        alt="First player image">
                        </v-img>
                    </div>
                </div>
            </div>
        </v-col>
    </v-row>
  </v-container>
  
</template>
<script>
export default {
  layout: 'main_layout',
  data() {
    return {
        userAuth: false,
        roomName: '',
        rooms: [],
        roomError: false,
        playerJoin: false,
        joinPlayerName: '',
        joinPlayerImage: ''
    }
  },
  methods: {
      async createRoom() {
        if (!this.userAuth) {
            this.roomError = false
            this.roomError = true
            this.roomErrorText = 'Вы не вошли в систему'
            setTimeout(() => {
                this.roomError = false
                this.roomErrorText = ''
            }, 3000);
            return
        }
        let userName = ''
        let userImage = ''
        const uid = this.$fire.auth.currentUser.uid
        await this.$fire.database.ref(`/users/${uid}/info`).once('value')
            .then( async (data) => {
            userName = data.val().name
            await this.$fire.storage.ref(data.val().avatarURL).getDownloadURL()
                .then( (img) => {
                    userImage = img
                })
        })
        this.rooms.forEach(async (element) => {
            if (userName == element.userName) {
                this.roomError = false
                this.roomError = true
                this.roomErrorText = 'Нельзя создать больше одной комнаты'
                setTimeout(() => {
                    this.roomError = false
                    this.roomErrorText = ''
                }, 3000);
                return
            }
            if (this.roomName == element.roomName) {
                this.roomError = false
                this.roomError = true
                this.roomErrorText = 'Название комнаты уже занято'
                setTimeout(() => {
                    this.roomError = false
                    this.roomErrorText = ''
                }, 3000);
                return
            } 
        });
        if (this.roomError) return
        let room = {
            roomName: this.roomName,
            userName,
            userImage
        }
        this.rooms.push(room)

        this.$socket.emit('roomCreated', room)
        this.roomName = ''
      },
      async joinInRoom(room) {
        if (!this.userAuth) {
            this.roomError = false
            this.roomError = true
            this.roomErrorText = 'Вы не вошли в систему'
            setTimeout(() => {
                this.roomError = false
                this.roomErrorText = ''
            }, 3000);
            return
        }
        let userName = ''
        let userImage = ''
        const uid = this.$fire.auth.currentUser.uid
        await this.$fire.database.ref(`/users/${uid}/info`).once('value')
            .then( async (data) => {
            userName = data.val().name
            await this.$fire.storage.ref(data.val().avatarURL).getDownloadURL()
                .then( (img) => {
                    userImage = img
                })
        })
        if (userName == room.userName) {
            this.roomError = false
            this.roomError = true
            this.roomErrorText = 'Вы не можете войти в свою комнату'
            setTimeout(() => {
                this.roomError = false
                this.roomErrorText = ''
            }, 3000);
            return
        }
        room.enemyUserName = userName
        room.enemyUserImage = userImage
        playerJoin = true
      }
  },
  sockets: {
    roomsFromServer(room) {
       this.rooms.push(room)
       console.log(this.rooms)
    }  
  },
  created() {
        this.$fire.auth.onAuthStateChanged(user => {
            user ? this.userAuth = true : this.userAuth = false
        })
  }
}
</script>

<style scoped>
    .room {
        border: 2px solid red;
        border-radius: 20px;
    }
</style>
