/*!
 * 分众快讯 (fenzhongkuaixun)
 * git https://github.com/xivistudios/fenzhongkuaixun.git
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */
"use strict";

/**
 * 页面加载触发
 */
Read(function(exports) {
  function adminMoneryTableGet (data, callback) {
    routerView.adminMoneryTableGet(data, function (error, data){
      if (error) {
        exports.Print("Error", error.message);
      } else {
        vueApp.orders = data
        if (vueApp.orders.length < 50) {
          vueApp.pageNumberRight = false
        } else {
          vueApp.pageNumberRight = true
        }
        callback && callback()
      }
    })
  }
  /**
   * Vue实例
   * @private
   */
  var vueApp = new Vue({
    el: "#vue-docker",
    data: {
      userInfo: {},
      menuHomeStyle: false,
      menuWebStyle: false,
      menuUserStyle: false,
      menuMoneyStyle: true,
      menuMallStyle: false,
      userMenuClass: false,
      Module: Module,
      exports: exports,
      orders: [],
      mall: [],
      modelOrders: {},
      settingsOrders: false,
      userDataFindname: "",
      userDataFinduserinfo: "",
      userDataFindgooddetailsCommodityName: "",
      userDataFindstatus: "0",
      userDataFindid: "",
      filterSortT: false,
      filterSortD: true,
      filtertailsPrice: false,
      filtertailsNumber: false,
      filterdistribution: false,
      filtertime: false,
      filter: {
        sort: 1,
        data: {_id: -1 },
        find: {}
      },
      pageNumber: 1,
      pageNumberLeft: false,
      pageNumberRight: true,
      filtertimeday: true,
      filtertimeZday: false,
      filtertimeYday: false,
      filtertimeAll: false,
      filterClose: false
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
      filtertimeInput: function () {
        setTimeout(function () {
          let start = document.getElementById("startTime").value
          let end = document.getElementById("endTime").value
          if (start.length >= 10 && end.length >= 10) {
            vueApp.filter.find.time = {
              $lt: (new Date(start + " 00:01:00")).getTime(), 
              $gt: (new Date(end + " 23:59:00")).getTime()
            }
            adminMoneryTableGet({
              sort: vueApp.filter.data,
              find: vueApp.filter.find,
            })
          }
        }, 500)
      },
      filtertimedayClick: function () {
        this.filtertimeAll = false
        this.filtertimeday = true
        this.filtertimeZday = false
        this.filtertimeYday = false
        let day = (new Date(`${exports.TimeString(new Date())} 00:01:00`)).getTime()
        let ime = 86400000
        vueApp.filter.find.time = {
          $lt: day, 
          $gt: day - ime
        }
        adminMoneryTableGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filtertimeZdayClick: function () {
        this.filtertimeAll = false
        this.filtertimeday = false
        this.filtertimeZday = true
        this.filtertimeYday = false
        let day = (new Date(`${exports.TimeString(new Date())} 00:01:00`)).getTime()
        let ime = 86400000 * 7
        vueApp.filter.find.time = {
          $lt: day, 
          $gt: day - ime
        }
        adminMoneryTableGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filtertimeYdayClick: function () {
        this.filtertimeAll = false
        this.filtertimeday = false
        this.filtertimeZday = false
        this.filtertimeYday = true
        let day = (new Date(`${exports.TimeString(new Date())} 00:01:00`)).getTime()
        let ime = 86400000 * 30
        vueApp.filter.find.time = {
          $lt: day, 
          $gt: day - ime
        }
        adminMoneryTableGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filtertimeAllClick: function () {
        this.filtertimeAll = true
        this.filtertimeday = false
        this.filtertimeZday = false
        this.filtertimeYday = false
        delete vueApp.filter.find.time
        adminMoneryTableGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      ordersStatus: function (status) {
        if (status === 0) {
          return "成功下单"
        } else
        if (status === 2) {
          return "已发货"
        } else
        if (status === 3) {
          return "已签收"
        } else 
        if (status === 4) {
          return "已退货"
        } else
        if (status === 6) {
          return "已完成"
        } else
        if (status === 9) {
          return "部分退换货"
        } else {
          return "状态不明确"
        }
      },
      ObjectIDtoMall: function (data) {
        if (data.mall) {
          for (let v of vueApp.mall) {
            if (v._id === data.mall) {
              return v.name
              break
            }
          }
        }
      },
      ObjectIDtoID: function (name) {
        if (name) {
          for (let v of vueApp.mall) {
            if (v.name === name) {
              return v._id
              break
            }
          }
        }
      },
      pageNumberLeftClick: function() {
        let skip = Number(vueApp.pageNumber);
        if (skip === 1) {
          vueApp.pageNumberLeft = false;
          return;
        }
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
          skip: skip - 1
        }, function () {
          vueApp.pageNumber = skip - 1
        })
      },
      pageNumberRightClick: function() {
        let skip = Number(vueApp.pageNumber);
        if (vueApp.user.length < 50) {
          vueApp.pageNumberRight = false;
          return;
        }
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
          skip: skip + 1
        }, function () {
          vueApp.pageNumber = skip + 1
        })
      },
      pageNumberSubmit: function(event) {
        if (event.keyCode === 13) {
          let skip = Number(vueApp.pageNumber);
          if (skip === 1) {
            vueApp.pageNumberLeft = false;
          }
          adminMoneryTableGet({ 
            sort: vueApp.filter.data,
            find: vueApp.filter.find,
            skip: skip
          })
        }
      },
      filterSortTClick: function () {
        this.filterSortT = true
        this.filterSortD = false
        this.filter.sort = 1
        for (let v in vueApp.filter.data) {
          vueApp.filter.data[v] = 1
        }
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filterSortDClick: function () {
        this.filterSortT = false
        this.filterSortD = true
        this.filter.sort = -1
        for (let v in vueApp.filter.data) {
          vueApp.filter.data[v] = -1
        }
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filtertailsPriceClick: function() {
        this.filterClose = false
        this.filtertailsPrice = true
        this.filtertailsNumber = false
        this.filterdistribution = false
        this.filtertime = false
        delete this.filter.data._id
        delete this.filter.data.gooddetailsNumber
        delete this.filter.find.distribution
        delete this.filter.data.time
        this.filter.data.gooddetailsPrice = this.filter.sort
        if ("distribution" in this.filter.find) {
          this.filter.find = {}
        }
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filtertailsNumberClick: function() {
        this.filterClose = false
        this.filtertailsPrice = false
        this.filtertailsNumber = true
        this.filterdistribution = false
        this.filtertime = false
        delete this.filter.data._id
        delete this.filter.data.gooddetailsPrice
        delete this.filter.find.distribution
        delete this.filter.data.time
        this.filter.data.gooddetailsNumber = this.filter.sort
        if ("distribution" in this.filter.find) {
          this.filter.find = {}
        }
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filterdistributionClick: function() {
        this.filterClose = false
        this.filtertailsPrice = false
        this.filtertailsNumber = false
        this.filterdistribution = true
        this.filtertime = false
        delete this.filter.data._id
        delete this.filter.data.gooddetailsPrice
        delete this.filter.data.gooddetailsNumber
        delete this.filter.data.time
        this.filter.find.distribution = false
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filtertimeClick: function() {
        this.filterClose = false
        this.filtertailsPrice = false
        this.filtertailsNumber = false
        this.filterdistribution = false
        this.filtertime = true
        delete this.filter.data._id
        delete this.filter.data.gooddetailsPrice
        delete this.filter.data.gooddetailsNumber
        delete this.filter.find.distribution
        this.filter.data.time = this.filter.sort
        if ("distribution" in this.filter.find) {
          this.filter.find = {}
        }
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      filterCloseClick: function () {
        this.filterClose = true
        this.filtertailsPrice = false
        this.filtertailsNumber = false
        this.filterdistribution = false
        this.filtertime = false
        delete this.filter.data.gooddetailsPrice
        delete this.filter.data.gooddetailsNumber
        delete this.filter.find.distribution
        delete this.filter.data.time
        delete this.filter.data._id
        adminMoneryTableGet({ 
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
        })
      },
      menuHome: function() {
        this.menuHomeStyle = this.menuHomeStyle ? false : true;
      },
      menuWeb: function() {
        this.menuWebStyle = this.menuWebStyle ? false : true;
      },
      menuUser: function() {
        this.menuUserStyle = this.menuUserStyle ? false : true;
      },
      menuMoney: function() {
        this.menuMoneyStyle = this.menuMoneyStyle ? false : true;
      },
      menuMall: function() {
        this.menuMallStyle = this.menuMallStyle ? false : true;
      },
      userMenu: function() {
        this.userMenuClass = this.userMenuClass ? false : true;
      },
      hideSettingsOrders: function() {
        this.settingsOrders = false;
      },
      hideSettingsOrdersOpen: function(data) {
        this.settingsOrders = true;
        this.modelOrders = data
        this.modelOrders.userMonery = data.gooddetailsMonery * (data.brokerage / 100)
      },
      hideSettingsOrdersBlock: function(data) {
        if (data.distribution === true) {
          axios.post("/admin/monery/table/dispatch/block", data).then(function (r) {
            if (r.status == 200 && r.data.Status === 200) {
              adminMoneryTableGet({ 
                sort: vueApp.filter.data,
                find: vueApp.filter.find,
              })
            } else {
              exports.Print("Error", r.data.Error)
            }
          })
        }
      },
      settingsOrdersSave: function () {
        if (vueApp.modelOrders.distribution === false) {
          vueApp.modelOrders.distribution = true
          vueApp.modelOrders.distributionTime = (new Date()).getTime()
          vueApp.modelOrders.mall = this.ObjectIDtoID(document.getElementById("modelOrdersMall").value)
          axios.post("/admin/monery/table/dispatch", vueApp.modelOrders).then(function (r) {
            if (r.status == 200 && r.data.Status === 200) {
              vueApp.modelOrders.bill = r.data.Data
              routerView.adminMoneryTableUpdate(vueApp.modelOrders, function (error, data) {
                if (error) {
                  exports.Print("Error", error);
                } else {
                  vueApp.orders.forEach(function (v, i) {
                    if (v._id === data._id) {
                      vueApp.orders[i] = data
                      vueApp.settingsOrders = false;
                    }
                  })
                }
              })
            } else {
              exports.Print("Error", r.data.Error);
            }
          })
        }
      },
      ordersFind: function () {
        let options = {}
        if (vueApp.userDataFindname.length > 0) {
          options.user = vueApp.userDataFindname
        }
        if (vueApp.userDataFinduserinfo.length > 0) {
          options.asin = vueApp.userDataFinduserinfo
        }
        if (vueApp.userDataFindgooddetailsCommodityName.length > 0) {
          options.gooddetailsCommodityName = vueApp.userDataFindgooddetailsCommodityName
        }
        if (document.getElementById("userDataFindmall").value !== "all") {
          options.mall = document.getElementById("userDataFindmall").value
        }
        options.status = Number(vueApp.userDataFindstatus)
        if (vueApp.userDataFindid.length > 0) {
          options.id = vueApp.userDataFindid
        }
        routerView.adminMoneryTableGet({
          sort: vueApp.filter.data,
          find: options,
        }, function(error, data) {
          if (error) {
            exports.Print("Error", error.message);
          } else {
            vueApp.orders = data
            if (vueApp.orders.length < 50) {
              vueApp.pageNumberRight = false;
            }
          }
        })
      }
    }
  });
  /**
   * 获取商城列表
   * @private
   */
  routerView.adminMallListGet(function(error, data) {
    if (error) {
      exports.Print("Error", error);
    } else {
      vueApp.mall = data;
    }
  });
  /**
   * 获取订单数据
   * @private
   */
  let day = (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime()
  let ime = 86400000
  adminMoneryTableGet({
    find:{
      time: {
        $lt: day, 
        $gt: day - ime
      }
    }
  })
  /**
   * 时间选择器
   * @private
   */
  laydate.render({ elem: "#startTime", lang: "zh" });
  laydate.render({ elem: "#endTime", lang: "zh" });
  /**
   * 获取用户信息
   * @private
   */
  routerView.userInfo(function(error, data) {
    if (error) {
      exports.Print("Error", error);
    } else {
      vueApp.userInfo = data;
    }
  });
}, false);
