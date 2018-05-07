/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 认证路由
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
router.post("/login", async function (req, res) {
  try {
    let { username, password } = req.body
    assert.deepEqual(typeof username === "string", true, "参数错误")
    assert.deepEqual(typeof password === "string", true, "参数错误")
    assert.deepEqual(username.length >= 4 && password.length >= 6, true, "用户名密码长度不够")
    let Data = await req.mongodb.admin.findOne({ username, password })
    let DecryptKey = await req.include.Decrypt(password)
    assert.deepEqual(Data !== null && Data !== undefined, true, "用户不存在")
    assert.deepEqual(typeof DecryptKey, "string", "处理密码错误")
    req.session.views = Data.username
    Data.DecryptKey = DecryptKey
    Data._id = String(Data._id)
    req.redis.set(Data.username, JSON.stringify(Data))
    res.cookie("password", DecryptKey, { httpOnly: true })
    res.cookie("username", Data.username, { httpOnly: true })
    res.send({ Status: 200 })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})



// 暴露出路由
module.exports = router