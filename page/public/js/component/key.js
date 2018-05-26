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
      exports: exports,
      user: [],
      page: [1],
      settings: false,
      modelType: "新建",
      model: {
        username: "",
        key: "",
        carrier: "",
        roles: {
          room: { add: false, edit: false, get: false, delete: false },
          service: { add: false, edit: false, get: false, delete: false },
          cluster: { add: false, edit: false, get: false, delete: false }
        }
      },
      keyCarrier: [
        {value: "cookie", text: "COOKIE"},
        {value: "header", text: "HEADER"},
        {value: "query", text: "URL QUERY"},
        {value: "body", text: "REQUEST BODY"},
      ]
    },
    methods: {
      
      /**
       * 翻页
       * @private
       */
      pageChange: async function (inthis) {
        try {
          let getUsers = await axios.get("/key/getUsers?page=" + inthis.target.value)
          exports.assert(getUsers.data.Status, 200, getUsers.data.Error || "")
          vueApp.user = getUsers.data.Data
          for (let i = 0; i < vueApp.user.length; i ++) {
            try {
              let getUserToken = await axios.get("/key/getUserToken?username=" + vueApp.user[i].username)
              exports.assert(getUserToken.data.Status, 200, getUserToken.data.Error || "")
              vueApp.user[i].session = getUserToken.data.Data
            } catch (error) {
              vueApp.user[i].session = "获取失败"
            }
          }
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 添加用户
       * @private
       */
      addUser: function () {
        this.settings = true
        this.modelType = "新建"
        this.model = {
          username: "",
          key: "",
          carrier: "cookie",
          roles: {
            room: { add: false, edit: false, get: false, delete: false },
            service: { add: false, edit: false, get: false, delete: false },
            cluster: { add: false, edit: false, get: false, delete: false }
          }
        }
      },
      
      /**
       * 编辑用户
       * @private
       */
      editUser: function (data) {
        this.settings = true
        this.modelType = "编辑"
        this.model = data
      },
      
      /**
       * 删除用户
       * @private
       */
      delUser: async function (data) {
        try {
          let deleteUsers = await axios.post("/key/deleteUsers", { id: data._id })
          exports.assert(deleteUsers.data.Status, 200, deleteUsers.data.Error || "")
          let newUser = []
          for (let v of vueApp.user) {
            if (v._id !== data._id) {
              newUser.push(v)
            }
          }
          vueApp.user = newUser
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 刷新动态密钥
       * @private
       */
      flushSession: async function (data) {
        try {
          let flushSession = await axios.post("/key/flushSession", { id: data._id })
          exports.assert(flushSession.data.Status, 200, flushSession.data.Error || "")
          for (let i = 0; i < vueApp.user.length; i ++) {
            if (vueApp.user[i]._id === data._id) {
              vueApp.user[i].session = flushSession.data.Data
              break
            }
          }
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
          if (this.modelType === "新建") {
            exports.assert(this.model.username.length > 0, true, "请输入用户名")
            exports.assert(this.model.key.length > 0, true, "请输入密钥")
            let addUsers = await axios.post("/key/addUsers", this.model)
            exports.assert(addUsers.data.Status, 200, addUsers.data.Error || "")
            vueApp.user.push(addUsers.data.Data)
            this.settings = false
          } else {
            let updateUsers = await axios.post("/key/updateUsers", this.model)
            exports.assert(updateUsers.data.Status, 200, updateUsers.data.Error || "")
            for (let i = 0; i < vueApp.user.length; i ++) {
              if (vueApp.user[i]._id === updateUsers.data.Data._id) {
                vueApp.user[i] = updateUsers.data.Data
                this.settings = false
                break
              }
            }
          }
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
    }
  }))
  
  /**
   * 获取所有用户
   * @private
   */
  try {
    let getUsers = await axios.get("/key/getUsers")
    exports.assert(getUsers.data.Status, 200, getUsers.data.Error || "")
    vueApp.user = getUsers.data.Data
    for (let i = 0; i < vueApp.user.length; i ++) {
      try {
        let getUserToken = await axios.get("/key/getUserToken?username=" + vueApp.user[i].username)
        exports.assert(getUserToken.data.Status, 200, getUserToken.data.Error || "")
        vueApp.user[i].session = getUserToken.data.Data
      } catch (error) {
        vueApp.user[i].session = "获取失败"
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