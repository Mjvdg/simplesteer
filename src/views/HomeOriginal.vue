<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p>hoi</p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorldOriginal from '@/components/HelloWorldOriginal.vue'

export default {
  name: 'home',
  components: {
    HelloWorldOriginal
  }
}
</script>
