<template>
  <v-card class="my-7 mx-auto">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-raspberry-pi</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Raspberry Pi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-space-around">
        <v-btn class="mx-1" @click="restart" x-large>Restart</v-btn>
        <v-btn class="mx-1" @click="poweroff" x-large>Power off</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    restart() {
      if (confirm("Are you sure you want to restart?")) {
        this.$socket.client.emit("piRestart");
      }
    },
    poweroff() {
      if (confirm("Are you sure you want to Poweroff?")) {
        this.$socket.client.emit("piPoweroff");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>