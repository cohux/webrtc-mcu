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
const events = require("events")
const express = require("express")
const ejs = require("ejs")
const app = express()
const http = require("http")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session")
const include = require("./lib/include")
const middleware = require("./service/middleware")
const dbService = require("./service/dbService")
const wsService = require("./service/wsService")
const logService = require("./service/logService")
const loopService = require("./service/loopService")
const mcuApiService = require("./service/mcuApiService")
const router = require("./router")
const server = http.createServer(app)
const eventEmitters = new events.EventEmitter()
const websocket = new ws.Server({ server })
const dbServices = new dbService(configure)
const includes = new include(configure)
const dbConnection = dbServices.connection()
const mcuApiServices = new mcuApiService(includes, dbConnection, configure)
const middlewares = new middleware(includes, dbConnection, configure, __dirname, mcuApiServices, eventEmitters)
const wsServices = new wsService(includes, dbConnection, configure, __dirname, websocket, eventEmitters)
const logServices = new logService(includes, dbConnection, configure)
const loopServices = new loopService(includes, dbConnection, configure, __dirname)


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
app.use("/public", express.static(configure.http.public))
app.use("/", router(middlewares))


/**
 * 初始化服务.
 * @private
 */
loopServices.heapMaintain()
server.listen(configure.http.port)
logServices.bind([ wsServices, dbServices, middlewares, loopServices ])