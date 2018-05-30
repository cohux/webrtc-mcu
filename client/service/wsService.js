/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * websocket服务.
 * @private
 */
"use strict"


/**
 * Module dependencies.
 */
const os = require("os")
const system = require("../lib/system")


/**
 * websocket服务类.
 * @private
 */
class wsService {
  constructor (socket, dbServices) {
    let inthis = this
    this.socket = socket
    this.dbServices = dbServices
    this.socket.on("error", function () {
      process.exit()
    })
    this.socket.on("close", function () {
      process.exit()
    })
    this.socket.on("message", function (message) {
      inthis.data(message)
    })
  }
  
  /**
   * 接收到消息.
   * @private
   */
  data (data) {
    try {
      let params = JSON.parse(data)
      if (params.event === "authonload") {
        
        /**
         * 每5S推送系统状态.
         * @private
         */
        setInterval(async () => {
          let network = await system.getNetWork()
          let sys = await system.getSystem()
          this.sendMessage({
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
              network, system: sys 
            }
          })
        }, 5000)
      }
    } catch (error) {
      return
    }
  }
  
  /**
   * 发送消息.
   * @private
   */
  sendMessage (data) {
    try {
      this.socket.send(JSON.stringify(data))
    } catch (error) {
      return
    }
  }
}


/**
 * 导出类函数
 * @private
 */
module.exports = wsService