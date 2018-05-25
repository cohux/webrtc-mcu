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
 * 登录
 * @private
 */
router.get("/login", async function (req, res) {
  res.view("login.html")
})


/**
 * 视图路由
 * @private
 */
router.get("/:model", async function (req, res) {
  try {
    assert.equal(req.userLogin, true)
    res.render("index", { model: req.params.model, user: req.userData, hostname: req.configure.http.host })
  } catch (error) {
    res.redirect("/view/login")
  }
})


// 暴露出路由
module.exports = router