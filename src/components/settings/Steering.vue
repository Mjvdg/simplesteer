<template>
  <v-card class="my-7">
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
      <v-subheader class="pl-0">Tolerance: {{toleranceDegrees}}°</v-subheader>
      <v-slider v-model="toleranceDegrees" min="0" max="5" step="0.1">
        <v-icon slot="prepend" @click="toleranceDegrees-=0.1">mdi-flash</v-icon>
        <v-icon slot="append" @click="toleranceDegrees+=0.1">mdi-turtle</v-icon>
      </v-slider>

      <v-radio-group label="Method" v-model="method">
        <v-radio label="Hydraulic" value="hydraulic"></v-radio>
        <v-radio label="Motor on wheel" value="motorOnWheel"></v-radio>
      </v-radio-group>
      <div v-if="method === 'motorOnWheel'">
        <v-subheader class="pl-0">Motor pwm: {{motorPwm}}</v-subheader>
        <v-slider hint="changes the speed of the electromotor" min="0" max="255" v-model="motorPwm">
          <v-icon slot="prepend" @click="motorPwm-=1">mdi-speedometer-slow</v-icon>
          <v-icon slot="append" @click="motorPwm+=1">mdi-speedometer</v-icon>
        </v-slider>
      </div>
      <v-radio-group label="Mode" v-model="mode">
        <v-radio label="simple" value="simple"></v-radio>
        <v-radio label="PID" value="pid"></v-radio>
      </v-radio-group>
      <div v-if="method === 'motorOnWheel'">
        <v-subheader class="pl-0">Minimum motor pwm: {{minimumMotorPwm}}</v-subheader>
        <v-slider
          hint="changes the speed of the electromotor"
          min="0"
          max="255"
          v-model="minimumMotorPwm"
        >
          <v-icon slot="prepend" @click="minimumMotorPwm-=1">mdi-speedometer-slow</v-icon>
          <v-icon slot="append" @click="minimumMotorPwm+=1">mdi-speedometer</v-icon>
        </v-slider>
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
      pidRules: [v => v!=='' || "is required", v => v >= 0 || "must be >= 0"],
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
</style>