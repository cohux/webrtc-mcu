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
      menuWebStyle: false,
      menuUserStyle: false,
      menuMoneyStyle: false,
      menuMallStyle: true,
      userMenuClass: false,
      Module: Module,
      mall: [],
      exports: exports,
      newMall: false,
      session: {
        name: "",
        info: "",
        image: "",
        moneyInfo: "",
        payInfo: ""
      },
      newsIconImageSrc: "",
      newsIconImage: false,
      mallTitle: "",
      mallInfo: "",
      submitNew: true,
      mallURL: "",
      mallBrokerage: "",
      mallBrokerageOffline: "",
      toURLPath: ""
    },
    methods: {
      newsTrash: function (id) {
        routerView.adminMallDelete(id, function (error, data) {
          if (error) {
            exports.Print("Error", error)
          } else {
            let mall = []
            for (let v of vueApp.mall) {
              if (v._id !== id) {
                mall.push(v)
              }
            }
            vueApp.mall = mall
          }
        })
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
      hideNewMall: function () {
        this.newMall = false
      },
      hideNewMallClose: function () {
        this.newMall = false
      },
      hideNewMallOpen: function () {
        this.newMall = true
        CKEDITOR.instances.mallMoneryInfo.setData("")
        CKEDITOR.instances.mallPayInfo.setData("")
      },
      submitNewMall: function () {
        try {
          vueApp.submitNew = true
          let file = document.getElementById("newsIconImage").files
          exports.assert(file.length > 0, true)
          routerView.files(file[0], function (error, data) {
            if (error) {
              exports.Print("Error", error)
            } else {
              routerView.adminMallAdd({
                name: vueApp.mallTitle,
                info: vueApp.mallInfo,
                image: data.filename,
                moneryInfo: CKEDITOR.instances.mallMoneryInfo.getData(),
                payInfo: CKEDITOR.instances.mallPayInfo.getData(),
                urlMatch: vueApp.mallURL,
                brokerage: vueApp.mallBrokerage,
                brokerageOffline: vueApp.mallBrokerageOffline,
                toURLPath: vueApp.toURLPath
              }, function (error, data) {
                if (error) {
                  exports.Print("Error", error)
                } else {
                  vueApp.mall.push(data)
                  vueApp.newMall = false
                }
              })
            }
          })
        } catch (error) {
          exports.Print("Error", error)
        }
      },
      newsIconImageChange: function () {
        this.newsIconImage = true
        this.newsIconImageSrc = URL.createObjectURL(document.getElementById("newsIconImage").files[0])
      },
      mallEdit: function (data) {
        vueApp.submitNew = false
        vueApp.newMall = true
        vueApp.mallTitle = data.name
        vueApp.mallInfo = data.info
        CKEDITOR.instances.mallMoneryInfo.setData(data.moneryInfo)
        CKEDITOR.instances.mallPayInfo.setData(data.payInfo)
        vueApp.newsIconImage = true
        vueApp.newsIconImageSrc = "/file/" + data.image
        vueApp.mallEdit_id = data._id
        vueApp.newsImageSrc = data.image
        vueApp.mallURL = data.urlMatch
        vueApp.mallBrokerage = data.brokerage
        vueApp.mallBrokerageOffline = data.brokerageOffline
        vueApp.toURLPath = data.toURLPath
        document.getElementById("newsIconImage").value = ""
      },
      submitEditMall: function () {
        function uploadFile (file, callback) {
          if (file.length > 0) {
            routerView.files(file[0], function (error, data) {
              if (error) {
                callback(error)
              } else {
                callback(null, data.filename)
              }
            })
          } else {
            callback(null, vueApp.newsImageSrc)
          }
        }
        uploadFile(document.getElementById("newsIconImage").files, function (error, image) {
          if (error) {
            exports.Print("Error", error)
          } else {
            routerView.adminMallUpdate({
              id: vueApp.mallEdit_id,
              name: vueApp.mallTitle,
              info: vueApp.mallInfo,
              image: image,
              moneryInfo: CKEDITOR.instances.mallMoneryInfo.getData(),
              payInfo: CKEDITOR.instances.mallPayInfo.getData(),
              urlMatch: vueApp.mallURL,
              brokerage: vueApp.mallBrokerage,
              brokerageOffline: vueApp.mallBrokerageOffline,
              toURLPath: vueApp.toURLPath,
              chanetMallID: vueApp.chanetMallID
            }, function (error, data) {
              if (error) {
                exports.Print("Error", error)
              } else {
                let newsMall = vueApp.mall
                vueApp.mall = []
                for (let v of newsMall) {
                  if (v._id === data._id) {
                    vueApp.mall.push(data)
                  } else {
                    vueApp.mall.push(v)
                  }
                }
                vueApp.newMall = false
                document.getElementById("newsIconImage").value = ""
              }
            })
          }
        })
      }
    }
  })
  /**
   * 获取商城列表
   * @private
   */
  routerView.adminMallListGet(function (error, data) {
    if (error) {
      exports.Print("Error", error)
    } else {
      vueApp.mall = data
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
  /**
   * 文本编辑器
   * @private
   */
  CKEDITOR.replace("mallMoneryInfo", {
    language: "zh",
    height: "400px"
  })
  CKEDITOR.replace("mallPayInfo", {
    language: "zh",
    height: "400px"
  })
}, false);
