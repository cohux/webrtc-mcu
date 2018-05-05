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
  function adminMoneryParseGet (data, callback) {
    routerView.adminMoneryParseGet(data, function(error, data) {
      if (error) {
        exports.Print("Error", error)
      } else {
        vueApp.url = data;
        if (vueApp.url.length < 50) {
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
      url: [],
      mall: [],
      hideSettingsUserData: {},
      brokerageSelf: "",
      brokerageOffline: "",
      setUserKey: "",
      setUserReKey: "",
      userDataFindName: "",
      userDataFindASIN: "",
      userDataFindQQ: "",
      userDataFindIP: "",
      userDataFindWechat: "",
      filterSortT: false,
      filterSortD: true,
      filter: {
        sort: -1,
        data: {_id: -1},
        find: {}
      },
      pageNumber: 1,
      pageNumberLeft: false,
      pageNumberRight: true,
      filtertimeday: true,
      filtertimeZday: false,
      filtertimeYday: false
    },
    methods: {
      filtertimeInput: function () {
        setTimeout(function () {
          let start = document.getElementById("startTime").value
          let end = document.getElementById("endTime").value
          if (start.length >= 10 && end.length >= 10) {
            adminMoneryParseGet({
              sort: vueApp.filter.data,
              find:{
                time: {
                  $lt: (new Date(start + " 00:01:00")).getTime(), 
                  $gt: (new Date(end + " 23:59:00")).getTime()
                }
              }
            })
          }
        }, 500)
      },
      filtertimedayClick: function () {
        this.filtertimeday = true
        this.filtertimeZday = false
        this.filtertimeYday = false
        let day = (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime()
        let ime = 86400000
        adminMoneryParseGet({
          sort: vueApp.filter.data,
          find:{
            time: {
              $lt: day, 
              $gt: day - ime
            }
          }
        })
      },
      filtertimeZdayClick: function () {
        this.filtertimeday = false
        this.filtertimeZday = true
        this.filtertimeYday = false
        let day = (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime()
        let ime = 86400000 * 7
        adminMoneryParseGet({
          sort: vueApp.filter.data,
          find:{
            time: {
              $lt: day, 
              $gt: day - ime
            }
          }
        })
      },
      filtertimeYdayClick: function () {
        this.filtertimeday = false
        this.filtertimeZday = false
        this.filtertimeYday = true
        let day = (new Date(`${exports.TimeString(new Date())} 23:59:00`)).getTime()
        let ime = 86400000 * 30
        adminMoneryParseGet({
          sort: vueApp.filter.data,
          find:{
            time: {
              $lt: day, 
              $gt: day - ime
            }
          }
        })
      },
      ObjectIDtoMall: function (id) {
        for (let v of vueApp.mall) {
          if (v._id === id) {
            return v.name
            break
          }
        }
      },
      pageNumberLeftClick: function() {
        let skip = Number(vueApp.pageNumber)
        if (skip === 2) {
          vueApp.pageNumberLeft = false;
          return;
        } else {
	  vueApp.pageNumberLeft = true
	}
        adminMoneryParseGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find,
          skip: skip - 1
        }, function () {
          vueApp.pageNumber = skip - 1
        })
      },
      pageNumberRightClick: function() {
        let skip = Number(vueApp.pageNumber);
        if (vueApp.url.length < 50) {
          vueApp.pageNumberRight = false;
          return;
        }
	if (skip >= 1) {
	  vueApp.pageNumberLeft = true
	}
        adminMoneryParseGet({
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
          } else {
	    vueApp.pageNumberLeft = true
	  }
          adminMoneryParseGet({
            sort: vueApp.filter.data,
            find: vueApp.filter.find,
            skip: skip
          })
        }
      },
      filterSortTClick: function() {
        this.filterSortT = true;
        this.filterSortD = false;
        this.filter.sort = 1;
        this.filter.data = { _id: this.filter.sort }
        adminMoneryParseGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterSortDClick: function() {
        this.filterSortD = true;
        this.filterSortT = false;
        this.filter.sort = -1;
        this.filter.data = { _id: this.filter.sort };
        adminMoneryParseGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
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
      userDataFind: function() {
        let options = {};
        if (vueApp.userDataFindName.length > 0) {
          options.id = vueApp.userDataFindName;
        }
        if (vueApp.userDataFindASIN.length > 0) {
          options.asin = vueApp.userDataFindASIN;
        }
        if (vueApp.userDataFindQQ.length > 0) {
          options.qq = vueApp.userDataFindQQ;
        }
        if (vueApp.userDataFindIP.length > 0) {
          options.ip = vueApp.userDataFindIP;
        }
        if (vueApp.userDataFindWechat.length > 0) {
          options.wechat = vueApp.userDataFindWechat;
        }
        vueApp.filter.data = { _id: vueApp.filter.sort }
        vueApp.filter.find = options
        adminMoneryParseGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
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
   * 获取链接列表
   * @private
   */
  let start = document.getElementById("startTime").value
  let end = document.getElementById("endTime").value
  adminMoneryParseGet({
    sort: { _id: -1 },
    find:{
      time: {
        $lt: (new Date(start + " 00:01:00")).getTime(), 
        $gt: (new Date(end + " 23:59:00")).getTime()
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
