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
      menuHomeStyle: true,
      menuWebStyle: false,
      menuUserStyle: false,
      menuMoneyStyle: false,
      menuMallStyle: false,
      userMenuClass: false,
      Module: Module
    },
    methods: {
      menuHome: function() {
        this.menuHomeStyle = this.menuHomeStyle ? false : true
      },
      menuWeb: function() {
        this.menuWebStyle = this.menuWebStyle ? false : true
      },
      menuUser: function() {
        this.menuUserStyle = this.menuUserStyle ? false : true
      },
      menuMoney: function() {
        this.menuMoneyStyle = this.menuMoneyStyle ? false : true
      },
      menuMall: function() {
        this.menuMallStyle = this.menuMallStyle ? false : true
      },
      userMenu: function() {
        this.userMenuClass = this.userMenuClass ? false : true
      }
    }
  })
  /**
   * 获取用户信息
   */
  routerView.userInfo(function(error, userInfo) {
    if (error) {
      exports.Print("Error", error.message)
    } else {
      vueApp.userInfo = userInfo
    }
  })
}, false)
