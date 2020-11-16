<template>
  <v-container>
    <v-row>
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
                color
                dense
                medium
              >
                {{
                  name == 'WPM' ? 'fas fa-tachometer-alt' :
                  name == 'Timer' ? 'far fa-clock' :
                  name == 'Accuracy' ? 'fas fa-percentage' : ''
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
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

export default {
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
      timer: () => {
        this.stats.Timer++
        this.stats.WPM = Math.round(this.greenNow / (this.stats.Timer / 60))
      },
      textEnd: false
    }
  },
  methods: {
    created () {
      window.addEventListener('keydown', this.keyPressed)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.keyPressed)
    },
    test: () => {
    },
    start () {
      this.timer = setInterval(this.timer, 1000)
    },
    stop () {
      clearInterval(this.timer)
    },
    keyPressed (key) {
      const greenNowSymbol = document.querySelector('.greenW')
      const keyPressedNow = key.key
      if (this.textEnd == true) {
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
          this.textEnd = true
          this.stop()
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
    this.created()
  }
}
</script>

<style scoped>
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
