/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 日志路由
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
 * 获取所有日志
 * @private
 */
router.get("/getAll", async function (req, res) {
  try {
    let { page = 1 } = req.query
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let Data = await req.mongodb.log.find().limit(20).skip((Number(page) - 1) * 20).toArray()
    res.send({ Status: 200, Data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 获取警告
 * @private
 */
router.get("/getError", async function (req, res) {
  try {
    let { page = 1 } = req.query
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let Data = await req.mongodb.log.find({ 
      type: "error",
      read: false
    }).limit(20).skip((Number(page) - 1) * 20).toArray()
    res.send({ Status: 200, Data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 获取未读通知数
 * @private
 */
router.get("/getUnreadBellSum", async function (req, res) {
  try {
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let Data = await req.mongodb.log.aggregate([
      {$match: {read : false}},
      {$group: {_id: "$type", sum: {$sum : 1}}}
    ]).toArray()
    res.send({ Status: 200, Data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


// 暴露出路由
module.exports = router