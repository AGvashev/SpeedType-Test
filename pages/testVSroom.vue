<template>
  <v-container>
    <h1>Страница для тестов</h1>
    <h2>Socket IO status: <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span></h2>
    <h2>You room: <span>{{ clientRoom }}</span></h2>
    <v-row>
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
    
    <v-btn
    elevation="2"
    @click="messageBtn"
    >Click me</v-btn>
    <Nuxt />
  </v-container>
</template>
<script>
export default {
    layout: 'main_layout',
    sockets: {
            serverKey(data) {
                console.log(data.key)
                console.log(document.querySelectorAll('.greenW'))
                const greenNowSymbol = document.querySelectorAll('.greenW')[0]
                if (data.key === 'Shift' || data.key === 'Backspace' || data.key === 'Alt' || data.key === 'Ctrl') {
                    console.log('Нажат шифт или бакспейс или альт или ктрл')
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
            serverMsg(data)  {
                console.log('I should be in room ' + data)
                console.log(data)
                return this.clientRoom = data
            }
    },
    data() {
        return {
            message: 'Lorem, ipsum dolor enemy',
            firstGreenNow: 0,
            firstMisses: 0,
            secondGreenNow: 0,
            secondMisses: 0,
            clientRoom: 0,
            roomIndex: '',
            userName: '',
        }
    },
    methods: {
        keyPressed (key) {
            const keyPressedNow = key.key
            const clientRoom = this.clientRoom
            const greenNowSymbol = document.querySelectorAll('.greenW')[1]
            this.$socket.emit('clientKeyPressed', {key: keyPressedNow, room: clientRoom})

            if (keyPressedNow === 'Shift' || keyPressedNow === 'Backspace') {
            } else if (greenNowSymbol.textContent === keyPressedNow) {
                greenNowSymbol.classList.add('wpased')
                this.firstGreenNow++
            } else if (greenNowSymbol.textContent !== keyPressedNow) {
                if (!greenNowSymbol.classList.contains('redW')) {
                this.firstMisses++
                greenNowSymbol.classList.add('redW')
                }
            }
        },
        messageBtn: function () {
            console.log(this.$socket)
        }
    },
    created() {
        if (!this.$route.query.roomIndex) {
            return this.$router.push('/testVS')
        }
        // Обращаться к серверу и по сокету и проверять, если пользователя нет в списке, то перенаправлять на testVS
        this.roomIndex = this.$route.query.roomIndex
        return this.roomIndex
    },
    mounted() {
        this.$socket.emit('userJoinRoom', this.roomIndex)
        window.addEventListener('keydown', this.keyPressed)
    },
    beforeDestroy () {
        this.$socket.emit('userDisconnect')
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
