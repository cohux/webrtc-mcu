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
 * 调试端口
 * @private
 */
router.use("*", function (req, res) {
  res.sendStatus(200)
})
 


// 暴露出路由
module.exports = routers