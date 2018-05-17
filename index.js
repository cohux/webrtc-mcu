/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


"use strict"


/**
 * Module dependencies.
 */
const fs = require("fs")
const ws = require("ws")
const toml = require("toml")
const configure = toml.parse(fs.readFileSync("./configure.toml"))
const express = require("express")
const ejs = require("ejs")
const app = express()
const assert = require("assert")
const http = require("http")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session")
const include = require("./include")
const middleware = require("./middleware")
const dbService = require("./dbService")
const wsService = require("./wsService")
const logService = require("./logService")
const server = http.createServer(app)
const websocket = new ws.Server({ server })
const dbServices = new dbService(configure)
const includes = new include(configure)
const dbConnection = dbServices.connection()
const middlewares = new middleware(includes, dbConnection, configure, __dirname)
const wsServices = new wsService(includes, dbConnection, configure, __dirname, websocket)
const logServices = new logService(includes, dbConnection, configure)


/**
 * 加载依赖组件
 * 初始化中间件
 * @private
 */
app.use(cookieSession(configure.session))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("views", configure.http.views)
app.set("view engine", "html")
app.engine(".html", ejs.__express)


/**
 * 路由模块
 * @private
 */
app.use("/public", express.static(configure.http.public))
app.use([/^((?!\.).)*$/, "/useJs"], middlewares.filter)
app.use("/", require("./router/root"))
app.use("/view", require("./router/view"))
app.use("/auth", require("./router/auth"))
app.use("/log", require("./router/log"))


/**
 * start service.
 * @private
 */
server.listen(configure.http.port)
logServices.bind([ wsServices, dbServices, middlewares ])