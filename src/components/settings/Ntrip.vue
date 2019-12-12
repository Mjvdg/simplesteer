<template>
  <v-card class="my-7">
    <v-card-title>
      <v-list-item>
        <v-list-item-icon>
          <v-icon x-large>mdi-antenna</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="headline">Ntrip</v-list-item-title>
          <v-list-item-subtitle>Credentials for gps correction data</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field v-model="host" label="Host" outlined />
        <v-text-field v-model="username" label="Username" outlined autocomplete="off" />
        <v-text-field
          label="Password"
          outlined
          v-model="password"
          :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="hidePassword ? 'password' : 'text'"
          @click:append="() => (hidePassword = !hidePassword)"
        />
        <v-text-field v-model="mountpoint" label="Mountpoint" outlined />
        <v-text-field v-model="port" label="Port" outlined type="number" />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="save" x-large :color="'primary'">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      host: undefined,
      username: undefined,
      password: undefined,
      mountpoint: undefined,
      port: undefined,
      hidePassword: true
    };
  },
  methods: {
    save() {
      this.$io.emit("saveNtripSettings", {
        host: this.host,
        username: this.username,
        password: this.password,
        mountpoint: this.mountpoint,
        port: this.port
      });
    }
  },
  mounted () {
    this.$io.emit("getNtripSettings");
  },
  sockets: {
    ntripSettings({host, username, password, mountpoint, port}){
      this.host = host;
      this.username = username;
      this.password = password;
      this.mountpoint = mountpoint;
      this.port = port;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>