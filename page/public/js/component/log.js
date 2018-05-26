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
  let logEvent = []
  let viewEvent = []

  /**
   * vue
   * @private
   */
  let vueApp = new Vue(new vueImport({
    el: "#vue-docker",
    data: {
      exports: exports,
      event: [],
      page: [1],
      allDeleteType: false
    },
    methods: {
      
      /**
       * 翻页
       * @private
       */
      pageChange: async function (inthis) {
        try {
          let logGetAll = await axios.get("/log/getAll?page=" + inthis.target.value)
          exports.assert(logGetAll.data.Status, 200, logGetAll.data.Error || "")
          for (let v of logGetAll.data.Data) {
            vueApp.event.push(Object.assign(v, { checkbox: false }))
          }
          logEvent = vueApp.event
          viewEvent = vueApp.event
          for (let v of logGetAll.data.Data) {
            if (v.type == "error" && vueApp.error.length < 5) {
              vueApp.error.push(v)
            }
          }
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 全部已读
       * @private
       */
      allRead: async function () {
        for (let i = 0; i < vueApp.event.length; i ++) {
          try {
            let read = await axios.post("/log/readInfo", { id: vueApp.event[i]._id })
            exports.assert(read.data.Status, 200, read.data.Error || "")
            vueApp.event[i].read = true
          } catch (error) {
            exports.Print("Error", error.message)
          }
        }
      },
      
      /**
       * 切换事件类型
       * @private
       */
      typeChange: function (inthis) {
        vueApp.event = []
        viewEvent = []
        for (let v of logEvent) {
          if (v.type === inthis.target.value) {
            let data = Object.assign(v, { checkbox: false })
            vueApp.event.push(data)
            viewEvent.push(data)
          }
        }
      },
      
      /**
       * 切换未读
       * @private
       */
      readChange: function (inthis) {
        if (inthis.target.value === "read") {
          vueApp.event = []
          for (let v of viewEvent) {
            if (v.read === false) {
              vueApp.event.push(v)
            }
          }
        } else {
          vueApp.event = viewEvent
        }       
      },
      
      /**
       * 全部删除
       * @private
       */
      allDelete: async function () {
        let log = vueApp.event
        for (let v of log) {
          if (v.checkbox) {
            await vueApp.delLog(v)
          }
        }
      },
      
      /**
       * 全部选择
       * @private
       */
      allOn: function () {
        let log = vueApp.event
        vueApp.event = []
        vueApp.allDeleteType = ! vueApp.allDeleteType
        for (let v of log) {
          v.checkbox = ! v.checkbox
          vueApp.event.push(v)
        }
      },
      
      /**
       * 删除日志
       * @private
       */
      delLog: async function (data) {
        try {
          let deleteLog = await axios.post("/log/delete", { id: data._id })
          exports.assert(deleteLog.data.Status, 200, deleteLog.data.Error || "")
          let log = vueApp.event
          vueApp.event = []
          for (let v of log) {
            if (v._id !== data._id) {
              vueApp.event.push(v)
            }
          }
          logEvent = vueApp.event
          viewEvent = vueApp.event
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
    }
  }))
  
  /**
   * 获取事件
   * @private
   */
  try {
    let logGetAll = await axios.get("/log/getAll")
    exports.assert(logGetAll.data.Status, 200, logGetAll.data.Error || "")
    for (let v of logGetAll.data.Data) {
      vueApp.event.push(Object.assign(v, { checkbox: false }))
    }
    logEvent = vueApp.event
    viewEvent = vueApp.event
    for (let v of logGetAll.data.Data) {
      if (v.type == "error" && vueApp.error.length < 5) {
        vueApp.error.push(v)
      }
    }
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