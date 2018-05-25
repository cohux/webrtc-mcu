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

  /**
   * vue
   * @private
   */
  let vueApp = new Vue(new vueImport({
    el: "#vue-docker",
    data: {
      settings: false,
      modaltorName: "",
      fromType: "",
      form: [
        {title: "服务名称", input: "", name: "name", placeholder: "服务名称"},
        {title: "服务KEY", input: "", name: "key", placeholder: "服务KEY"}
      ],
      view: false,
      servicesName: "",
      services: [],
      serviceType: true,
      serviceId: "",
      service: []
    },
    methods: {
      
      /**
       * 切换节点
       * @private
       */
      serviceChange: async function (inthis) {
        try {
          remoteAddress = inthis.tatget.value
          let serviceGetService = await axios.post("/service/getService", { remoteAddress })
          exports.assert(serviceGetService.data.Status, 200, serviceGetService.data.Error || "")
          vueApp.services = serviceGetService.data.Data
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 新建服务
       * @private
       */
      addService: function () {
        this.settings = true
        this.modaltorName = "新建"
      },
      
      /**
       * 删除服务
       * @private
       */
      delService: async function (data) {
        try {
          let newServices = []
          let serviceDeleteService = await axios.post("/service/deleteService", { remoteAddress, id: data._id })
          exports.assert(serviceDeleteService.data.Status, 200, serviceDeleteService.data.Error || "")
          for (let v of vueApp.services) {
            if (v._id !== data._id) {
              newServices.push(v)
            }
          }
          vueApp.services = newServices
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 提交表单
       * @private
       */
      modaltorSubmit: async function () {
        try {
          let data = {}
          for (let v of this.form) {
            data[v.name] = v.input
          }
          let serviceAddService = await axios.post("/service/addService", {
            remoteAddress, 
            name: data.name,
            key: data.key
          })
          exports.assert(serviceAddService.data.Status, 200, serviceAddService.data.Error || "")
          vueApp.services.push(serviceAddService.data.Data)
          vueApp.settings = false
        } catch (error) {
          exports.Print("Error", error.message)
        }
      }
    }
  }))
  
  /**
   * 获取节点列表
   * @private
   */
  try {
    let clusterGetAll = await axios.get("/cluster/getAll")
    exports.assert(clusterGetAll.data.Status, 200, clusterGetAll.data.Error || "")
    vueApp.service = clusterGetAll.data.Data
    remoteAddress = clusterGetAll.data.Data[0].remoteAddress
    let serviceGetService = await axios.post("/service/getService", { remoteAddress })
    exports.assert(serviceGetService.data.Status, 200, serviceGetService.data.Error || "")
    vueApp.services = serviceGetService.data.Data
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