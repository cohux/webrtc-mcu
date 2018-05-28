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
var cluster = require("cluster")
var fs = require("fs")
var WebSocket = require("ws")
var toml = require("toml")
var os = require("os")
var assert = require("assert")
var configure = toml.parse(fs.readFileSync("./nuve.toml"))
var lib = require("./lib.js")


if (cluster.isMaster) {
  
  
  cluster.fork()
  cluster.on("exit", function(work) {
    setTimeout (function () {
      cluster.fork()
    }, 2000)
  })
  
  
} else {
  var socket = new WebSocket(configure.websocket.host)
  var systemInfoLoop

  /**
   * 发送消息.
   * @private
   */
  function sendMessage (data) {
    try {
      socket.send(JSON.stringify(data))
    } catch (error) {
      return
    }
  }
  
  
  socket.on("error", function () {
    process.exit()
  })
  
  
  socket.on("close", function () {
    process.exit()
  })


  /**
   * websocket接收到消息.
   * @private
   */
  socket.on("message", function (data) {
    try {
      var params = JSON.parse(data)
      if (params.event === "authonload") {
        clearInterval(systemInfoLoop)
        systemInfoLoop = setInterval(function () {
          lib.GetNetWork(function (data) {
            lib.getCpu(function (cpus) {
              sendMessage({
                event: "systemInfo",
                message: {
                  arch: os.arch(),
                  hostname: os.hostname(),
                  release: os.release(),
                  type: os.type(),
                  cups: os.cpus().length,
                  networkInterfaces: os.networkInterfaces(),
                  loadavg: os.loadavg(),
                  uptime: os.uptime(),
                  freemem: os.freemem(),
                  totalmem: os.totalmem(),
                  network: data,
                  cpu: cpus
                }
              })
            })
          })
        }, 5000)
      }
    } catch (error) {
      return
    }
  })
  
}