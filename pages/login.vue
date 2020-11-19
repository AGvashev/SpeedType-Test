<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >

      <v-alert
      type="error"
      v-if="err"
      >Неправильный email/пароль</v-alert>
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

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validate
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="gotoRegistration"
    >
      Зарегестрироваться
    </v-btn>
  </v-form>
</template>
<script>
export default {
  layout: 'main_layout',
  data() {
    return {
      err: false,
      valid: true,
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
   methods: {
      validate () {
        this.$refs.form.validate()
        this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
            .then(data => {
                this.$router.push('/home')
            })
            .catch(err => {
                console.log(err)
                this.err = true
                setTimeout(() => {
                  this.err = false
                }, 5000);
                
            })
      },
      gotoRegistration() {
        this.$router.push('/registration')
      }
    },
}
</script>

<style scoped>

</style>
