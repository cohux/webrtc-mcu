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
   * 获取邀请收入
   * @private
   */
  function getIncome (data, callback) {
    axios.post("/income/get", data).then(function (r) {
      if (r.status == 200 && r.data.Status == 200) {
        vueApp.bill = r.data.Data
        if (r.data.Data.length < 50) {
          vueApp.pageRightStyle = false
        } else {
          vueApp.pageRightStyle = true
        }
        vueApp.incomeData.user = r.data.Data.length
        vueApp.incomeData.monery = 0
        vueApp.bill.forEach(function (v, i) {
          vueApp.incomeData.monery += v.monery
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
      income: {
        time: []
      },
      bill: [],
      pageLeftStyle: false,
      pageRightStyle: false,
      pageNumber: 1,
      time: "",
      incomeData: {}
    },
    methods: {
      openUserMenuClick: function () {
        this.openUserMenu = true
      },
      closeUserMenuClick: function () {
        this.openUserMenu = false
      },
      hideOpenInfo: function () {
        this.openInfo = false
      },
      pageLeft: function () {
        let page = Number(vueApp.pageNumber)
        if (page == 1) {
          this.pageLeftStyle = false
          return
        }
        getIncome({
          time: vueApp.time,
          skip: page - 1
        }, function () {
          vueApp.pageNumber = page - 1
        })
      },
      pageRight: function () {
        let page = Number(vueApp.pageNumber)
        getIncome({
          time: vueApp.time,
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
          getIncome({
            time: vueApp.time,
            skip: page
          })
        }
      },
      tabTime: function (event) {
        getIncome({
          time: event.target.value,
          skip: 1
        })
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
  /**
   * 初始化时间
   * @private
   */
  let time = new Date()
  let sTime = time.getFullYear()
  for (let i = 1; i > -2; i --) {
    var y = String(time.getMonth() + i)
    vueApp.income.time.push(sTime + "-" + (y.length == 1 ? "0" + y : y))
    if (i == 1) {
      vueApp.time = sTime + "-" + (y.length == 1 ? "0" + y : y)
    }
  }
  getIncome({
    time: vueApp.income.time[0],
    skip: 1
  })
}, false)