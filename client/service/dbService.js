/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 数据库连接服务.
 * @private
 */
"use strict"


/**
 * Module dependencies.
 */
const mongodb = require("mongodb")


/**
 * 数据库连接类
 * @private
 */
class dbService {
  constructor (configure) {
    this.configure = configure
  }
  
  /**
   * 连接数据库
   * @private
   */
  connection () {
    let { configure } = this
    let MongoDBClient = {}
    let mongoURI = "mongodb://" + configure.mongodb.host + ":" + configure.mongodb.port
    MongoClient.connect(mongoURI, function (error, Mongo) {
      if (error) {
        EventEmitters.emit("error", error)
        throw error
      } else {
        for (let v of configure.mongodb.document) {
          MongoDBClient[v] = Mongo.db(configure.mongodb.dbname).collection(v)
        }
      }
    })
    return {
      MongoDBClient
    }
  }
  
  /**
   * 监听事件
   * @private
   */
  on (event, emit) {
    EventEmitters.on(event, emit)
  }
}


// 暴露服务
module.exports = dbService