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
  function adminUserVipGet (data, callback) {
    routerView.adminUserVipGet(data, function(error, data) {
      if (error) {
        exports.Print("Error", error.message);
      } else {
        vueApp.user = data
        adminUserToURLNumber()
        if (vueApp.user.length < 50) {
          vueApp.pageNumberRight = false
        } else {
          vueApp.pageNumberRight = true
        }
        callback && callback()
      }
    })
  }
  function adminUserToURLNumber () {
    vueApp.user.forEach(function (v, i) {
      routerView.adminUserToURLNumber(v.id, function (error, data) {
        if (error) {
          vueApp.user[i].toURLNumberSum = 0
        } else {
          vueApp.user[i].toURLNumberSum = data
        }
      })
    })
  }
  /**
   * Vue实例
   * @private
   */
  var vueApp = new Vue({
    el: "#vue-docker",
    data: {
      brokerage: [],
      mall: [],
      mallbrokerage: {},
      userInfo: {},
      menuHomeStyle: false,
      menuWebStyle: false,
      menuUserStyle: true,
      menuMoneyStyle: false,
      menuMallStyle: false,
      userMenuClass: false,
      Module: Module,
      exports: exports,
      user: [],
      settings: false,
      settingsKey: false,
      settingsUser: false,
      userMonerySettingsName: "",
      session: {
        _id: undefined
      },
      hideSettingsUserData: {},
      brokerageSelf: "",
      brokerageOffline: "",
      setUserKey: "",
      setUserReKey: "",
      userDataFindName: "",
      userDataFindEmail: "",
      userDataFindQQ: "",
      userDataFindWechat: "",
      userDataFindFeedbackID: "",
      filterSortT: true,
      filterSortD: false,
      filterConditionConvert: false,
      filterConditionOffline: false,
      filterConditionMonery: false,
      filterConditionLogin: false,
      filterIncom: false,
      filterMonery: false,
      filterYery: false,
      filter: {
        sort: -1,
        data: {}
      },
      pageNumber: 1,
      pageNumberLeft: false,
      pageNumberRight: true
    },
    methods: {
      userFreeze: function (data) {
        data.freeze = data.freeze ? false : true
        routerView.adminUserUpdate(data, function(error, data) {
          if (error) {
            exports.Print("Error", error.message)
          } else {
            vueApp.user.forEach(function(v, i) {
              if (v._id === data._id) {
                vueApp.user[i] = data
                vueApp.settings = false
              }
            })
          }
        })
      },
      pageNumberLeftClick: function() {
        let skip = Number(vueApp.pageNumber);
        if (skip === 1) {
          return;
        }
        if (skip === 2) {
          vueApp.pageNumberLeft = false;
        }
        adminUserVipGet({
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
          return
        }
        vueApp.pageNumberLeft = true
        adminUserVipGet({
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
            vueApp.pageNumberLeft = false
          }
          adminUserVipGet({
            sort: vueApp.filter.data,
            find: vueApp.filter.find,
            skip: skip
          })
        }
      },
      filterIncomClick: function() {
        this.filterIncom = true;
        this.filterMonery = false;
        this.filterYery = false;
        this.filter.find = { authoritySpread: true, offlineUser: 0 }
        adminUserVipGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterMoneryClick: function() {
        this.filterIncom = false;
        this.filterMonery = true;
        this.filterYery = false;
        this.filter.find = { brokerage: { $type: 3 } }
        adminUserVipGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterYeryClick: function() {
        this.filterIncom = false;
        this.filterMonery = false;
        this.filterYery = true;
      },
      filterConditionConvertClick: function() {
        this.filterConditionConvert = true;
        this.filterConditionDown = false;
        this.filterConditionOffline = false;
        this.filterConditionMonery = false;
        this.filterConditionLogin = false;
        this.filter.data = { toURLNumberSum: this.filter.sort };
        adminUserVipGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterConditionOfflineClick: function() {
        this.filterConditionConvert = false;
        this.filterConditionDown = false;
        this.filterConditionOffline = true;
        this.filterConditionMonery = false;
        this.filterConditionLogin = false;
        this.filter.data = { offlineUser: this.filter.sort };
        adminUserVipGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterConditionMoneryClick: function() {
        this.filterConditionConvert = false;
        this.filterConditionDown = false;
        this.filterConditionOffline = false;
        this.filterConditionMonery = true;
        this.filterConditionLogin = false;
        this.filter.data = 4;
      },
      filterConditionLoginClick: function() {
        this.filterConditionConvert = false;
        this.filterConditionDown = false;
        this.filterConditionOffline = false;
        this.filterConditionMonery = false;
        this.filterConditionLogin = true;
        this.filter.data = 5;
        this.filter.data = { loginTime: this.filter.sort };
        adminUserVipGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterSortTClick: function() {
        this.filterSortT = true;
        this.filterSortD = false;
        this.filter.sort = 1;
        this.filter.data = { soginTime: this.filter.sort };
        adminUserVipGet({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterSortDClick: function() {
        this.filterSortD = true;
        this.filterSortT = false;
        this.filter.sort = -1;
        this.filter.data = { soginTime: this.filter.sort };
        adminUserVipGet({
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
      hideSettings: function() {
        this.settings = false;
      },
      hideSettingsKey: function() {
        this.settingsKey = false;
      },
      hideSettingsUser: function() {
        this.settingsUser = false;
      },
      hideSettingsOpen: function(data) {
        this.userMonerySettingsName = data.id;
        this.settings = true;
        this.session._id = data._id;
        this.brokerageSelf = data.brokerageSelf;
        this.brokerageOffline = data.brokerageOffline;
        this.hideSettingsUserData = data;
        if (data.brokerage === true) {
          vueApp.brokerage = vueApp.mall;
        } else {
          let neWbrokerage = [];
          for (let v of vueApp.mall) {
            if (typeof data.brokerage[v._id] === "object") {
              neWbrokerage.push({
                _id: v._id,
                name: v.id,
                info: v.info,
                image: v.image,
                moneryInfo: v.moneryInfo,
                payInfo: v.payInfo,
                urlMatch: v.urlMatch,
                brokerage: data.brokerage[v._id].brokerage,
                brokerageOffline: data.brokerage[v._id].brokerageOffline
              });
            } else {
              neWbrokerage.push({
                _id: v._id,
                name: v.id,
                info: v.info,
                image: v.image,
                moneryInfo: v.moneryInfo,
                payInfo: v.payInfo,
                urlMatch: v.urlMatch,
                brokerage: v.brokerage,
                brokerageOffline: v.brokerageOffline
              });
            }
          }
          vueApp.brokerage = neWbrokerage;
        }
      },
      hideSettingsClose: function() {
        this.settings = false;
      },
      hideSettingsKeyOpen: function(data) {
        this.userMonerySettingsName = data.id;
        this.settingsKey = true;
        this.session._id = data._id;
        this.hideSettingsUserData = data;
        this.setUserKey = "";
        this.setUserKey = "";
      },
      hideSettingsKeyClose: function() {
        this.settingsKey = false;
      },
      hideSettingsUserOpen: function(data) {
        this.userMonerySettingsName = data.id;
        this.settingsUser = true;
        this.session._id = data._id;
        this.hideSettingsUserData = data;
      },
      submitMoneySettings: function() {
        let newMallbrokerage = {};
        for (let v of vueApp.brokerage) {
          let value = vueApp.mallbrokerage[v._id];
          if (
            Number(value.brokerage) !== v.brokerage ||
            Number(value.brokerageOffline) !== v.brokerageOffline
          ) {
            newMallbrokerage[v._id] = {
              brokerage: Number(v.brokerage),
              brokerageOffline: Number(v.brokerageOffline)
            };
          }
        }
        if (Object.keys(newMallbrokerage).length > 0) {
          this.hideSettingsUserData.brokerage = newMallbrokerage;
        } else {
          this.hideSettingsUserData.brokerage = true;
          vueApp.settings = false;
        }
        routerView.adminUserUpdate(this.hideSettingsUserData, function(error, data) {
          if (error) {
            exports.Print("Error", error.message);
          } else {
            vueApp.user.forEach(function(v, i) {
              if (v._id === data._id) {
                vueApp.user[i] = data;
                vueApp.settings = false;
              }
            });
          }
        });
      },
      submitKeySettings: function() {
        if (
          this.setUserKey.length > 6 &&
          this.setUserKey === this.setUserReKey
        ) {
          this.hideSettingsUserData.key = this.setUserKey;
          routerView.adminUserUpdate(this.hideSettingsUserData, function(
            error,
            data
          ) {
            if (error) {
              exports.Print("Error", error.message);
            } else {
              vueApp.user.forEach(function(v, i) {
                if (v._id === data._id) {
                  vueApp.user[i] = data;
                  vueApp.settingsKey = false;
                }
              });
            }
          });
        }
      },
      settingsUserSave: function() {
        routerView.adminUserUpdate(this.hideSettingsUserData, function(
          error,
          data
        ) {
          if (error) {
            exports.Print("Error", error.message);
          } else {
            vueApp.user.forEach(function(v, i) {
              if (v._id === data._id) {
                vueApp.user[i] = data;
                vueApp.settingsUser = false;
              }
            });
          }
        });
      },
      userAuthoritySpread: function(data) {
        let input = document.getElementById(`userAuthoritySpread-` + data._id);
        data.authoritySpread = input.checked;
        routerView.adminUserUpdate(data, function(error, data) {
          if (error) {
            exports.Print("Error", error.message);
          } else {
            vueApp.user.forEach(function(v, i) {
              if (v._id === data._id) {
                vueApp.user[i] = data;
              }
            });
          }
        });
      },
      userAuthorityTransaction: function(data) {
        let input = document.getElementById(
          `userAuthorityTransaction-` + data._id
        );
        data.authorityTransaction = input.checked;
        routerView.adminUserUpdate(data, function(error, data) {
          if (error) {
            exports.Print("Error", error.message);
          } else {
            vueApp.user.forEach(function(v, i) {
              if (v._id === data._id) {
                vueApp.user[i] = data;
              }
            });
          }
        });
      },
      userDataFind: function() {
        let options = {};
        if (vueApp.userDataFindName.length > 0) {
          options.id = vueApp.userDataFindName;
        }
        if (vueApp.userDataFindEmail.length > 0) {
          options.email = vueApp.userDataFindEmail;
        }
        if (vueApp.userDataFindQQ.length > 0) {
          options.qq = vueApp.userDataFindQQ;
        }
        if (vueApp.userDataFindWechat.length > 0) {
          options.wechat = vueApp.userDataFindWechat;
        }
        if (vueApp.userDataFindFeedbackID.length > 0) {
          options.feedbackID = vueApp.userDataFindFeedbackID;
        }
        adminUserVipGet({
          sort: { soginTime: -1 },
          find: options
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
      for (let v of data) {
        vueApp.mallbrokerage[v._id] = {
          brokerage: v.brokerage,
          brokerageOffline: v.brokerageOffline
        };
      }
    }
  });
  /**
   * 加载用户
   * @private
   */
  adminUserVipGet({
    sort: { soginTime: -1 }
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
