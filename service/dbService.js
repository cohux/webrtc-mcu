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
const util = require("util")
const mongodb = require("mongodb")
const amqp = require("amqplib")
const pgp = require("pg-promise")
const { EventEmitter } = require("events")


/**
 * 事件处理
 * @private
 */
let EventEmitters = new EventEmitter()
let mongodConnect = util.promisify(mongodb.MongoClient.connect)


/**
 * 数据库连接类
 * @private
 */
class dbService {
  constructor () {
    this.MongoDBClient = {}
    this.RedisClient = {}
    this.RabbitMQ = {}
    this.PostgreSQL = {}
  }
  
  
  /**
   * 连接Monogodb数据库
   * @private
   */
  mongodb (options) {
    mongodConnect(options.path, options.options || {}).then(mongod => {
      for (let v of options.document) {
        this.MongoDBClient[v] = mongod.db(options.dbname).collection(v)
      }
    }).catch(error => {
      EventEmitters.emit("error", error)
      throw error
    })
  }
  
  
  /**
    * 连接Redis数据库
    * @private
    */
  redis (options) {
    this.RedisClient = redis.createClient(options)
    this.RedisClient.on("ready", () => {
      this.RedisClient.__proto__.Del = util.promisify(this.RedisClient.del).bind(this.RedisClient)
      this.RedisClient.__proto__.Get = util.promisify(this.RedisClient.get).bind(this.RedisClient)
    })
    this.RedisClient.on("error", function (error) {
      EventEmitters.emit("error", error)
      throw error
    })
  }
  
  
  /**
    * 连接RabbitMQ
    * @private
    */
  rabbitmq (options) {
    amqp.connect(options).then(connect => {
      this.RabbitMQ = connect
    }).catch(function (error) {
      EventEmitters.emit("error", error)
      throw error
    })
  }
  
  
  /**
    * 连接postgresql
    * @private
    */
  postgresql (options) {
    try {
      let postgresql = pgp({ capSQL: true })
      this.PostgreSQL = postgresql(options)
    } catch (error) {
      EventEmitters.emit("error", error)
      throw error
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
 * 导出类函数
 * @private
 */
module.exports = dbService