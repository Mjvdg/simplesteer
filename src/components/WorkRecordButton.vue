<template>
  <v-btn @click="toggle" :color="this.isRecording ? 'red' : 'primary'" elevation="0" outlined tile x-large>
    <v-icon x-large v-if="isRecording">mdi-water</v-icon>
    <v-icon x-large v-if="!isRecording">mdi-water-off</v-icon>
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      isRecording: false
    };
  },
  methods: {
    toggle() {
      this.isRecording = !this.isRecording;
      this.$socket.client.emit('workIsRecording', this.isRecording);
    }
  },
  sockets: {
    isWorkRecording(isRecording){
      this.isRecording = isRecording;
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  height: 50px !important;
}
</style>