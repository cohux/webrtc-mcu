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
Read(function (exports) {


  /**
   * Vue实例
   * @private
   */
  let vueApp = new Vue({
    el: "#vue-docker",
    data: {
      ad: [],
      newsConterFilterLedtime: "",
      newsConterFilterEndtime: "",
      newsConterFilterLimit: "10",
      newsConterFilterSort: "1",
      addNewsDataImages: "",
      uploadText: "上传封面图",
      news: [],
      page: [1],
      addNewsTitle: "",
      addNewsDataMoneyD: "",
      addNewsDataMoneyY: "",
      addNewsDataType: "",
      addNewsURL: "",
      addNewsOpacity: 0,
      addNewszIndex: 0,
      exports
    },
    methods: {
      addNews: function () {
        this.addNewsOpacity = 1;
        this.addNewszIndex = 999;
      },
      saveNews: function () {
        
      },
      closeNews: function () {
        this.addNewsOpacity = 0;
        this.addNewszIndex = 0;
      },
      newsTrash: function (id) {
        axios.post("/admin/page/news/delete", { id }).then(function (r) {
          if (r.status == 200 && r.data.Status == 200) {
            let newNews = [];
            for (let v of vueApp.news) {
              if (v._id !== r.data.Data) {
                newNews.push(v);
              }
            }
            vueApp.news = newNews;
          } else {
            exports.Print("Error", r.data.Error);
          }
        })
      }
    }
  });


}, false);