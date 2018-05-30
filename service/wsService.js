/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * websocket服务.
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const assert = require("assert")
const { EventEmitter } = require("events")
const querystring = require("querystring")


/**
 * 事件处理器.
 * @private
 */
let EventEmitters = new EventEmitter()
let dbServices = {}
let socketListenLoop = {}


/**
 * websocket 类.
 * @private
 */
class wsService {
  constructor (include, dbService, configure, dirname, websocket, eventEmitters) {
    dbServices = dbService
    let inthis = this
    this.dbService = dbService
    this.configure = configure
    this.include = include
    this.dirname = dirname
    this.websocket = websocket
    this.eventEmitters = eventEmitters
    
    /**
     * websocket 连接.
     * @private
     */
    this.websocket.on("connection", function (socket, req) {
      wsService.connection(inthis, socket, req)
    })
    
    /**
     * websocket 错误.
     * @private
     */
    this.websocket.on("error", function (error) {
      EventEmitters.emit("error", error)
    })
    
    /**
     * 主动关闭websocket.
     * @private
     */
    this.eventEmitters.on("closeWebSocket", async function (data) {
      try {
        let { remoteAddress } = data
        
        /**
         * 删除节点信息.
         * @private
         */
        try {
          let list = []
          let clusterList = await dbService.RedisClient.Get("systemInfo")
          assert.equal(clusterList !== null && clusterList !== undefined, true)
          clusterList = JSON.parse(clusterList)
          assert.equal(Array.isArray(clusterList), true)
          for (let v of clusterList) {
            v.remoteAddress !== remoteAddress && list.push(v)
          }
          dbService.RedisClient.set("systemInfo", JSON.stringify(list))
        } catch (error) {
          return
        }
        
        /**
         * 关闭socket并删除连接池.
         * @private
         */
        if (remoteAddress in socketListenLoop) {
          socketListenLoop[remoteAddress].terminate()
          delete socketListenLoop[remoteAddress]
        }
      } catch (error) {
        return
      }
    })
  }
  
  /**
   * 发送数据.
   * @private
   */
  static send (socket, data) {
    try {
      socket.send(JSON.stringify(data))
    } catch (error) {
      return
    }
  }
  
  /**
   * 接收到数据.
   * @private
   */
  async data (message, auth, socket) {
    let dbService = this.dbService
    let {
      remoteAddress,
      remoteFamily,
      remotePort
    } = socket._socket
    try {
      remoteAddress = remoteAddress.match(/[\d.]+/g)[0]
      let parms = JSON.parse(message)
      assert.deepEqual("event" in parms && "message" in parms, true, "数据不符合标准")
      
      /**
       * 节点.
       * @private
       */
      if (auth.type === "cluster") {
        
        /**
         * 推送节点信息.
         * @private
         */
        if (parms.event === "systemInfo") {
          let systemInfo = await this.dbService.RedisClient.Get("systemInfo")
          systemInfo = JSON.parse(systemInfo)
          parms.message.remoteAddress = remoteAddress
          if (Array.isArray(systemInfo) && systemInfo.length > 0) {
            for (let i = 0; i < systemInfo.length; i ++) {
              if (systemInfo[i].hostname === parms.message.hostname) {
                systemInfo[i] = parms.message
                break
              }
            }
          } else {
            systemInfo = []
            systemInfo.push(parms.message)
          }
          this.dbService.RedisClient.set("systemInfo", JSON.stringify(systemInfo))
        } else {
          return
        }
      } else
        
      /**
       * 管理后台.
       * @private
       */
      if (auth.type === "web") {
        
        /**
         * 请求系统实时数据.
         * @private
         */
        if (parms.event === "systemInfo") {
          let systemInfo = await this.dbService.RedisClient.Get("systemInfo")
          assert.deepEqual(systemInfo !== null && systemInfo !== undefined, true, "无法获取系统数据")
          systemInfo = JSON.parse(systemInfo)
          wsService.send(socket, {
            event: "systemInfo",
            message: systemInfo
          })
        } else {
          return
        }
      } else {
        return
      }
    } catch (error) {
      
      /**
       * 返回错误信息.
       * @private
       */
      wsService.send(socket, {
        event: "ERR_MESSAGE_PARSE",
        message: error.message
      })
      
      /**
       * 如果是节点，记录错误信息.
       * @private
       */
      auth.type === "cluster" && EventEmitters.emit("info", {
        event: "节点[ " + remoteAddress + " ]数据解析错误",
        message: JSON.stringify({
          remoteAddress,
          remoteFamily,
          remotePort,
          error: error.message
        })
      })
    }
  }
  
