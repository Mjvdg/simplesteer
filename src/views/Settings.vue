<template>
  <div>    
    <div class="flex">
      <router-link to="/"><img src="../assets/home-icon.svg" width="40"/></router-link>
      <h1>Settings</h1>
    </div>
    <input type="text">

  </div>
</template>

<script>
export default {
  name: 'settings',
  components: {
    
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

