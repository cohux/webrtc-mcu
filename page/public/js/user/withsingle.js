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
      openUserMenu: false,
      mall: [],
      orders: [],
      exports: exports,
      pageLeftStyle: false,
      pageRightStyle: false,
      pageNumber: 1,
      find: {}
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
      openUserMenuClick: function () {
        this.openUserMenu = true
      },
      closeUserMenuClick: function () {
        this.openUserMenu = false
      },
      ObjectIDtoMall: function (id) {
        for (let v of vueApp.mall) {
          if (v._id === id) {
            return v.name
            break
          }
        }
      },
      pageLeft: function () {
        let page = Number(vueApp.pageNumber)
        if (page == 1) {
          this.pageLeftStyle = false
          return
        }
        axios.post("/withsingle/getOrders", {
          find: vueApp.find,
          skip: page - 1
        }).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            vueApp.orders = r.data.Data
            vueApp.pageNumber = page - 1
            if (vueApp.orders.length < 50) {
              vueApp.pageRightStyle = false
            }
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      pageRight: function () {
        let page = Number(vueApp.pageNumber)
        axios.post("/withsingle/getOrders", {
          find: vueApp.find,
          skip: page + 1
        }).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            vueApp.orders = r.data.Data
            vueApp.pageNumber = page + 1
            if (vueApp.orders.length < 50) {
              vueApp.pageRightStyle = false
            }
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      pageNumberSubmit: function (event) {
        if (event.keyCode === 13) {
          let page = Number(vueApp.pageNumber)
          if (page === 1) {
            vueApp.pageLeftStyle = false
          }
          axios.post("/withsingle/getOrders", {
            find: vueApp.find,
            skip: page
          }).then(function (r) {
            if (r.status === 200 && r.data.Status === 200) {
              vueApp.orders = r.data.Data
              if (vueApp.orders.length < 50) {
                vueApp.pageRightStyle = false
              } else {
                vueApp.pageRightStyle = true
              }
            } else {
              exports.Print("Error", r.data.Error)
            }
          })
        }
      },
      malltab: function (event) {
        var mall = event.target.value
        if (mall == "all") {
          vueApp.find = {}
        } else {
          vueApp.find = { mall: mall }
        }
        axios.post("/withsingle/getOrders", {
          find: vueApp.find,
        }).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            vueApp.orders = r.data.Data
            if (vueApp.orders.length < 50) {
              vueApp.pageRightStyle = false
            } else {
              vueApp.pageRightStyle = true
            }
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      timeThisDay: function () {
        axios.post("/withsingle/getOrders", {
          find: { distributionTime: {
            $lt: (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime(), 
            $gt: (new Date(`${exports.TimeString(new Date())} 00:01:01`)).getTime()
          }},
        }).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            vueApp.orders = r.data.Data
            if (vueApp.orders.length < 50) {
              vueApp.pageRightStyle = false
            } else {
              vueApp.pageRightStyle = true
            }
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      timeSD: function () {
        var day = (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime()
        var ime = 86400000 * 7
        axios.post("/withsingle/getOrders", {
          find: { distributionTime: {
            $lt: day, 
            $gt: day - ime
          }},
        }).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            vueApp.orders = r.data.Data
            if (vueApp.orders.length < 50) {
              vueApp.pageRightStyle = false
            } else {
              vueApp.pageRightStyle = true
            }
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      timeOY: function () {
        var day = (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime()
        var ime = 86400000 * 30
        axios.post("/withsingle/getOrders", {
          find: { distributionTime: {
            $lt: day, 
            $gt: day - ime
          }},
        }).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            vueApp.orders = r.data.Data
            if (vueApp.orders.length < 50) {
              vueApp.pageRightStyle = false
            } else {
              vueApp.pageRightStyle = true
            }
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      timeSY: function () {
        var day = (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime()
        var ime = 86400000 * 90
        axios.post("/withsingle/getOrders", {
          find: { distributionTime: {
            $lt: day, 
            $gt: day - ime
          }},
        }).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            vueApp.orders = r.data.Data
            if (vueApp.orders.length < 50) {
              vueApp.pageRightStyle = false
            } else {
              vueApp.pageRightStyle = true
            }
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
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
   * 获取订单
   * @private
   */
  axios.post("/withsingle/getOrders").then(function (r) {
    if (r.status === 200 && r.data.Status === 200) {
      vueApp.orders = r.data.Data
    } else {
      exports.Print("Error", r.data.Error)
    }
  })
  /* 获取用户信息
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