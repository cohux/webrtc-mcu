/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 页面路由
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
 * 控制台
 * @private
 */
router.get("/console", async function (req, res) {
  try {
    assert.equal(req.userLogin, true)
    res.render("console", {})
  } catch (error) {
    res.redirect("/view/login")
  }
})


/**
 * 控制台
 * @private
 */
router.get("/login", async function (req, res) {
  res.view("login.html")
})



// 暴露出路由
module.exports = router