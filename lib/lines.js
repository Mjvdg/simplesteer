"use strict";
const State = require('./state');
const Calc = require('./Calc');
const DB = require('./db/Repo');
const sendMapLines = require('./socketIO-send').sendMapLines;
const turf = require('@turf/turf');
const getClosestLineNr = require('./getClosestLineNr');


const Lines = (() => {
    const createAndSend = () => {
        const pointA = State.pointA.location;
        const pointB = State.pointB.location;
        const currentLocation = State.gps.currentLocation;
        const abLineBearing = State.abLineBearing;
        const lineOffset = DB.getSettings().lineOffset;
        let closestLineNr = getClosestLineNr(currentLocation);
        
        State.lines.others = [];

        State.lines.closestLine = createLine(0);
        for (let i = 1; i < 2; i++) {
            State.lines.others.push(createLine(-i));
            State.lines.others.push(createLine(i));
        }

        function createLine(offset) {
            const offsetPointA = Calc.coord(pointA, abLineBearing - 90, ((-closestLineNr + offset) * DB.getSettings().machineWidth / 100)+lineOffset);
            const offsetPointB = Calc.coord(pointB, abLineBearing - 90, ((-closestLineNr + offset) * DB.getSettings().machineWidth / 100)+lineOffset);
            const [extendedA, extendedB] = extend(offsetPointA, offsetPointB);
            return [
                extendedA,
                extendedB
            ];
        }
        sendMapLines();
    }

    function extend(pointA, pointB) {
        let a = turf.point([pointA.longitude, pointA.latitude]);
        let b = turf.point([pointB.longitude, pointB.latitude]);

        let bearing = turf.rhumbBearing(a, b);
        let options = { units: 'kilometers' };
        let extendedB = turf.rhumbDestination(b, 1, bearing, options);
        let extendedA = turf.rhumbDestination(a, 1, bearing - 180, options);
        return [
            [pointA.longitude, pointA.latitude],
            [pointB.longitude, pointB.latitude]
        ];
        return [extendedA.geometry.coordinates, extendedB.geometry.coordinates];
    }

    return {
        createAndSend,
    }
})()


//module.exports = createAndSendLines;
module.exports = Lines;




// calculate crosstrackdistance between current location and abline
// devide that crosstrackdistance by machinewidth
// round that solution to an integer
// draw line with offset from AB line that is integer*machinewidth