<template>
  <v-app>
    
    <v-app-bar app color="primary" dark>
      <v-icon>mdi-arrow-left</v-icon>
      <v-toolbar-title>Settings</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <SteeringAngle />
      <SteeringMode />
    </v-content>
    <v-footer color="primary lighten-1" dark>
      <v-row justify="center">
        Matthijs Missiaen
        <a href="tel:+32495648902">+32 495 64 89 02</a>
      </v-row>
    </v-footer>
  </v-app>
</template>
<script>
import SteeringAngle from "@/components/settings/SteeringAngle.vue";
import SteeringMode from "@/components/settings/SteeringMode.vue";
export default {
  name: "settings",
  components: {
    SteeringAngle,
    SteeringMode
  }
};
</script>

<style lang="scss" scoped>
</style>


