/*!
 * 分众快讯 (fenzhongkuaixun)
 * git https://github.com/xivistudios/fenzhongkuaixun.git
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */
"use strict"

/**
 * 页面加载触发
 */
Read(function(exports) {
  /**
   * Vue实例
   * @private
   */
  let vueApp = new Vue({
    el: "#vue-docker",
    data: {
      userInfo: {},
      openInfoText: "",
      openUserMenu: false,
      userQQ: "",
      userWechat: "",
      userQQInput: "",
      userWechatInput: "",
      userQQInputClick: false,
      userWechatInputClick: false,
      userInfoClass: true,
      payClass: false,
      reKeyClass: false,
      userkey: "",
      userReKey: ""
    },
    methods: {
      openUserMenuClick: function () {
        this.openUserMenu = true
      },
      closeUserMenuClick: function () {
        this.openUserMenu = false
      },
      editUserData: function (type) {
        if (type === "qq") {
          if (vueApp.userQQInputClick) {
            let qq = document.getElementById("userQQInput").value
            vueApp.userInfo.qq = qq
            axios.post("/user/update", vueApp.userInfo).then(function (r) {
              if (r.status == 200 && r.data.Status == 200) {
                vueApp.userQQ = qq
                vueApp.userQQInputClick = false
              } else {
                exports.Print("Error", r.data.Error)
              }
            })
          } else {
            vueApp.userQQ = "<input type=\"text\" value=" + vueApp.userInfo.qq + " id=\"userQQInput\" />"
            vueApp.userQQInputClick = true
          }
        } else {
          if (vueApp.userWechatInputClick) {
            let wechat = document.getElementById("userWechatInput").value
            vueApp.userInfo.wechat = wechat
            axios.post("/user/update", vueApp.userInfo).then(function (r) {
              if (r.status == 200 && r.data.Status == 200) {
                vueApp.userWechat = wechat
                vueApp.userWechatInputClick = false
              } else {
                exports.Print("Error", r.data.Error)
              }
            })
          } else {
            vueApp.userWechat = "<input type=\"text\" value=" + vueApp.userInfo.wechat + " id=\"userWechatInput\" />"
            vueApp.userWechatInputClick = true
          }
        }
      },
      userInfoTab: function () {
        this.userInfoClass = true
        this.payClass = false
        this.reKeyClass = false
      },
      payIdTab: function () {
        this.userInfoClass = false
        this.payClass = true
        this.reKeyClass = false
      },
      reKeyTab: function () {
        this.userInfoClass = false
        this.payClass = false
        this.reKeyClass = true
      },
      updateAlipay: function () {
        if (this.userInfo.alipay.length > 0 && this.userInfo.name.length > 0) {
          axios.post("/user/update", vueApp.userInfo).then(function (r) {
            if (r.status == 200 && r.data.Status == 200) {
              alert("修改成功")
            } else {
              exports.Print("Error", r.data.Error)
            }
          })
        }
      },
      updateKey: function () {
        let key = this.userkey
        let reKey = this.userReKey
        if (key.length > 6 && key === key) {
          axios.post("/user/updateKey", {
            key: key
          }).then(function (r) {
            if (r.status == 200 && r.data.Status == 200) {
              location.href = "/login"
            } else {
              exports.Print("Error", r.data.Error)
            }
          })
        }
      }
    }
  })
  /**
   * 获取用户信息
   * @private
   */
  axios.get("/userInfo").then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      vueApp.userInfo = r.data.Data
      vueApp.userQQ = vueApp.userInfo.qq
      vueApp.userWechat = vueApp.userInfo.wechat
    } else {
      exports.Print("Error", r.data.Error)
    }
  })
}, false)