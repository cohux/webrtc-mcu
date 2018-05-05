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
function DateInt (Init, split = "-") {
  let Data = parseInt(Init)
  let UMT = new Date(1E3 * Data)
  return UMT.getFullYear() + split + (UMT.getMonth() +1) + split + UMT.getDate()
}


/*!
 * MD5计算
 * @private
 */
function md5 (str) {
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
function TimeString (now, data) {
  let Year = now.getFullYear()
  let Month = now.getMonth() + 1
  let Data = data ? data : now.getDate()
  if (Month < 10) {
    Month = "0" + Month.toString()
  }
  if (Data < 10) {
    Data = "0" + Data.toString()
  }
  return `${Year}-${Month}-${Data}`
}


/*!
 * 对比时间
 * @private
 */
function ifTime (a, b) {
  assert.deepEqual(typeof a, "string")
  assert.deepEqual(typeof b, "string")
  let atime = new Date(a)
  let btime = new Date(b)
  let aUTC = atime.getTime()
  let bUTC = btime.getTime()
  if (aUTC > bUTC) {
    return 1
  } else 
  if (aUTC < bUTC) {
    return -1
  } else 
  if (aUTC == bUTC) {
    return 0
  }
}


/*!
 * 日期加减换算
 * @private
 */
function AddDate (date, days) { 
  let D = new Date(date)
  D.setDate(D.getDate() + days)
  let Month = D.getMonth() + 1
  let Data = D.getDate()
  if (Month < 10) {
    Month = "0" + Month.toString()
  }
  if (Data < 10) {
    Data = "0" + Data.toString()
  }
  return `${D.getFullYear()}-${Month}-${Data}`
}


/*!
 * 字符串限定
 * @private
 */
function StrLimit (str, limit) {
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
function Decrypt (keyString) {
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
function Encrypt (keyString) {
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
function initMath (number, length) {
  let numberstr = (String(number)).split(".")
  if (numberstr.length === 1) {
    return number
  } else {
    return Number(`${numberstr[0]}.${numberstr[1].slice(0, length)}`)
  }
}


// 导出模块
module.exports = {
  Decrypt,
  Encrypt,
  TimeString,
  StrLimit,
  AddDate,
  DateInt,
  ifTime,
  md5,
  initMath
}