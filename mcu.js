/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


 /**
  *               南无阿弥陀佛
  *
  *                  _ooOoo_
  *                 o8888888o
  *                 88" . "88
  *                 (| -_- |)
  *                 O\  =  /O
  *              ____/`---'\____
  *            .'  \\|     |//  `.
  *           /  \\|||  :  |||//  \
  *          /  _||||| -:- |||||-  \
  *          |   | \\\  -  /// |   |
  *          | \_|  ''\---/''  |   |
  *          \  .-\__  `-`  ___/-. /
  *        ___`. .'  /--.--\  `. . __
  *     ."" '<  `.___\_<|>_/___.'  >'"".
  *    | | :  `- \`.;`\ _ /`;.`/ - ` : | |
  *    \  \ `-.   \_ __\ /__ _/   .-` /  /
  *======`-.____`-.___\_____/___.-`____.-'======
  *                `=---='
  *^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  *      佛祖保佑       永无BUG
*/


"use strict"


/**
 * Module dependencies.
 */
const fs = require("fs")
const ws = require("ws")
const express = require("express")
const toml = require("toml")
const events = require("events")
const ejs = require("ejs")
const http = require("http")
const https = require("https")
const router = require("./router")
const targs = require("./lib/targs")
const include = require("./lib/include")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session")
const middleware = require("./service/middleware")
const dbService = require("./service/dbService")
const wsService = require("./service/wsService")
const logService = require("./service/logService")
const loopService = require("./service/loopService")
const mcuApiService = require("./service/mcuApiService")


/**
 * 初始化组件
 * @private
 */
const app = express()
const configure = toml.parse(fs.readFileSync("./configure.toml"))
const key = fs.readFileSync(configure.https.key)
const cert = fs.readFileSync(configure.https.cert)
const server = https.createServer({ key, cert }, app)
const eventEmitters = new events.EventEmitter()
const websocket = new ws.Server({ server })
const dbConnection = new dbService()
const includes = new include(configure)
const mcuApiServices = new mcuApiService(includes, dbConnection, configure)
const wsServices = new wsService(includes, dbConnection, configure, __dirname, websocket, eventEmitters)
const logServices = new logService(includes, dbConnection, configure)
const loopServices = new loopService(includes, dbConnection, configure, __dirname)
const middlewares = new middleware(includes, dbConnection, configure, __dirname, mcuApiServices, eventEmitters, targs)
const httpLocation = http.createServer(middlewares.locationHttps)


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
httpLocation.listen(80)
loopServices.heapMaintain()
server.listen(configure.http.port)
dbConnection.redis(configure.redis)
dbConnection.mongodb(configure.mongodb)
logServices.bind([ wsServices, dbConnection, middlewares, loopServices ])