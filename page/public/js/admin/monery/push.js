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
  function getReport (data, callback) {
    axios.post("/admin/monery/push/get", data).then(function (r) {
      if (r.status === 200 && r.data.Status === 200) {
        vueApp.report = r.data.Data
        if (vueApp.report.length < 50) {
          vueApp.pageNumberRight = false
        } else {
          vueApp.pageNumberRight = true
        }
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
      brokerage: [],
      mall: [],
      mallbrokerage: {},
      userInfo: {},
      menuHomeStyle: false,
      menuWebStyle: false,
      menuUserStyle: false,
      menuMoneyStyle: true,
      menuMallStyle: false,
      userMenuClass: false,
      Module: Module,
      exports: exports,
      report: [],
      filterSortT: true,
      filterSortD: false,
      filter: {
        sort: 1,
        data: {},
        find: {}
      },
      pageNumber: 1,
      pageNumberLeft: false,
      pageNumberRight: true
    },
    methods: {
      pushBlock: function (data) {
        axios.get("/admin/monery/push/block?id=" + data._id).then(function (r) {
          if (r.status === 200 && r.data.Status === 200) {
            let newReport = []
            for (let v of vueApp.report) {
              if (v._id != r.data.Data) {
                newReport.push(v)
              }
            }
            vueApp.report = newReport
          } else {
            exports.Print("Error", r.data.Error)
          }
        })
      },
      findReport: function () {
        setTimeout(function () {
          let mall  = document.getElementById("findMall").value
          let start = document.getElementById("startTime").value
          let end = document.getElementById("endTime").value
          vueApp.filter.find = { name: mall, time: {
            $lt: (new Date(start + " 23:59:00")).getTime(), 
            $gt: (new Date(end + " 00:01:00")).getTime()
          } }
          getReport({
            sort: vueApp.filter.data,
            find: vueApp.filter.find
          })
        }, 500)
      },
      ObjectIDtoMall: function (id) {
        if (id) {
          for (let v of vueApp.mall) {
            if (v._id === id) {
              return v.name
              break
            }
          }
        }
      },
      uploadfile: function () {
        let file = document.getElementById("uploadfile").files[0]
        let nameParse = file.name.split(".")
        let mmietype = nameParse[nameParse.length - 1]
        if (mmietype === "xlsx") {
          routerView.files(file, function (error, data) {
            if (error) {
              exports.Print("Error", error.message)
            } else {
              axios.post("/admin/monery/push/upload", {
                mall: document.getElementById("uploadMall").value,
                data: data
              }).then(function (r) {
                if (r.status === 200 && r.data.Status === 200) {
                  vueApp.report.push(r.data.Data)
                  if (vueApp.report.length < 50) {
                    vueApp.pageNumberRight = false
                  } else {
                    vueApp.pageNumberRight = true
                  }
                } else {
                  exports.Print("Error", r.data.Error)
                }
              })
            }
          })
        }
      },
      pageNumberLeftClick: function() {
        let skip = Number(vueApp.pageNumber);
        if (skip === 1) {
          vueApp.pageNumberLeft = false;
          return;
        }
        getReport({
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
        getReport({
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
          getReport({
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
        this.filter.data = { _id: this.filter.sort };
        getReport({
          sort: vueApp.filter.data,
          find: vueApp.filter.find
        })
      },
      filterSortDClick: function() {
        this.filterSortD = true;
        this.filterSortT = false;
        this.filter.sort = -1;
        this.filter.data = { _id: this.filter.sort };
        getReport({
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
      vueApp.mall = data
      for (let v of data) {
        vueApp.mallbrokerage[v._id] = {
          brokerage: v.brokerage,
          brokerageOffline: v.brokerageOffline
        }
      }
    }
  })
  /**
   * 加载文件列表
   * @private
   */
  getReport({})
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
