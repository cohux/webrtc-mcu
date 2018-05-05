/*!
 * 分众快讯 (fenzhongkuaixun)
 * git https://github.com/xivistudios/fenzhongkuaixun.git
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */

"use strict";

/**
 * 复用方法集合
 * @private
 */

/**
 * 用户身份
 * @private
 */
function userRole(role) {
  if (role === "root") {
    return "系统管理员"
  }
}

window.Module = {
  userRole: userRole,
}
