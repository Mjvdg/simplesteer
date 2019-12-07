<template>
  <v-btn @click="toggle" :color="this.isRecording ? 'red' : 'primary'" elevation="0" outlined tile x-large>
    <v-icon x-large v-if="isRecording">mdi-stop-circle</v-icon>
    <v-icon x-large v-if="!isRecording">mdi-record-rec</v-icon>
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
      this.$socket.client.emit('curvedIsRecording', this.isRecording);
    }
  },
  sockets: {
    isRecordingStatus(isRecording){
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