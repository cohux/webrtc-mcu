/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 路由服务
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const express = require("express")
const router = express.Router()


/**
 * 路由依赖注入.
 * @private
 */
function routers (middlewares) {
  
  /**
   * 路由过滤注入.
   * @private
   */
  router.use(/^((?!\.).)*$/, middlewares.filter)
  
  /**
   * 根路由重定向.
   * @private
   */
  router.get("/", async function (req, res, next) {
    res.redirect(req.userLogin ? "/view/console" : "/view/login")
    next()
  })
  
  /**
   * 模块路由.
   * @private
   */
  router.use("/view", require("./router/view"))
  router.use("/api", require("./router/api"))
  router.use("/auth", require("./router/auth"))
  router.use("/log", require("./router/log"))
  router.use("/cluster", require("./router/cluster"))
  router.use("/service", require("./router/service"))
  router.use("/room", require("./router/room"))
  router.use("/key", require("./router/key"))
  router.use(middlewares.error)
  
  /**
   * 返回路由模块.
   * @private
   */
  return router
}


// 暴露出路由
module.exports = routers