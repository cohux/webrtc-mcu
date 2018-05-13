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
const childProcess = require("child_process")


/*!
 * Date转字符串
 * @private
 */
exports.DateInt = function (init, split = "-") {
  let data = parseInt(init), 
      umt = new Date(1E3 * data)
  return umt.getFullYear() + split + (umt.getMonth() +1) + split + umt.getDate()
}


/*!
 * MD5计算
 * @private
 */
exports.md5 = function (str) {
  try {
    assert.equal(typeof str, "string")
    return crypto.createHash("md5").update(str).digest("hex")
  } catch (error) {
    return false
  }
}


/*!
 * 获取标准格式时间
 * @private
 */
exports.TimeString = function (now, da) {
  let year = now.getFullYear(), 
      month = now.getMonth() + 1,
      data = da ? da : now.getDate()
  if (month < 10) {
    month = "0" + month.toString()
  }
  if (data < 10) {
    data = "0" + data.toString()
  }
  return `${year}-${month}-${data}`
}


/*!
 * 对比时间
 * @private
 */
exports.ifTime = function (a, b) {
  let atime = new Date(a),
      btime = new Date(b),
      autc = atime.getTime(),
      butc = btime.getTime()
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


/*!
 * 日期加减换算
 * @private
 */
exports.AddDate = function (date, days) { 
  let d = new Date(date)
  d.setDate(d.getDate() + days)
  let month = d.getMonth() + 1,
      data = d.getDate()
  if (month < 10) {
    month = "0" + month.toString()
  }
  if (data < 10) {
    data = "0" + data.toString()
  }
  return `${d.getFullYear()}-${month}-${data}`
}


/*!
 * 字符串限定
 * @private
 */
exports.StrLimit = function (str, limit) {
  if (str.length > limit) {
    return `${str.substring(0, limit - 3)}...`
  } else {
    return str
  }
}


/*!
 * 加密
 * @private 
 */
exports.Decrypt = function (keyString) {
  return new Promise((resolve, reject) => {
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


/*!
 * 解密
 * @private
 */
exports.Encrypt = function (keyString) {
  return new Promise((resolve, reject) => {
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


/*!
 * 多精度浮点
 * @private
 */
exports.initMath = function (number, length) {
  let numberstr = (String(number)).split(".")
  if (numberstr.length === 1) {
    return number
  } else {
    return Number(`${numberstr[0]}.${numberstr[1].slice(0, length)}`)
  }
}