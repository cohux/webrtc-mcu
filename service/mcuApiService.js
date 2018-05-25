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
const uuid = require("uuid/v4")
 
 
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
        let url = cluster.api.protocol + "://" + cluster.remoteAddress + ":" + (port || cluster.api.port) + path
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
  auth (user, old) {
    return new Promise(async (resolve, reject) => {
      try {
        assert.deepEqual(old !== null && old !== undefined, true, "认证失败")
        let session = await this.authNext(user, old)
        user.session = session
        this.dbService.RedisClient.set("use-" + user.username, JSON.stringify(user))
        resolve(session)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }
  
  /**
   * 认证链
   * @private
   */
  authNext (user, old) {
    return new Promise(async (resolve, reject) => {
      try {
        let haxStr = Buffer.from(old, "base64").toString("utf8")
        let oldSession = await this.include.encrypt(haxStr)
        let usernameParse = oldSession.match(/^\[.*?\]/g)
        let username = usernameParse[0].substring(1, usernameParse[0].length - 1)
        assert.deepEqual(user.key, username, "认证失败")
        assert.deepEqual(user.session, old, "认证失败")
        let session = await this.authLoad(user.key)
        resolve(session)
      } catch (error) {
        reject(error)
      }
    })
  }
  
  /**
   * 初始化session
   * @private
   */
  authLoad (key) {
    return new Promise(async (resolve, reject) => {
      try {
        let uid = uuid()
        let timestamp = new Date().getTime()
        let session = "[" + key + "][" + uid + "][" + String(timestamp) + "]"
        let hax = await this.include.decrypt(session)
        resolve(Buffer.from(hax).toString("base64"))
      } catch (error) {
        reject(error)
      }
    })
  }
  
}


/**
 * 导出类
 * @private
 */
module.exports = mcuApiService