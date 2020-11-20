<template>
  <v-container>
    <h1>Настройки</h1>
    <div class="settings">
      <v-alert
      type="success"
      v-if="settingSave"
      >Изменения сохранены</v-alert>
      
      <v-alert
      type="error"
      v-if="imageUploaded"
      >Выбери изображение</v-alert>


      <div class="username__setting">
        Изменить имя:
        <v-text-field
        v-model="newUserName"
        label="Username"
        placeholder="Введи новое имя"
        :rules="usernameRules"
      ></v-text-field>
      <v-btn @click="this.changeUsername">
            <v-icon>mdi-check</v-icon>
          </v-btn>
      </div>

      <div class="image__setting py-5" >
        Изменить изображение:
          <v-file-input
            :rules="avatarUploadRules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            label="Avatar"
            id="photo"
          ></v-file-input>

          <v-btn @click="this.uploadImage">
            <v-icon>mdi-check</v-icon>
          </v-btn>
      </div>
    </div>
  </v-container>
</template>
<script>
export default {
  layout: 'main_layout',
  mounted() {
    this.$fire.auth.onAuthStateChanged(user => {
        if (!user) {
          this.$router.push('/login')
        }
    })  
  },
  data() {
    return {
      settingSave: false,
      newUserName: '',
      imageUploaded : false,
      avatarUploadRules: [
        v => !v || v.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      usernameRules: [
        v => (v && v.length >= 3) || 'Min 3 characters',
      ],
    }
  },
  methods: {
    uploadImage() {
      const uid = this.$fire.auth.currentUser.uid
      const file = document.querySelector('#photo').files[0]
      const avatarUrl = `/${uid}/avatar.png`
      if (!file) {
        this.imageUploaded = true;
        setTimeout(() => {
          this.imageUploaded = false
        }, 3000);
        return
      }
      this.$fire.storage.ref().child(avatarUrl).put(file)
        .then ( (img) => {
                this.$fire.database.ref(`/users/${uid}/info`).update({
                    avatarURL: avatarUrl
                })
                .then( ()=> {
                  this.settingSave = true;
                  setTimeout(() => {
                    this.settingSave = false;
                  }, 3000);
                })
        })
        .catch(err=>console.log('Ошибка' + err))
    },
    changeUsername() {
      const uid = this.$fire.auth.currentUser.uid
      this.$fire.database.ref(`/users/${uid}/info`).update({
          name: this.newUserName
      })
      .then( ()=> {
        this.settingSave = true;
        setTimeout(() => {
           this.settingSave = false;
        }, 3000);
      })
    }
  }
}
</script>

<style scoped>
.imageupload__input {
  outline:0;
  opacity:0;
  height:0;
  pointer-events:none;
  user-select:none
}

.label__image{
  width:100px;
  border:2px dashed grey;
  border-radius:5px;
  display:block;
  transition:border 300ms ease;
  cursor:pointer;
  text-align:center
}

.label__image__icon {
  display:block;
  font-size:32px;
}

.label__image__title {
  font-size: 15px;
}
</style>
