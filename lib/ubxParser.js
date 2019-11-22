'use strict';
//5.14.6 UBX-NAV-HPPOSLLH (0x01 0x14)
const ubxHighPrecisionParser = (() => {
  function parse(message) {
    let hex = message.toString('hex');
    if (hex.startsWith('b562')) {
      getData(message);
    } else if (hex.startsWith('b5620107')) {
      console.log('UBX-NAV-PVT: ' + hex);
    }
    else if (hex.startsWith('b5620501')) {
      console.log('UBX-ACK: ' + hex);
    }
    else if (hex.startsWith('b56205000200')) {
      let clsID = hex.substring(12, 14);
      let msgID = hex.substring(14, 16);
      console.log('UBX-NOT-ACK: ', clsID, msgID);
    }
    else {
      console.log('huh?: ' + hex);
    }
  }

  return {
    parse
  }
})();


function getData(data) {
  let ubxFrame = data;
  while (ubxFrame.length != 0) {
    if (ubxFrame.toString('hex').startsWith('b562')) {
      if (ubxFrame.toString('hex').startsWith('b56201075c')) { //ubxNavPvt
        console.log('hasNavPvtHeader')
        let navPvt;
        navPvt = ubxFrame.slice(0, 100);
        ubxFrame = ubxFrame.slice(100);
        if (isValid(navPvt)) {
          decodeNavPvt(navPvt);
        } else {
          console.error('invalid NavPvt');
        }
      } else if (ubxFrame.toString('hex').startsWith('b562011424')) { //ubxNAV-HPPOSLLH
        console.log('hasNAV-HPPOSLLHHeader');
        let hpposllh;
        hpposllh = ubxFrame.slice(0, 114);
        ubxFrame = ubxFrame.slice(114);
        if (isValid(hpposllh)) {
          decodeHPPOSLLH(hpposllh);
        } else {
          console.error('invalid hpposllh: ' + hpposllh.toString('hex'));
        }
      } else if (ubxFrame.toString('hex').startsWith('b56205010200')) { // UBX-ACK-ACK
        let ack;
        ack = ubxFrame.slice(0, 10);
        ubxFrame = ubxFrame.slice(10);
        if (isValid(ack)) {
          console.log('ack: ' + JSON.stringify(decodeAck(ack)));
        } else {
          console.error('invalid Ack');
        }
      } else {
        console.error('unknown ubx message: ' + ubxFrame.toString('hex'));
        ubxFrame = Buffer.from('');
      }
    } else {
      console.log('invalid start of ubxFrame: ' + ubxFrame.toString('hex'));
      ubxFrame = Buffer.from('');
    }
  }
}

function decodeNavPvt(ubxFrame) {
  //console.log('valid NavPvt')
}

function isValid(ubxFrame) {
  let providedChecksum = ubxFrame.slice(-2);
  let toCheck = ubxFrame.slice(2, -2);
  let calculatedChecksum = calcUbxChecksum(toCheck);
  return (
    providedChecksum[0] === calculatedChecksum[0] &&
    providedChecksum[1] === calculatedChecksum[1]
  );
}

function encapsulate(message) {
  let head = Buffer.from('b562');
  let checksum = calcUbxChecksum(message);
  return Buffer.concat([head, message, checksum]);
}
function calcUbxChecksum(message) {
  let ck_a = 0;
  let ck_b = 0;

  for (let i = 0; i < message.length; i++) {
    ck_a = ck_a + message[i];
    ck_b = ck_b + ck_a;
    ck_a = ck_a & 0xff
    ck_b = ck_b & 0xff
  }

  return Buffer.from([ck_a, ck_b]);
}
function decodeAck(ubxFrame) {
  let payload = ubxFrame.slice(6, -2);
  let ackMsg = {};
  ackMsg.clsID = payload.readUInt8();
  ackMsg.msgID = payload.readUInt8(1);
  return ackMsg;
}
function decodeHPPOSLLH(ubxFrame) {
  let payload = ubxFrame.slice(6, -2);
  let hpposllhMsg = {};
  hpposllhMsg.version = payload.readUInt8();
  hpposllhMsg.iTOW = payload.readInt32LE(4);
  hpposllhMsg.lonLp = payload.readUInt32LE(8) * 1e-7;
  hpposllhMsg.latLp = payload.readUInt32LE(12) * 1e-7;
  hpposllhMsg.height = payload.readUInt32LE(16);
  hpposllhMsg.hMSL = payload.readUInt32LE(20);
  hpposllhMsg.lonHp = payload.readIntLE(24, 1) * 1e-9;
  hpposllhMsg.latHp = payload.readIntLE(25, 1) * 1e-9;
  hpposllhMsg.heightHp = payload.readIntLE(26, 1) * 0.1;
  hpposllhMsg.hMSLHp = payload.readIntLE(27, 1) * 0.1;
  hpposllhMsg.hAcc = payload.readInt32LE(28);
  hpposllhMsg.vAcc = payload.readInt32LE(32);
  hpposllhMsg.lat = hpposllhMsg.latHp + hpposllhMsg.latLp;
  hpposllhMsg.lon = hpposllhMsg.lonHp + hpposllhMsg.lonLp;
  return hpposllhMsg;
}


module.exports = ubxHighPrecisionParser;

