"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e
}
: function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
}
  , dataAccess = require("../data_access")
  , logger = require("./../logger").logger
  , cloudHandler = require("../cloudHandler")
  , e = require("../errors")
  , log = logger.getLogger("RoomsResource");
exports.createRoom = function(o, r, t) {
    var n = o.authData;
    if ("object" !== _typeof(o.body) || null === o.body || "string" != typeof o.body.name || "" === o.body.name)
        return t(new e.BadRequestError("Invalid request body"));
    if (o.body.options && "object" !== _typeof(o.body.options))
        return t(new e.BadRequestError("Invalid room option"));
    o.body.options = o.body.options || {};
    var a = o.body.options;
    a.name = o.body.name,
    dataAccess.room.create(n.service._id, a, function(i, s) {
        !i && s ? (log.debug("Room created:", o.body.name, "for service", n.service.name),
        r.send(s),
        s && s.sip && (log.info("Notify SIP Portal on create Room"),
        cloudHandler.notifySipPortal("create", s, function() {}))) : (log.info("Room creation failed", i ? i.message : a),
        t(i || new e.AppError("Create room failed")))
    })
}
exports.represent = function(o, r, t) {
    var n = o.authData;
    o.query.page = Number(o.query.page) || void 0,
    o.query.per_page = Number(o.query.per_page) || void 0,
    dataAccess.room.list(n.service._id, o.query, function(o, a) {
        a ? (log.debug("Representing rooms for service ", n.service._id),
        r.send(a)) : t(o || new e.AppError("Get rooms failed"))
    })
};
exports.getrooms = function(o, r, t) {
    var n = o.authData;
    dataAccess.room.list(o.query.id, {
      page: Number(o.query.page) || void 0,
      per_page: Number(o.query.per_page) || void 0
    }, function(o, a) {
        if (o) {
            r.send({ Status: 404, Error: o.message })
        } else {
            r.send({ Status: 200, Data: a })
        }
    })
};
exports.addrooms = function(o, r, t) {
    var n = o.authData;
    var service = o.body.service;
    var room = o.body.room;
    dataAccess.room.create(service, room, function(i, s) {
        !i && s ? (log.debug("Room created:", room.name, "for service", n.service.name),
        r.send(s),
        s && s.sip && (log.info("Notify SIP Portal on create Room"),
        cloudHandler.notifySipPortal("create", s, function() {}))) : (log.info("Room creation failed", i ? i.message : room),
        t(i || new e.AppError("Create room failed")))
    })
}
