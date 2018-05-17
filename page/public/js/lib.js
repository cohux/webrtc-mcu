/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


"use strict"


/**
 * 全局变量类
 * @private
 */
let WEBSOCKET_ONOPEN = false
let WEBSOCKET_ONDATA = false


/**
 * websocket连接类
 * @private
 */
class websocket {
  constructor (path) {
    this.ws = new WebSocket(path)
    this.ws.onmessage = function (evt) {
      let message = JSON.parse(evt.data)
      if ("event" in message && message.event === "authonload") {
        WEBSOCKET_ONOPEN && WEBSOCKET_ONOPEN()
      } else {
        WEBSOCKET_ONDATA && WEBSOCKET_ONDATA(message)
      }
    }
  }
  emit (data) {
    this.ws.send(JSON.stringify(data))
  }
  data (callback) {
    WEBSOCKET_ONDATA = callback
  }
  close (callback) {
    this.ws.onclose = callback
  }
  open (callback) {
    WEBSOCKET_ONOPEN = callback
  }
}