/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 根路由
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const assert = require("assert")
const express = require("express")
const path = require("path")
const router = express.Router()


/**
 * 根目录
 * @private
 */
router.get("/", async function (req, res) {
  res.redirect(req.userLogin === true ? "/view/console" : "/view/login")
})


/**
 * js组件模板
 * @private
 */
router.get("/useJs/:model", async function (req, res) {
  try {
    let { model } = req.params
    let indexJs = await req.include.readFile(path.join(req.configure.http.public, "/js/index.js"))
    let componentJs = await req.include.readFile(path.join(req.configure.http.public, "/js/component/", model))
    indexJs = indexJs.toString()
    componentJs = componentJs.toString()
    for (let v of indexJs.match(/(?<=\[\!\s*)(?!\s)([^!]|\!(?!\]))+(?<!\s)(?=\s*\!\])/g)) {
      let componentJsModel = componentJs.match(new RegExp(`\\[\\!\\s<=${v}=>([\\s\\S]*?)\\!\\]`, "g"))
      if (componentJsModel !== null) {
        let jsText = componentJsModel[0]
        jsText = jsText.replace(`[! <=${v}=>`, "")
        jsText = jsText.replace("!]", "")
        indexJs = indexJs.replace(`[! ${v} !]`, jsText)
      } else {
        indexJs = indexJs.replace(`[! ${v} !]`, "")
      }
    }
    res.set("Content-Type", "application/javascript; charset=UTF-8")
    res.send(Buffer.from(indexJs))
  } catch (error) {
    res.sendStatus(404)
  }
})


// 暴露出路由
module.exports = router