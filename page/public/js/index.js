/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


"use strict"

/**
 * 加载完成
 * @private
 */
Read(function (exports) {

  /**
   * vue
   * @private
   */
  let vueApp = new Vue({
    el: "#vue-docker",
    data: {
      windowWidth: document.documentElement.offsetWidth - 200,
      windowHeight: document.documentElement.offsetHeight - 50,
      menuTargetType: true,
      menuSpanType: true,
      menu: useData.menu,
      exports: exports,
      bell: 0,
      [! componentVueData !]
    },
    methods: {
      menuTarget: function () {
        if (this.menuTargetType) {
          this.menuTargetType = false
          this.menuSpanType = false
          this.windowWidth = document.documentElement.offsetWidth - 50
        } else {
          this.menuTargetType = true
          this.menuSpanType = true
          this.windowWidth = document.documentElement.offsetWidth - 200
        }
      },
      menuCheckbox: function (model) {
        location.href = "/view/" + model
      },
      menuCheckboxClass: function (v) {
        return {
          "menu-li-checkbox": v.value === useData.value
        }
      },
      [! componentVueMethods !]
    }
  })
  
  /**
   * 调整窗口大小
   * @private
   */
  document.body.onresize = function () {
    let width = document.documentElement.offsetWidth
    let height = document.documentElement.offsetHeight
    if (width < 1300) {
      vueApp.menuTargetType = false
      vueApp.menuSpanType = false
      vueApp.windowWidth = width - 50
    } else {
      vueApp.menuTargetType = true
      vueApp.menuSpanType = true
      vueApp.menuSpanType = true
      vueApp.windowWidth = width - 200
    }
  }
  
  /**
   * 组件私有部分
   * @private
   */
  [! component !]
  
})