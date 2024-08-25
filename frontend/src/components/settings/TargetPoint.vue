<template>
  <v-card class="my-7">
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
      <v-subheader class="pl-0">Time ahead: {{timeAheadSeconds}} sec</v-subheader>
      <v-slider v-model="timeAheadSeconds" step="0.1" min="0.1" max="10">
        <v-icon slot="prepend" v-ripple @click="timeAheadSeconds-=0.1">mdi-flash</v-icon>
        <v-icon slot="append" v-ripple @click="timeAheadSeconds+=0.1">mdi-turtle</v-icon>
      </v-slider>
      <v-subheader class="pl-0">Minimum distance: {{minimumDistance}} cm</v-subheader>
      <v-slider v-model="minimumDistance" step="1" min="10" max="200">
        <v-icon slot="prepend" v-ripple @click="minimumDistance-=1">mdi-flash</v-icon>
        <v-icon slot="append" v-ripple @click="minimumDistance+=1">mdi-turtle</v-icon>
      </v-slider>
      
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="save" x-large :color="'primary'">Save</v-btn>
    </v-card-actions>
    
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      timeAheadSeconds: undefined,
      minimumDistance: undefined
    };
  },
  methods: {
    save() {
      this.$socket.client.emit("saveTargetPointSettings", {
        timeAheadSeconds: this.timeAheadSeconds,
        minimumDistance: this.minimumDistance / 100
      });
    }
  },
  mounted() {
    this.$socket.client.emit("getTargetPointSettings");
  },
  sockets: {
    targetPointSettings({ timeAheadSeconds, minimumDistance }) {
      this.timeAheadSeconds = timeAheadSeconds;
      this.minimumDistance = minimumDistance * 100;
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