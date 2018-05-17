[! <=componentVueData=>
 
  information: {
    user: 0,
    room: 0,
    error: 0,
    server: 0
  },
  server: [],
  event: []

!]
  
[! <=component=>
 
  /**
   * 连接websocket获取数据
   * @private
   */
  let socket = new websocket("ws://" + hostname + "/socket")
  socket.open(function () {
    socket.data(function (data) {
      if (data.event === "systemInfo") {
        vueApp.information = data.message.information
        vueApp.server = data.message.server
      }
    })
    setInterval(function () {
      socket.emit({
        event: "systemInfo"
      })
    }, 5000)
  })
  
  /**
   * 获取事件
   * @private
   */
  axios.get("/log/getAll").then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      vueApp.event = r.data.Data
    } else {
      exports.Print("Error", r.data.Error)
    }
  })
 
  /**
   * 获取未读事件数
   * @private
   */
   axios.get("/log/getUnreadBellSum").then(function (r) {
     if (r.status == 200 && r.data.Status == 200) {
       for (let v of r.data.Data) {
         if (v._id == "error") {
           vueApp.bell += v.sum
         }
       } 
     } else {
       exports.Print("Error", r.data.Error)
     }
   })
 
!]
