<template>
  <v-card class="ma-8">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-target</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Target point</v-list-item-title>
          <v-list-item-subtitle>The point ahead to steer to</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-subheader class="pl-0">seconds ahead</v-subheader>
      <v-slider
        v-model="timeAheadSeconds"
        thumb-label="always"
        prepend-icon="mdi-flash"
        append-icon="mdi-turtle"
        step="0.1"
        min="0.1"
        max="10"
      ></v-slider>
      <v-subheader class="pl-0">minimum distance (cm)</v-subheader>
      <v-slider
        v-model="minimumDistance"
        thumb-label="always"
        prepend-icon="mdi-flash"
        append-icon="mdi-turtle"
        step="1"
        min="10"
        max="200"
      ></v-slider>
      <v-row justify="end" class="mr-3">
        <v-btn @click="save" x-large :color="'primary'">Save</v-btn>
      </v-row>
    </v-card-text>
    <v-snackbar color="success" top right v-model="savedEffect">
      <v-icon x-large>mdi-check-bold</v-icon>saved successfully!
      <v-btn dark text @click="savedEffect = false">X</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      savedEffect: false,
      timeAheadSeconds: undefined,
      minimumDistance: undefined
    };
  },
  methods: {
    save() {
      this.$socket.emit("saveTargetPointSettings", {
        timeAheadSeconds: this.timeAheadSeconds,
        minimumDistance: this.minimumDistance
      });
    }
  },
  mounted() {
    this.$socket.emit("getTargetPointSettings");
  },
  sockets: {
    targetPointSettings({ timeAheadSeconds, minimumDistance }) {
      this.timeAheadSeconds = timeAheadSeconds;
      this.minimumDistance = minimumDistance;
    },
    targetPointSettingsSaveSuccess() {
      this.savedEffect = true;
    }
  },
  watch: {
    savedEffect(val) {
      if (val) {
        setTimeout(() => {
          this.savedEffect = false;
        }, 2500);
      }
    }
  }
};
</script>

<style scoped>
</style>