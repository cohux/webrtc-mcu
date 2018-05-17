/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 节点控制注入服务.
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
var fs = require("fs")
var WebSocket = require("ws")
var toml = require("toml")
var os = require("os")
var assert = require("assert")
var childProcess = require("child_process")
var configure = toml.parse(fs.readFileSync("./configure.toml"))
//var socket = new WebSocket(configure.websocket.host)


/**
 * 解析获取网络情况输出字符
 * @private
 */
function cmdParce(stdout, type, fn) {
  if (stdout && type === "net" && stdout.search("Inter-|   Receive") === 0 ) {
    var NetWork = {
      Node: {
        name: "",
        Receive: 0,
        Transmit: 0
      },
      Domain: {
        name: "",
        Receive: 0,
        Transmit: 0
      }
    }
    var compressedIndex = stdout.lastIndexOf("compressed")
    var data = stdout.substring(compressedIndex + 11, stdout.length - 1)
    var nav = data.split(":")
    var NodeNav = nav[1].split(" ")
    var DomainNav = nav[2].split(" ")
    var NodeDataMap = []
    var DomainDataMap = []
    for (var i = 0; i < NodeNav.length; i ++) {
      var Value = NodeNav[i]
      var NumberValue = Number(Value)
      Value.length > 0 && NumberValue !== null && NodeDataMap.push(NumberValue)
      if (i === NodeNav.length - 1) {
        for (var i = 0; i < DomainNav.length; i ++) {
          var Value = DomainNav[i]
          var NumberValue = Number(Value)
          Value.length > 0 && NumberValue !== null && DomainDataMap.push(NumberValue)
          if (i === DomainNav.length - 1) {
            NetWork.Node.name = nav[0]
            NetWork.Node.Receive = NodeDataMap[0]
            NetWork.Node.Transmit = NodeDataMap[8]
            NetWork.Domain.name = NodeNav[NodeNav.length - 1]
            NetWork.Domain.Receive = DomainDataMap[0]
            NetWork.Domain.Transmit = DomainDataMap[8]
            fn(NetWork)
          }
        }
      }
    }
  } else 
  if (stdout && type === "list" && stdout.search("Active") === 0){
    var LISTEN = stdout.split("Active UNIX")[0].split("PID/Program name")[1]
    var NET = LISTEN.slice(3, LISTEN.length - 3).split("\n")
    var NETNEW = []
    var PORT = []
    var PORTNEW = []
    for (var i = 0; i < NET.length; i ++) {
      var Value = NET[i]
      var LISTENParey = []
      if (Value.match(/LISTEN/g) !== null) {
        for (var v = 0, x = Value.split(" "); v < x.length; v ++) {
          x[v] !== "" && x[v] !== "\n" && LISTENParey.push(x[v])
        }
      }
      LISTENParey.length > 0 && NETNEW.push(LISTENParey)
      if (i === NET.length - 1) {
        for (var i = 0; i < NETNEW.length; i ++) {
          PORT.push(NETNEW[i][3])
          if (i === NETNEW.length - 1) {
            for (var i = 0; i < PORT.length; i ++) {
              var Value = PORT[i]
              PORTNEW.push(Value.includes(":::") ? Value.split(":")[3] : Value.split(":")[1] )
              if (i === PORT.length - 1) {
                fn(PORTNEW)
              }
            }
          }
        }
      }
    }
  } else {
    fn(false)
  }
}


/**
 * 获取网络信息
 * @method NetWorkInfoPro
 * @returns {Promise}
 */
function NetWorkInfoPro(type, callback) {
  childProcess.exec(type === "net" ? "cat /proc/net/dev" : "netstat -npl", function (error, stdout, stderr) {
    if (error || stderr) {
      callback(error || stderr)
    } else {
      cmdParce(stdout, type, function(NetWork) {
        callback(null, NetWork)
      })
    }
  })
}


/**
 * 获取网络流量 字节/S
 * 获取两次
 * 间隔1秒
 * 计算差值
 * 得到速率
 * @method GetNetWork
 * @param {fn<callback>}
 */
function GetNetWork(portList, fn) {
  NetWorkInfoPro("net", function (error, NetWorkOne) {
    if (! error) {
      setTimeout(function () {
        NetWorkInfoPro("net", function (error, NetWorkTwo) {
          if (! error) {
            NetWorkInfoPro("list", function (error, NetListPort) {
              // 计算差值
              var [
                NodeName,
                DomainName,
                NodeReceive,
                NodeTransmit,
                DomainReceive,
                DomainTransmit
              ] = [
                NetWorkTwo.Node.name,
                NetWorkTwo.Domain.name,
                NetWorkTwo.Node.Receive - NetWorkOne.Node.Receive,
                NetWorkTwo.Node.Transmit - NetWorkOne.Node.Transmit,
                NetWorkTwo.Domain.Receive - NetWorkOne.Domain.Receive,
                NetWorkTwo.Domain.Transmit - NetWorkOne.Domain.Transmit
              ]
              // 回调
              fn({
                Node: {
                  name: NodeName,
                  Receive: NodeReceive,
                  Transmit: NodeTransmit
                },
                Domain: {
                  name: DomainName,
                  Receive: DomainReceive,
                  Transmit: DomainTransmit
                },
                NetListPort: new Set(NetListPort)
              })
            })
          }
        })
      }, 1000)
    }
  })
}


///**
// * websocket已连接.
// * @private
// */
//socket.on("open", function () {
//  try {
//    
//  } catch (error) {
//    return
//  }
//})


///**
// * websocket接收到消息.
// * @private
// */
//socket.on("message", function (data) {
//  try {
//    var params = JSON.parse(data)
//  } catch (error) {
//    return
//  }
//})
//
//
///**
// * websocket发生错误.
// * @private
// */
//socket.on("error", function (error) {
//  console.log(error)
//})
//
//
///**
// * websocket断开.
// * @private
// */
//socket.on("close", function () {
//  setTimeout(function () {
//    socket = new WebSocket(configure.socket.host)
//  }, 2000)
//})


var systemInfoLoop = setInterval(function () {
    GetNetWork(function (data) {
      var arch = os.arch()
      var hostname = os.hostname()
      var release = os.release()
      var type = os.type()
      var cups = os.cpus().length
      var networkInterfaces = os.networkInterfaces()
      var loadavg = os.loadavg()
      var uptime = os.uptime()
      var freemem = os.freemem()
      var totalmem = os.totalmem()
      console.log(JSON.stringify({
        arch: arch,
        hostname: hostname,
        release: release,
        type: type,
        cups: cups,
        networkInterfaces: networkInterfaces,
        loadavg: loadavg,
        uptime: uptime,
        freemem: freemem,
        totalmem: totalmem,
        network: data
      }))
      socket.send(JSON.stringify({
        arch: arch,
        hostname: hostname,
        release: release,
        type: type,
        cups: cups,
        networkInterfaces: networkInterfaces,
        loadavg: loadavg,
        uptime: uptime,
        freemem: freemem,
        totalmem: totalmem,
        network: data
      }))
    })
  }, 5000)