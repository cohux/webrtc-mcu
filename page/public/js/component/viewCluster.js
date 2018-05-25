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

  /**
   * vue
   * @private
   */
  let vueApp = new Vue(new vueImport({
    el: "#vue-docker",
    data: {
      server: {
        "arch": "",
        "hostname": "",
        "release": "",
        "type": "",
        "cups": 0,
        "networkInterfaces": {},
        "loadavg": [],
        "uptime": 0,
        "freemem": 0,
        "totalmem": 0,
        "network": {
          "node": {
            "name": "",
            "receive": 0,
            "transmit": 0
          },
          "domain": {
            "name": "",
            "receive": 4616,
            "transmit": 157964
          },
          "listenPort": [],
          "listenList": []
        },
        "cpu": [],
        "remoteAddress": ""
      }
    },
    methods: {
    }
  }))
  
  /**
   * 获取节点信息
   * @private
   */
  try {
    let clusterGetService = await axios.post("/cluster/getService", { remoteAddress: location.href.split("=")[1] })
    exports.assert(clusterGetService.data.Status, 200, clusterGetService.data.Error || "")
    vueApp.server = clusterGetService.data.Data
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
  document.body.onresize = function () {
    let width = document.documentElement.offsetWidth
    let height = document.body.offsetHeight
    vueApp.windowHeight = height - 49
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
  }
  
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