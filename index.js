/*!
 * intel-webrtc-packaging
 * git https://github.com/xivistudios/intel-webrtc-packaging
 * Copyright(c) 2018-2023 Mr.Panda xivistudios
 * MIT Licensed
 */


 /*!
 * intel webrtc的node.js javascript封装
 * 使用Intel webrtc SDK的接口
 * 使用标准的webrtc协议，使用webrtc协议发送结构化文本控制信号
 */

/*！
 * intel webrtc的node.js javascript封装
 * 增加管理服务壳
 * 管理所有的服务
 * 并提供管理界面
 */


"use strict";


/**
 * Module dependencies.
 */
const fs = require("fs");
const Path = require("path");
const log4js = require("log4js");
const toml = require("toml");


/**
 * Module manage.
 */
const ManageService = require("./manage");


/**
 * Module public.
 */

/*!
 * Multiple nuve instances provide stateless services at the same time. 
 * If application implements node fail detection and rescheduling strategy, 
 * when one node fails, other nodes can take over when the further requests are assigned to any of them.
 */
const nuve = require("./src/nuve");

/*!
 * The manager of all active workers in the cluster, checking their lives, 
 * scheduling workers with the specified purposes according to the configured policies. 
 * If one has been elected as master, it will provide service; others will be standby.
 */
const clusterManager = require("./src/clusterManager");

/*!
 * The signaling server, handling service requests from Socket.IO clients.
 */
const portal = require("./src/portal");

/*!
 * This agent handles room controller logics.
 */
const conferenceAgent = require("./src/conferenceAgent");

/*!
 * This agent spawning webrtc accessing nodes which establish peer-connections with webrtc clients, 
 * receive media streams from and send media streams to webrtc clients.
 */
const webrtcAgent = require("./src/webrtcAgent");

/*!
 * This agent spawning streaming accessing nodes which pull external streams from sources and push streams to rtmp/rtsp destinations.
 */
const streamingAgent = require("./src/streamingAgent");

/*!
 * This agent spawning recording nodes which record the specified audio/video streams to permanent storage facilities.
 */
const recordingAgent = require("./src/recordingAgent");

/*!
 * This agent spawning audio processing nodes which perform audio transcoding and mixing.
 */
const audioAgent = require("./src/audioAgent");

/*!
 * This agent spawning video processing nodes which perform video transcoding and mixing.
 */
const videoAgent = require("./src/videoAgent");

/*!
 * This agent spawning sip processing nodes which handle sip connections.
 */
const sipAgent = require("./src/sipAgent");

/*!
 * The portal for initializing rooms' sip settings and scheduling sip agents to serve for them.
 */
const sipPortal = require("./src/sipPortal");


/**
 * Module configure.
 */
const nuveConfig = toml.parse(fs.readFileSync("./configure/nuve.toml"));


/**
 * main
 * @private
 */
try {

  // run module.
  let nuveService = new nuve({
    configure: nuveConfig,
    dirname: __dirname,
    cart: fs.readFileSync(Path.join(__dirname, nuveConfig.nuve.keystorePath))
  });

  /**
   * module event bind.
   */
  nuveService.on("logger", function (logger) {
    console.log(logger);
  });



} catch (error) {
  // Error
  return;
}