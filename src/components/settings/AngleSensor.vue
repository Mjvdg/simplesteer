<template>
  <v-card class="my-7 mx-auto">
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
      <v-form v-model="valid">
        <table>
          <tr>
            <th>current raw value:</th>
            <td>{{rawSteeringValue}}</td>
          </tr>
        </table>
        <v-container>
          <v-row v-for="(setting, name) in settings" v-bind:key="name">
            <v-col cols="auto">
              <v-btn
                x-large
                @mousedown="setting.averaging=true"
                @touchstart="setting.averaging=true"
                @mouseup="setting.averaging=false"
                @touchend="setting.averaging=false"
                @touchend.prevent
              >
                <v-icon>mdi-arrow-collapse-all</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-text-field
                :prepend-inner-icon="setting.icon"
                type="number"
                :label="setting.label"
                outlined
                :rules="txtSteeringRules"
                :hint="setting.info"
                :loading="setting.averaging ? 'info' : false"
                v-model.number="setting.value"
              />
            </v-col>
          </v-row>
        </v-container>
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
import averageTracker from "@/inc/averageTracker";

export default {
  name: "angleSensor",
  components: {},

  data() {
    return {
      valid: false,
      rawSteeringValue: 123,
      savedEffect: false,
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
          icon: "mdi-arrow-collapse-left",
          value: undefined
        },
        straight: {
          averaging: false,
          info:
            "Set the steeringwheel straight and enter the current raw value.",
          label: "Straight",
          icon: "mdi-arrow-up",
          value: undefined
        },
        maxRight: {
          averaging: false,
          info:
            "Turn the steeringwheel completely to the right and enter the current raw value.",
          label: "Max right",
          icon: "mdi-arrow-collapse-right",
          value: undefined
        }
      }
    };
  },
  mounted() {
    this.$socket.emit("getAngleSensorSettings");
  },
  methods: {
    save() {
      this.$socket.emit("saveAngleSensorSettings", {
        maxLeft: this.settings.maxLeft.value,
        straight: this.settings.straight.value,
        maxRight: this.settings.maxRight.value
      });
    }
  },
  watch: {
    "settings.maxLeft.averaging": function(isMaxLeftAveraging) {
      if (!isMaxLeftAveraging) {
        if (!averageTracker.reset()) {
          this.settings.maxLeft.value = this.rawSteeringValue;
        }
      }
    },
    "settings.straight.averaging": function(isstraightAveraging) {
      if (!isstraightAveraging) {
        if (!averageTracker.reset()) {
          this.settings.straight.value = this.rawSteeringValue;
        }
      }
    },
    "settings.maxRight.averaging": function(ismaxRightAveraging) {
      if (!ismaxRightAveraging) {
        if (!averageTracker.reset()) {
          this.settings.maxRight.value = this.rawSteeringValue;
        }
      }
    },
    savedEffect(val) {
      if (val) {
        setTimeout(() => {
          this.savedEffect = false;
        }, 2500);
      }
    }
  },
  sockets: {
    angleSensorSaveSuccess() {
      this.savedEffect = true;
    },
    angleSensorSettings({ maxLeft, straight, maxRight }) {
      this.settings.maxLeft.value = maxLeft;
      this.settings.straight.value = straight;
      this.settings.maxRight.value = maxRight;
    },
    rawAngleSensorValue(data) {
      this.rawSteeringValue = data;
      if (this.settings.maxLeft.averaging) {
        averageTracker.addData(data);
        this.settings.maxLeft.value = Math.round(averageTracker.getAvg());
      }
      if (this.settings.straight.averaging) {
        averageTracker.addData(data);
        this.settings.straight.value = Math.round(averageTracker.getAvg());
      }
      if (this.settings.maxRight.averaging) {
        averageTracker.addData(data);
        this.settings.maxRight.value = Math.round(averageTracker.getAvg());
      }
    }
  }
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

