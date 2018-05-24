/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 开放API服务
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const assert = require("assert")
const express = require("express")
const router = express.Router()


/**
 * 鉴权中间件
 * @private
 */
router.use(async function (req, res, next) {
  try {
    
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


// 暴露出路由
module.exports = router