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
const router = express.Router()


/**
 * 根目录
 * @private
 */
router.get("/", async function (req, res) {
  try {
    assert.equal(req.userLogin, true)
    res.redirect("/view/console")
  } catch (error) {
    res.redirect("/view/login")
  }
})


/**
 * 视图路由
 * @private
 */
router.use("/view", require("./view"))


/**
 * 认证路由
 * @private
 */
router.use("/auth", require("./auth"))



// 暴露出路由
module.exports = router