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
      newsSum: 0,
      userInfo: {},
      menuHomeStyle: false,
      menuWebStyle: true,
      menuUserStyle: false,
      menuMoneyStyle: false,
      menuMallStyle: false,
      userMenuClass: false,
      Module: Module,
      news: [],
      page: [1],
      exports: exports
    },
    methods: {
      newsTrash: function (id) {
        routerView.adminPageNewsDelete(id, function (error, data) {
          if (error) {
            exports.Print("Error", error)
          } else {
            let newNews = []
            for (let v of vueApp.news) {
              v._id !== data && newNews.push(v)
              vueApp.news = newNews
            }
          }
        })
      },
      pageTurning: function (id) {
        
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
      moduleString: function (code) {
        switch (code) {
          case 0:
            return "商品"
          case 1:
            return "文章"
          case 2:
            return "置顶"
          break
        }
      },
      modelKey: function (code) {
        
      },
      addNews: function () {
        location.href = "/admin/page/news/edit"
      }
    }
  })
  /**
   * 获取动态
   * @private
   */
  routerView.adminPageNewsGet(function (error, data) {
    if (error) {
      exports.Print("Error", error)
    } else {
      vueApp.news = data
    }
  })
  /**
   * 获取页数
   * @private
   */
  routerView.adminPageNewsGetSum(function (error, data, sum) {
    if (error) {
      exports.Print("Error", error)
    } else {
      vueApp.page = data
      vueApp.newsSum = sum
    }
  })
  /**
   * 获取用户信息
   */
  routerView.userInfo(function(error, data) {
    if (error) {
      exports.Print("Error", error)
    } else {
      vueApp.userInfo = data
    }
  })
}, false);
