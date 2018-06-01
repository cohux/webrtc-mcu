/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 文件系统抽象
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const fs = require("fs")
const path = require("path")
const moment = require("moment")
const assert = require("assert")
const fsPromise = fs.fsPromises


/**
 * 文件系统抽象类
 * @private
 */
class fsModel {
  
  
  /**
   * 写入日志
   * @private
   */
  async addendLog (path, log) {
    
    /**
     * 查询目录下的所有日志文件
     * @private
     */
    let dir = await fsPromise.readdir(path)
    if (dir.length === 0) {

      /**
       * 没有日志文件
       * 直接新建一个当前时间为name的日志文件
       * @private
       */
      await fsPromise.writeFile(moment(new Date()).format("YYYY-MM-DD-HH-mm") + ".log", log)
    } else {

      /**
       * 有日志文件
       * 找到最后一个日志文件
       * 检查日志文件大小有无超出边界
       * @private
       */
      let logFile = path.join(path, dir[dir.length - 1])
      let stat = await fsPromise.stat(logFile)
      if (stat.size > 10485760) {

        /**
         * 已经超出边界
         * 新建一个日志文件
         * @private
         */
        await fsPromise.writeFile(moment(new Date()).format("YYYY-MM-DD-HH-mm") + ".log", log)
      } else {

        /**
         * 没有超出边界
         * 直接写入到现有的日志文件
         * @private
         */
        await fsPromise.appendFile(logFile, log)
      }
    }
  }
  
  
}


/**
 * 导出类函数
 * @private
 */
module.exports = fsModel