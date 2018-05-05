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
   * 获取商城信息
   * @private
   */
  function getMallInfo (id, callback) {
    axios.get("/monery/getMallInfo?id=" + id).then(function (r) {
      if (r.status == 200 && r.data.Status == 200) {
        callback(r.data.Data)
      } else {
        exports.Print("Error", r.data.Error)
      }
    })
  }
  /**
   * 获取订单收入
   * @private
   */
  function getOrderes (data, callback) {
    axios.post("/invite/get", data).then(function(r) {
      if (r.status == 200 && r.data.Status == 200) {
        vueApp.bill = r.data.Data
        if (r.data.Data.length < 50) {
          vueApp.pageRightStyle = false
        } else {
          vueApp.pageRightStyle = true
        }
        vueApp.bill.forEach(function (v, i) {
          getMallInfo(v.mall, function (data) {
            vueApp.bill[i].mall = data.name
          })
        })
        callback && callback(r.data.Data)
      } else {
        exports.Print("Error", r.data.Error)
      }
    })
  }
  /**
   * Vue实例
   * @private
   */
  let vueApp = new Vue({
    el: "#vue-docker",
    data: {
      userInfo: {},
      openUserMenu: false,
      openInfo: false,
      bill: [],
      moneryType: "订单",
      tabType: 0,
      pageLeftStyle: false,
      pageRightStyle: false,
      pageNumber: 1,
      find: { type: "inthis" }
    },
    methods: {
      initMath: function (number, length) {
        var numberstr = (String(number)).split(".")
        if (numberstr.length === 1) {
          return number
        } else {
          return Number(`${numberstr[0]}.${numberstr[1].slice(0, length)}`)
        }
      },
      openUserMenuClick: function () {
        this.openUserMenu = true
      },
      closeUserMenuClick: function () {
        this.openUserMenu = false
      },
      hideOpenInfo: function () {
        this.openInfo = false
      },
      ObjectIDtoMall: function (id) {
        for (let v of vueApp.mall) {
          if (v._id === id) {
            return v.name
            break
          }
        }
      },
      orders: function () {
        this.tabType = 0
        this.moneryType = "订单"
        vueApp.find = { type: "inthis" }
        getOrderes({
          find: vueApp.find,
          skip: 1
        })
      },
      income: function () {
        this.tabType = 1
        this.moneryType = "推广"
        vueApp.find = { type: "income" }
        getOrderes({
          find: vueApp.find,
          skip: 1
        })
      },
      pageLeft: function () {
        let page = Number(vueApp.pageNumber)
        if (page == 1) {
          this.pageLeftStyle = false
          return
        }
        getOrderes({
          find: vueApp.find,
          skip: page - 1
        }, function () {
          vueApp.pageNumber = page - 1
        })
      },
      pageRight: function () {
        let page = Number(vueApp.pageNumber)
        getOrderes({
          find: vueApp.find,
          skip: page + 1
        }, function () {
          vueApp.pageNumber = page + 1
        })
      },
      pageNumberSubmit: function (event) {
        if (event.keyCode === 13) {
          let page = Number(vueApp.pageNumber)
          if (page === 1) {
            vueApp.pageLeftStyle = false
          }
          getOrderes({
            find: vueApp.find,
            skip: page
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
      if ( ! (r.data.Data.alipay && r.data.Data.name) ) {
        vueApp.openInfo = true
      }
    } else {
      exports.Print("Error", r.data.Error)
    }
  })
  getOrderes({
    find: vueApp.find,
    skip: 1
  })
}, false)