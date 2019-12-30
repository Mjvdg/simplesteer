<template>
  <div class="app">
      <router-view/>
      <BaseConnectionStatus />
  </div>
</template>

<style lang="scss">
  // @import '/src/assets/css/normalize.css';

.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>