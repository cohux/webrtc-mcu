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
      monery: {
        name: ""
      },
      URL: "",
      toURLon: false,
      openInfoText: "",
      openUserMenu: false,
      pay: false,
      loading: false
    },
    methods: {
      closeURL: function () {
        this.URL = ""
      },
      toURL: function () {
        let link = this.URL
        if (! (link.startsWith("http://") || link.startsWith("https://"))) {
          alert("请输入正确的商品链接")
          return
        }
        this.loading = true
        axios.post("/URLParse", { 
          link: link, 
          id: vueApp.monery._id 
        }).then(function (r) {
          vueApp.loading = false
          if (r.status == 200 && r.data.Status == 200) {
            vueApp.toURLon = true
            vueApp.pay = "http://55fzkx.com/target.html?id=" + r.data.Data
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      openUserMenuClick: function () {
        this.openUserMenu = true
      },
      closeUserMenuClick: function () {
        this.openUserMenu = false
      },
      URLChange: function () {
        vueApp.pay = "#"
        vueApp.toURLon = false
      }
    }
  })
  /**
   * 获取商城信息
   * @private
   */
  if (location.href.split("?id=").length > 1) {
    axios.get("/monery/getMallInfo?id=" + location.href.split("?id=")[1]).then(function(r) {
      if (r.status == 200 && r.data.Status == 200) {
        vueApp.monery = r.data.Data
      } else {
        exports.Print("Error", r.data.Error)
      }
    })
  }
  /**
   * 获取用户信息
   * @private
   */
  axios.get("/userInfo").then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      vueApp.userInfo = r.data.Data
    } else {
      exports.Print("Error", r.data.Error)
    }
  })
}, false)