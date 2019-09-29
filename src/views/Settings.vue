<template>
  <div>    
    <div class="flex">
      <router-link to="/"><img src="../assets/home-icon.svg" width="40"/></router-link>
      <h1>Settings</h1>
    </div>
    <input type="text">
    <ConnectionStatus />
  </div>
</template>

<script>
import ConnectionStatus from "@/components/ConnectionStatus.vue"
export default {
  name: 'settings',
  components: {
    ConnectionStatus,
  }
}
</script>

<style lang="scss" scoped>
  .flex{
    h1{
      margin: 0;
      width: 100%;
      text-align: center;
    }
    display: flex;
    justify-content: space-evenly;
  }
</style>

