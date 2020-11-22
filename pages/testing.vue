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
            connection() {
                console.log('Client say: socket connected')
            },
            keyPressedFromServer(data) {
                console.log(data)
                const greenNowSymbol = document.querySelectorAll('.greenW')[0]
                if (data === 'Shift' || data === 'Backspace') {
                    console.log('Нажат шифт или бакспейс')
                } else if (greenNowSymbol.textContent === data) {
                    greenNowSymbol.classList.add('wpased')
                    this.secondGreenNow++
                } else if (greenNowSymbol.textContent !== data) {
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
        }
    },
    methods: {
        keyPressed (key) {
            const keyPressedNow = key.key
            const clientRoom = this.clientRoom
            const greenNowSymbol = document.querySelectorAll('.greenW')[1]
            this.$socket.emit('keyPressedOnServer', {key: keyPressedNow, room: clientRoom})
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
        
    },
    mounted() {
        this.$socket.emit('userConnected')
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
