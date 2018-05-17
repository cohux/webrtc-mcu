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
var childProcess = require("child_process")


/**
 * 解析获取网络情况输出字符
 * @private
 */
function cmdParce (stdout, type, fn) {
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
  if (stdout && type === "list" && stdout.search("Active") === 0) {
    var LISTEN = stdout.split("Active UNIX")[0].split("PID/Program name")[1]
    var NET = LISTEN.slice(3, LISTEN.length - 3).split("\n")
    var NETNEW = []
    var PORT = []
    var PORTNEW = []
    var PORTSTR = []
    for (var i = 0; i < NET.length; i ++) {
      var Value = NET[i]
      var LISTENParey = []
      if (Value.match(/LISTEN/g) !== null) {
        PORTSTR.push(Value)
        for (var v = 0, x = Value.split(" "); v < x.length; v ++) {
          x[v] !== "" && x[v] !== "\n" && LISTENParey.push(x[v])
        }
      }
      LISTENParey.length > 0 && NETNEW.push(LISTENParey)
      if (i === NET.length - 1) {
        for (var a = 0; a < NETNEW.length; a ++) {
          PORT.push(NETNEW[a][3])
          if (a === NETNEW.length - 1) {
            for (var b = 0; b < PORT.length; b ++) {
              var Value = PORT[b]
              PORTNEW.push(Value.includes(":::") ? Value.split(":")[3] : Value.split(":")[1] )
              if (b === PORT.length - 1) {
                fn(PORTNEW, PORTSTR)
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
      cmdParce(stdout, type, function(NetWork, PORTSTR) {
        callback(null, NetWork, PORTSTR)
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
function GetNetWork(fn) {
  NetWorkInfoPro("net", function (error, NetWorkOne) {
    if (! error) {
      setTimeout(function () {
        NetWorkInfoPro("net", function (error, NetWorkTwo) {
          if (! error) {
            NetWorkInfoPro("list", function (error, NetListPort, PORTSTR) {
              var NodeName = NetWorkTwo.Node.name
              var DomainName = NetWorkTwo.Domain.name
              var NodeReceive = NetWorkTwo.Node.Receive - NetWorkOne.Node.Receive
              var NodeTransmit = NetWorkTwo.Node.Transmit - NetWorkOne.Node.Transmit
              var DomainReceive = NetWorkTwo.Domain.Receive - NetWorkOne.Domain.Receive
              var DomainTransmit = NetWorkTwo.Domain.Transmit - NetWorkOne.Domain.Transmit
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
                NetListPort: NetListPort,
                ListenList: PORTSTR
              })
            })
          }
        })
      }, 1000)
    }
  })
}


module.exports = {
  GetNetWork: GetNetWork
}