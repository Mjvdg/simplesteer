"use strict";
const State = require('./state');
const Calc2 = require('./Calc2');
const DB = require('./db/Repo');
const IoSend = require('./socketIO-send');
const getClosestLineNr = require('./getClosestLineNr');
const turf = require('@turf/turf');

const Lines = (() => {
    const createAndSend = () => {
        if (DB.getSettings().mode === 'straightABlines') {
            createAndSendStraight();
        }
        if (DB.getSettings().mode === 'curvedABlines') {
            createAndSendCurved();
        }
    }
    function createAndSendCurved() {
        const currentLocation = State.gps.currentLocation;
        const lineOffset = DB.getSettings().lineOffset;
        const closestLineNr = getClosestLineNr(currentLocation);

        State.curvedLines.others = [];
        State.curvedLines.closestLine = createLine(0);
        for (let i = 1; i < 2; i++) {
            State.curvedLines.others.push(createLine(-i));
            State.curvedLines.others.push(createLine(i));
        }

        function createLine(offset) {
            let line = turf.lineOffset(
                turf.lineString(State.curvedLines.abLine),
                (((-closestLineNr + offset) * DB.getSettings().machineWidth / 100) + lineOffset) / 1000
            ).geometry.coordinates;
            return line;
        }
        IoSend.sendMapCurvedLines();
    }

    function createAndSendStraight() {
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
            const offsetPointA = Calc2.coord(pointA, abLineBearing - 90, ((-closestLineNr + offset) * DB.getSettings().machineWidth / 100) + lineOffset);
            const offsetPointB = Calc2.coord(pointB, abLineBearing - 90, ((-closestLineNr + offset) * DB.getSettings().machineWidth / 100) + lineOffset);

            return [
                offsetPointA,
                offsetPointB
            ];
        }
        IoSend.sendMapLines();
    }

    return {
        createAndSend
    }
})()

module.exports = Lines;




// calculate crosstrackdistance between current location and abline
// devide that crosstrackdistance by machinewidth
// round that solution to an integer
// draw line with offset from AB line that is integer*machinewidth