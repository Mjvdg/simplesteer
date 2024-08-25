const CurvedLineRecorder = (() => {
  let curvedLine = [];
  function add(position) {
    curvedLine.push(position);
  }
  function get() {
    return curvedLine;
  }
  function reset(){
    curvedLine = [];
  }
  return {
    add,
    get,
    reset
  }
})();

module.exports = CurvedLineRecorder;