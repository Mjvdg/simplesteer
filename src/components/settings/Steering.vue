<template>
  <v-card class="ma-8">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-steering</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Steering</v-list-item-title>
          <v-list-item-subtitle>steering settings</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-radio-group v-model="steeringMode" row>
        <v-radio label="Hydraulic" value="hydraulic"></v-radio>
        <v-radio label="Motor on wheel" value="motorOnWheel"></v-radio>
      </v-radio-group>
      <div v-if="steeringMode === 'motorOnWheel'">
        <v-subheader class="pl-0">motor pwm</v-subheader>
        <v-slider
          hint="changes the speed of the electromotor"
          min="0"
          max="1024"
          thumb-label="always"
          append-icon="mdi-speedometer"
          prepend-icon="mdi-speedometer-slow"
        ></v-slider>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      steeringMode: "hydraulic"
    };
  }
};
</script>

<style scoped>
</style>