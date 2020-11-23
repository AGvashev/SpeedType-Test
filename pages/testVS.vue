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
    v-for="(el, i) in rooms"
    :key="el.roomName"
    class="py-2"
    >
        <v-col class="d-flex flex-column justify-center room">
            <div class="align-self-center">
                Комната "{{ el.roomName}}"
            </div>
    
            <v-btn v-if="el.userName == userName" class="align-self-end" @click="deleteRoom(i)">
                <v-icon>mdi-delete</v-icon>
            </v-btn>

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
                    <v-btn :disabled="playerJoined" v-if="!joinPlayerName" width="250px" @click="joinInRoom(i)">Войти</v-btn>
                    <div v-if="joinPlayerName" class="d-flex flex-column align-center">
                        {{ joinPlayerName }}
                        <v-img 
                        :src="joinPlayerImage" 
                        max-height="150"
                        max-width="150"
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
        userName: '',
        userImage: '',
        userAuth: false,
        roomName: '',
        rooms: [],
        roomError: false,
        joinPlayerName: '',
        joinPlayerImage: '',
        playerJoined: false,
    }
  },
  methods: {
      async createRoom() {
        this.$socket.emit('roomCreated', {
            userName: this.userName,
            userImage: this.userImage,
            roomName: this.roomName,
            userAuth: this.userAuth
        })
        this.roomName = ''
      },
      async joinInRoom(index) {
        this.$socket.emit('joinedInRoom', {
            joinedUserName: this.userName,
            joinedUserImage: this.userImage,
            roomIndex: index,
            userAuth: this.userAuth
        })

        // let userName = this.userName
        // let userImage = this.userImage
        // let roomIndex = index
        // if (userName == room.userName) {
        //     this.roomError = false
        //     this.roomError = true
        //     this.roomErrorText = 'Вы не можете войти в свою комнату'
        //     setTimeout(() => {
        //         this.roomError = false
        //         this.roomErrorText = ''
        //     }, 3000);
        //     return
        // }
        // this.$socket.emit('joinedInRoom', {roomIndex, userName, userImage})
        // room.enemyUserName = userName
        // room.enemyUserImage = userImage
        // this.playerJoined = true
      },
      deleteRoom(roomIndex) {
        this.$socket.emit('roomDelete', roomIndex)
      }
  },
  sockets: {
    roomsFromServer(rooms) {
        this.rooms = rooms
    },
    roomsCreateFromServer(room) {
       this.rooms.push(room)
    },
    roomsDeleteFromServer(roomIndex) {
        this.rooms.splice(roomIndex, 1)
    },
    deleteRoomFromServer(room) {
       this.rooms.push(room)
    },
    joinedRoomFromServer(data) {
        this.joinPlayerName = data.joinedUserName
        this.joinPlayerImage = data.joinedUserImage
    },
    errorFromServer(errText) {
        this.roomError = false
        this.roomError = true
        this.roomErrorText = errText
        setTimeout(() => {
            this.roomError = false
            this.roomErrorText = ''
        }, 3000);
        return
    }
  },
  async mounted() {
        await this.$fire.auth.onAuthStateChanged(user => {
            if (user) {
                this.userAuth = true
                const uid = this.$fire.auth.currentUser.uid
                this.$fire.database.ref(`/users/${uid}/info`).once('value')
                    .then( async (data) => {
                        this.userName = data.val().name
                        this.$fire.storage.ref(data.val().avatarURL).getDownloadURL()
                            .then( (img) => {
                                this.userImage = img
                            })
                })
            } else {
                this.userAuth = false
            }
        })
        this.$socket.emit('userConnectedInTestPVP', this.room)
  }
}
</script>

<style scoped>
    .room {
        border: 2px solid red;
        border-radius: 20px;
    }
</style>
