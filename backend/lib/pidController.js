const DB = require('./db/Repo');
const Controller = require('node-pid-controller');

const PidController = (() => {
    let controller;
    
    function reset(){
        let pid = DB.getSteeringSettings().pid;

        controller = new Controller({
            k_p: pid.p,
            k_i: pid.i,
            k_d: pid.d
        });
    }
    return{
        reset,
        get: () => controller,
        setTarget(target){
            controller.setTarget(target);
        },
        update(currentValue){
            return controller.update(currentValue);
        }
    }
})();
module.exports = PidController;