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
const zlib = require("zlib")
const assert = require("assert")
const crypto = require("crypto")
const querystring = require("querystring")


/**
 * 工具类
 * @private
 */
class include {
  constructor (configure) {
    this.configure = configure
  }
  
  /**
   * 计算MD5
   * @private
   */
  md5 (str) {
    try {
      assert.equal(typeof str, "string")
      return crypto.createHash("md5").update(str).digest("hex")
    } catch (error) {
      return false
    }
  }
  
  /**
   * HMAC SHA256
   * @private
   */
  hmacSHA256 (key, toSign) {
    return new Promise(function (resolve, reject) {
      try {
        assert.equal(typeof key === "string" || typeof key === "number", true)
        key = key.toString()
        let Crypted = crypto.createHmac("sha256", key).update(toSign).digest("hex")
        resolve(Buffer.from(Crypted).toString("base64"))
      } catch (error) {
        reject(error)
      }
    })
  }
  
  /**
   * 加密
   * @private
   */
  decrypt (key) {
    return new Promise((resolve, reject) => {
      try {
        assert.equal(typeof key === "string" || typeof key === "number", true)
        key = key.toString()
        let Cipher = crypto.createCipher(this.configure.crypto.type, this.configure.crypto.key)
        let Crypted = Cipher.update(key, "utf8", "hex")
        Crypted += Cipher.final("hex")
        resolve(Crypted)
      } catch (error) {
        reject(error)
      }
    })
  }
  
  /**
   * 解密
   * @private
   */
  encrypt (key) {
    return new Promise(function (resolve, reject) {
      try {
        assert.equal(typeof key === "string" || typeof key === "number", true)
        key = key.toString()
        let Decipher = crypto.createDecipher(this.configure.crypto.type, this.configure.crypto.key)
        let Dec = Decipher.update(key, "hex", "utf8")
        Dec += Decipher.final("utf8")
        resolve(Dec)
      } catch (Error) {
        reject(Error)
      }
    })
  }
  
  /**
   * 读取文件
   * @private
   */
  readFile (path) {
    return new Promise(function (resolve, reject) {
      fs.readFile(path, function (error, data) {
        error ? reject(error) : resolve(data)
      })
    })
  }
  
}


/**
 * 导出类
 * @private
 */
module.exports = include