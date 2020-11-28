<template>
  <v-container>
    <div v-if="!serverErrMsg && progressValue != 100" class="alert">
        <div v-if="allUserConnect">
            До начала игры осталось 
            <v-progress-circular
            :size="100"
            :width="10"
            :value="progressValue"
            color="blue-grey"
            >{{ countdownTimerSec }}</v-progress-circular>
        </div>
        <div v-else>
            Ждем остальных игроков
        </div>
    </div>
    <h1>Страница для тестов</h1>
    <h2>Socket IO status: <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span></h2>
    <h2>You room: <span>{{ roomIndex }}</span></h2>
    <v-alert type="error" v-if="serverErrMsg" style="position: fixed; top:40%; left:40%;">
        {{ serverErrMsg }}
    </v-alert> 
        <v-card
        outlined
        shaped
        class="mx-auto"
        v-if="!serverErrMsg && !textEnd"
        >
            <v-card-title class="d.flex justify-center align-center">
                <v-icon
                    dense
                    medium
                    class="px-1"
                >
                    mdi-timer
                </v-icon>
                Время {{ Timer }}
            </v-card-title>
        </v-card>  
    <v-row v-if="!serverErrMsg && !textEnd">
        <v-col>
            <div class="mainText">
                <span
                    v-for="(item, index) in message"
                    :key="index"
                    :index="index"
                    :class="[index == firstGreenNow ? 'greenW' : '', firstGreenNow > index ? 'passedW' : '', index > firstGreenNow ? 'blackW' : '']"
                >{{ item }}</span>
            </div>

        <span>Статистика</span>
        <div class="stat">
                <v-card
                    v-for="(value, name) in firstStats"
                    :key="name"
                    outlined
                    shaped
                    class="mx-auto"
                >
                    <v-card-title>
                    <v-icon
                        dense
                        medium
                        class="px-1"
                    >
                        {{
                        name == 'firstWPM' ? 'mdi-speedometer' :
                        name == 'firstAccuracy' ? 'mdi-checkbox-marked-circle-outline' : ''
                        }}
                    </v-icon>
                    {{
                        name == 'firstWPM' ? 'Скорость' :
                        name == 'firstAccuracy' ? 'Точность' : ''
                    }}
                    :
                    {{ value }} 
                    </v-card-title>
                </v-card>
            </div>
        </v-col>
        <v-col>

        <div class="mainText">
          <span
            v-for="(item, index) in message"
            :key="index"
            :index="index"
            :class="[index == secondGreenNow ? 'greenW' : '', secondGreenNow > index ? 'passedW' : '', index > secondGreenNow ? 'blackW' : '']"
          >{{ item }}</span>
        </div>
        <span>Статистика</span>
                <div class="stat">
                <v-card
                    v-for="(value, name) in secondStats"
                    :key="name"
                    outlined
                    shaped
                    class="mx-auto"
                >
                    <v-card-title>
                    <v-icon
                        dense
                        medium
                        class="px-1"
                    >
                        {{
                        name == 'secondWPM' ? 'mdi-speedometer' :
                        name == 'secondAccuracy' ? 'mdi-checkbox-marked-circle-outline' : ''
                        }}
                    </v-icon>
                    {{
                        name == 'secondWPM' ? 'Скорость' :
                        name == 'secondAccuracy' ? 'Точность' : ''
                    }}
                    :
                    {{ value }} 
                    </v-card-title>
                </v-card>
            </div>
        </v-col>
    </v-row>
    <v-row v-if="textEnd">
        Игра завершена <br />
        Победитель: {{ winnerUserName }} <br />
        WPM: {{ winnerWPM }} <br />
        Accuracy: {{ winnerAccuracy }} <br />
    </v-row>
  </v-container>
