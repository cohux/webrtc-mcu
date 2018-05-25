/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 房间路由
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
 * 获取所有房间
 * @private
 */
router.post("/getRooms", async function (req, res) {
  try {
    let { remoteAddress, id, page = 1 } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let cluster = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(cluster !== null && cluster !== undefined, true, "未找到该节点")
    let data = await req.api.afflux({ method: "GET", cluster, path: "/apiRouter/getRooms", params: { id, page, per_page: 20 } })
    res.send({ Status: 200, Data: data.data.Data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 新建房间
 * @private
 */
router.post("/addRoom", async function (req, res) {
  try {
    let { remoteAddress, room, service } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let cluster = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(cluster !== null && cluster !== undefined, true, "未找到该节点")
    let data = await req.api.afflux({ method: "POST", cluster, path: "/apiRouter/addRooms", data: { service, room } })
    res.send({ Status: 200, Data: data.data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 更新房间
 * @private
 */
router.post("/updateRoom", async function (req, res) {
  try {
    let { remoteAddress, room, roomId, service } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let cluster = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(cluster !== null && cluster !== undefined, true, "未找到该节点")
    let data = await req.api.afflux({ method: "POST", cluster, path: "/apiRouter/updateRooms/" + roomId, data: { room, service } })
    res.send({ Status: 200, Data: data.data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * 删除房间
 * @private
 */
router.post("/deleteRoom", async function (req, res) {
  try {
    let { remoteAddress, roomId } = req.body
    assert.deepEqual(req.userLogin, true, "用户未登录")
    let cluster = await req.mongodb.cluster.findOne({ remoteAddress })
    assert.deepEqual(cluster !== null && cluster !== undefined, true, "未找到该节点")
    let data = await req.api.afflux({ method: "DELETE", cluster, path: "/v1/rooms/" + roomId })
    res.send({ Status: 200, Data: data.data })
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


// 暴露出路由
module.exports = router