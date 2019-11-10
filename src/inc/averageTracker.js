const AverageTracker = (() => {
    let count = 0;
    let total = 0
    function addData(data){
        count++;
        total+=data;
    }
    function reset(){
        let success = (count != 0);
        count = 0;
        total = 0;
        return success;
    }
    function getAvg(){
        return total / count;
    }
    return {
        addData,
        reset,
        getAvg
    }
})();

module.exports = AverageTracker;