/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


"use strict"


/**
 * 加载完成
 * @private
 */
Read(async function (exports) {
  let services = []

  /**
   * vue
   * @private
   */
  let vueApp = new Vue(new vueImport({
    el: "#vue-docker",
    data: {
      exports: exports,
      information: {
        user: 0,
        room: 0,
        server: 0
      },
      server: [],
      event: []
    },
    methods: {
      
    }
  }))
  
  /**
   * 连接websocket获取数据
   * @private
   */
  let socket = new websocket("ws://" + hostname + "/socket")
  let sockLoop = {}
  socket.error(function () {
    clearInterval(sockLoop)
    exports.Print("Error", "与服务器断开连接")
  })
  socket.open(function () {
    socket.data(function (data) {
      if (data.event === "systemInfo") {
        if (Array.isArray(data.message)) {
          vueApp.information.server = data.message.length
          for (let v of data.message) {
            let remoteAddress = v.remoteAddress
            for (let x of services) {
              if (x.remoteAddress === remoteAddress) {
                let svi = {}
                svi.name = x.anotherName
                svi.cpu = Math.round(100 - v.cpu[3])
                svi.monery = Math.round((v.totalmem - v.freemem) / v.totalmem * 100)
                svi.io = Math.round(v.loadavg[0] / v.cups / 5 * 100)
                svi.network = Math.round((v.network.domain.receive + v.network.domain.transmit) / x.maxNetwork * 100)
                svi.user = Math.round(10)
                svi.room = Math.round(10)
                svi.remoteAddress = v.remoteAddress
                if (vueApp.server.length === 0) {
                  vueApp.server.push(svi)
                  return
                }
                let arr = []
                for (let k = 0; k < vueApp.server.length; k ++) {
                  if (vueApp.server[k].remoteAddress === svi.remoteAddress) {
                    arr.push(svi)
                  } else {
                    arr.push(vueApp.server[k])
                  }
                }
                vueApp.server = arr
              }
            }
          }
        }
      }
    })
    sockLoop = setInterval(function () {
      socket.emit({
        event: "systemInfo",
        message: ""
      })
    }, 5000)
    socket.emit({
      event: "systemInfo",
      message: ""
    })
  })
  
  /**
   * 获取事件
   * @private
   */
  try {
    let logGetAll = await axios.get("/log/getAll")
    exports.assert(logGetAll.data.Status, 200, logGetAll.data.Error || "")
    vueApp.event = logGetAll.data.Data
  } catch (error) {
    exports.Print("Error", error.message)
  }
  
  /**
   * 获取节点列表
   * @private
   */
   try {
    let clusterGetAll = await axios.get("/cluster/getAll")
    exports.assert(clusterGetAll.data.Status, 200, clusterGetAll.data.Error || "")
    services = clusterGetAll.data.Data
  } catch (error) {
    exports.Print("Error", error.message)
  }
 
  /**
   * 获取未读事件数
   * @private
   */
  try {
    let unreadBellSum = await axios.get("/log/getUnreadBellSum")
    exports.assert(unreadBellSum.data.Status, 200, unreadBellSum.data.Error || "")
    for (let v of unreadBellSum.data.Data) {
      if (v._id == "error") {
        vueApp.bell += v.sum
      }
    }
  } catch (error) {
    exports.Print("Error", error.message)
  }
  
  /**
   * 调整窗口大小
   * @private
   */
  document.body.addEventListener("resize", function () {
    let width = document.documentElement.offsetWidth
    let height = document.body.offsetHeight
    if (width < 1300) {
      vueApp.menuTargetType = false
      vueApp.menuSpanType = false
      vueApp.windowWidth = width - 50
    } else {
      vueApp.menuTargetType = true
      vueApp.menuSpanType = true
      vueApp.menuSpanType = true
      vueApp.windowWidth = width - 200
    }
  })
  
  /**
   * 展开窗口
   * @private
   */
  try {
    for (let i = 0; i < vueApp.menu.length; i ++) {
      vueApp.menu[i].show = vueApp.menu[i].value.includes(useData.value)
    }
  } catch (error) {
    exports.Print("Error", error.message)
  }
  
})