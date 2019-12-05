<template>
  <v-card class="my-2 mx-auto">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-cards-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Modus</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-radio-group v-model="mode">
        <v-radio label="Straight AB lines" value="straightABlines"></v-radio>
        <v-radio label="Curved AB lines" value="curvedABlines"></v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
  
    };
  },
  computed: {
    mode: {
      get(){
        return this.$store.state.settings.mode;
      },
      set(value){
        this.$socket.client.emit('modeChanged', value);
        this.$store.commit('changeMode', value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>