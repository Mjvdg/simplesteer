<template>
  <div>
    <v-btn icon @click="openDialog">
      <v-icon x-large color="black">mdi-folder-open</v-icon>
    </v-btn>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Open Field</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <template v-for="(field, index) in fields">
                <v-list-item :key="field.title">
                  <v-list-item-avatar>
                    <v-icon v-if="field.type==='straightABlines'">mdi-ab-testing</v-icon>
                    <v-icon v-if="field.type==='curvedABlines'">mdi-current-ac</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content @click="openField(field.id)">
                    <v-list-item-title v-text="field.name"></v-list-item-title>
                    <v-list-item-subtitle v-text="niceTime(field.id)"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="deleteField(field.id)">
                      <v-icon color="grey lighten-1">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider v-if="index + 1 < fields.length" :key="index"></v-divider>
              </template>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
const moment = require("moment");
export default {
  data() {
    return {
      dialog: false,
      fields: [
        {
          id: 0,
          name: "bij de molen",
          type: "straightABlines"
        }
      ]
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.$socket.client.emit("getFields");
    },
    niceTime(time) {
      return moment(time).fromNow();
    },
    openField(id) {
      this.$socket.client.emit("openField", id);
      this.dialog = false;
    },
    deleteField(id) {
      if(window.confirm("Do you really want to delete this?")){
        this.$socket.client.emit("deleteField", id);
      }
    }
  },
  computed: {},
  sockets: {
    fields(fields) {
      this.fields = fields;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>