/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


/**
 *      
 *          ┌─┐       ┌─┐
 *       ┌──┘ ┴───────┘ ┴──┐
 *       │                 │
 *       │       ───       │
 *       │  ─┬┘       └┬─  │
 *       │                 │
 *       │       ─┴─       │
 *       │                 │
 *       └───┐         ┌───┘
 *           │         │
 *           │         │
 *           │         │
 *           │         └──────────────┐
 *           │                        │
 *           │                        ├─┐
 *           │                        ┌─┘    
 *           │                        │
 *           └─┐  ┐  ┌───────┬──┐  ┌──┘         
 *             │ ─┤ ─┤       │ ─┤ ─┤         
 *             └──┴──┘       └──┴──┘ 
 *                 神兽保佑 
 *                 代码无BUG! 
 */


/**
 * 节点控制注入服务.
 * @private
 */


"use strict"


/**
 * Module dependencies.
 */
const cluster = require("cluster")


/**
 * 主进程
 * @private
 */
if (cluster.isMaster) {
  cluster.fork()
  cluster.on("exit", function(work) {
    setTimeout (function () {
      cluster.fork()
    }, 2000)
  })
} else {
  require("./service")
}