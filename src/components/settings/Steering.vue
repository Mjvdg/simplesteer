<template>
  <v-card class="my-7">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-steering</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Steering</v-list-item-title>
          <v-list-item-subtitle>Change steering behavior</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
       <v-divider></v-divider>
      <v-subheader class="pl-0">Tolerance: {{toleranceDegrees}}°</v-subheader>
      <v-slider v-model="toleranceDegrees" min="0" max="5" step="0.1">
        <v-icon slot="prepend" @click="toleranceDegrees-=0.1">mdi-flash</v-icon>
        <v-icon slot="append" @click="toleranceDegrees+=0.1">mdi-turtle</v-icon>
      </v-slider>
      <v-divider></v-divider>
      <v-radio-group label="Method" v-model="method">
        <v-radio label="Hydraulic" value="hydraulic"></v-radio>
        <v-radio label="Motor on wheel" value="motorOnWheel"></v-radio>
      </v-radio-group>
      <v-divider></v-divider>
      <v-radio-group label="Mode" v-model="mode">
        <v-radio label="simple" value="simple"></v-radio>
        <v-radio label="PID" value="pid"></v-radio>
      </v-radio-group>
      <div v-if="method === 'motorOnWheel'">
        <v-divider></v-divider>
        <v-subheader class="pl-0">Minimum motor pwm: {{minimumMotorPwm}}</v-subheader>
        <v-slider
          hint="changes the speed of the electric motor"
          min="0"
          max="255"
          v-model="minimumMotorPwm"
        >
          <v-icon slot="prepend" @click="minimumMotorPwm-=1">mdi-speedometer-slow</v-icon>
          <v-icon slot="append" @click="minimumMotorPwm+=1">mdi-speedometer</v-icon>
        </v-slider>

        <div class="d-flex justify-space-around">
          <v-btn
            x-large
            :disabled="$store.state.controls.autoSteer"
            icon
            @mousedown="turnLeftMinimumPwm"
            @touchstart="turnLeftMinimumPwm"
            @mouseup="stopTurning"
            @touchend="stopTurning"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            x-large
            :disabled="$store.state.controls.autoSteer"
            icon
            @mousedown="turnRightMinimumPwm"
            @touchstart="turnRightMinimumPwm"
            @mouseup="stopTurning"
            @touchend="stopTurning"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <v-divider></v-divider>
      </div>
      <div v-if="mode === 'pid'">
        <v-subheader class="pl-0">PID settings</v-subheader>
        <v-form v-model="valid" class="d-flex">
          <v-text-field
            v-model.number="pid.p"
            label="P"
            prepend-inner-icon="mdi-flash"
            outlined
            :rules="pidRules"
            hint="Aggressiveness"
            type="number"
          />
          <v-text-field
            :rules="pidRules"
            v-model.number="pid.d"
            prepend-inner-icon="mdi-turtle"
            hint="Dampening"
            label="D"
            outlined
            type="number"
          />
        </v-form>
         <v-divider></v-divider>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="!valid" @click="save" x-large :color="'primary'">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Steering",
  data() {
    return {
      valid: true,
      method: "hydraulic",
      mode: "simple",
      toleranceDegrees: undefined,
      motorPwm: undefined,
      minimumMotorPwm: undefined,
      pidRules: [v => v !== "" || "is required", v => v >= 0 || "must be >= 0"],
      pid: {
        p: undefined,
        d: undefined
      }
    };
  },
  mounted() {
    this.$io.emit("getSteeringSettings");
  },
  methods: {
    save() {
      this.$socket.client.emit("saveSteeringSettings", {
        method: this.method,
        mode: this.mode,
        pid: this.pid,
        toleranceDegrees: this.toleranceDegrees,
        minimumMotorPwm: this.minimumMotorPwm
      });
    },
    turnLeftMinimumPwm() {
      this.$socket.client.emit("turnLeftPwm", this.minimumMotorPwm);
    },
    turnRightMinimumPwm() {
      this.$socket.client.emit("turnRightPwm", this.minimumMotorPwm);
    },
    stopTurning() {
      this.$socket.client.emit("turnStop");
    }
  },
  sockets: {
    steeringSettings({ method, mode, pid, toleranceDegrees, minimumMotorPwm }) {
      this.method = method;
      this.mode = mode;
      this.pid = pid;
      this.toleranceDegrees = toleranceDegrees;
      this.minimumMotorPwm = minimumMotorPwm;
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
