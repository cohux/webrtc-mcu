/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


 /**
  * 任务模块
  * @private
  */


 "use strict"


 /**
  * Module dependencies.
  */
const assert = require("assert")
const { EventEmitter } = require("events")


/**
 * 事件处理
 * @private
 */
let EventEmitters = new EventEmitter()


/**
  * 自动任务类函数
  * @private
  */
class loopService {
  constructor (include, dbService, configure, dirname) {
    this.include = include
    this.dbService = dbService
    this.configure = configure
    this.dirname = dirname
    this.loop = []
  }
  
  /**
   * TODO: 待写插槽
   * 数据维护
   * @private
   */
  heapMaintain () {
    
  }
  
  /**
   * 停止所有的服务
   * @private
   */
  stop () {
    for (let v of this.loop) {
      clearInterval(v)
    }
  }
  
  /**
   * 事件监听
   * @private
   */
  on (event, emit) {
    EventEmitters.on(event, emit)
  }
}


 /**
 * 导出类
 * @private
 */
module.exports = loopService