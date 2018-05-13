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
const toml = require("toml")
const configure = toml.parse(fs.readFileSync("./configure.toml"))
const { promisify } = require("util")
const { MongoClient } = require("mongodb")
const redis = require("redis")


/**
 * 数据库连接对象
 * @private
 */
let MongoDBClient = {}
let RedisClient = redis.createClient(configure.redis)


/*!
 * 连接到mongodb
 * @private
 */
MongoClient.connect(configure.mongodb.path, function (error, Mongo) {
  for (let v of configure.mongodb.document) {
    MongoDBClient[v] = Mongo.db(configure.mongodb.dbname).collection(v)
  }
})


/*!
 * redis连接失败时触发
 * 触发错误
 */
RedisClient.on("error", function (error) {
  setTimeout(function () {
    RedisClient = redis.createClient(configure.redis)
  }, 2000)
})


/*!
 * 修改 redis 对象的原型链
 * 增加 async 异步 promise 封装
 * 以大写字母开头的原方法和类
 */
RedisClient.on("ready", function () {
  RedisClient.__proto__.Del = promisify(RedisClient.del).bind(RedisClient)
  RedisClient.__proto__.Get = promisify(RedisClient.get).bind(RedisClient)
})


/**
 * 导出数据库连接
 * @private
 */
module.exports = {
  MongoDBClient,
  RedisClient
}