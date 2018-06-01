/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 开放API服务
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const assert = require("assert")
const express = require("express")
const router = express.Router()
const axios = require("axios")


/**
 * 鉴权中间件
 * @private
 */
router.use(async function (req, res, next) {
  try {
    let { query, cookies, body, headers } = req
    let { username } = query
    let old = ""
    
    /**
     * 读取用户信息
     * @private
     */
    let user = await req.redis.Get("APIUSERINFO_" + username)
    assert.deepEqual(user !== null && user !== undefined, true, "认证失败")
    user = JSON.parse(user)
    
    /**
     * 判断密钥载体
     * @private
     */
    if (user.carrier === "query") {
      old = query.Sig
    } else
    if (user.carrier === "header") {
      old = headers.sig
    } else 
    if (user.carrier === "cookie") {
      old = cookies.Sig
    } else 
    if (user.carrier === "body") {
      old = body.Sig
    }
    
    /**
     * 进行认证以及密钥链递交
     * @private
     */
    assert.deepEqual(user.session, old, "认证失败")
    let session = await req.api.auth(user, old)
    
    /**
     * 附加请求数据
     * @private
     */
    req.Sig = false
    req.sigUser = user
    
    /**
     * 判断密钥载体
     * @private
     */
    if (user.carrier === "cookie") {
      res.cookie("Sig", session, { httpOnly: true })
    } else
    if (user.carrier === "header") {
      res.header("Sig", session)
    } else
    if (user.carrier === "body" || user.carrier === "query") {
      req.Sig = session
    }
    
    /**
     * 自定义发送方法
     * @private
     */
    req.callback = function (data) {
      if (req.Sig) {
        res.send(Object.assign(data, { Sig: req.Sig }))
      }
    }
    
    /**
     * 递交
     * @private
     */
    next()
  } catch (error) {
    res.send({ Status: 404, Error: error.message })
  }
})


/**
 * API请求代理
 * @private
 */
router.use("/:use/:model/:url", async function (req, res, next) {
  try {
    let { roles } = req.sigUser
    let auth = roles[req.params.use][req.params.model]
    assert.deepEqual(auth, true, "访问被拒绝")
    let url = "http://127.0.0.1/" + req.params.use + "/" + req.params.url
    let data = await axios({ data: req.body, method: req.method, url, params: req.query })
    req.callback(data.data)
  } catch (error) {
    req.callback({ Status: 404, Error: error.message })
  }
})


// 暴露出路由
module.exports = router