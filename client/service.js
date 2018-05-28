/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 节点控制注入服务.
 * @private
 */
"use strict"


/**
 * Module dependencies.
 */
const fs = require("fs")
const toml = require("toml")
const http = require("http")
const assert = require("assert")
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const router = require("./service/router.js")
const wsService = require("./service/wsService")
const dbService = require("./service/dbService")


/**
 * 全局变量
 * @private
 */
const app = express()
const server = http.createServer(app)
const configure = toml.parse(fs.readFileSync("./client.toml"))
const socket = new WebSocket(configure.websocket.host)
const dbServices = new dbService(configure)
const wsServices = new wsService(socket, dbServices)


/**
 * 加载依赖组件
 * 初始化中间件
 * @private
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(/^((?!\.).)*$/, router)


/**
 * 初始化服务.
 * @private
 */
server.listen(configure.http.port)