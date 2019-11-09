<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn icon to="/">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <AngleSensor />
      <Machine />
      <TargetPoint />
      <Steering />
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
import AngleSensor from "@/components/settings/AngleSensor.vue";
import Machine from "@/components/settings/Machine.vue";
import TargetPoint from "@/components/settings/TargetPoint.vue";
import Steering from "@/components/settings/Steering.vue";
export default {
  name: "settings",
  components: {
    AngleSensor,
    Machine,
    TargetPoint,
    Steering
  }
};
</script>

<style lang="scss" scoped>
</style>


