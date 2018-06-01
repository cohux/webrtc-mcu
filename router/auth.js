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
    let DecryptKey = await req.include.decrypt(password)
    assert.deepEqual(Data !== null && Data !== undefined, true, "用户不存在或密码错误")
    assert.deepEqual(typeof DecryptKey, "string", "处理密码错误")
    req.session.views = Data.username
    Data.decryptKey = DecryptKey
    Data._id = String(Data._id)
    req.redis.set("USERINFO_" + Data.username, JSON.stringify(Data))
    res.cookie("password", DecryptKey, { httpOnly: true })
    res.cookie("username", Data.username, { httpOnly: true })
    res.send({ Status: 200 })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 验证用户是否存在
 * @private
 */
router.post("/verificationUserName", async function (req, res) {
  try {
    let { username } = req.body
    assert.deepEqual(typeof username === "string", true, "参数错误")
    assert.deepEqual(username.length >= 4, true, "参数错误")
    let Data = await req.mongodb.admin.findOne({ username })
    assert.deepEqual(Data !== null && Data !== undefined, true, "用户不存在")
    res.send({ Status: 200 })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 退出登录
 * @private
 */
router.get("/loginOut", async function (req, res) {
  try {
    let { username } = req.userData
    assert.deepEqual(req.userLogin, true, "用户未登录")
    await req.redis.Del("USERINFO_" + username)
    req.session.views = null
    res.clearCookie("username")
    res.clearCookie("password")
    res.redirect("/view/login")
  } catch (error) {
    res.status(404).send(error.message)
  }
})


// 暴露出路由
module.exports = router