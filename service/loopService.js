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
   * 数据维护
   * @private
   */
  heapMaintain () {
    let inthis = this
    
    /**
     * 每隔10分钟
     * 将redis存储的节点数据同步到mongodb
     * @private
     */
    this.loop.push(setInterval(async function () {
      try {
        let systemInfo = await inthis.dbService.RedisClient.Get("systemInfo")
        if (Array.isArray(systemInfo)) {
          for (let v of systemInfo) {
            let sysInfo = await inthis.dbService.MongoDBClient.system.findOne({ hostname: v.hostname })
            if (sysInfo !== null && sysInfo !== undefined) {
              await inthis.dbService.MongoDBClient.system.updateOne({ hostname: v.hostname }, { $set: v })
            } else {
              await inthis.dbService.MongoDBClient.insertOne(v)
            }
          }
        }
      } catch (error) {
        EventEmitters.emit("error", error)
      }
    }, 600000))
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