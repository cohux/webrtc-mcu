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
Read(function (exports) {
  /**
   * Vue实例
   * @private
   */
  var vueApp = new Vue({
    el: "#vue-docker",
    data: {
      newsSum: 0,
      userInfo: {},
      menuHomeStyle: false,
      menuWebStyle: true,
      menuUserStyle: false,
      menuMoneyStyle: false,
      menuMallStyle: false,
      userMenuClass: false,
      Module: Module,
      moneyrate: [],
      addMoneyrateType: "",
      addMoneyratePush: "",
      addMoneyrateConter: "",
      exports: exports
    },
    methods: {
      newsTrash: function (id) {
        routerView.adminPageMoneyrateDelete(id, function (error, data) {
          if (error) {
            exports.Print("Error", error)
          } else {
            let newNews = []
            for (let v of vueApp.moneyrate) {
              v._id !== data && newNews.push(v)
            }
            vueApp.moneyrate = newNews
          }
        })
      },
      addNews: function () {
        try {
          let addMoneyrateType = this.addMoneyrateType
          let addMoneyratePush = this.addMoneyratePush
          let addMoneyrateConter = this.addMoneyrateConter
          exports.assert(addMoneyrateType.length > 0, true)
          exports.assert(addMoneyratePush.length > 0, true)
          exports.assert(addMoneyrateConter.length > 0, true)
          routerView.adminPageMoneyrateAdd({
            type: addMoneyrateType,
            push: Number(addMoneyratePush),
            conter: Number(addMoneyrateConter)
          }, function (error, data) {
            if (error) {
              exports.Print("Error", error)
            } else {
              vueApp.moneyrate.push(data)
            }
          })
        } catch (error) {
          exports.Print("Error", "参数错误")
        }
      },
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
      },
    }
  })
  /**
   * 获取汇率
   * @private
   */
  routerView.viewGetMoneyrate(function (error, data) {
    if (error) {
      exports.Print("Error", error)
    } else {
      vueApp.moneyrate = data
    }
  })
}, false)