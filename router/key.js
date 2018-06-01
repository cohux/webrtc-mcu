/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 开放API管理
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
 * 获取用户
 * @private
 */
router.get("/getUsers", async function (req, res) {
  try {
    let { page = 1 } = req.query
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let Data = await req.mongodb.apiAuth.find().limit(20).skip((Number(page) - 1) * 20).toArray()
    res.send({ Status: 200, Data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 获取用户密钥链
 * @private
 */
router.get("/getUserToken", async function (req, res) {
  try {
    let { username } = req.query
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let user = await req.redis.Get("use-" + username)
    assert.deepEqual(user !== null, user !== undefined, true, "获取失败")
    user = JSON.parse(user)
    res.send({ Status: 200, Data: user.session })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 新建用户
 * @private
 */
router.post("/addUsers", async function (req, res) {
  try {
    let { username, key, carrier, roles } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let user = await req.mongodb.apiAuth.findOne({ username })
    assert.deepEqual(user === null || user === undefined, true, "用户已存在")
    let addUser = await req.mongodb.apiAuth.insertOne({ username, key, carrier, roles })
    assert.deepEqual(addUser.result.n, 1, "新建失败")
    let session = await req.api.authLoad(key)
    let Data = { session, username, key, carrier, roles, _id: addUser.insertedId }
    req.redis.set("APIUSERINFO_" + Data.username, JSON.stringify(Data))
    res.send({ Status: 200, Data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 更新用户
 * @private
 */
router.post("/updateUsers", async function (req, res) {
  try {
    let { username, key, carrier, roles, _id } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let user = await req.mongodb.apiAuth.findOne({ _id: req.ojectID.createFromHexString(_id) })
    assert.deepEqual(user !== null && user !== undefined, true, "用户不存在")
    let updateUsers = await req.mongodb.apiAuth.updateOne({ _id: req.ojectID.createFromHexString(_id) }, { $set: { username, key, carrier, roles } })
    assert.deepEqual(updateUsers.result.n, 1, "更新失败")
    let session = await req.api.authLoad(key)
    req.redis.set("APIUSERINFO_" + username, JSON.stringify({ username, key, carrier, roles, _id, session }))
    res.send({ Status: 200, Data: { username, key, carrier, roles, _id, session } })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 删除用户
 * @private
 */
router.post("/deleteUsers", async function (req, res) {
  try {
    let { id } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let user = await req.mongodb.apiAuth.findOne({ _id: req.ojectID.createFromHexString(id) })
    assert.deepEqual(user !== null && user !== undefined, true, "用户不存在")
    let deleteUsers = await req.mongodb.apiAuth.deleteOne({ _id: req.ojectID.createFromHexString(id) })
    assert.deepEqual(deleteUsers.result.n, 1, "删除失败")
    await req.redis.Del("APIUSERINFO_" + user.username)
    res.send({ Status: 200, Data: id })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 刷新动态密钥
 * @private
 */
router.post("/flushSession", async function (req, res) {
  try {
    let { id } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let user = await req.mongodb.apiAuth.findOne({ _id: req.ojectID.createFromHexString(id) })
    assert.deepEqual(user !== null && user !== undefined, true, "用户不存在")
    let session = await req.api.authLoad(user.key)
    user.session = session
    req.redis.set("APIUSERINFO_" + user.username, JSON.stringify(user))
    res.send({ Status: 200, Data: session })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


// 暴露出路由
module.exports = router