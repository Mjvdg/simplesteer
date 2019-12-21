<template>
  <v-btn
    id="btn"
    @click="toggle"
    :color="this.isLongPress ? 'black' : (this.isRecording ? 'red' : 'primary')"
    elevation="0"
    outlined
    tile
    x-large
    v-long-press="2000"
    @long-press-start="onLongPressStart"
    @long-press-stop="onLongPressStop"
    >
    <v-icon x-large v-if="isRecording && !isLongPress">mdi-water</v-icon>
    <v-icon x-large v-if="!isRecording && !isLongPress">mdi-water-off</v-icon>
    <v-icon x-large v-if="isLongPress">mdi-close</v-icon>
  </v-btn>
</template>

<script>
import LongPress from "vue-directive-long-press";
export default {
  data() {
    return {
      isRecording: false,
      isLongPress: false
    };
  },
  directives: {
    "long-press": LongPress
  },
  methods: {
    toggle() {
      this.isRecording = !this.isRecording;
      this.$socket.client.emit("workIsRecording", this.isRecording);
    },
    onLongPressStart() {
      this.isLongPress = true;
      this.$socket.client.emit('clearRecordedWork');
    },
    onLongPressStop() {
      this.isLongPress = false;
      console.log('triggers on mouseup of document');
    }
  },
  sockets: {
    isWorkRecording(isRecording) {
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