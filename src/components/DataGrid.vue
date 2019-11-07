<template>
  <table>
    <tr>
      <th>XTD: </th>
      <td>{{crossTrackDistance}}cm</td>
    </tr>
    <tr>      
      <th>Speed: </th>
      <td>{{currentSpeed}}km/h</td>
    </tr>
    <tr v-bind:class="{disabled: currentLineNumber===undefined}">      
      <th>LineNr: </th>
      <td>{{currentLineNumber}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'dataGrid',
  data: function(){
    return {
      crossTrackDistance: 0,
      currentSpeed: 0,
      currentLineNumber: undefined
    }
  },
  sockets: {
    crossTrackDistance(data){
      this.crossTrackDistance = parseFloat(data.value).toFixed(2);
    },
    currentSpeed(data){
      this.currentSpeed = parseFloat(data).toFixed(2);
    },
    currentLineNumber(data){
      this.currentLineNumber = data;
    }
  }
}
</script>

<style lang="scss" scoped>
   th {
    text-align: left;
   }
   .disabled{
     color: gray;
   }
</style>
