<template>
  <div>
    <v-btn :disabled="!isAutosteerAllowed" @click="openSaveDialog" icon>
      <v-icon color="black" x-large>mdi-content-save</v-icon>
    </v-btn>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Save lines</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="name" ref="txtName" hint="Enter a name for future reference or keep the random name" clearable outlined label="Name"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import names from "../inc/names.js";
export default {  
  data() {
    return {
      name: '',
      dialog: false,
      isAutosteerAllowed: false
    };
  },
  methods: {
    openSaveDialog() {
      this.dialog = true;
      this.name = this.getRandomName();
      requestAnimationFrame(() =>{         
        this.$refs.txtName.focus();
      });
    },
    save(){
      this.$socket.client.emit("saveLines", this.name);
      this.dialog = false;
    },
    getRandomName(){
      return names[Math.floor(Math.random()*names.length)]
    }
  },
  sockets: {
      isAutosteerAllowed(isAutosteerAllowed){
      this.isAutosteerAllowed = isAutosteerAllowed;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>