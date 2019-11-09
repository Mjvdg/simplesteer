<template>
  <v-card class="ma-12">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-angle-acute</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Angle sensor</v-list-item-title>
          <v-list-item-subtitle>calibrate steering sensor</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-btn icon>
            <v-icon>mdi-help-circle-outline</v-icon>
          </v-btn>          
        </v-list-item-icon>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-form>
        <table>
          <tr>
            <th>current raw value:</th>
            <td>{{rawSteeringValue}}</td>
          </tr>
        </table>
        <v-container>
          <v-row v-for="(setting, name) in settings" v-bind:key="name">
            <v-col>
              <v-text-field
                :prepend-inner-icon="setting.icon"
                type="number"
                :label="setting.label"
                outlined
                required
                :rules="txtSteeringRules"
                :hint="setting.info"
                :loading="setting.averaging ? 'info' : false"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                x-large
                @mousedown="setting.averaging=true"
                @touchstart="setting.averaging=true"
                @mouseup="setting.averaging=false"
                @touchend="setting.averaging=false"
              >
                <v-icon>mdi-arrow-collapse-all</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-row justify="end" class="mr-3">
          <v-btn x-large color="primary">Save</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "steeringAngle",
  components: {},

  data() {
    return {
      rawSteeringValue: 123,
      txtSteeringRules: [
        v => !!v || "is required",
        v => (v > 0 && v < 1024) || "must be between 0 and 1024"
      ],
      settings: {
        maxLeft: {
          averaging: false,
          info:
            "Turn the steeringwheel completely to the left and enter the current raw value.",
          label: "Max left",
          icon: "mdi-arrow-collapse-left"
        },
        straigt: {
          averaging: false,
          info:
            "Set the steeringwheel straight and enter the current raw value.",
          label: "Straight",
          icon: "mdi-arrow-up"
        },
        maxRight: {
          averaging: false,
          info:
            "Turn the steeringwheel completely to the right and enter the current raw value.",
          label: "Max right",
          icon: "mdi-arrow-collapse-right"
        }
      }
    };
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
button.v-btn {
  &:focus::before,
  &:hover::before {
    background-color: white;
  }
}
</style>

