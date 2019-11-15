<template>
  <v-card class="my-7 mx-auto">
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
      <v-form v-model="valid">
        <v-text-field
          v-model.number="antennaHeight"
          type="number"
          label="Antenna Height (cm)"
          hint="vertical distance from the ground to the gps antennes"
          outlined
        />
        <v-text-field
          v-model.number="antennaToFrontAxleDistance"
          type="number"
          label="antenna to front axle(cm)"
          hint="Distance between front axle and antenna's"
          :rules="txtMachineRules"
          outlined
        />
        <v-text-field
          v-model.number="maxSteeringAngle"
          type="number"
          label="Max steering angle (degrees)"
          hint="angle between straight and maximum steering"
          outlined
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :disabled="!valid"
        @click="save"
        x-large
        :color="savedEffect ? 'success' : 'primary'"
      >Save</v-btn>
    </v-card-actions>
    <v-snackbar color="success" top right v-model="savedEffect">
      <v-icon x-large>mdi-check-bold</v-icon>saved successfully!
      <v-btn dark text @click="savedEffect = false">X</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: "steeringMode",
  data() {
    return {
      valid: false,
      savedEffect: false,
      txtMachineRules: [
        v => !!v || "is required",
        v => v > 0 || "must be greater than 0"
      ],
      antennaHeight: undefined,
      antennaToFrontAxleDistance: undefined,
      maxSteeringAngle: undefined
    };
  },
  methods: {
    save() {
      this.$io.emit("saveMachineSettings", {
        antennaHeight: this.antennaHeight/100,
        antennaToFrontAxleDistance: this.antennaToFrontAxleDistance /100,
        maxSteeringAngle: this.maxSteeringAngle
      });
    }
  },
  mounted() {
    this.$io.emit("getMachineSettings");
  },
  watch: {
    savedEffect(val) {
      if (val) {
        setTimeout(() => {
          this.savedEffect = false;
        }, 2500);
      }
    }
  },
  sockets: {
    machineSettingsSaveSuccess() {
      this.savedEffect = true;
    },
    machineSettings({
      antennaHeight,
      antennaToFrontAxleDistance,
      maxSteeringAngle
    }) {
      this.antennaHeight = antennaHeight*100;
      this.antennaToFrontAxleDistance = antennaToFrontAxleDistance *100;
      this.maxSteeringAngle = maxSteeringAngle;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
