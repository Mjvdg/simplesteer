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
        thumb-label="always"
        prepend-icon="mdi-flash"
        append-icon="mdi-turtle"
        step="0.1"
        min="0.1"
        max="10"
      ></v-slider>
      <v-subheader class="pl-0">minimum distance (cm)</v-subheader>
      <v-slider
        thumb-label="always"
        prepend-icon="mdi-flash"
        append-icon="mdi-turtle"
        step="1"
        min="10"
        max="200"
      ></v-slider>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      
    };
  }
};
</script>

<style scoped>
</style>