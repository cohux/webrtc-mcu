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
Read(function (exports) {
  // 用户名
  let username = ""

  /**
   * vue
   * @private
   */
  let vueApp = new Vue({
    el: "#vue-docker",
    data: {
      inputType: "text",
      inputPlaceholder: "输入你的账号",
      input: "",
      module: "name",
      button: "下一步",
      type: "登录",
      block: false,
      username: ""
    },
    methods: {

      /**
       * 下一步
       * @private
       */
      next: function () {
        if (this.module === "name") {
          username = vueApp.input
          axios.post("/auth/verificationUserName", {
            username: vueApp.input
          }).then(function(r) {
            if (r.status === 200 && r.data.Status == 200) {
              vueApp.input = ""
              vueApp.inputPlaceholder = "请输入密码"
              vueApp.inputType = "password"
              vueApp.button = "登录"
              vueApp.module = "pass"
              vueApp.type = "输入密码"
              vueApp.block = true
              vueApp.username = username
            } else {
              exports.Print("Error", r.data.Error)
            }
          })
        } else
        if (this.module === "pass") {
          axios.post("/auth/login", {
            username: username,
            password: vueApp.input
          }).then(function(r) {
            if (r.status === 200 && r.data.Status == 200) {
              location.href = "/view/console"
            } else {
              exports.Print("Error", r.data.Error)
            }
          })
        } else {
          return
        }
      },

      /**
       * 回到输入帐户名
       * @private
       */
      blockUserName: function () {
        vueApp.input = username
        vueApp.inputPlaceholder = "输入你的账号"
        vueApp.inputType = "text"
        vueApp.button = "下一步"
        vueApp.module = "name"
        vueApp.type = "登录"
        vueApp.block = false
        vueApp.username = ""
      },

      /**
       * 键盘回车提交
       * @private
       */
      keys: function (tar) {
        if (tar.keyCode === 13) {
          vueApp.next()
        }
      }
    }
  })
  
})