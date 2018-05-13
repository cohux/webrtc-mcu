/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 根路由
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const assert = require("assert")
const express = require("express")
const path = require("path")
const router = express.Router()


/**
 * 根目录
 * @private
 */
router.get("/", async function (req, res) {
  res.redirect(req.userLogin === true ? "/view/console" : "/view/login")
})


// 暴露出路由
module.exports = router