<template>
  <v-card class="my-7 mx-auto">
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
      <v-radio-group @change="sendModeChanged" v-model="mode" :mandatory="false">
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
      mode: 'straightABlines'
    };
  },
  methods: {
    sendModeChanged() {
      this.$store.commit('changeMode', this.mode);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>