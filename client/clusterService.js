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
var configure = toml.parse(fs.readFileSync("./configure.toml"))
var lib = require("./lib.js")
var socket = new WebSocket(configure.websocket.host)
var systemInfoLoop


/**
 * websocket已连接.
 * @private
 */
socket.on("open", function () {
  
})


/**
 * 发送消息.
 * @private
 */
sendMessage (data) {
  try {
    socket.send(JSON.stringify(data))
  } catch (error) {
    return
  }
}


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
          sendMessage({
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
            network: data
          })
        })
      }, 5000)
    }
  } catch (error) {
    return
  }
})


/**
 * websocket发生错误.
 * @private
 */
socket.on("error", function (error) {
  console.log(error)
})


/**
 * websocket断开.
 * @private
 */
socket.on("close", function () {
  setTimeout(function () {
    socket = new WebSocket(configure.socket.host)
  }, 2000)
})