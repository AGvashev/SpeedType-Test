<template>
  <v-container>
    <v-dialog
      v-model="startModal"
      persistent
      max-width="600"
    >
      <v-card class="blue lighten-5">
        <v-card-title class="headline mx-auto" style="width:85%;">
          Нажимай на кнопку и начинай печатать!
        </v-card-title>
        <v-card-text>
          После нажатия на кнопку, начинай печатать. Старайся допускать наименьшее колличество ошибок
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="green lighten-4"
            class="mx-auto"
            elevation="2"
            @click="startModal = false"
          >
            Начать.
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row v-if="!textEnd">
      <v-col>
        <div class="mainText">
          <span
            v-for="(item, index) in message"
            :key="index"
            :index="index"
            :class="[index == greenNow ? 'greenW' : '', greenNow > index ? 'passedW' : '', index > greenNow ? 'blackW' : '']"
          >{{ item }}</span>
        </div>
      </v-col>
      <v-col>
        <div class="stat">
          <v-card
            v-for="(value, name) in stats"
            :key="name"
            outlined
            shaped
            class="mx-auto"
            max-width="300"
          >
            <v-card-title>
              <v-icon
                dense
                medium
                class="px-1"
              >
                {{
                  name == 'WPM' ? 'mdi-speedometer' :
                  name == 'Timer' ? 'mdi-timer' :
                  name == 'Accuracy' ? 'mdi-checkbox-marked-circle-outline' : ''
                }}
              </v-icon>
              {{
                name == 'WPM' ? 'Скорость' :
                name == 'Timer' ? 'Время' :
                name == 'Accuracy' ? 'Точность' : ''
              }}
              :
              {{ value }}
            </v-card-title>
          </v-card>
            <v-btn
              elevation="2"
              class="my-2"
              @click="newTest"
            >
              Начать заного
            </v-btn>
        </div>
        
      </v-col>
    </v-row>
    <v-row v-if="textEnd">
      <v-row>
        <v-alert
          v-if="userAuth == false"
          type="warning"
        >Войди в аккаунт, для того что бы твои результаты сохранились</v-alert>
      </v-row>
      <v-row>
        <span class="text-lg-h6">Отлично! Твои результаты:</span>
        <v-card 
        v-for="(value, name) in stats"
        :key="name"
        class="mx-2 px-2"
        >

        <div class="overline colontintul" v-if="newRecordWpm">
            {{
              name == 'WPM' ? 'Новый рекород!' : ''
            }}
        </div>

        <div class="overline colontintul" v-if="newRecordWpm">
          {{
            name == 'Timer' ? 'Новый рекород!' : ''
          }}
        </div>

        <div class="overline colontintul" v-if="newRecordAcc">
            {{
              name == 'Accuracy' ? 'Новый рекород!' : ''
            }}
        </div>

          <v-icon
            dense
            medium
            class="mx-2 pa-2"
          >
            {{
              name == 'WPM' ? 'mdi-speedometer' :
              name == 'Timer' ? 'mdi-timer' :
              name == 'Accuracy' ? 'mdi-checkbox-marked-circle-outline' : ''
            }}
          </v-icon>
          {{
            name == 'WPM' ? 'Скорость' :
            name == 'Timer' ? 'Время' :
            name == 'Accuracy' ? 'Точность' : ''
          }}
          :
          {{ value }}
        </v-card>
            <v-btn
              elevation="2"
              class="my-2"
              @click="newTest"
            >
              Начать заного
            </v-btn>
      </v-row>
      
    </v-row>
  </v-container>
</template>
<script>

export default {
  layout: 'main_layout',
  data () {
    return {
      message: 'Lorem, ipsum dolor',
      greenNow: 0,
      misses: 0,
      stats: {
        WPM: 0,
        Timer: 0,
        Accuracy: 100
      },
      newRecordAcc: false,
      newRecordWpm: false,
      newRecordTime: false,
      timer: () => {
        this.stats.Timer++
        this.stats.WPM = Math.round(this.greenNow / (this.stats.Timer / 60))
      },
      startModal: true,
      endModal: false,
      textEnd: false,
      userAuth: false,
    }
  },
  methods: {
    newTest () {
      window.location.reload(true)
    },
    start () {
      const Timer = setInterval(this.timer, 1000)
    },
    stop () {
      clearInterval(this.Timer)
    },
    keyPressed (key) {
      const greenNowSymbol = document.querySelector('.greenW')
      const keyPressedNow = key.key
      if (this.textEnd == true) {
          return
      }
      if (this.startModal == true) {
        if (keyPressedNow == 'Enter') {
          return this.startModal = false
        }
        return
      }
      if (keyPressedNow === 'Shift' || keyPressedNow === 'Backspace') {
      } else if (greenNowSymbol.textContent === keyPressedNow) {
        if (this.greenNow === 0) {
          this.start()
        }
        greenNowSymbol.classList.add('wpased')
        this.greenNow++
        if (this.greenNow === (this.message.length)) {
          this.stop()
          this.textEnd = true
          if (this.userAuth == true) {
            const uid = this.$fire.auth.currentUser.uid
            this.$fire.database.ref(`/users/${uid}/results`).once('value')
              .then( (data) => {
                if (data.val() == null) {
                  this.$fire.database.ref(`/users/${uid}/results`).set({
                      gamePlayed: 1,
                      bestWpm: this.stats.WPM ,
                      bestAcuuracy: this.stats.Accuracy,
                      bestTime: this.stats.Timer
                  })
                } else {
                      this.$fire.database.ref(`/users/${uid}/results`).update({
                          gamePlayed: data.val().gamePlayed += 1
                      })
                      if (this.stats.Accuracy > data.val().bestAcuuracy) {
                        this.newRecordAcc = true
                        this.$fire.database.ref(`/users/${uid}/results`).update({
                            bestAcuuracy: this.stats.Accuracy
                        })
                      }
                      if (this.stats.WPM > data.val().bestWpm) {
                        this.newRecordWpm = true
                        this.$fire.database.ref(`/users/${uid}/results`).update({
                            bestWpm: this.stats.WPM
                        })
                      }
                      if (this.stats.Timer < data.val().bestTime) {
                        this.newRecordTime = true
                        this.$fire.database.ref(`/users/${uid}/results`).update({
                            bestTime: this.stats.Timer
                        })
                      }
                }
            })
          }
                
        }
      } else if (greenNowSymbol.textContent !== keyPressedNow) {
        if (!greenNowSymbol.classList.contains('redW')) {
          this.misses++
          this.stats.Accuracy <= 0 ? this.stats.Accuracy = 0 : this.stats.Accuracy = (this.stats.Accuracy - this.message.length / 100).toFixed(1)
          greenNowSymbol.classList.add('redW')
        }
      }
    }
  },
  mounted () {
        window.addEventListener('keydown', this.keyPressed)
        this.$fire.auth.onAuthStateChanged(user => {
              if (!user) {
                console.log('Пользователь не авторизирован')
              } else {
                this.userAuth = true;
              }
          }) 
  },
  beforeDestroy () {
      window.removeEventListener('keydown', this.keyPressed)
  },
}
</script>

<style scoped>
.colontintul {
  position: absolute;
  top: -20px;
  left: 0;
}
        .mainText {
            width: 680px;
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
