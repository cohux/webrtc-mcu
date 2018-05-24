/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 节点路由
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
 * 获取所有节点
 * @private
 */
router.get("/getAll", async function (req, res) {
  try {
    let { page = 1 } = req.query
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let Data = await req.mongodb.cluster.find().limit(20).skip((Number(page) - 1) * 20).toArray()
    res.send({ Status: 200, Data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 获取节点名称
 * @private
 */
router.post("/getServiceName", async function (req, res) {
  try {
    let { remoteAddress } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let service = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(service !== null && service !== undefined, true, "未找到数据")
    res.send({ Status: 200, Data: service.anotherName })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 删除节点
 * @private
 */
router.post("/delService", async function (req, res) {
  try {
    let { remoteAddress } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let delService = await req.mongodb.cluster.deleteOne({ remoteAddress })
    assert.deepEqual(delService.result.n, 1, "删除失败")
    res.send({ Status: 200 })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 更新节点
 * @private
 */
router.post("/updateService", async function (req, res) {
  try {
    let { 
      _id, remoteAddress, bindPort, anotherName, type, auth, maxNetwork
    } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let service = await req.mongodb.cluster.findOne({ _id: req.ojectID.createFromHexString(_id) })
    assert.deepEqual(service !== null && service !== undefined, true, "未找到数据")
    let updateService = await req.mongodb.cluster.updateOne({ _id: req.ojectID.createFromHexString(_id) }, { $set: {
      remoteAddress, bindPort, anotherName, type, auth, maxNetwork
    } })
    assert.deepEqual(updateService.result.n, 1, "更新失败")
    res.send({ Status: 200, Data: { _id, remoteAddress, bindPort, anotherName, type, auth, maxNetwork } })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 新建节点
 * @private
 */
router.post("/addService", async function (req, res) {
  try {
    let { 
      remoteAddress, bindPort, anotherName, type, auth, maxNetwork
    } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let service = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(service === null || service === undefined, true, "已存在重复节点")
    let addService = await req.mongodb.cluster.insertOne({ remoteAddress, bindPort, anotherName, type, auth, maxNetwork })
    assert.deepEqual(addService.result.n, 1, "新建失败")
    res.send({ Status: 200, Data: { 
      _id: addService.insertedId, remoteAddress, bindPort, anotherName, type, auth, maxNetwork 
    } })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 获取节点信息
 * @private
 */
router.post("/getService", async function (req, res) {
  try {
    let { remoteAddress } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let sysInfo = await req.redis.Get("systemInfo")
    sysInfo = JSON.parse(sysInfo)
    assert.deepEqual(Array.isArray(sysInfo), true, "没有节点数据")
    for (let i = 0, loop = false; i < sysInfo.length; i ++) {
      if (sysInfo[i].remoteAddress === remoteAddress) {
        res.send({ Status: 200, Data: sysInfo[i] })
        break
      }
      if (i === sysInfo.length - 1 && !loop) {
        res.send({ Status: 404, Error: "未找到节点信息" })
      }
    }
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


// 暴露出路由
module.exports = router