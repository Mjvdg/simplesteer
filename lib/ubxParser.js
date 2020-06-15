'use strict';
//5.14.6 UBX-NAV-HPPOSLLH (0x01 0x14)

const ubxHighPrecisionParser = (() => (message) => getData(message))();


function getData(data) {
  let ubxFrame = data;
  let responses = [];
  while (ubxFrame.length != 0) {
    if (ubxFrame.toString('hex').startsWith('b562')) {
      if (ubxFrame.toString('hex').startsWith('b56201075c')) { //ubxNavPvt
        let navPvt;
        navPvt = ubxFrame.slice(0, 100);
        ubxFrame = ubxFrame.slice(100);
        if (isValid(navPvt)) {
          responses.push(decodeNavPvt(navPvt));
        } else {
          console.error('invalid NavPvt');
        }
      } else if (ubxFrame.toString('hex').startsWith('b562011424')) { //ubxNAV-HPPOSLLH
        let hpposllh;
        hpposllh = ubxFrame.slice(0, 114);
        ubxFrame = ubxFrame.slice(114);
        if (isValid(hpposllh)) {
          console.log(decodeHPPOSLLH(hpposllh));
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
  return responses;
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
  hpposllhMsg.hMSL = payload.readInt32LE(20);
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

function decodeNavPvt(ubxFrame) {
  let payload = ubxFrame.slice(6, -2);
  let pvtMsg = {};
  pvtMsg.iTow = payload.readUInt32LE();
  pvtMsg.year = payload.readUInt16LE(4);
  pvtMsg.month = payload.readUInt8(6);
  pvtMsg.day = payload.readUInt8(7);
  pvtMsg.hour = payload.readUInt8(8);
  pvtMsg.min = payload.readUInt8(9);
  pvtMsg.sec = payload.readUInt8(10);
  pvtMsg.valid = decodeValid(payload.readUInt8(11));
  pvtMsg.tAcc = payload.readUInt32LE(12);
  pvtMsg.nano = payload.readInt32LE(16);
  pvtMsg.fixType = decodeFixType(payload.readUInt8(20));
  pvtMsg.flags = decodeFlags(payload.readUInt8(21));
  pvtMsg.flags2 = decodeFlags2(payload.readUInt8(22));
  pvtMsg.numSV = payload.readUInt8(23);
  pvtMsg.lon = payload.readInt32LE(24) * 1e-7;
  pvtMsg.lat = payload.readInt32LE(28) * 1e-7;
  pvtMsg.height = payload.readInt32LE(32);
  pvtMsg.hMSL = payload.readInt32LE(36);
  pvtMsg.hAcc = payload.readUInt32LE(40);
  pvtMsg.vAcc = payload.readUInt32LE(44);
  pvtMsg.velN = payload.readInt32LE(48);
  pvtMsg.velE = payload.readInt32LE(52);
  pvtMsg.velD = payload.readInt32LE(56);
  pvtMsg.gSpeed = payload.readInt32LE(60);
  pvtMsg.headMot = payload.readInt32LE(64) * 1e-5;
  pvtMsg.sAcc = payload.readUInt32LE(68);
  pvtMsg.headAcc = payload.readUInt32LE(72) * 1e-5;
  pvtMsg.pDOP = payload.readUInt16LE(76) * 0.01;
  pvtMsg.flags3 = { invalidLlh: (payload.readUInt8(78) & 0b1) === 1 };
  pvtMsg.headVeh = payload.readInt32LE(84) * 1e-5;
  pvtMsg.magDec = payload.readInt16LE(88) * 1e-2;
  pvtMsg.magAcc = payload.readUInt16LE(90) * 1e-2;
  return pvtMsg;

  function decodeFlags2(byte) {
    let flags = {};
    flags.confirmAvai = (byte & 0b100000) !== 0;
    flags.confirmedDate = (byte & 0b1000000) !== 0;
    flags.confirmedTime = (byte & 0b10000000) !== 0;
    return flags;
  }

  function decodeFlags(byte) {
    let flags = {};
    flags.gnssFixOk = (byte & 0b1) !== 0;
    flags.diffSoln = (byte & 0b10) !== 0;
    flags.psmState = byte & 0b11100;
    flags.headVehValid = (byte & 0b100000) !== 0;
    let carrSoln = (byte & 0b11000000) >>> 6;
    switch (carrSoln) {
      case 0:
        flags.carrSoln = '...'
        break;
      case 1:
        flags.carrSoln = 'Float';
        break;
      case 2:
        flags.carrSoln = 'Fix'
        break;
      default:
        flags.carrSoln = 'Error: ' + carrSoln;
        break;
    }

    return flags;
  }

  function decodeFixType(byte) {
    switch (byte) {
      case 0:
        return 'no fix';
      case 1:
        return 'dead reckoning only';
      case 2:
        return '2D-fix';
      case 3:
        return '3D-fix';
      case 4:
        return 'GNSS + dead reckoning combined';
      case 5:
        return 'time only fix';
    }
  }

  function decodeValid(byte) {
    let valid = {};
    valid.date = (byte & 0b1) !== 0;
    valid.time = (byte & 0b10) !== 0;
    valid.fullyResolved = (byte & 0b100) !== 0;
    valid.mag = (byte & 0b1000) !== 0;
    return valid;
  }
}
module.exports = ubxHighPrecisionParser;
