/*!
 * 分众快讯 (fenzhongkuaixun)
 * git https://github.com/xivistudios/fenzhongkuaixun.git
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */

"use strict";

/**
 * 路由表
 * 获取数据
 * @private
 */


function assert (arg, arm) {
  if (arg === arm) {
    return true
  } else {
    throw new Error (arg + "!==" + arm)
  }
}


/**
 * 获取用户信息
 * @private
 */
function userInfo(callback) {
  axios.get("/userInfo").then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 获取指定用户信息
 * @private
 */
function adminUserInfoGet (id, callback) {
  axios.post("/admin/userInfo", { id }).then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 获取动态总数
 * @private
 */
function adminPageNewsGetSum (callback) {
  axios.get("/admin/page/news/getSum").then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      let page = []
      for (let i = 0; i < Math.ceil(r.data.Data / 10); i++) {
        page.push(i + 1)
      }
      callback(null, page, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 获取动态
 * @private
 */
function adminPageNewsGet (callback) {
  axios.get("/admin/page/news/get").then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 上传文件
 * @private
 */
function files (files, callback) {
  let param = new FormData()
  param.append("files", files, files.name)
  axios.post("/files", param, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    } 
  })
}


/**
 * 新建动态
 * @private
 */
function adminPageNewsAdd (options, callback) {
  axios.post("/admin/page/news/add", options).then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    } 
  })
}


/**
 * 更新动态
 * @private
 */
function adminPageNewsUpdate (options, callback) {
  axios.post("/admin/page/news/update", options).then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    } 
  })
}


/**
 * 删除动态
 * @private
 */
function adminPageNewsDelete (id, callback) {
  axios.post("/admin/page/news/delete", { id }).then(function(r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    } 
  })
}


/**
 * 获取汇率
 * @private
 */
function viewGetMoneyrate (callback) {
  axios.get("/view/get/moneyrate").then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 删除汇率
 * @private
 */
function adminPageMoneyrateDelete (id, callback) {
  axios.post("/admin/page/moneyrate/delete", { id }).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 添加汇率
 * @private
 */
function adminPageMoneyrateAdd (options, callback) {
  axios.post("/admin/page/moneyrate/add", options).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 获取用户
 * @private
 */
function adminUserVipGet (optios, callback) {
  axios.post("/admin/user/vip/getUserList", optios).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 获取商城列表
 * @private
 */
function adminMallListGet (callback) {
  axios.get("/admin/mall/malllist").then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 新建返利商城
 * @private
 */
function adminMallAdd (options, callback) {
  try {
    axios.post("/admin/mall/add", options).then(function (r) {
      if (r.status == 200 && r.data.Status == 200) {
        callback(null, r.data.Data)
      } else {
        callback(r.data.Error)
      }
    })
  } catch (error) {
    callback(error)
  }
}


/**
 * 删除返利商城
 * @private
 */
function adminMallDelete (id, callback) {
  axios.get("/admin/mall/delete", { params: { id } }).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 更新返利商城
 * @private
 */
function adminMallUpdate (options, callback) {
  try {
    axios.post("/admin/mall/update", options).then(function (r) {
      if (r.status == 200 && r.data.Status == 200) {
        callback(null, r.data.Data)
      } else {
        callback(r.data.Error)
      }
    })
  } catch (error) {
    callback(error)
  }
}


/**
 * 更新用户信息
 * @private
 */
function adminUserUpdate (options, callback) {
  try {
    axios.post("/admin/user/vip/update", options).then(function (r) {
      if (r.status == 200 && r.data.Status == 200) {
        callback(null, r.data.Data)
      } else {
        callback(r.data.Error)
      }
    })
  } catch (error) {
    callback(error)
  }
}


/**
 * 获取链接列表
 * @private
 */
function adminMoneryParseGet (options, callback) {
  axios.post("/admin/monery/parse/get", options).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 查询订单信息
 * @private
 */
function adminMoneryTableGet (options, callback) {
  axios.post("/admin/monery/table/get", options).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 更新订单信息
 * @private
 */
function adminMoneryTableUpdate (options, callback) {
  axios.post("/admin/monery/table/update", options).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}


/**
 * 获取用户7天转换量
 * @private
 */
function adminUserToURLNumber (id, callback) {
  axios.get("/admin/user/vip/getUserToURLNumer?id=" + id).then(function (r) {
    if (r.status == 200 && r.data.Status == 200) {
      callback(null, r.data.Data)
    } else {
      callback(r.data.Error)
    }
  })
}



/**
 * 导出路由
 * @private
 */
window.routerView = {
  files: files,
  userInfo: userInfo,
  adminUserInfoGet: adminUserInfoGet,
  adminPageNewsGet: adminPageNewsGet,
  adminPageNewsGetSum: adminPageNewsGetSum,
  adminPageNewsAdd: adminPageNewsAdd,
  adminPageNewsUpdate: adminPageNewsUpdate,
  adminPageNewsDelete: adminPageNewsDelete,
  viewGetMoneyrate: viewGetMoneyrate,
  adminPageMoneyrateDelete: adminPageMoneyrateDelete,
  adminPageMoneyrateAdd: adminPageMoneyrateAdd,
  adminUserVipGet: adminUserVipGet,
  adminMallListGet: adminMallListGet,
  adminMallAdd: adminMallAdd,
  adminMallDelete: adminMallDelete,
  adminMallUpdate: adminMallUpdate,
  adminUserUpdate: adminUserUpdate,
  adminMoneryParseGet: adminMoneryParseGet,
  adminMoneryTableGet: adminMoneryTableGet,
  adminMoneryTableUpdate: adminMoneryTableUpdate,
  adminUserToURLNumber: adminUserToURLNumber
}
