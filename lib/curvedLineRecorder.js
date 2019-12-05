

const CurvedLineRecorder = (() => {
  let curvedLine = [];
  function add(position) {
    curvedLine.push(position);
  }
  function get() {
    return curvedLine;
  }
  return {
    add,
    get
  }
})();

module.exports = CurvedLineRecorder;