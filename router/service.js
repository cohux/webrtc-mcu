/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 服务路由
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
 * 获取所有服务
 * @private
 */
router.post("/getService", async function (req, res) {
  try {
    let { remoteAddress } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let cluster = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(cluster !== null && cluster !== undefined, true, "未找到该节点")
    let data = await req.api.afflux({ method: "GET", cluster, path: "/services" })
    res.send({ Status: 200, Data: data.data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 删除服务
 * @private
 */
router.post("/deleteService", async function (req, res) {
  try {
    let { remoteAddress, id } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let cluster = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(cluster !== null && cluster !== undefined, true, "未找到该节点")
    let data = await req.api.afflux({ method: "DELETE", cluster, path: "/services/" + id })
    res.send({ Status: 200, Data: data.data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 添加服务
 * @private
 */
router.post("/addService", async function (req, res) {
  try {
    let { remoteAddress, key, name } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let cluster = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(cluster !== null && cluster !== undefined, true, "未找到该节点")
    let data = await req.api.afflux({ data: { key, name }, method: "POST", cluster, path: "/services" })
    res.send({ Status: 200, Data: data.data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


// 暴露出路由
module.exports = router