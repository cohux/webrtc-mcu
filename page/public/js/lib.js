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
  error (callback) {
    this.ws.onerror = callback
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


/**
 * vue依赖注入
 * @private
 */
function vueImport (Inport) {
  this.el = Inport.el
  this.data = Inport.data
  this.methods = Inport.methods
  this.data.windowWidth = document.documentElement.offsetWidth - 200
  this.data.windowHeight = document.body.offsetHeight - 49
  this.data.menuTargetType = true
  this.data.menuSpanType = true
  this.data.menu = useData.menu
  this.data.bell = 0
  this.methods.menuTarget = function () {
    if (this.menuTargetType) {
      this.menuTargetType = false
      this.menuSpanType = false
      this.windowWidth = document.documentElement.offsetWidth - 50
    } else {
      this.menuTargetType = true
      this.menuSpanType = true
      this.windowWidth = document.documentElement.offsetWidth - 200
    }
  }
  this.methods.menuCheckbox = function (model) {
    location.href = "/view/" + model
  }
  this.methods.menuCheckboxClass = function (v) {
    return {
      "menu-li-checkbox": v.value === useData.value
    }
  }
}