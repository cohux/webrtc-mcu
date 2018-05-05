/*!
 * 分众快讯 (fenzhongkuaixun)
 * git https://github.com/xivistudios/fenzhongkuaixun.git
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */
"use strict"

// files => .newsIconImage

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
      exports: exports,
      newsTitle: "",
      newsInfo: "",
      newsLink: "",
      newsMall: "",
      newsModel: 0,
      newsClass: false,
      newsIconImageSrc: "",
      newsIconImage: false,
      pageModel: false
    },
    methods: {
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
      submitNews: function () {
        try {
          let editHTML = CKEDITOR.instances.addNewsText.getData()
          let file = document.getElementById("newsIconImage").files
          let addNewsTitle = vueApp.newsTitle
          let addNewsInfo = vueApp.newsInfo
          let addNewsMall = vueApp.newsMall
          let addNewsURL = vueApp.newsLink
          let addNewsModel = vueApp.newsModel
          let time = (new Date()).getTime()
          exports.assert(addNewsTitle.length > 0, true)
          exports.assert(addNewsInfo.length > 0, true)
          exports.assert(addNewsMall.length > 0, true)
          exports.assert(addNewsURL.length > 0, true)
          exports.assert(editHTML.length > 0, true)
          exports.assert(file.length > 0, true)
          routerView.files(file[0], function (error, data) {
            if (error) {
              exports.Print("Error", error.message)
            } else {
              routerView.adminPageNewsAdd({
                title: addNewsTitle,
                info: addNewsInfo,
                class: addNewsMall,
                link: addNewsURL,
                text: editHTML,
                time: time,
                image: data.filename,
                model: addNewsModel
              }, function (error, data) {
                if (error) {
                  exports.Print("Error", error.message)
                } else {
                  location.href = "/admin/page/news"
                }
              })
            }
          })
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      submitEditNews: function () {
        try {
          exports.assert(vueApp.pageModel, true)
          let editHTML = CKEDITOR.instances.addNewsText.getData()
          let file = document.getElementById("newsIconImage").files
          let addNewsTitle = vueApp.newsTitle
          let addNewsInfo = vueApp.newsInfo
          let addNewsMall = vueApp.newsMall
          let addNewsURL = vueApp.newsLink
          let addNewsModel = vueApp.newsModel
          let time = (new Date()).getTime()
          exports.assert(addNewsTitle.length > 0, true)
          exports.assert(addNewsInfo.length > 0, true)
          exports.assert(addNewsMall.length > 0, true)
          exports.assert(addNewsURL.length > 0, true)
          exports.assert(editHTML.length > 0, true)
          if (file.length > 0) {
            routerView.files(file[0], function (error, data) {
              if (error) {
                exports.Print("Error", error.message)
              } else {
                routerView.adminPageNewsUpdate({
                  id: location.href.split("?id=")[1],
                  title: addNewsTitle,
                  info: addNewsInfo,
                  class: addNewsMall,
                  link: addNewsURL,
                  text: editHTML,
                  time: time,
                  image: data.filename,
                  model: addNewsModel
                }, function (error, data) {
                  if (error) {
                    exports.Print("Error", error.message)
                  } else {
                    location.href = "/admin/page/news"
                  }
                })
              }
            })
          } else {
            routerView.adminPageNewsUpdate({
              id: location.href.split("?id=")[1],
              title: addNewsTitle,
              info: addNewsInfo,
              class: addNewsMall,
              link: addNewsURL,
              text: editHTML,
              time: time,
              image: vueApp.newsIconImageSrcBash,
              model: addNewsModel
            }, function (error, data) {
              if (error) {
                exports.Print("Error", error.message)
              } else {
                location.href = "/admin/page/news"
              }
            })
          }
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      model_1: function () {
        this.newsModel = 0
        this.newsClass = false
      },
      model_2: function () {
        this.newsModel = 2
        this.newsClass = false
      },
      model_3: function () {
        this.newsModel = 1
        this.newsClass = false
      },
      newsModelTab: function () {
        this.newsClass = this.newsClass ? false : true
      },
      newsIconImageFiles: function (tar) {
        vueApp.newsIconImage = true
        vueApp.newsIconImageSrc = URL.createObjectURL(tar.target.files[0])
      }
    }
  })
  /**
   * 文本编辑器
   * @private
   */
  CKEDITOR.replace("addNewsText", {
    language: "zh",
    height: "400px"
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
   * 判断是否是编辑
   * @private
   */
  if (location.href.split("?id=").length > 1) {
    axios.get("/view/get/recommend", {
      params: { id: location.href.split("?id=")[1] }
    }).then(function (r) {
      if (r.status == 200 && r.data.Status == 200) {
        vueApp.newsTitle = r.data.Data.title
        vueApp.newsInfo = r.data.Data.info
        vueApp.newsMall = r.data.Data.class
        vueApp.newsLink = r.data.Data.link
        vueApp.newsModel = r.data.Data.model
        vueApp.newsIconImageSrc = "/file/" + r.data.Data.image
        vueApp.newsIconImageSrcBash = r.data.Data.image
        vueApp.newsIconImage  = true
        vueApp.pageModel = true
        CKEDITOR.instances.addNewsText.setData(r.data.Data.text)
      } else {
        location.href = "/admin/page/news"
      }
    })
  }
}, false);
