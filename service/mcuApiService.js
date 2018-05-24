/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


 /**
  * MCU通信模块
  * @private
  */
 

 "use strict"


 /**
  * Module dependencies.
  */
const assert = require("assert")
const fs = require("fs")
const path = require("path")
const os = require("os")
const axios = require("axios")
 
 
 /**
 * MCUAPI类
 * @private
 */
class mcuApiService {
  constructor (include, dbService, configure) {
    this.include = include
    this.dbService = dbService
    this.configure = configure
  }
  
  /**
   * 远程节点请求注入
   * @private
   */
  afflux ({ cluster, method, data = {}, params = {}, path, port }) {
    return new Promise(async (resolve, reject) => {
      try {
        let url = cluster.api.protocol + "://127.0.0.1:" + (port || cluster.api.port) + path
        let Authorization = "MAuth realm=http://marte3.dit.upm.es,mauth_signature_method=HMAC_SHA256,mauth_serviceid="
        let cnounce = Math.floor(Math.random() * 99999)
        let timestamp = new Date().getTime()
        let toSign = timestamp + "," + cnounce
        let hax = await this.include.hmacSHA256(cluster.auth.key, toSign)
        Authorization += cluster.auth.id
        Authorization += ",mauth_cnonce=" + cnounce
        Authorization += ",mauth_timestamp=" + timestamp
        Authorization += ",mauth_signature=" + hax
        let request = await axios({ data, method, url, params, headers: { Authorization } })
        resolve(request)
      } catch (error) {
        reject(error)
      }
    })
  }
  
  /**
   * Token Auth类
   * @private
   */
  auth () {
    
  }
  
}


/**
 * 导出类
 * @private
 */
module.exports = mcuApiService