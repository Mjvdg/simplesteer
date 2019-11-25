<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn icon to="/">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
    </v-app-bar>
    <v-content class="px-8">
      <div class="d-flex flex-wrap">
        <AngleSensor />
        <Machine />
      </div>
      <TargetPoint />
      <Steering />
      <SaveSettingsSuccess />
      <Ntrip />
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
import SaveSettingsSuccess from '@/components/settings/SaveSettingsSuccess.vue';
import Ntrip from '@/components/settings/Ntrip.vue';
export default {
  name: "settings",
  components: {
    AngleSensor,
    Machine,
    TargetPoint,
    Steering,
    SaveSettingsSuccess,
    Ntrip
  }
};
</script>

<style lang="scss" scoped>
</style>
