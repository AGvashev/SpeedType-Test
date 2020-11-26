<template>
  <v-container>
    <h1>Страница для тестов</h1>
    <h2>Socket IO status: <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span></h2>
    <h2>You room: <span>{{ roomIndex }}</span></h2>
    <v-alert type="error" v-if="serverErrMsg" style="position: fixed; top:40%; left:40%;">
        {{ serverErrMsg }}
    </v-alert>
    <v-row v-if="!serverErrMsg">
        <v-col>
            <div class="mainText">
            <span
                v-for="(item, index) in message"
                :key="index"
                :index="index"
                :class="[index == secondGreenNow ? 'greenW' : '', secondGreenNow > index ? 'passedW' : '', index > secondGreenNow ? 'blackW' : '']"
            >{{ item }}</span>
            </div>
        </v-col>
        <v-col>

        <div class="mainText">
          <span
            v-for="(item, index) in message"
            :key="index"
            :index="index"
            :class="[index == firstGreenNow ? 'greenW' : '', firstGreenNow > index ? 'passedW' : '', index > firstGreenNow ? 'blackW' : '']"
          >{{ item }}</span>
        </div>
        </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
    layout: 'main_layout',
    sockets: {
            serverKey(data) {
                const greenNowSymbol = document.querySelectorAll('.greenW')[0]
                if (data.key === 'Shift' || data.key === 'Backspace' || data.key === 'Alt' || data.key === 'Ctrl') {
                    return
                } else if (greenNowSymbol.textContent === data.key) {
                    greenNowSymbol.classList.add('wpased')
                    this.secondGreenNow++
                } else if (greenNowSymbol.textContent !== data.key) {
                    if (!greenNowSymbol.classList.contains('redW')) {
                    this.secondMisses++
                    greenNowSymbol.classList.add('redW')
                    }
                }
            },
            serverErr(data)  {
                this.serverErrMsg = data
                setTimeout(() => {
                    this.$router.push('/testVS')
                }, 5000); 
            }
    },
    data() {
        return {
            message: 'Lorem, ipsum dolor enemy',
            firstGreenNow: 0,
            firstMisses: 0,
            secondGreenNow: 0,
            secondMisses: 0,
            roomIndex: '',
            userName: '',
            serverErrMsg: '',
        }
    },
    methods: {
        keyPressed (key) {
            const keyPressedNow = key.key
            const clientRoom = this.roomIndex
            const greenNowSymbol = document.querySelectorAll('.greenW')[1]
            this.$socket.emit('clientKeyPressed', {key: keyPressedNow, room: clientRoom})

            if (keyPressedNow === 'Shift' || keyPressedNow === 'Backspace' || keyPressedNow === 'Alt' || keyPressedNow === 'Ctrl') {
                return
            } else if (greenNowSymbol.textContent === keyPressedNow) {
                greenNowSymbol.classList.add('wpased')
                this.firstGreenNow++
            } else if (greenNowSymbol.textContent !== keyPressedNow) {
                if (!greenNowSymbol.classList.contains('redW')) {
                this.firstMisses++
                greenNowSymbol.classList.add('redW')
                }
            }
        }
    },
    async beforeMount() {
        let uid = '';
        await this.$fire.auth.onAuthStateChanged(user => {
            if (!user) {
            this.$router.push('/login')
            } else {
            uid = user.uid
                this.$fire.database.ref(`/users/${uid}/info`).once('value')
                    .then( (data) => {
                        this.userName = data.val().name
                        this.roomIndex = this.$route.query.roomIndex
                        this.$socket.emit('userJoinRoom', {
                            roomIndex: this.roomIndex,
                            userName: this.userName
                        })
                    })
            }
            
        })

    },
    mounted() {
        window.addEventListener('keydown', this.keyPressed)
    },
    beforeDestroy () {
        this.$socket.emit('userDisconnect', this.roomIndex)
        this.$socket.emit('roomDestroy')
        window.removeEventListener('keydown', this.keyPressed)
    },
    
}
</script>

<style scoped>
    .mainText {
        width: 500px;
        height: 225px;
        overflow: hidden;
        float: left;
        margin-right: 45px;
        font-size: 21px;
        line-height: 32px;

        background-color: pink;
        padding: 10px;
        border-radius: 5px;
    }

    .blackW {
        color: #000;
    }

    .passedW {
        color: #5bc538;
    }

    .greenW {
        background-color: #5bc538;
        padding: 3px;
        border-radius: 3px;
        color: #fff;
    }

    .redW {
        background-color: #fc0000;
        padding: 3px;
        border-radius: 3px;
        color: #fff;
    }
</style>
