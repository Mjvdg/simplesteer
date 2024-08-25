<template>
  <v-snackbar class="snackbar" color="success" top right v-model="savedEffect">
    <v-icon x-large>mdi-check-bold</v-icon>saved successfully!
    <v-btn dark text @click="savedEffect = false">X</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      savedEffect: false
    };
  },
  watch: {
    savedEffect(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.savedEffect = false;
        }, 2500);
      }
    }
  },
  sockets: {
    saveSettingsSuccess() {
      this.savedEffect = true;
    }
  }
};
</script>

<style lang="scss" scoped>
  .snackbar{
    top: 65px;
  }
</style>