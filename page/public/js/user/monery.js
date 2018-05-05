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
      mall: [],
      userInfo: {},
      openInfo: false,
      openInfoTitle: "",
      openInfoTitleName: "",
      openInfoText: "",
      openUserMenu: false
    },
    methods: {
      initMath: function (number, length) {
        let numberstr = (String(number)).split(".")
        if (numberstr.length === 1) {
          return number
        } else {
          return Number(`${numberstr[0]}.${numberstr[1].slice(0, length)}`)
        }
      },
      openMallInfo: function (data) {
        this.openInfo = true
        this.openInfoTitle = "佣金说明"
        this.openInfoTitleName = data.name
        this.openInfoText = data.moneryInfo
      },
      openMallPay: function (data) {
        this.openInfo = true
        this.openInfoTitle = "结算规则"
        this.openInfoTitleName = data.name
        this.openInfoText = data.payInfo
      },
      hideOpenInfo: function () {
        this.openInfo = false
      },
      openUserMenuClick: function () {
        this.openUserMenu = true
      },
      closeUserMenuClick: function () {
        this.openUserMenu = false
      }
    }
  })
  /**
   * 获取商城列表
   * @private
   */
  axios.get("/monery/getMall").then(function (r) {
    if (r.status === 200 && r.data.Status === 200) {
      vueApp.mall = r.data.Data
    } else {
      exports.Print("Error", r.data.Error)
    }
  })
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
