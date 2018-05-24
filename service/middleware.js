/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


 /**
  * 路由中间件
  * @private
  */
 

 "use strict"


 /**
  * Module dependencies.
  */
const assert = require("assert")
const path = require("path")
const mongodb = require("mongodb")
const { EventEmitter } = require("events")


 /**
  * 模块缓存类
  * @private
  */
let include
let configure
let dirname
let dbService
let mcuApiServices
let EventEmitters = new EventEmitter()


/**
 * 中间件类函数
 * @private
 */
class middleware {
  constructor (includes, dbServices, configures, dirnames, mcuApiService) {
    include = includes
    configure = configures
    dirname = dirnames
    dbService = dbServices
    mcuApiServices = mcuApiService
  }

  /**
   * 过滤
   * @private
   */
  async filter (req, res, next) {

    /**
     * 附加参数
     * @private
     */
    req.rootdirname = dirname
    req.configure = configure
    req.ojectID = mongodb.ObjectID
    req.include = include
    req.mongodb = dbService.MongoDBClient
    req.redis = dbService.RedisClient
    req.afflux = mcuApiServices.afflux
    req.apiAuth = mcuApiServices.auth
    
    /**
     * 判断是否为移动设备
     * @private
     */
    let userAgent = req.headers["user-agent"]
    let match = /(Android|iPhone|iPad)/g
    if (typeof userAgent === "string" && Array.isArray(userAgent.match(match))) {
      req.mobile = true
    } else {
      req.mobile = false
    }

    
    /**
     * 跨域
     * @private
     */
    res.header("Access-Control-Allow-Origin", configure.http.origin)
  
    /**
     * 封装发送HTML文件方法
     * @private
     */
    res.view = function (html) {
      res.sendFile(path.join(configure.http.views, html))
    }
    
    /**
     * 抛出错误
     * @private
     */
    req.error = function (error) {
      EventEmitters.emit("error", error)
    }
    
    /**
     * 抛出日志
     * @private
     */
    req.info = function (event, message) {
      EventEmitters.emit("info", { event, message })
    }

    /**
     * 过滤器
     * @private
     */
    try {
      let { username, password } = req.cookies
      let { views } = req.session
      assert.equal(username !== undefined && username !== null, true)
      assert.equal(password !== undefined && password !== null, true)
      assert.equal(views !== undefined && views !== null, true)
      let data = await dbService.RedisClient.Get(views)
      assert.equal(data !== undefined, true)
      let user = JSON.parse(data)
      assert.equal(user["username"], views)
      assert.equal(user["username"], username)
      assert.equal(user["decryptKey"], password)
      req.userData = user
      req.userLogin = true
    } catch (error) {
      req.userLogin = false
    }
    
    /**
     * 递交
     * @private
     */
    next()
  }
  
  /**
   * 错误处理绑定
   * @private
   */
  async error (error, req, res, next) {
    
    /**
     * 处理文件和非文件
     * @private
     */
    if (req.path.search(/^((?!\.).)*$/) > 0) {
      res.sendFile(path.join(configure.http.views, "404.html"))
    } else {
      res.sendStatus(404)
    }
  }
  
  /**
   * 监听
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
module.exports = middleware