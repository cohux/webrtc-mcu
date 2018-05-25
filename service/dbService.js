/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 * 数据库服务
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const redis = require("redis")
const { promisify } = require("util")
const { MongoClient } = require("mongodb")
const { EventEmitter } = require("events")


/**
 * 事件处理
 * @private
 */
let EventEmitters = new EventEmitter()


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
    let RedisClient = redis.createClient(configure.redis)
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
    RedisClient.on("ready", function () {
      RedisClient.__proto__.Del = promisify(RedisClient.del).bind(RedisClient)
      RedisClient.__proto__.Get = promisify(RedisClient.get).bind(RedisClient)
    })
    RedisClient.on("error", function (error) {
      EventEmitters.emit("error", error)
      throw error
    })
    return {
      MongoDBClient,
      RedisClient
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


/**
 * 导出数据库连接类
 * @private
 */
module.exports = dbService