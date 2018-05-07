/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


 /**
  * 路由中间件
  */
 

 "use strict"


 /**
  * Module dependencies.
  */
 const assert = require("assert")
 const path = require("path")
 const mongodb = require("mongodb")


 /**
  * 模块缓存类
  * @private
  */
 let include
 let configure
 let dirname
 let dbService


/**
 * 中间件类函数
 * @private
 */
class middleware {
  constructor (includes, dbServices, configures, dirnames) {
    include = includes
    configure = configures
    dirname = dirnames
    dbService = dbServices
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
     * 过滤器
     * @private
     */
    try {
      let { views } = req.session
      assert.equal(views !== undefined && views !== null, true)
      let data = await dbService.RedisClient.Get(views)
      assert.equal(data !== undefined, true)
      let user = JSON.parse(data)
      assert.equal(user["username"], views)
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
}


/**
 * 导出类
 * @private
 */
module.exports = middleware