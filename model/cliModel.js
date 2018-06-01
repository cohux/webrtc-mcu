/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * CIL抽象
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const chalk = require("chalk")
const path = require("path")
const moment = require("moment")
const assert = require("assert")


/**
 * 文件系统抽象类
 * @private
 */
class cliModel {
  constructor () {
    this.print = console.log
  }
  
  /**
   * 系统错误
   * @private
   */
  SystemError (error) {
    this.print(chalk.blue.bgRed.bold(error))
  }
  
  
}


/**
 * 导出类函数
 * @private
 */
module.exports = cliModel