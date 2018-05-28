/*!
 * WebRTC-MCU
 * git https://github.com/xivistudios/webrtc-mcu
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


"use strict"


/**
 * Module dependencies.
 */
const assert = require("assert")


/**
 * 获取值类型
 * @private
 */
function ValuesType (Arguments) {
  
  /*
   * 排除一种情况 
   * 单个参数验证 
   * 类型直接取类型构造函数的name
   * @private
   */
  if (typeof Arguments === "function") {
    if ("name" in Arguments) {
      return Arguments.name.toLowerCase()
    } else {
      return "function"
    }
  } else {
    if (Array.isArray(Arguments)) {
      return "array"
    } else {
      return typeof Arguments
    }
  }
}


/**
 * 对比单个值
 * 如果包含多个允许值
 * 只要其中一个类型匹配就算正确
 * @private
 */
function SingleValue (Key, Values) {
  if (Array.isArray(Values)) {
    
    /*
     * 多个值
     * 命中一个就算通过
     * @private
     */
    let TypeLocal = false
    for (let TypeKey of Values) {
      assert.equal(typeof TypeKey, "function")
      assert.equal("name" in TypeKey, true)
      TypeLocal = Array.isArray(Key) && TypeKey.name === "Array" || typeof Key === TypeKey.name.toLowerCase() ? true : TypeLocal
    }
    assert.equal(TypeLocal, true)
  } else {
    /*
     * 只有单个值
     * 直接匹配类型
     * @private
     */
    assert.equal(ValuesType(Key), ValuesType(Values))
  }
}


/**
 * 针对各种类型的验证
 * 遍历所有根节点并且验证
 * 对象
 * @private
 */
function tObject (Arguments, Type) {
  /*
   * 遍历复杂对象的算法 --- 步进算法
   * 按步走，遇到分叉进岔路
   * 岔路走完回退到路口
   * 遍历对象多叉树
   */
  let ArgumentsKeys = Object.keys(Arguments)
  let TypeKeys = Object.keys(Type)
  // 临时拷贝
  let CopyArguments = Arguments
  let CopyType = Type
  let CopyArgumentsKeys = ArgumentsKeys
  let CopyTypeKeys = TypeKeys
  // 步进参数
  let PathFork = CopyArgumentsKeys.length // 局部总数
  let Path = [] // 路线索引
  let Step = 0 // 全局步数
  let StepFork = 0 // 局部步数
  let Top = true // 是否到顶层
  let Break = true // 停止
  // 主循环
  for (; Break === true; Step ++) {
    // 主循环已走完所有线路
    if (Top && Step >= ArgumentsKeys.length - 1) {
      Break = false
    }
    // 局部路线走完
    if (PathFork == StepFork - 2) {
      let CopyPath = (new Array(Path))[0] // 拷贝一个新的路线索引
      Path = [] // 原路线索引清空
      StepFork = 0 // 局部步数清空
      // 重写临时拷贝为原始对象
      CopyArguments = Arguments
      CopyType = Type
      // 判断是否到顶层，如果未到顶层就前进一层
      if (CopyPath.length - 2 >= 0) {
        for (let i = 0; i < CopyPath.length; i ++) {
          if (i < CopyPath.length - 2) {
            Path.push(CopyPath[i])
          }
          CopyType = CopyType[CopyPath[i]]
          CopyArguments = CopyArguments[CopyPath[i]]
        }
      } else {
        Top = true
      }
      // 重写临时拷贝
      CopyArgumentsKeys = Object.keys(CopyArguments)
      CopyTypeKeys = Object.keys(CopyType)
      // 重写步进参数
      let IndexOf = CopyArgumentsKeys.indexOf(CopyPath[CopyPath.length - 1])
      Step = IndexOf === -1 ? 0 : IndexOf + 1
      PathFork = CopyArgumentsKeys.length
    }
    // 从临时拷贝区获取 key value
    let Key = CopyArgumentsKeys[Step]
    let Value = CopyArguments[Key]
    let TypeKey = CopyTypeKeys[Step]
    let TypeValue = CopyType[TypeKey]
    if (typeof Value === "object") { // 如果是对象
      Top = false // 不是顶层
      Step = -1 // 步数调为零
      // 获取局部key列表
      let SeedArguments = Object.keys(Value)
      let SeedTypeArguments = Object.keys(TypeValue)
      PathFork = SeedArguments.length // 重置局部步数
      // 重置临时拷贝区
      CopyArguments = Value
      CopyType = TypeValue
      CopyArgumentsKeys = SeedArguments
      CopyTypeKeys = SeedTypeArguments
      Path.push(Key) // 添加路线索引
    } else { // 不是对象
      StepFork++
      SingleValue(Value, TypeValue)
    }
  }
}


/**
 * 针对各种类型的验证
 * 遍历所有根节点并且验证
 * 数组
 * @private
 */
function tArray (Arguments, Type) {
  assert.equal(Arguments.length, Type.length) // 长度相等
  for (let i = 0; i < Type.length; i ++) {
    Arguments[i] && SingleValue(Arguments[i], Type[i])
  }
}


/**
 * 参数验证入口
 * @private
 */
function equal (Arguments, Type) {
  try {
    
    /**
     * not null undefined
     * @private
     */
    assert.equal(Type === null, false)
    assert.equal(Type === undefined, false)
    assert.equal(Arguments === null, false)
    assert.equal(Arguments === undefined, false)
    
    /**
     * 记录待验证参数的类型
     * @private
     */
    let ArgType = ValuesType(Type)
    let TypeArgType = ValuesType(Arguments)
    
    /**
     * 对比两个参数的类型相等
     * @private
     */
    assert.equal(ArgType, TypeArgType)
    
    /**
     * 如果是单个数值
     * 直接跳过
     * @private
     */
    if (ArgType === "object") {
      tObject(Arguments, Type)
    } else
    if (ArgType === "array") {
      tArray(Arguments, Type)
    }
    return true
  } catch (error) {
    throw error
  }
}


/**
 * 导出参数验证类
 * @private
 */
module.exports = equal