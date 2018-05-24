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
Read(async function (exports) {
  let remoteAddress = ""
  let serviceChangeInput = ""

  /**
   * vue
   * @private
   */
  let vueApp = new Vue(new vueImport({
    el: "#vue-docker",
    data: {
      bill: 0,
      form: {
        name: "",
        inputLimit: 0,
        participantLimit: 0,
        roles: [],
        views: [],
        mediaIn: {
          video: [],
          audio: []
        },
        mediaOut: {
          video: {
            format: [],
            parameters: {
              keyFrameInterval: [],
              bitrate: [],
              framerate: [],
              resolution: []
            }
          },
          audio: []
        },
        transcoding: {
          audio: false,
          video: {
            format: false,
            parameters: {
              keyFrameInterval: false,
              bitrate: false,
              framerate: false,
              resolution: false
            }
          }
        },
        notifying: {
          streamChange: false,
          participantActivities: false
        },
        sip: {
          password: "",
          username: "",
          sipServer: ""
        }
      },
      audioFormat: [
        {value: "pcmu.0.0", text: "PCMU"},
        {value: "opus.48000.2", text: "OPUS"},
        {value: "pcma.0.0", text: "PCMA"},
        {value: "ilbc.0.0", text: "ILBC"},
        {value: "isac.16000.0", text: "ISAC (16000)"},
        {value: "isac.32000.0", text: "ISAC (32000)"},
        {value: "g722.16000.1", text: "G722"},
        {value: "aac.0.0", text: "AAC"},
        {value: "aac.48000.2", text: "AAC"},
        {value: "ac3.0.0", text: "AC3"},
        {value: "nellymoser.0.0", text: "NELLYMOSER"},
      ],
      videoFormat: [
        {value: "h264", text: "H264"},
        {value: "h265", text: "H265"},
        {value: "vp8", text: "VP8"},
        {value: "vp9", text: "VP9"},
      ],
      videoFitPolicy: [
        {value: "letterbox", text: "LETTERBOX"},
        {value: "crop", text: "CROP"}
      ],
      videoTemplatesBase: [
        {value: "fluid", text: "FLUID"},
        {value: "lecture", text: "LECTURE"},
        {value: "void", text: "VOID"}
      ],
      resolutionFormat: [
        {value: "x3/4", text: "X3/4"},
        {value: "x2/3", text: "X2/3"},
        {value: "x1/2", text: "X1/2"},
        {value: "x1/3", text: "X1/3"},
        {value: "x1/4", text: "X1/4"},
        {value: "cif", text: "CIF"},
        {value: "qcif", text: "QCIF"},
        {value: "sif", text: "SIF"},
        {value: "vga", text: "VGA"},
        {value: "svga", text: "SVGA"},
        {value: "xga", text: "XGA"},
        {value: "hvga", text: "HVGA"},
        {value: "hd720p", text: "HD720P"},
        {value: "hd1080p", text: "HD1080P"},
        {value: "uhd_4k", text: "4K"},
      ],
      framerateFormat: [
        {value: "6", text: "6"},
        {value: "12", text: "12"},
        {value: "15", text: "15"},
        {value: "24", text: "24"},
        {value: "30", text: "30"},
        {value: "48", text: "48"},
        {value: "60", text: "60"}
      ],
      bitrateFormat: [
        {value: "x0.8", text: "0.8"},
        {value: "x0.6", text: "0.6"},
        {value: "x0.4", text: "0.4"},
        {value: "x0.2", text: "0.2"}
      ],
      keyFrameIntervalFormat: [
        {value: "100", text: "100"},
        {value: "30", text: "30"},
        {value: "5", text: "5"},
        {value: "2", text: "2"},
        {value: "1", text: "1"}
      ]
    },
    methods: {
      
      /**
       * 不更改
       * @private
       */
      modaltorSubmitClose: function () {
        location.href = "/view/room"
      },
      
      /**
       * 提交表单
       * @private
       */
      modaltorSubmit: async function () {
        try {
          let query = exports.urlQuery(location.href)
          let data = vueApp.form
          let roomId = data._id
          exports.assert(data.name.length > 0, true, "房间名不能为空")
          data.inputLimit = Number(data.inputLimit)
          data.participantLimit = Number(data.participantLimit)
          for (let i = 0; i < data.views.length; i ++) {
            if (data.views[i].audio.fromatStr) {
              let audiofromat = data.views[i].audio.fromatStr.split(".")
              data.views[i].audio.format.codec = audiofromat[0]
              if (Number(audiofromat[1]) === 0 && data.views[i].audio.format.sampleRate) {
                delete data.views[i].audio.format.sampleRate
              } else {
                data.views[i].audio.format.sampleRate = Number(audiofromat[1])
              }
              if (Number(audiofromat[2]) === 0 && data.views[i].audio.format.channelNum) {
                delete data.views[i].audio.format.channelNum
              } else {
                data.views[i].audio.format.sampleRate = Number(audiofromat[2])
              }
              delete data.views[i].audio.fromatStr
            }
            if (data.views[i].video.fromatStr) {
              data.views[i].video.format.codec = data.views[i].video.fromatStr
              delete data.views[i].video.fromatStr
            }
            data.views[i].video.bgColor.b = Number(data.views[i].video.bgColor.b)
            data.views[i].video.bgColor.g = Number(data.views[i].video.bgColor.g)
            data.views[i].video.bgColor.r = Number(data.views[i].video.bgColor.r)
            data.views[i].video.parameters.bitrate = Number(data.views[i].video.parameters.bitrate)
            data.views[i].video.parameters.framerate = Number(data.views[i].video.parameters.framerate)
            data.views[i].video.parameters.keyFrameInterval = Number(data.views[i].video.parameters.keyFrameInterval)
            data.views[i].video.parameters.resolution.width = Number(data.views[i].video.parameters.resolution.width)
            data.views[i].video.parameters.resolution.height = Number(data.views[i].video.parameters.resolution.height)
            data.views[i].video.maxInput = Number(data.views[i].video.maxInput)
            data.views[i].video.motionFactor = Number(data.views[i].video.motionFactor)
            for (let y = 0, x = data.views[i].video.layout.templates.custom; y < x.length; y ++) {
              for (let v = 0, z = data.views[i].video.layout.templates.custom[y].region; v < z.length; v ++) {
                let { width, height, top, left } = data.views[i].video.layout.templates.custom[y].region[v].area
                data.views[i].video.layout.templates.custom[y].region[v].area.width = Number(width)
                data.views[i].video.layout.templates.custom[y].region[v].area.height = Number(height)
                data.views[i].video.layout.templates.custom[y].region[v].area.top = Number(top)
                data.views[i].video.layout.templates.custom[y].region[v].area.left = Number(left)
              }
            }
            if (data.views[i].video.layout.templates.custom.length <= 0) {
              delete data.views[i].video.layout.templates.custom
            }
            if (data.views[i].video.parameters.bitrate === null || data.views[i].video.parameters.bitrate === "") {
              delete data.views[i].video.parameters.bitrate
            }
          }
          for (let i = 0; i < data.mediaIn.audio.length; i ++) {
            let mediaInAudio = data.mediaIn.audio[i].codecStr.split(".")
            data.mediaIn.audio[i].codec = mediaInAudio[0]
            if (Number(mediaInAudio[1]) == 0 && data.mediaIn.audio[i].sampleRate) {
              delete data.mediaIn.audio[i].sampleRate
            } else {
              data.mediaIn.audio[i].sampleRate = Number(mediaInAudio[1])
            }
            if (Number(mediaInAudio[2]) == 0 && data.mediaIn.audio[i].channelNum) {
              delete data.mediaIn.audio[i].channelNum
            } else {
              data.mediaIn.audio[i].channelNum = Number(mediaInAudio[2])
            }
            delete data.mediaIn.audio[i].codecStr
          }
          for (let i = 0; i < data.mediaOut.audio.length; i ++) {
            let mediaInAudio = data.mediaOut.audio[i].codecStr.split(".")
            data.mediaOut.audio[i].codec = mediaInAudio[0]
            if (Number(mediaInAudio[1]) == 0 && data.mediaOut.audio[i].sampleRate) {
              delete data.mediaOut.audio[i].sampleRate
            } else {
              data.mediaOut.audio[i].sampleRate = Number(mediaInAudio[1])
            }
            if (Number(mediaInAudio[2]) == 0 && data.mediaOut.audio[i].channelNum) {
              delete data.mediaOut.audio[i].channelNum
            } else {
              data.mediaOut.audio[i].channelNum = Number(mediaInAudio[2])
            }
            delete data.mediaOut.audio[i].codecStr
          }
          for (let i = 0; i < data.mediaOut.video.parameters.framerate.length; i ++) {
            data.mediaOut.video.parameters.framerate[i] = Number(data.mediaOut.video.parameters.framerate[i])
          }
          for (let i = 0; i < data.mediaOut.video.parameters.keyFrameInterval.length; i ++) {
            data.mediaOut.video.parameters.keyFrameInterval[i] = Number(data.mediaOut.video.parameters.keyFrameInterval[i])
          }
          if (!(data.sip.sipServer.length > 1 && data.sip.username.length > 1 && data.sip.password.length > 1)) {
            delete data.sip
          }
          delete data._id
          delete data.__v
          let updateRoom = await axios.post("/room/updateRoom", {
            remoteAddress: query.remoteAddress,
            room: data, roomId, service: query.service
          })
          exports.assert(updateRoom.data.Status, 200, updateRoom.data.Error || "")
          exports.Print("Info", "更新成功")
          setTimeout(function () {
            location.href = "/view/room"
          }, 2000)
        } catch (error) {
          exports.Print("Error", error.message)
        }
      },
      
      /**
       * 添加角色
       * @private
       */
      addRoles: function () {
        this.form.roles.push({ 
          role: "",
          subscribe: {
            video: false,
            audio: false
          },
          publish: {
            video: false,
            audio: false
          }
        })
      },
      
      /**
       * 删除角色
       * @private
       */
      delRole: function (index) {
        let roles = this.form.roles
        this.form.roles = []
        for (let i = 0; i < roles.length; i ++) {
          if (i !== Number(index)) {
            this.form.roles.push(roles[i])
          }
        }
      },
      
      /**
       * 添加视图
       * @private
       */
      addViews: function () {
        this.form.views.push({ 
          label: "",
          audio: {
            vad: false,
            format: {
              channelNum: 0,
              sampleRate: 0,
              codec: ""
            },
            fromatStr: "pcmu.0.0",
          },
          video: {
            layout: {
              templates: {
                custom: [],
                base: "fluid"
              },
              fitPolicy: "letterbox"
            },
            keepActiveInputPrimary: false,
            bgColor: {
              b: 0,
              g: 0,
              r: 0
            },
            motionFactor: 0,
            maxInput: 0,
            parameters: {
              bitrate: 0,
              keyFrameInterval: 100,
              framerate: 6,
              resolution: {
                height: 0,
                width: 0
              }
            },
            format: {
              codec: ""
            },
            fromatStr: "h264"
          }
        })
      },
      
      /**
       * 删除视图
       * @private
       */
      delViews: function (index) {
        let views = this.form.views
        this.form.views = []
        for (let i = 0; i < views.length; i ++) {
          if (i !== Number(index)) {
            this.form.views.push(views[i])
          }
        }
      },
      
      /**
       * 添加自定义
       * @private
       */
      addCustom: function (inthis) {
        this.form.views[inthis].video.layout.templates.custom.push({
          region: []
        })
      },
      
      /**
       * 添加区域
       * @private
       */
      addRegion: function (x, y) {
        this.form.views[y].video.layout.templates.custom[x].region.push({
          id: "",
          area: {
            width: 0,
            height: 0,
            top: 0,
            left: 0
          },
          shape: "rectangle",
          
        })
      },
      
      /**
       * 添加媒体入口音频
       * @private
       */
      addAudioMediaIn: function () {
        this.form.mediaIn.audio.push({
          codec: "",
          sampleRate: 0,
          channelNum: 0,
          codecStr: "pcmu.0.0"
        })
      },
      
      /**
       * 删除媒体入口音频
       * @private
       */
      delAudioMediaIn: function (index) {
        let mediaInAudio = this.form.mediaIn.audio
        this.form.mediaIn.audio = []
        for (let i = 0; i < mediaInAudio.length; i ++) {
          if (index !== i) {
            this.form.mediaIn.audio.push(mediaInAudio[i])
          }
        }
      },
      
      /**
       * 添加媒体入口视频
       * @private
       */
      addVideoMediaIn: function () {
        this.form.mediaIn.video.push({
          codec: "h264"
        })
      },
      
      /**
       * 删除媒体入口视频
       * @private
       */
      delVideoMediaIn: function (index) {
        let mediaInVideo = this.form.mediaIn.audio
        this.form.mediaIn.video = []
        for (let i = 0; i < mediaInVideo.length; i ++) {
          if (index !== i) {
            this.form.mediaIn.video.push(mediaInVideo[i])
          }
        }
      },
      
      /**
       * 添加媒体出口音频
       * @private
       */
      addAudioMediaOut: function () {
        this.form.mediaOut.audio.push({
          codec: "",
          sampleRate: 0,
          channelNum: 0,
          codecStr: "pcmu.0.0"
        })
      },
      
      /**
       * 删除媒体出口音频
       * @private
       */
      delAudioMediaOut: function (index) {
        let mediaOutAudio = this.form.mediaOut.audio
        this.form.mediaOut.audio = []
        for (let i = 0; i < mediaOutAudio.length; i ++) {
          if (index !== i) {
            this.form.mediaOut.audio.push(mediaOutAudio[i])
          }
        }
      },
      
      /**
       * 添加媒体出口视频
       * @private
       */
      addVideoMediaOut: function () {
        this.form.mediaOut.video.format.push({
          codec: "h264"
        })
      },
      
      /**
       * 删除媒体出口视频
       * @private
       */
      delVideoMediaOut: function (index) {
        let mediaOutVideo = this.form.mediaOut.video.format
        this.form.mediaOut.video.format = []
        for (let i = 0; i < mediaOutVideo.length; i ++) {
          if (index !== i) {
            this.form.mediaOut.video.format.push(mediaOutVideo[i])
          }
        }
      },
      
      /**
       * 添加解析度
       * @private
       */
      addParametersResolution: function () {
        this.form.mediaOut.video.parameters.resolution.push("cif")
      },
      
      /**
       * 删除解析度
       * @private
       */
      delParametersResolution: function (index) {
        let ParametersResolution = this.form.mediaOut.video.parameters.resolution
        this.form.mediaOut.video.parameters.resolution = []
        for (let i = 0; i < ParametersResolution.length; i ++) {
          if (index !== i) {
            this.form.mediaOut.video.parameters.resolution.push(ParametersResolution[i])
          }
        }
      },
      
      /**
       * 添加帧率
       * @private
       */
      addParametersFramerate: function () {
        this.form.mediaOut.video.parameters.framerate.push("60")
      },
      
      /**
       * 删除帧率
       * @private
       */
      delParametersFramerate: function (index) {
        let ParametersFramerate = this.form.mediaOut.video.parameters.framerate
        this.form.mediaOut.video.parameters.framerate = []
        for (let i = 0; i < ParametersFramerate.length; i ++) {
          if (index !== i) {
            this.form.mediaOut.video.parameters.framerate.push(ParametersFramerate[i])
          }
        }
      },
      
      /**
       * 添加比特率
       * @private
       */
      addParametersBitrate: function () {
        this.form.mediaOut.video.parameters.bitrate.push("x0.8")
      },
      
      /**
       * 删除比特率
       * @private
       */
      delParametersBitrate: function (index) {
        let ParametersBitrate = this.form.mediaOut.video.parameters.bitrate
        this.form.mediaOut.video.parameters.bitrate = []
        for (let i = 0; i < ParametersBitrate.length; i ++) {
          if (index !== i) {
            this.form.mediaOut.video.parameters.bitrate.push(ParametersBitrate[i])
          }
        }
      },
      
      /**
       * 添加关键帧间隔
       * @private
       */
      addKeyFrameInterval: function () {
        this.form.mediaOut.video.parameters.keyFrameInterval.push("100")
      },
      
      /**
       * 删除关键帧间隔
       * @private
       */
      delKeyFrameInterval: function (index) {
        let KeyFrameInterval = this.form.mediaOut.video.parameters.keyFrameInterval
        this.form.mediaOut.video.parameters.keyFrameInterval = []
        for (let i = 0; i < KeyFrameInterval.length; i ++) {
          if (index !== i) {
            this.form.mediaOut.video.parameters.keyFrameInterval.push(KeyFrameInterval[i])
          }
        }
      }
      
    }
  }))
  
  /**
   * 判断入口类型
   * @private
   */
  try {
    let query = exports.urlQuery(location.href)
    let room = JSON.parse(localStorage.viewRooms)
    if (!(room.sip)) {
      room.sip = { password: "", username: "", sipServer: "" }
    }
    for (let i = 0; i < room.views.length; i ++) {
      let { audio, video } = room.views[i]
      let { codec, sampleRate = 0, channelNum = 0 } = audio.format
      room.views[i].audio.fromatStr = String(codec) + "." + String(sampleRate) + "." + String(channelNum)
      room.views[i].video.fromatStr = video.format.codec
    }
    for (let i = 0; i < room.mediaIn.audio.length; i ++) {
      let { codec, sampleRate = 0, channelNum = 0 } = room.mediaIn.audio[i]
      room.mediaIn.audio[i].codecStr = String(codec) + "." + String(sampleRate) + "." + String(channelNum)
    }
    for (let i = 0; i < room.mediaOut.audio.length; i ++) {
      let { codec, sampleRate = 0, channelNum = 0 } = room.mediaOut.audio[i]
      room.mediaOut.audio[i].codecStr = String(codec) + "." + String(sampleRate) + "." + String(channelNum)
    }
    vueApp.form = room
  } catch (error) {
    exports.Print("Error", error.message)
  }
  
  /**
   * 获取未读事件数
   * @private
   */
  try {
    let unreadBellSum = await axios.get("/log/getUnreadBellSum")
    exports.assert(unreadBellSum.data.Status, 200, unreadBellSum.data.Error || "")
    for (let v of unreadBellSum.data.Data) {
      if (v._id == "error") {
        vueApp.bell += v.sum
      }
    }
  } catch (error) {
    exports.Print("Error", error.message)
  }
  
  /**
   * 调整窗口大小
   * @private
   */
  document.body.addEventListener("resize", function () {
    let width = document.documentElement.offsetWidth
    let height = document.body.offsetHeight
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
  })
  
  /**
   * 展开窗口
   * @private
   */
  try {
    for (let i = 0; i < vueApp.menu.length; i ++) {
      vueApp.menu[i].show = vueApp.menu[i].value.includes(useData.value)
    }
  } catch (error) {
    exports.Print("Error", error.message)
  }
  
})