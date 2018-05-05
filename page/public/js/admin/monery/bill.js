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
  /**
   * 获取用户佣金列表
   * @private
   */
  function getOrders (data, callback) {
    axios.post("/admin/monery/bill/get", data).then(function (r) {
      if (r.status == 200 && r.data.Status == 200) {
        vueApp.bill = r.data.Data
        r.data.Data.forEach(function (v, i) {
          for (let x of vueApp.mall) {
            if (x._id === v.mall) {
              vueApp.bill[i].mall = x.name
            }
          }   
        })
        if (vueApp.bill.length < 50) {
          vueApp.pageNumberRight = false;
        } else {
          vueApp.pageNumberRight = true;
        }
        vueApp.mall.forEach(function (x, i) {
          vueApp.mall[i].monery = {
            monery: { sum: 0, ok: 0, no: 0 },
            income: { sum: 0, ok: 0, no: 0 }
          }
          for (let v of vueApp.bill) {
            if (v.mall === x.name) {
              vueApp.mall[i].monery[v.type === "inthis" ? "monery" : "income" ].sum += v.monery
              if (v.status) {
                vueApp.mall[i].monery.monery.ok += v.monery
              } else {
                vueApp.mall[i].monery.monery.no += v.monery
              }
            }
          }
        })
        callback && callback()
      } else {
        exports.Print("Error", r.data.Error)
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
      mall: [],
      userInfo: {},
      menuHomeStyle: false,
      menuWebStyle: false,
      menuUserStyle: false,
      menuMoneyStyle: true,
      menuMallStyle: false,
      userMenuClass: false,
      Module: Module,
      exports: exports,
      bill: [],
      filterSortT: true,
      filterSortD: false,
      filter: {
        sort: 1,
        data: {}
      },
      pageNumber: 1,
      pageNumberLeft: false,
      pageNumberRight: true,
      time: [],
      monery: {
        sum: 0,
        ok: 0,
        no: 0
      },
      find: {
        user: "",
        mall: ""
      },
      filterSortT: true,
      filterSortD: false,
      filterConditionConvert: false,
      pageNumberLeft: false,
      pageNumberRight: true,
      pageNumber: 1,
      billSum: "",
      onClosedAccount: false,
      BillType: "monery"
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
      tabBillSum: function () {
        vueApp.monery = {}
        for (let v of vueApp.mall) {
          if (v._id === vueApp.billSum) {
            vueApp.monery = v.monery[vueApp.BillType]
          }
        }
      },
      pageNumberLeftClick: function() {
        let skip = Number(vueApp.pageNumber)
        if (skip === 1) {
          vueApp.pageNumberLeft = false;
          return;
        }
        getOrders({
          find: { time: vueApp.tabTime },
          skip: skip - 1
        }, function () {
          vueApp.pageNumber = skip - 1
        })
      },
      pageNumberRightClick: function() {
        let skip = Number(vueApp.pageNumber)
        if (vueApp.user.length < 50) {
          vueApp.pageNumberRight = false;
          return;
        }
        getOrders({
          find: { time: vueApp.tabTime },
          skip: skip + 1
        }, function () {
          vueApp.pageNumber = skip + 1
        })
      },
      pageNumberSubmit: function(event) {
        if (event.keyCode === 13) {
          let skip = Number(vueApp.pageNumber)
          if (skip === 1) {
            vueApp.pageNumberLeft = false;
          }
          getOrders({
            find: { time: vueApp.tabTime },
            skip: skip
          }, function () {
            vueApp.pageNumber = skip
          })
        }
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
      closedBill: function () {
        let day = (exports.TimeString(new Date())).slice(0, 7)
        if (vueApp.tabTime === day) {
            alert("当前月不能封帐")
        } else {
          vueApp.onClosedAccount = true
        }
      },
      onClosedAccountClick: function () {
        axios.post("/admin/monery/bill/alipayPid", {
          time: vueApp.tabTime
        }).then(function (r) {
          if (r.status == 200 && r.data.Status == 200) {
            alert("封帐成功")
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      tabBillType: function () {
        console.log(vueApp.mall)
        vueApp.monery = {}
        for (let v of vueApp.mall) {
          if (v._id === vueApp.billSum) {
            vueApp.monery = v.monery[vueApp.BillType]
          }
        }
      },
      findOrders: function () {
        if (vueApp.find.user.length == 0) {
          delete vueApp.find.user
        }
        getOrders({
          sort: { _id: 1 },
          find: vueApp.find
        })
      },
      filterSortTClick: function () {
        this.filterSortT = true
        this.filterSortD = false
        vueApp.filter.sort = 1
        getOrders({
          sort: { _id: 1 },
          find: { time: vueApp.tabTime }
        })
      },
      filterSortDClick: function () {
        this.filterSortT = false
        this.filterSortD = true
        vueApp.filter.sort = -1
        getOrders({
          sort: { _id: -1 },
          find: { time: vueApp.tabTime }
        })
      },
      filterConditionConvertClick: function () {
        getOrders({
          sort: { monery: vueApp.filter.sort },
          find: { time: vueApp.tabTime }
        })
      },
      tabsTime: function (event) {
        let time = event.target.value
        getOrders({
          sort: vueApp.filter.data,
          find: { time }
        })
        vueApp.tabTime = time
      },
      editAlipayPid: function (data) {
        if (data.payPid == 'false' || data.payPid.length == 0) {
          data.status = false
          data.payPid = false
          data.payTime = false
        } else {
          data.status = true
          data.payTime = (new Date()).getTime()
        }
        axios.post("/admin/monery/bill/update", data).then(function (r) {
          if (r.status == 200 && r.data.Status == 200) {
            vueApp.bill.forEach(function (v, i) {
              if (v._id == r.data.Data._id) {
                vueApp.bill[i] = r.data.Data
              }
            })
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
  routerView.adminMallListGet(function(error, data) {
    if (error) {
      exports.Print("Error", error);
    } else {
      vueApp.mall = data;
      vueApp.find.mall = data[0]._id
      vueApp.billSum = data[0]._id
    }
  });
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
  /**
   * 初始化时间
   * @private
   */
  let time = new Date()
  let sTime = time.getFullYear()
  for (let i = 1; i > -2; i --) {
    var y = String(time.getMonth() + i)
    vueApp.time.push(sTime + "-" + (y.length == 1 ? "0" + y : y))
    if (i == 1) {
      vueApp.tabTime = sTime + "-" + (y.length == 1 ? "0" + y : y)
    }
  }
  getOrders({
    find: { time: vueApp.tabTime }
  })
  setTimeout(function () {
    for (let v of vueApp.mall) {
      if (v._id === vueApp.billSum) {
        vueApp.monery = v.monery.monery
      }
    }
  }, 2000)
}, false);
