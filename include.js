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
   * 时间转字符串
   * @private
   */
  toDate (n, type) {
    let y = n.getFullYear()
    let m = n.getMonth() + 1
    let d = n.getDate()
    let h = n.getHours()
    let i = n.getMinutes()
    let s = n.getSeconds()
    if (m < 10) {
      m = "0" + m.toString()
    }
    if (d < 10) {
      d = "0" + d.toString()
    }
    if (type === true) {
      if (h < 10) {
        h = "0" + h.toString()
      }
      if (i < 10) {
        i = "0" + i.toString()
      }
      if (s < 10) {
        s = "0" + s.toString()
      }
      return y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s
    } else {
      return y + "-" + m + "-" + d
    }
  }
  
  /**
   * 对比时间
   * @private
   */
  ifDate (a, b) {
    let atime = new Date(a)
    let btime = new Date(b)
    let autc = atime.getTime()
    let butc = btime.getTime()
    if (autc > butc) {
      return 1
    } else 
    if (autc < butc) {
      return -1
    } else 
    if (autc == butc) {
      return 0
    }
  }
  
  /**
   * 加密
   * @private
   */
  decrypt (keyString) {
    let { configure } = this
    return new Promise(function (resolve, reject) {
      try {
        assert.equal(typeof keyString === "string" || typeof keyString === "number", true)
        keyString = keyString.toString()
        let Cipher = crypto.createCipher(configure.crypto.type, configure.crypto.key)
        let Crypted = Cipher.update(keyString, "utf8", "hex")
        Crypted += Cipher.final("hex")
        resolve(Crypted)
      } catch (Error) {
        reject(Error)
      }
    })
  }
  
  /**
   * 解密
   * @private
   */
  encrypt (keyString) {
    let { configure } = this
    return new Promise(function (resolve, reject) {
      try {
        assert.equal(typeof keyString === "string" || typeof keyString === "number", true)
        keyString = keyString.toString()
        let Decipher = crypto.createDecipher(configure.crypto.type, configure.crypto.key)
        let Dec = Decipher.update(keyString, "hex", "utf8")
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