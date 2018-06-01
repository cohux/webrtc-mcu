/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


 /**
  * 日志模块
  * @private
  */


/**
 * 模块对外函数 {protype} bind
 * 绑定一个数组，数组里面为所有需要处理这些事件的 EventEmitter 类对象
 * 对象必须满足可以绑定 [ error, info ] EventEmitter
 * 发送的事件为JSON，参数：
 *    [ error ] EventEmitter: {class} Error
 *    [ info ] EventEmitter:
 *      event: {string} 事件
 *      message: {string} 事件详细信息
 */
 

 "use strict"


 /**
  * Module dependencies.
  */
const assert = require("assert")
const fs = require("fs").promises
const path = require("path")
const os = require("os")
 
 
 /**
 * 错误处理类
 * @private
 */
class logService {
  constructor (include, dbService, configure, fsModels) {
    this.dbService = dbService
    this.configure = configure
    this.include = include
    this.fsModels = fsModels
  }
  

   /**
     * 写入日志
     * @private
     */
   async append (options) {
     let {
       type = "error",
       event = "",
       message = "",
       time = (new Date()).getTime()
     } = options
     try {
       
       /**
         * 写入日志到数据库
         * @private
         */
       let dbLog = await this.dbService.MongoDBClient.log.insertOne({ type, event, message, time, read: false })
       assert.deepEqual(dbLog.result.n, 1)
       
       /**
         * 写入日志到文件系统
         * @private
         */
       await this.fsModels.addendLog(this.configure.log.path, JSON.stringify({ type, event, message, time }) + os.EOL)
     } catch (error) {
       return
     }
   }
  

   /**
     * 绑定事件处理函数
     * @private
     */
   bind (modules) {
     modules.forEach(v => {
       v.on("error", error => {
         let { message, stack, inprotype, event } = error
         this.append(inprotype === true ? { type: "error", event, message } : { type: "error", event: message, message: stack })
       })
       v.on("info", function (info) {
         let { event, message } = info
         this.append({ type: "info", event, message })
       })
     })
   }
  
  
 }
 
 
 /**
 * 导出类
 * @private
 */
module.exports = logService