</template>
<script>
export default {
    layout: 'main_layout',
    sockets: {
            serverKey(data) {
                 if (this.textEnd == true) {
                    return
                }
                if (data.userName == this.userName) {
                    const greenNowSymbol = document.querySelectorAll('.greenW')[0] ? document.querySelectorAll('.greenW')[0] : document.querySelectorAll('.greenW')[1]
                        if (data.key === 'Shift' || data.key === 'Backspace' || data.key === 'Alt' || data.key === 'Ctrl' || data.key === 'CapsLock') {
                            return
                        } else if (greenNowSymbol.textContent === data.key) {
                            greenNowSymbol.classList.add('wpased')
                            this.firstGreenNow++
                        } else if (greenNowSymbol.textContent !== data.key) {
                            if (!greenNowSymbol.classList.contains('redW')) {
                            this.firstMisses++
                            this.firstStats.firstAccuracy <= 0 ? this.firstStats.firstAccuracy = 0 : this.firstStats.firstAccuracy = (this.firstStats.firstAccuracy - this.message.length / 100).toFixed(1)
                            greenNowSymbol.classList.add('redW')
                            }
                        }
                } else if (data.userName != this.userName) {
                    const greenNowSymbol = document.querySelectorAll('.greenW')[1] ? document.querySelectorAll('.greenW')[1] : document.querySelectorAll('.greenW')[0]
                        if (data.key === 'Shift' || data.key === 'Backspace' || data.key === 'Alt' || data.key === 'Ctrl' || data.key === 'CapsLock') {
                            return
                        } else if (greenNowSymbol.textContent === data.key) {
                            greenNowSymbol.classList.add('wpased')
                            this.secondGreenNow++
                        } else if (greenNowSymbol.textContent !== data.key) {
                            if (!greenNowSymbol.classList.contains('redW')) {
                            this.secondMisses++
                            this.secondStats.secondAccuracy <= 0 ? this.secondStats.secondAccuracy = 0 : this.secondStats.secondAccuracy = (this.secondStats.secondAccuracy - this.message.length / 100).toFixed(1)
                            greenNowSymbol.classList.add('redW')
                            }
                        }
                } 
                if (this.firstGreenNow == this.message.length) {
                    let winner = {}
                    let looser = {}
                    let room = this.roomIndex
                        winner.userName = this.userName
                        winner.WPM = this.firstStats.firstWPM
                        winner.Accuracy = this.firstStats.firstAccuracy
                        looser.WPM = this.secondStats.secondWPM
                        looser.Accuracy = this.secondStats.secondAccuracy
                    this.$socket.emit('gameEnd', 
                    {
                        winner,
                        looser,
                        room
                    })  
                    return
                } else if (this.secondGreenNow == this.message.length) {
                    let winner = {}
                    let looser = {}
                    let room = this.roomIndex
                        winner.userName = data.userName
                        winner.WPM = this.secondStats.secondWPM
                        winner.Accuracy = this.secondStats.secondAccuracy
                        looser.WPM = this.firstStats.firstWPM
                        looser.Accuracy = this.firstStats.firstAccuracy
                    this.$socket.emit('gameEnd', {
                        winner,
                        looser,
                        room
                    })
                    return
                }
            },
            serverErr(data)  {
                this.serverErrMsg = data
                setTimeout(() => {
                    this.$router.push('/testVS')
                }, 5000); 
            },
            gameStarted() {
                this.allUserConnect = true
                let timer = false
                if (!timer) {
				  timer = setInterval( () => {
						if (this.countdownTimerSec > 0) {
                            this.progressValue += 20
							 this.countdownTimerSec--
						} else {
                             clearInterval(timer)
                             this.start()
						}
                  }, 1000)
                }
            },
            gameWinner(winnerAndLooser) {
                if (this.userName == winnerAndLooser.winner.userName) {
                    this.$fire.database.ref(`/users/${this.uid}/results`).once('value')
                        .then( (data) => {
                                this.$fire.database.ref(`/users/${this.uid}/results`).update({
                                    gamePlayed: data.val().gamePlayed += 1
                                })
                                if (winnerAndLooser.winner.Accuracy > data.val().bestAcuuracy) {
                                    this.newRecordAcc = true
                                    this.$fire.database.ref(`/users/${this.uid}/results`).update({
                                        bestAcuuracy: winnerAndLooser.winner.Accuracy
                                    })
                                }
                                if (winnerAndLooser.winner.WPM > data.val().bestWpm) {
                                    this.newRecordWpm = true
                                    this.$fire.database.ref(`/users/${this.uid}/results`).update({
                                        bestWpm: winnerAndLooser.winner.WPM
                                    })
                                }
                        })
                } else {
                    this.$fire.database.ref(`/users/${this.uid}/results`).once('value')
                        .then( (data) => {
                                this.$fire.database.ref(`/users/${this.uid}/results`).update({
                                    gamePlayed: data.val().gamePlayed += 1
                                })
                                if (winnerAndLooser.looser.Accuracy > data.val().bestAcuuracy) {
                                    this.newRecordAcc = true
                                    this.$fire.database.ref(`/users/${this.uid}/results`).update({
                                        bestAcuuracy: winnerAndLooser.looser.Accuracy
                                    })
                                }
                                if (winnerAndLooser.looser.WPM > data.val().bestWpm) {
                                    this.newRecordWpm = true
                                    this.$fire.database.ref(`/users/${this.uid}/results`).update({
                                        bestWpm: winnerAndLooser.looser.WPM
                                    })
                                }
                        })
                }
                this.winnerUserName = winnerAndLooser.winner.userName
                this.winnerWPM = winnerAndLooser.winner.WPM
                this.winnerAccuracy = winnerAndLooser.winner.Accuracy
                this.stop()
                this.textEnd = true  
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
            countdownTimerSec: 5,
            progressValue: 0,
            allUserConnect: false,
            textEnd: false,
            firstStats: {
                firstWPM: 0,
                firstAccuracy: 100,
            },
            secondStats: {
                secondWPM: 0,
                secondAccuracy: 100
            },
            Timer: 0,
            timer: () => {
                this.Timer++
                this.firstStats.firstWPM = Math.round(this.firstGreenNow / (this.Timer / 60))
                this.secondStats.secondWPM = Math.round(this.secondGreenNow / (this.Timer / 60))
            },
            countdownTimer: '',
            winnerUserName: '',
            winnerWPM: '',
            winnerAccuracy: '',
            uid: ''
        }
    },
    methods: {
        keyPressed (key) {
            if (this.countdownTimerSec != 0) return
            const keyPressedNow = key.key
            const clientRoom = this.roomIndex
            this.$socket.emit('clientKeyPressed', {userPressed: this.userName, key: keyPressedNow, room: clientRoom})
        },
        start () {
            this.countdownTimer = setInterval(this.timer, 1000)
        },
        stop () {
            clearInterval(this.countdownTimer)
        },
    },
    async beforeMount() {
        await this.$fire.auth.onAuthStateChanged(user => {
            if (!user) {
            this.$router.push('/login')
            } else {
            this.uid = user.uid
                this.$fire.database.ref(`/users/${user.uid}/info`).once('value')
                    .then( (data) => {
                        this.userName = data.val().name
                        this.roomIndex = this.$route.query.roomNumber
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
    .alert {
        position: fixed;
        top: 0%;
        left: 0%;
        width: 100%;
        height: 100%;
        background-color: antiquewhite;
        z-index: 9999;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 25px;
    }

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
