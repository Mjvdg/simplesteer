<template>
  <v-card class="ma-4">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-tractor</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Machine</v-list-item-title>
          <!-- <v-list-item-subtitle>tractor settings</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-text-field type="number" label="Antenna Height (cm)" />
      <v-text-field type="number" label="Distance between front axle and antenna's(cm)" />
      <v-text-field type="number" label="Max steering angle (degrees)"/>
      
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "steeringMode",
  data() {
    return {
     
    };
  }
};
</script>

<style scoped>
</style>
