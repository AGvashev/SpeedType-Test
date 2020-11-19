<template>
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="pressed"
  >

    <v-text-field
      v-model="userName"
      label="Username"
      required
    ></v-text-field>
    
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :counter="10"
      :rules="passwordRules"
      label="Password"
      required
    ></v-text-field>
    
    <v-text-field
      v-model="passwordRepeat"
      :counter="10"
      :rules="passwordRepeatRules"
      label="Password reapeat"
      required
    ></v-text-field>

    <v-btn
      color="error"
      class="mr-4"
      @click="registration"
    >
      Зарегестрироваться
    </v-btn>
  </v-form>
</template>
<script>
export default {
    layout: 'main_layout',
    mounted() {
      this.$fire.auth.onAuthStateChanged(user => {
        if (user) {
          this.$router.push('/profile')
        }
      })
    },
    data () {
        return { 
        valid: true,
        userName: '',
        password: '',
        passwordRepeat: '',
        passwordRules: [
            v => !!v || 'Password is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        passwordRepeatRules: [
            v => !!v || 'Password repeated is required',
            v => (v && v == this.password) || '!= Password ',
        ],
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
            }
    },
    methods: {
        async registration() {
            this.$refs.form.validate()
            try {
                const userName = this.userName
                await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)
                const uid = await this.$fire.auth.currentUser.uid
                this.$fire.database.ref(`/users/${uid}/info`).set({
                    name: userName,
                    avatarURL: 'default_avatar.png'
                })
                this.$router.push('/profile')
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
<style>
</style>
