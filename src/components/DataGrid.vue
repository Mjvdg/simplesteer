<template>
  <table>
    <tr>
      <th>XTD: </th>
      <td>{{crossTrackDistance}}cm</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'dataGrid',
  data: function(){
    return {
      crossTrackDistance: 0
    }
  },
  sockets: {
    crossTrackDistance(data){
      this.crossTrackDistance = parseFloat(data.value).toFixed(2);
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>
