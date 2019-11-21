'use strict';
//5.14.6 UBX-NAV-HPPOSLLH (0x01 0x14)
const ubxHighPrecisionParser = (() => {
  function parse(message) {
    let hex = message.toString('hex');
    if (hex.startsWith('b5620114')) {
      getData(message);
    }else if(hex.startsWith('b5620107')){
      console.log('UBX-NAV-PVT');
    }else if(hex.startsWith('b5620501')){
      console.log('UBX-ACK: '+hex);
    }
    else if(hex.startsWith('b5620500')){
      console.log('UBX-NOT-ACK: '+hex);
    }
    else {
      console.log('huh?: ' + hex);
    }
  }

  return {
    parse
  }
})();


function getData(message) {
  if (!isValid(message)) {
    console.error('invalid message: ' + message.toString('hex'));
   // return;
  }
  if (Buffer.compare(message.slice(0, 6), Buffer.from('b56201142400', 'hex')) === 0) { //UBX-NAV-HPPOSLLH 
    let payload = message.slice(6, -2);
    console.log(decodeHPPOSLLH(payload));
  }else{
    console.log('wuut?')
  }
}


function isValid(message) {
  let checksum = message.slice(-2);
  let ck_a = 0;
  let ck_b = 0;
  let toCheck = message.slice(2, -2);

  for (let i = 0; i < toCheck.length; i++) {
    ck_a = ck_a + toCheck[i];
    ck_b = ck_b + ck_a;
    ck_a = ck_a & 0xff
    ck_b = ck_b & 0xff
  }
  return (checksum[0] === ck_a && checksum[1] === ck_b);
}

function getChecksum(message){
  let ck_a = 0;
  let ck_b = 0;
  let toCheck = message.slice(2, -2);

  for (let i = 0; i < toCheck.length; i++) {
    ck_a = ck_a + toCheck[i];
    ck_b = ck_b + ck_a;
    ck_a = ck_a & 0xff
    ck_b = ck_b & 0xff
  }

  return `${ck_a.toString(16)}${ck_b.toString(16)}`
}

function decodeHPPOSLLH(payload) {
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

