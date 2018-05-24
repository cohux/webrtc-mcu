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
      server: [],
      page: [1],
      settings: false,
      modaltorName: "",
      fromType: "",
      form: [
        {title: "服务名称", input: "", name: "anotherName", placeholder: "节点的别名"},
        {title: "IP地址", input: "", name: "remoteAddress", placeholder: "节点的IP"},
        {title: "网络带宽", input: "", name: "maxNetwork", placeholder: "服务器对外网络带宽(byte)"},
        {title: "监控端口", input: "", name: "bindPort", placeholder: "节点需要监控的端口列表，多个以 (,) 分割"},
        {title: "服务ID", input: "", name: "auth.id", placeholder: "MCU超级服务ID"},
        {title: "服务KEY", input: "", name: "auth.key", placeholder: "MCU超级服务KEY"}
      ],
      view: false,
      servicesName: "",
      services: [],
      serviceType: true,
      serviceId: ""
    },
    methods: {
      
      /**
       * 翻页
       * @private
       */
      pageChange: async function (inthis) {
        try {
          let clusterGetAll = await axios.get("/cluster/getAll?page=" + inthis.target.value)
          exports.assert(clusterGetAll.data.Status, 200, clusterGetAll.data.Error || "")
          vueApp.server = clusterGetAll.data.Data
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 新建服务
       * @private
       */
      addService: function () {
        for (let i = 0; i < this.form.length; i ++) {
          this.form[i].input = ""
        }
        this.settings = true
        this.modaltorName = "新建服务"
        this.fromType = "new"
      },
      
      /**
       * 编辑服务
       * @private
       */
      editService: function (data) {
        this.serviceId = data._id
        this.serviceType = data.type
        for (let i = 0; i < this.form.length; i ++) {
          if (this.form[i].name === "auth.id") {
            this.form[i].input = data.auth.id
          } else
          if (this.form[i].name === "auth.key") {
            this.form[i].input = data.auth.key
          } else {
            this.form[i].input = data[this.form[i].name]
          }
        }
        this.settings = true
        this.modaltorName = "编辑服务"
        this.fromType = "edit"
      },
      
      /**
       * 查看服务
       * @private
       */
      viewService: function (data) {
        this.servicesName = data.anotherName
        location.href = "/view/viewCluster?sig=" + data.remoteAddress
      },
      
      /**
       * 删除服务
       * @private
       */
      delService: async function (data) {
        try {
          let clusterDelService = await axios.post("/cluster/delService", { remoteAddress: data.remoteAddress })
          exports.assert(clusterDelService.data.Status, 200, clusterDelService.data.Error || "")
          let newService = []
            for (let v of vueApp.server) {
              if (v.remoteAddress !== data.remoteAddress) {
                newService.push(v)
              }
            }
            vueApp.server = newService
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
          let from = { auth: {} }
          for (let v of this.form) {
            if (v.name === "auth.id") {
              from.auth.id = v.input
            } else
            if (v.name === "auth.key") {
              from.auth.key = v.input
            } else 
            if (v.name === "bindPort") {
              from[v.name] = v.input.toString()
            } else {
              from[v.name] = v.input
            }
          }
          if (from.bindPort === "") {
            from.bindPort = []
          } else {
            let ar = from.bindPort.split(",")
            if (ar.length > 1) {
              from.bindPort = []
              for (let v of ar) {
                if (! isNaN(v)) {
                  from.bindPort.push(Number(v))
                }
              }
            } else {
              if (! isNaN(from.bindPort)) {
                from.bindPort = [Number(from.bindPort)]
              } else {
                from.bindPort = []
              }
            }
          }
          if (this.fromType === "new") {
            from = Object.assign(from, { type: false })
            let clusterAddService = await axios.post("/cluster/addService", from)
            exports.assert(clusterAddService.data.Status, 200, clusterAddService.data.Error || "")
            vueApp.server.push(from)
            vueApp.settings = false
          } else 
          if (this.fromType === "edit") {
            from = Object.assign(from, { type: this.serviceType, _id: this.serviceId })
            let clusterUpdateService = await axios.post("/cluster/updateService", from)
            exports.assert(clusterUpdateService.data.Status, 200, clusterUpdateService.data.Error || "")
            vueApp.server.forEach(function (v, i) {
              if (v.remoteAddress === from.remoteAddress) {
                vueApp.server[i] = from
                vueApp.settings = false
              }
            })
          }
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
    }
  }))
  
  /**
   * 获取节点列表
   * @private
   */
  try {
    let clusterGetAll = await axios.get("/cluster/getAll")
    exports.assert(clusterGetAll.data.Status, 200, clusterGetAll.data.Error || "")
    vueApp.server = clusterGetAll.data.Data
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