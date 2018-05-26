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
  let remoteAddress = ""
  let serviceChangeInput = ""

  /**
   * vue
   * @private
   */
  let vueApp = new Vue(new vueImport({
    el: "#vue-docker",
    data: {
      exports: exports,
      settings: false,
      view: false,
      servicesName: "",
      serviceType: true,
      serviceId: "",
      service: [],
      cluster: [],
      room: [],
      page: [1],
      newRoom: {
        name: "",
        inputLimit: 0,
        participantLimit: 0
      }
    },
    methods: {
      
      /**
       * 切换服务
       * @private
       */
      serviceChange: async function (inthis) {
        try {
          let id = inthis.target.value
          for (let v of vueApp.service) {
            if (v._id === id) {
              serviceChangeInput = id
              let roomGetRoom = await axios.post("/room/getRooms", { remoteAddress, id: v._id })
              exports.assert(roomGetRoom.data.Status, 200, roomGetRoom.data.Error || "")
              vueApp.room = roomGetRoom.data.Data
              break
            }
          }
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 切换节点
       * @private
       */
      clusterChange: async function (inthis) {
        try {
          remoteAddress = inthis.target.value
          let service = await axios.post("/service/getService", { remoteAddress })
          exports.assert(service.data.Status, 200, service.data.Error || "")
          vueApp.service = service.data.Data
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 翻页
       * @private
       */
      pageChange: async function (inthis) {
        try {
          let page = inthis.target.value
          let roomGetRoom = await axios.post("/room/getRooms", { remoteAddress, id: serviceChangeInput, page: Number(page) })
          exports.assert(roomGetRoom.data.Status, 200, roomGetRoom.data.Error || "")
          vueApp.room = roomGetRoom.data.Data
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 新建房间
       * @private
       */
      addService: function () {
        this.settings = true
        this.newRoom = {
          name: "",
          inputLimit: 0,
          participantLimit: 0
        }
      },
      
      /**
       * 编辑房间
       * @private
       */
      editService: function (data) {
        localStorage.viewRooms = JSON.stringify(data)
        location.href = "/view/viewRooms?service=" + serviceChangeInput + "&remoteAddress=" + remoteAddress
      },
      
      /**
       * 删除房间
       * @private
       */
      delService: async function (data) {
        try {
          let deleteRoom = await axios.post("/room/deleteRoom", {
            remoteAddress: remoteAddress,
            roomId: data._id
          })
          exports.assert(deleteRoom.data.Status, 200, deleteRoom.data.Error || "")
          let newRoom = []
          for (let v of vueApp.room) {
            if (v._id !== data._id) {
              newRoom.push(v)
            }
          }
          vueApp.room = newRoom
          exports.Print("Info", "删除成功")
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 提交新建房间
       * @private
       */
      modaltorSubmit: async function () {
        try {
          exports.assert(vueApp.newRoom.name.length > 0, true, "房间名不能为空")
          let addRoom = await axios.post("/room/addRoom", {
            remoteAddress: remoteAddress,
            room: vueApp.newRoom,
            service: serviceChangeInput
          })
          exports.assert(addRoom.data.Status, 200, addRoom.data.Error || "")
          exports.Print("Info", "新建成功")
          vueApp.room.push(addRoom.data.Data)
          vueApp.settings = false
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
    }
  }))
  
  /**
   * 获取节点和服务列表
   * @private
   */
  try {
    let cluster =  await axios.get("/cluster/getAll")
    exports.assert(cluster.data.Status, 200, cluster.data.Error || "")
    vueApp.cluster = cluster.data.Data
    remoteAddress = vueApp.cluster[0].remoteAddress
    let service = await axios.post("/service/getService", { remoteAddress })
    exports.assert(service.data.Status, 200, service.data.Error || "")
    vueApp.service = service.data.Data
    serviceChangeInput = service.data.Data[0]._id
    let roomGetRoom = await axios.post("/room/getRooms", { remoteAddress, id: serviceChangeInput })
    exports.assert(roomGetRoom.data.Status, 200, roomGetRoom.data.Error || "")
    vueApp.room = roomGetRoom.data.Data
  } catch (error) {
    exports.Print("Error", error.message)
  }
  
  /**
   * 获取事件
   * @private
   */
  try {
    let logGetAll = await axios.get("/log/getAll")
    exports.assert(logGetAll.data.Status, 200, logGetAll.data.Error || "")
    vueApp.event = logGetAll.data.Data
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