  /**
   * 连接关闭.
   * @private
   */
  async close (auth) {
    if (auth.type === "cluster") {
      let {
        remoteAddress,
        remoteFamily,
        remotePort
      } = auth
      try {
        
        /**
         * 连接关闭  更新数据库状态为断线.
         * @private
         */
        let cluster = await this.dbService.MongoDBClient.cluster.findOne({ remoteAddress })
        assert.equal(cluster !== null && cluster !== undefined, true)
        delete cluster._id
        cluster.type = false
        let updateCluster = await this.dbService.MongoDBClient.cluster.updateOne({ remoteAddress }, { $set: cluster })
        assert.equal(updateCluster.result.n, 1)
        
        /**
         * 发送错误日志.
         * @private
         */
        EventEmitters.emit("error", {
          inprotype: true,
          event: "节点[ " + remoteAddress + " ]断开连接",
          message: JSON.stringify({
            remoteAddress,
            remoteFamily,
            remotePort
          })
        })
        
        /**
         * 从连接池删除.
         * @private
         */
        delete socketListenLoop[remoteAddress]
        this.eventEmitters.emit("closeWebSocket", { remoteAddress })
      } catch (error) {
        return
      }
    }
  }
  
  /**
   * 鉴权.
   * @private
   */
  async authentication (connection, callback) {
    let {
      socket, headers, url, req
    } = connection
    let {
      remoteAddress,
      remoteFamily,
      remotePort
    } = req.socket
    try {
      remoteAddress = remoteAddress.match(/[\d.]+/g)[0]
      
      /**
       * websocket路由过滤.
       * @private
       */
      if (url.startsWith("/socket")) {

        /**
         * 管理后台连接.
         * @private
         */
        let {
          password, username
        } = querystring.parse(headers.cookie, "; ", "=")
        assert.deepEqual(password !== null && password !== undefined, true, "连接没有token")
        assert.deepEqual(username !== null && username !== undefined, true, "连接没有token")
        let user = await this.dbService.RedisClient.Get(String(username))
        user = JSON.parse(user)
        assert.deepEqual(user !== null && user !== undefined, true, "没有找到用户")
        assert.deepEqual(username === user.username && password === user.decryptKey, true, "未通过鉴权")
        callback({
          type: "web",
          token: user,
          remoteAddress,
          remoteFamily,
          remotePort
        })
      } else
      if (url.startsWith(this.configure.service.router)) {
        
        /**
         * 节点服务连接.
         * @private
         */
        let cluster = await this.dbService.MongoDBClient.cluster.findOne({ remoteAddress })
        assert.deepEqual(cluster !== null && cluster !== undefined, true, "未通过鉴权")
        delete cluster._id
        cluster.type = true
        let updateCluster = await this.dbService.MongoDBClient.cluster.updateOne({ remoteAddress }, { $set: cluster })
        assert.deepEqual(updateCluster.result.n, 1, "未通过鉴权")
        socketListenLoop[remoteAddress] = socket
        callback({
          type: "cluster",
          token: cluster,
          remoteAddress,
          remoteFamily,
          remotePort
        })
      } else {
        
        /**
         * 访问指定外的接口.
         * @private
         */
        throw new Error("访问未允许")
      }
    } catch (error) {
      
      /**
       * 发送给客户端错误信息.
       * @private
       */
      wsService.send(socket, {
        event: "ERR_AUTHENTICATION_FAILED",
        message: error.message
      })
      
      /**
       * 强制断开连接.
       * @private
       */
      socket.terminate()
    }
  }
  
  /**
   * 连接事件.
   * @private
   */
  static connection (inthis, socket, req) {
    let {
      headers, url
    } = req
    
    /**
     * websocket鉴权.
     * 被授权连接开始处理事件
     * 未被授权直接关闭中断
     * @private
     */
    inthis.authentication({
      socket, headers, url, req
    }, function (auth) {
      
      /**
       * 接收到数据.
       * @private
       */
      socket.on("message", function (message) {
        inthis.data(message, auth, socket)
      })
      
      /**
       * 断开.
       * @private
       */
      socket.on("close", function () {
        inthis.close(auth)
      })
      
      /**
       * 发生错误.
       * @private
       */
      socket.on("error", function (error) {
        EventEmitters.emit("error", error)
      })
      
      /**
       * 通知客户端准备完成.
       * @private
       */
      setTimeout(function () {
        wsService.send(socket, {
          event: "authonload"
        })
      }, 1000)
    })
  }

  /**
   * 监听事件.
   * @private
   */
  on (event, emit) {
    EventEmitters.on(event, emit)
  }
}


/**
 * 导出类函数
 * @private
 */
module.exports = wsService