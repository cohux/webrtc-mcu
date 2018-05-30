/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */

/**
 * 获取系统信息.
 * @private
 */

"use strict";

/**
 * Module dependencies.
 */
const childProcess = require("child_process");

/**
 * bash.
 * @private
 */
function processExec(cmd) {
  return new Promise(function(resolve, reject) {
    childProcess.exec(cmd, function(error, stdout, stderr) {
      if (error || stderr) {
        reject(error || stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * 获取流量信息.
 * @private
 */
function getNetByt(stdout) {
  let network = {};
  let compressedIndex = stdout.lastIndexOf("compressed");
  let data = stdout.substring(compressedIndex + 11, stdout.length - 1);
  let arr = data.split(/\n/);
  for (let v of arr) {
    let info = v.split(":");
    let name = info[0].replace(/\s/g, "");
    let math = info[1].match(/[\d.]+/g);
    network[name] = {
      receive: Number(math[0]),
      transmit: Number(math[8])
    };
  }
  return network;
}

/**
 * 获取监听列表.
 * @private
 */
function getListen(stdout) {
  let network = [];
  let info = stdout
    .split("Active Internet connections (only servers)")[1]
    .split("Active UNIX domain sockets (only servers)")[0];
  let data = info.split("PID/Program name")[1];
  let arr = data.slice(1, data.length - 1).split(/\n/g);
  for (let v of arr) {
    if (v.includes("LISTEN")) {
      let net = v.split(/[\s]+/g);
      network.push({
        protocol: net[0],
        port: Number(net[3].split(net[3].includes(":::") ? ":::" : ":")[1]),
        pid: Number(net[6].split("/")[0]),
        order: net[6].split("/")[1]
      });
    }
  }
  return network;
}

/**
 * 获取系统信息.
 * @private
 */
function getSystem (stdout) {
  let system = { cpu: {}, process: [] }
  let cpuInfo = stdout.match(/\%Cpu.*?st/g)[0].match(/[\d.]+/g)
  let proInfo = stdout.split("COMMAND")[1]
  let proArr = proInfo.slice(2, proInfo.length).split(/\n/g)
  system.cpu = {
    us: Number(cpuInfo[0]),
    sy: Number(cpuInfo[1]),
    ni: Number(cpuInfo[2]),
    id: Number(cpuInfo[3]),
    wa: Number(cpuInfo[4]),
    hi: Number(cpuInfo[5]),
    si: Number(cpuInfo[6]),
    st: Number(cpuInfo[7])
  }
  for (let v of proArr) {
    let i = v.split(/[\s]+/g)
    if (v.startsWith(" ")) {
      system.process.push({
        pid: Number(i[1]),
        user: i[2],
        pr: Number(i[3]),
        ni: Number(i[4]),
        virt: Number(i[5]),
        res: Number(i[6]),
        shr: Number(i[7]),
        s: i[8],
        cpu: Number(i[9]),
        mem: Number(i[10]),
        time: i[11],
        command: i[12]
      })
    } else {
      system.process.push({
        pid: Number(i[0]),
        user: i[1],
        pr: Number(i[2]),
        ni: Number(i[3]),
        virt: Number(i[4]),
        res: Number(i[5]),
        shr: Number(i[6]),
        s: i[7],
        cpu: Number(i[8]),
        mem: Number(i[9]),
        time: i[10],
        command: i[11]
      })
    }
  }
  return system
}

/**
 * 获取网络信息.
 * @private
 */
exports.getNetWork = function() {
  return new Promise(async function(resolve, reject) {
    try {
      let network = { flow: {}, listen: {} };
      network.listen = getListen(await processExec("netstat -npl"));
      let old = getNetByt(await processExec("cat /proc/net/dev"));
      setTimeout(async function() {
        let now = getNetByt(await processExec("cat /proc/net/dev"));
        for (let v in now) {
          network.flow[v] = {
            receive: now[v].receive - old[v].receive,
            transmit: now[v].transmit - old[v].transmit
          };
        }
        resolve(network);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 获取CPU信息.
 * @private
 */
exports.getSystem = function() {
  return new Promise(async function(resolve, reject) {
    try {
      let stdout = await processExec("top -b -n 1");
      resolve(getSystem(stdout));
    } catch (error) {
      reject(error);
    }
  });
};